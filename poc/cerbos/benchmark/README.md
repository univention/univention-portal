<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# OPA-Guardian vs Cerbos — sequential latency benchmark

Design and rationale: `../docs/perf-comparison-plan.md`. Short version:
the measured job is "visible-tile set for one user for one page
render", each backend driven exactly as production integrates it
(Guardian: HTTP, actor-only general-permissions request + portal-side
string matching; Cerbos: gRPC CheckResources with all 33 tiles).

## One-time preparation

```bash
# payload snapshots from UDM (already committed under data/ if present)
uv run fetch_data.py

# production OPA bundles from the hackathon deployment
# (already committed under bundles/; re-run to refresh)
kubectl -n guardian-hackathon port-forward svc/nubus-guardian-management-api 18001:80 &
curl -fo bundles/GuardianPolicyBundle.tar.gz \
  http://localhost:18001/guardian/management/bundles/GuardianPolicyBundle.tar.gz
curl -fo bundles/GuardianDataBundle.tar.gz \
  http://localhost:18001/guardian/management/bundles/GuardianDataBundle.tar.gz
```

## Running

One stack at a time. Interleave repetitions A,B,A,B,A,B (3 each) to
spread thermal/background noise. Laptop plugged in, no heavy apps.

```bash
# --- Cerbos
docker compose -f docker-compose.cerbos.yaml up -d
uv run bench.py cerbos --sanity        # decision sets look right?
uv run bench.py cerbos --label run1
docker stats --no-stream cerbos-bench  # note CPU/mem
docker compose -f docker-compose.cerbos.yaml down

# --- Guardian
docker compose -f docker-compose.guardian.yaml up -d
uv run bench.py guardian --sanity
uv run bench.py guardian --label run1
docker stats --no-stream authz-api-bench opa-bench
docker compose -f docker-compose.guardian.yaml down

# ... repeat both twice more (run2, run3)
```

Results accumulate in `results.jsonl` (one JSON object per run:
p50/p90/p99/max/mean/stddev in ms, req/s, metadata).

Saturation mode (N threads, each with its own connection, fixed
duration; `client_cpu_cores` near 1.0 would mean the harness is the
bottleneck):

```bash
for c in 1 2 4 8 16; do uv run bench.py cerbos --concurrency $c --duration 20; done

# guardian with more gunicorn workers (image default is 1):
GUARDIAN_WORKERS=8 docker compose -f docker-compose.guardian.yaml up -d
```

Grab `docker stats --no-stream` mid-run for the CPU-per-job numbers.

Note: pulling the authorization-api image from
`artifacts.software-univention.de` may require registry login. The OPA
image is upstream `openpolicyagent/opa:1.11.0-static` — pinned to the
exact OPA version the deployed guardian image runs.

## Expected sanity output

- `guardian`: only tiles carrying a `guardianPermissionView` that maps
  to one of the user's role capabilities are listed (Administrator with
  `guardian:builtin:super-admin` typically gets all marked tiles).
- `cerbos`: tiles matching the PoC rules in `../policies/` (ox_mail for
  OX users, nextcloud for nextcloudEnabled, teacher tiles, tile*,
  super-admin sees all).

The two sets differ by design (OR-union model) — see the plan doc.
