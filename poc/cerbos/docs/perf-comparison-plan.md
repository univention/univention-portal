<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# Performance comparison plan: OPA-Guardian vs Cerbos

## Goal

A **simple** performance comparison of the cost of answering the
question the portal asks on every page load:

> **"Which tiles is this user allowed to see?"** (one full portal page,
> per user)

for two authorization backends, on the same laptop:

- **OPA-Guardian**: Guardian Authorization API (FastAPI) + OPA, with the
  exact bundles deployed in the `guardian-hackathon` namespace.
- **Cerbos**: single Cerbos container with this PoC's policies, run with
  the production Cerbos config that `univention-guardian` ships.

The unit of comparison is the **job** ("visibility set for one user for
one page render"), not "one HTTP request", because the two systems split
the job differently (see next section).

Scope is deliberately minimal: sequential latency only, real data
(33 tiles, 3 users), no CPU caps, no load sweeps. Extensions live in
"Later" at the bottom.

## The structural asymmetry you must not paper over

The two integrations have fundamentally different request shapes:

| | OPA-Guardian (as the portal calls it today) | Cerbos (as this PoC calls it) |
|---|---|---|
| Requests per page render | 1 | 1 |
| Protocol | HTTP/JSON (the stack offers nothing else) | gRPC/protobuf (production config is gRPC-only) |
| Request carries | actor only (`targets: null`, all UDM user props as `attributes`) | principal **plus every candidate tile** as a resource |
| Server returns | the user's *general permissions* in namespace `univention-portal:portal` | ALLOW/DENY per tile |
| Tile matching happens | **in the portal** (string compare `guardianPermissionView ∈ permissions`) | **in the PDP** (CEL rules over tile attrs) |
| Cost scales with | size of roleCapabilityMapping (constant in #tiles) | #tiles × #rules |

Evidence:
- Portal → Guardian call: `python/univention/portal/extensions/portal.py:245-252`
  (`get_permissions(actor, targets=None, namespaces=["univention-portal:portal"], include_general_permissions=True)`).
- Guardian API → OPA: `authorization-api/guardian_authorization_api/adapters/policies.py`
  (`POST /v1/data/univention/base/get_permissions`).
- Cerbos call: `poc/cerbos/poc.py:cerbos_check` (CheckResources, all
  entries as resources).

Each system is benchmarked **the way it is actually integrated and
deployed** — including its protocol. gRPC is a capability OPA-Guardian
does not have; that difference is part of the comparison, not noise to
be normalized away. The report states both shapes explicitly.

Note: we test at the real N=33 only. Keep in mind when reading results
that Cerbos cost scales with tile count while Guardian's stays flat —
but at portal-realistic tile counts a single number is fine.

## Topologies

Both stacks run in Docker on the same laptop, exercised by the same
benchmark harness over localhost, one stack at a time (never
simultaneously). No CPU caps — each stack takes what it wants; record
`docker stats` peak CPU alongside the results so resource appetite is
visible.

### Stack A — Cerbos (gRPC)

```
bench.py ──gRPC──> cerbos:3593  CheckResources
```

- Container: `ghcr.io/cerbos/cerbos:0.46.0`.
- **Config: the production config** from the guardian repo,
  `univention-guardian/conffiles/usr/share/univention-guardian-server/config/config.yaml`,
  copied to `poc/cerbos/benchmark/cerbos-bench.yaml` with the UCR
  template header stripped. Relevant properties:
  - gRPC configured explicitly (`grpcListenAddr: ":3593"`; Cerbos still
    opens its default HTTP listener on :3592, but the benchmark — like
    the production config's intent — uses gRPC, and the compose file
    publishes only 3593),
  - no audit section → audit disabled (the PoC's `cerbos.yaml` has it
    enabled; the PoC file stays untouched),
  - telemetry disabled, playground/API-explorer off,
  - `schema.enforcement: reject` (harmless — the PoC defines no schemas),
  - `requestLimits.maxResourcesPerRequest: 50` — the 33 real tiles fit
    in one request; we don't test beyond that.
- Policies: the existing `policies/portal_entry.yaml` (5 rules).
- Client: official `cerbos` Python SDK, gRPC client
  (`cerbos.sdk.grpc`), persistent channel.

### Stack B — OPA-Guardian (HTTP)

```
bench.py ──HTTP──> authorization-api:8000  POST /guardian/authorization/permissions
                        │
                        └─HTTP──> opa:8181  POST /v1/data/univention/base/get_permissions
```

- Images: the exact deployed hackathon images, version **3.0.9**
  (`artifacts.software-univention.de/nubus/images/guardian-authorization-api-authorization-api:3.0.9`
  and `...-opa:3.0.9`), pulled if accessible; fallback: build from the
  matching git ref.
- authz-api env (no Keycloak, no UDM, no Management API at runtime):
  ```
  GUARDIAN__AUTHZ__ADAPTER__SETTINGS_PORT=env
  GUARDIAN__AUTHZ__ADAPTER__POLICY_PORT=opa
  GUARDIAN__AUTHZ__ADAPTER__PERSISTENCE_PORT=udm_data   # registered, never hit:
                                                        # only the non-lookup endpoint is called
  GUARDIAN__AUTHZ__ADAPTER__AUTHENTICATION_PORT=fast_api_always_authorized
  OPA_ADAPTER__URL=http://opa:8181/
  GUARDIAN__AUTHZ__LOGGING__LEVEL=WARNING
  ```
- OPA loads the **downloaded production bundles** from disk (no
  polling, no Management API):
  ```
  opa run --server --addr 0.0.0.0:8181 \
      /bundles/GuardianPolicyBundle.tar.gz /bundles/GuardianDataBundle.tar.gz
  ```
- Decision logging off (default), uvicorn access logs off.
- Worker count: whatever the image's default entrypoint does — same as
  the hackathon deployment. Record it.

### Explicitly out of scope (for both stacks equally)

- Keycloak token issuance/validation (disabled on Guardian; Cerbos has
  none). Noted as flattering Guardian slightly vs its production config.
- UDM lookups. The portal does one UDM user fetch per render before
  *either* backend; it is backend-independent and excluded. **The
  results doc must carry this caveat prominently** — these numbers are
  PDP cost, not total portal authorization latency.
- The legacy group-filter and the union step — identical for both.

## Production rules — DONE, verified

The bundles were downloaded from the hackathon Management API on
2026-06-11 and are committed under `poc/cerbos/benchmark/bundles/`:

```bash
kubectl -n guardian-hackathon port-forward svc/nubus-guardian-management-api 18001:80 &
curl -fO http://localhost:18001/guardian/management/bundles/GuardianPolicyBundle.tar.gz
curl -fO http://localhost:18001/guardian/management/bundles/GuardianDataBundle.tar.gz
```

No auth required. Verified contents:
- `GuardianPolicyBundle.tar.gz` (4.5 KB): `univention/base.rego`,
  `univention/utils.rego`, all `guardian/conditions/*.rego` builtins.
- `GuardianDataBundle.tar.gz` (0.8 KB): `data.json` with the live
  `roleCapabilityMapping`, including the `univention-portal` roles.

Re-running the two commands refreshes them if the deployment's mapping
changes.

## Harness design

One Python script (`poc/cerbos/benchmark/bench.py`), one timing path,
two backend drivers.

### Payload preparation (offline, not timed)

1. Fetch the 33 portal entries and the 3 test users
   (`Administrator`, `student1`, `teacher1`) from UDM once (reuse
   `poc.py` fetch code). Persist as JSON snapshots in
   `poc/cerbos/benchmark/data/` so runs are reproducible offline.
2. **Strip base64 icons** (and `jpegPhoto` on users) from all payloads
   for **both** backends — the production integration should do this
   anyway (95 KB → ~5 KB, see `sample-request.md`).
3. Pre-build per driver:
   - Cerbos: the protobuf `Resource` list once (shared across
     requests); a `Principal` per user.
   - Guardian: the actor dict per user (it contains no tiles).

### Per-request timed window — identical for both drivers

pick user (round-robin) → build/serialize request → send → receive →
parse → produce the visible-DN set.

For Guardian "produce the visible set" includes the portal-side
`guardianPermissionView in permissions` string matching over the 33
tiles; for Cerbos it is reading the per-resource effects. Per-user
request building stays inside the loop (simulates separate requests
for separate users); the heavy shared parts are pre-built.

### Sanity check (not a gate)

Once, before timing: print each backend's decision set per user. The
two systems intentionally gate different tile subsets (OR-union model)
— differences are expected and fine. This is just to confirm both
stacks are actually evaluating the real rules and not erroring into
trivially-empty answers.

### Measurement

Sequential latency only. Single persistent connection/channel, one
request in flight. Per backend:

- 200 warmup requests (discarded),
- 2,000 timed requests, users round-robin,
- report p50 / p90 / p99 / max, plus mean ± stddev.

Run protocol: interleave A,B,A,B,A,B (3 repetitions each) to spread
thermal/background noise. Laptop plugged in, performance governor,
no heavy apps. Rerun any repetition whose p50 deviates >15% from the
other two.

## Deliverables

1. `poc/cerbos/benchmark/` — `bench.py`, data snapshots,
   `cerbos-bench.yaml`, compose file(s) for both stacks,
   `bundles/` (done).
2. `poc/cerbos/docs/perf-results.md` — one table:
   p50/p90/p99/max per backend, peak CPU from `docker stats`,
   versions/environment block (Cerbos 0.46.0, Guardian 3.0.9, OPA
   version from the image, CPU model, kernel), and the caveats list
   (auth disabled on Guardian, UDM fetch excluded, toy-scale rule sets,
   laptop hardware, localhost networking).

## Decisions taken

1. **Job-level comparison, production shapes end-to-end** — including
   protocol: Cerbos over gRPC (its production config is gRPC-only),
   Guardian over HTTP (its stack has no gRPC). The protocol difference
   is a real capability difference and part of the result.
2. **Cerbos runs the production config** shipped by
   `univention-guardian` (audit off, telemetry off, gRPC-only,
   50-resource request limit). PoC `cerbos.yaml` untouched.
3. **No CPU caps.** Both stacks take what they want; peak CPU is
   recorded and reported next to latency.
4. **Sequential latency only** for the first iteration. Throughput /
   concurrency sweeps deferred.
5. **Auth disabled on Guardian** (`fast_api_always_authorized`) —
   documented as flattering Guardian vs production.
6. **Decision-set differences accepted.** Sanity-print once, no
   equivalence gate.
7. **Icons stripped for both backends.**
8. **Deployed images, pinned versions** (Guardian 3.0.9, Cerbos 0.46.0),
   live production bundles (already downloaded and committed).

## Concerns that remain

1. **Toy-scale rule sets on both sides.** 5 Cerbos rules vs a small
   roleCapabilityMapping measure the framework overhead floor, not
   policy-evaluation scaling. Fine for "simple comparison"; say so in
   the results.
2. **Python client jitter inflates p99.** A Python loop partly measures
   Python; treat p50/p90 as primary, p99 as indicative. gRPC and HTTP
   clients have different Python-side overhead — that lands inside the
   timed window by design (it's part of each integration's real cost),
   but worth a sentence in the results.
3. **Laptop is a noisy lab.** Interleaved A/B repetitions and stddev
   bound this; read absolute numbers as ±20%, trust the relative
   comparison more.
4. **Pulling the 3.0.9 images** from
   `artifacts.software-univention.de` may need registry credentials.
   Fallback: build from the matching git ref and record the delta.
5. **The UDM-fetch caveat** (out-of-scope note above) is the most
   likely way these numbers get misquoted later. Keep it in the results
   header, not a footnote.

## Later (explicitly not now)

- Concurrency sweep / throughput (asyncio or k6; shows Go-vs-gunicorn
  saturation behavior).
- OPA-direct scenario (attributes how much of Guardian's latency is the
  FastAPI hop).
- Bigger synthetic rule sets / role mappings (policy-eval scaling).
- Cerbos HTTP variant (quantifies the gRPC advantage in isolation).
