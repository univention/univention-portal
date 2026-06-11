# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
"""
Sequential latency benchmark: OPA-Guardian vs Cerbos, job-level.

The measured job is "compute the visible-tile set for one user for one
page render", each backend exercised exactly the way it is integrated
and deployed in production:

  cerbos    gRPC CheckResources with all tiles as resources; the PDP
            answers ALLOW/DENY per tile.
  guardian  HTTP POST /guardian/authorization/permissions with the
            actor only (targets=null, general permissions); the
            portal-side string matching of guardianPermissionView
            against the returned permission set is part of the timed
            window, because the portal really does it per render.

Timed window per request (identical structure for both drivers):
  pick user (round-robin) -> build/serialize request -> send ->
  receive -> parse -> visible-DN set.

Heavy shared parts (the tile resource list, per-user actor/principal)
are pre-built offline; per-request serialization stays in the loop.

Usage:
  uv run bench.py cerbos    [--target localhost:3593]
  uv run bench.py guardian  [--target http://localhost:8000]
  uv run bench.py <backend> --sanity      # print decision sets, no timing
  uv run bench.py <backend> --concurrency 8 --duration 20   # saturation

Concurrency mode: N worker threads, each with its OWN driver instance
(own HTTP connection / own gRPC channel — like N independent portal
workers), all running for a fixed duration after a barrier start.
`client_cpu_cores` in the output is the harness's own CPU usage; values
approaching 1.0 mean the Python client (GIL) is the bottleneck, not the
backend.

Results are printed and appended to results.jsonl.
"""

import argparse
import datetime
import json
import pathlib
import statistics
import sys
import threading
import time


HERE = pathlib.Path(__file__).parent
DATA_DIR = HERE / "data"

TEST_USERS = ["Administrator", "student1", "teacher1"]


def load_snapshots():
    try:
        entries = json.loads((DATA_DIR / "entries.json").read_text())
        users = json.loads((DATA_DIR / "users.json").read_text())
    except FileNotFoundError:
        sys.exit("data/ snapshots missing - run `uv run fetch_data.py` first")
    return users, entries


def guardian_roles(properties: dict) -> list[str]:
    return list(properties.get("guardianRoles") or []) + list(
        properties.get("guardianInheritedRoles") or [],
    )


# ----------------------------------------------------------------------
# Guardian driver (HTTP, production call shape of the portal)
# ----------------------------------------------------------------------


class GuardianDriver:
    name = "guardian"
    default_target = "http://localhost:8000"

    def __init__(self, target: str, users: dict, entries: list):
        import httpx

        self.client = httpx.Client(base_url=target, timeout=10.0)
        # (dn, guardianPermissionView) for the portal-side matching step
        self.tiles = [
            (e["dn"], e["properties"].get("guardianPermissionView")) for e in entries
        ]
        # Pre-built request body per user; json.dumps happens per
        # request inside the timed window.
        self.bodies = {
            uname: self._build_body(u["dn"], u["properties"])
            for uname, u in users.items()
        }

    @staticmethod
    def _expand_role(role: str) -> dict | None:
        # "app:namespace:name" -> Role object; mirrors the portal's
        # GuardianAuthorizationClient.expand_role_string().
        parts = role.split(":", 2)
        if len(parts) != 3:
            return None
        return {
            "app_name": parts[0],
            "namespace_name": parts[1],
            "name": parts[2],
            "context": None,
        }

    def _build_body(self, dn: str, properties: dict) -> dict:
        roles = [
            r for r in map(self._expand_role, guardian_roles(properties)) if r
        ]
        # Mirrors portal.py _get_guardian_permissions / _build_guardian_actor:
        # actor with full UDM properties, no targets, portal namespace only.
        return {
            "namespaces": [{"app_name": "univention-portal", "name": "portal"}],
            "actor": {"id": dn, "roles": roles, "attributes": properties},
            "targets": None,
            "contexts": [],
            "include_general_permissions": True,
            "extra_request_data": {},
        }

    def request(self, uname: str) -> set[str]:
        body = json.dumps(self.bodies[uname])
        r = self.client.post(
            "/guardian/authorization/permissions",
            content=body,
            headers={"Content-Type": "application/json"},
        )
        r.raise_for_status()
        perms = {
            f"{p['app_name']}:{p['namespace_name']}:{p['name']}"
            for p in r.json()["general_permissions"]
        }
        # Portal-side step: guardianPermissionView string matching.
        return {dn for dn, gpv in self.tiles if gpv and gpv in perms}

    def close(self):
        self.client.close()


# ----------------------------------------------------------------------
# Cerbos driver (gRPC, production config is gRPC-only)
# ----------------------------------------------------------------------


def _sanitize(value):
    # Same as poc.py: drop None so CEL has() returns false for missing.
    if isinstance(value, dict):
        return {k: _sanitize(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [_sanitize(v) for v in value if v is not None]
    return value


class CerbosDriver:
    name = "cerbos"
    default_target = "localhost:3593"

    def __init__(self, target: str, users: dict, entries: list):
        from cerbos.engine.v1 import engine_pb2
        from cerbos.request.v1 import request_pb2
        from cerbos.sdk.grpc.client import CerbosClient
        from google.protobuf import json_format
        from google.protobuf.struct_pb2 import Value

        self._effect_allow = self._load_effect_allow()

        def attr_map(properties: dict) -> dict:
            return {
                k: json_format.ParseDict(v, Value())
                for k, v in _sanitize(properties).items()
            }

        # Resource entries pre-built once, shared by every request.
        self.resources = [
            request_pb2.CheckResourcesRequest.ResourceEntry(
                actions=["view"],
                resource=engine_pb2.Resource(
                    kind="portal:entry",
                    id=e["dn"],
                    attr=attr_map(e["properties"]),
                ),
            )
            for e in entries
        ]
        # Principal pre-built per user.
        self.principals = {}
        for uname, u in users.items():
            roles = guardian_roles(u["properties"]) or ["anonymous"]
            self.principals[uname] = engine_pb2.Principal(
                id=u["dn"], roles=roles, attr=attr_map(u["properties"]),
            )
        self.client = CerbosClient(target, tls_verify=False)

    @staticmethod
    def _load_effect_allow():
        from cerbos.effect.v1 import effect_pb2

        return effect_pb2.Effect.EFFECT_ALLOW

    def request(self, uname: str) -> set[str]:
        resp = self.client.check_resources(
            principal=self.principals[uname], resources=self.resources,
        )
        return {
            r.resource.id
            for r in resp.results
            if r.actions["view"] == self._effect_allow
        }

    def close(self):
        self.client.close()


DRIVERS = {d.name: d for d in (GuardianDriver, CerbosDriver)}


# ----------------------------------------------------------------------
# Runner
# ----------------------------------------------------------------------


def percentile(sorted_samples: list[float], p: float) -> float:
    idx = min(round(p / 100 * (len(sorted_samples) - 1)), len(sorted_samples) - 1)
    return sorted_samples[idx]


def run_concurrent(driver_cls, target, users, entries, unames,
                   concurrency: int, duration: float):
    """N threads x own driver, barrier start, fixed duration."""
    drivers = [driver_cls(target, users, entries) for _ in range(concurrency)]
    barrier = threading.Barrier(concurrency + 1)
    stop = threading.Event()
    per_thread: list[list[float]] = [[] for _ in range(concurrency)]

    def worker(idx: int):
        d = drivers[idx]
        for i in range(20):  # per-thread warmup
            d.request(unames[(idx + i) % len(unames)])
        barrier.wait()
        samples = per_thread[idx]
        i = idx
        while not stop.is_set():
            t0 = time.perf_counter_ns()
            d.request(unames[i % len(unames)])
            samples.append((time.perf_counter_ns() - t0) / 1e6)
            i += 1

    threads = [threading.Thread(target=worker, args=(i,)) for i in range(concurrency)]
    for t in threads:
        t.start()
    barrier.wait()
    cpu0 = time.process_time()
    t_start = time.perf_counter()
    time.sleep(duration)
    stop.set()
    for t in threads:
        t.join()
    wall_s = time.perf_counter() - t_start
    client_cpu_s = time.process_time() - cpu0
    for d in drivers:
        d.close()
    samples = [s for lst in per_thread for s in lst]
    return samples, wall_s, client_cpu_s


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("backend", choices=sorted(DRIVERS))
    ap.add_argument("--target", help="backend address (default per backend)")
    ap.add_argument("--requests", type=int, default=2000)
    ap.add_argument("--warmup", type=int, default=200)
    ap.add_argument("--concurrency", type=int, default=1,
                    help="worker threads, each with its own driver/connection")
    ap.add_argument("--duration", type=float, default=20.0,
                    help="seconds per concurrent run (concurrency > 1 only)")
    ap.add_argument("--sanity", action="store_true",
                    help="print per-user decision sets and exit (no timing)")
    ap.add_argument("--label", default="", help="free-form note stored in results")
    args = ap.parse_args()

    users, entries = load_snapshots()
    by_dn = {e["dn"]: e["properties"].get("name", "?") for e in entries}
    driver_cls = DRIVERS[args.backend]
    target = args.target or driver_cls.default_target
    unames = [u for u in TEST_USERS if u in users] or list(users)

    if args.sanity:
        driver = driver_cls(target, users, entries)
        for uname in unames:
            allowed = driver.request(uname)
            names = sorted(by_dn[dn] for dn in allowed)
            print(f"{uname}: {len(allowed)} visible via {args.backend}: {names}")
        driver.close()
        return 0

    client_cpu_s = None
    if args.concurrency > 1:
        print(f"backend={args.backend} target={target} "
              f"concurrency={args.concurrency} duration={args.duration}s users={unames}")
        samples_ms, wall_s, client_cpu_s = run_concurrent(
            driver_cls, target, users, entries, unames,
            args.concurrency, args.duration)
        n_requests = len(samples_ms)
    else:
        print(f"backend={args.backend} target={target} "
              f"warmup={args.warmup} requests={args.requests} users={unames}")
        driver = driver_cls(target, users, entries)
        for i in range(args.warmup):
            driver.request(unames[i % len(unames)])
        samples_ms = []
        t_start = time.perf_counter()
        for i in range(args.requests):
            t0 = time.perf_counter_ns()
            driver.request(unames[i % len(unames)])
            samples_ms.append((time.perf_counter_ns() - t0) / 1e6)
        wall_s = time.perf_counter() - t_start
        driver.close()
        n_requests = args.requests

    s = sorted(samples_ms)
    result = {
        "ts": datetime.datetime.now(datetime.UTC).isoformat(timespec="seconds"),
        "backend": args.backend,
        "target": target,
        "label": args.label,
        "concurrency": args.concurrency,
        "requests": n_requests,
        "warmup": args.warmup,
        "tiles": len(entries),
        "users": unames,
        "p50_ms": round(percentile(s, 50), 3),
        "p90_ms": round(percentile(s, 90), 3),
        "p99_ms": round(percentile(s, 99), 3),
        "max_ms": round(s[-1], 3),
        "mean_ms": round(statistics.fmean(s), 3),
        "stddev_ms": round(statistics.stdev(s), 3),
        "wall_s": round(wall_s, 1),
        "rps": round(n_requests / wall_s, 1),
    }
    if client_cpu_s is not None:
        result["client_cpu_cores"] = round(client_cpu_s / wall_s, 2)

    print(
        f"\n{args.backend} c={args.concurrency}: "
        f"p50={result['p50_ms']}ms p90={result['p90_ms']}ms "
        f"p99={result['p99_ms']}ms max={result['max_ms']}ms "
        f"mean={result['mean_ms']}±{result['stddev_ms']}ms "
        f"rps={result['rps']}"
        + (f" client_cpu={result['client_cpu_cores']} cores"
           if client_cpu_s is not None else ""),
    )

    with open(HERE / "results.jsonl", "a") as f:
        f.write(json.dumps(result) + "\n")
    print(f"appended to {HERE / 'results.jsonl'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
