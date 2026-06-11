<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# Performance results: OPA-Guardian vs Cerbos

Plan and methodology: `perf-comparison-plan.md`. Harness: `../benchmark/`.
Run date: 2026-06-11.

## Read these caveats first

- **The UDM user fetch is excluded.** In production the portal fetches
  the user from UDM before calling *either* backend; that call is
  backend-independent and often dominates total authorization latency.
  These numbers are PDP-job cost only — do not quote them as "portal
  authorization latency".
- Guardian ran **without OAuth** (`fast_api_always_authorized`); its
  production config validates a JWT per request. Numbers flatter
  Guardian slightly.
- Both rule sets are toy-sized (5 Cerbos rules; small hackathon
  roleCapabilityMapping). This measures each framework's overhead
  floor at the real portal workload, not policy-evaluation scaling.
- Laptop hardware, Docker on localhost, sequential requests from a
  Python client (one extra container-bridge hop, identical for both).
  Absolute numbers ±20%; the relative comparison is the result.
- Both stacks were up simultaneously; the idle one consumes ~no CPU
  during the other's sequential run.

## Headline

| | p50 | p90 | p99 | mean | sequential req/s |
|---|---|---|---|---|---|
| **OPA-Guardian** (HTTP, actor-only + portal-side matching) | **3.7 ms** | 5.1 ms | 6.7 ms | 3.9 ms | ~257 |
| **Cerbos** (gRPC, 33 tiles as resources) | **12.1 ms** | 21.6 ms | 25.2 ms | 14.2 ms | ~71 |

**The OPA-Guardian job is ~3× faster than the Cerbos job at the real
portal size of 33 tiles** — despite Guardian being a Python FastAPI hop
in front of OPA over HTTP/JSON, and Cerbos being a single Go server
spoken to over gRPC. The reason is the integration shape, not engine
quality: Guardian's request carries only the actor and its evaluation
cost is constant in tile count, while Cerbos receives and evaluates all
33 tiles per request (~0.3 ms per tile, see attribution below).

## Full runs

2,000 timed requests per run after 200 warmup, 3 users round-robin,
runs interleaved A,B,A,B,A,B. Raw data: `../benchmark/results.jsonl`.

| run | backend | p50 | p90 | p99 | max | mean ± stddev | req/s |
|---|---|---|---|---|---|---|---|
| 1 | cerbos | 12.25 | 21.92 | 25.69 | 32.60 | 14.36 ± 4.46 | 69.6 |
| 1 | guardian | 3.73 | 5.26 | 7.22 | 38.99 | 3.86 ± 1.38 | 259.1 |
| 2 | cerbos | 12.02 | 21.58 | 25.59 | 40.68 | 14.11 ± 4.41 | 70.8 |
| 2 | guardian | 3.79 | 5.00 | 6.31 | 17.05 | 3.91 ± 0.84 | 255.9 |
| 3 | cerbos | 11.99 | 21.35 | 24.46 | 33.83 | 13.99 ± 4.29 | 71.5 |
| 3 | guardian | 3.73 | 5.01 | 6.49 | 51.08 | 3.92 ± 1.37 | 255.1 |

All values in ms. Repetitions agree within ~2% on p50 — thermal/noise
effects were negligible at this load.

## Attribution experiments

**Cerbos latency is linear in resource count** (student1 principal,
150 samples per point):

| resources | p50 | p90 | min |
|---|---|---|---|
| 1 | 1.76 | 2.14 | 1.36 |
| 4 | 4.38 | 5.51 | 3.61 |
| 8 | 4.17 | 7.54 | 3.23 |
| 16 | 6.59 | 12.23 | 5.33 |
| 33 | 12.91 | 22.75 | 9.57 |

≈ 1.8 ms fixed + ≈ 0.31 ms per resource. A hypothetical 50-tile portal
(the production config's `maxResourcesPerRequest`) would land around
17–18 ms p50; Guardian would stay at ~3.7 ms.

**Not a payload-size effect.** Sending resources with *only* the `name`
attribute (5.7 KB request instead of 31.8 KB) gives the same latency
(p50 12.3 vs 12.5 ms). The per-tile cost is Cerbos's per-resource
rule-evaluation machinery, not attribute marshalling. Stripping tile
attributes below "what the policies read" buys nothing.

**Not user-dependent.** All three principals (including Administrator,
whose super-admin rule allows everything) show the same distribution.

**Client-side cost is negligible.** Building + serializing the full
33-resource protobuf request takes ~0.3 ms in Python; Guardian's
`json.dumps` similar. >95% of the measured window is server + transport.

**Bimodality in Cerbos** (p90 ≈ 2× p50, two modes ~11 ms apart) is not
explained by user, payload, or warmup; plausibly Go GC/scheduler under
the per-request allocation load of 33 attr maps. Not investigated
further.

## Saturation scenario (concurrency sweep)

N harness threads, each with its own connection/channel and driver
instance, 20 s per level, users round-robin. `client cpu` is the
harness's own CPU use (max 0.57 cores — the client was never the
bottleneck). Guardian ran the image default of **1 gunicorn worker**
here (multi-worker variant below).

| c | cerbos p50 | cerbos rps | guardian p50 | guardian rps |
|---|---|---|---|---|
| 1 | 13.5 ms | 64 | 4.5 ms | 211 |
| 2 | 24.7 ms | 78 | 6.5 ms | 293 |
| 4 | 49.3 ms | 81 | 10.2 ms | **377** |
| 8 | 98.6 ms | 80 | 21.0 ms | 371 |
| 16 | 205.4 ms | **76** | 50.2 ms | 306 |

`docker stats` snapshots taken mid-run:

- during a Cerbos level: `cerbos-bench` **960% CPU** (~9.6 cores),
  authz/opa idle;
- during a Guardian level: `authz-api-bench` **105%** + `opa-bench`
  **99%** (~1 core each), cerbos idle.

**Findings:**

1. **Cerbos saturates at ~80 jobs/s on this machine** (33-tile jobs),
   already at c=2, and is purely CPU-bound: ~9.6 cores / 80 rps ≈
   **120 ms of CPU per job** (~3.6 ms CPU per tile). Cerbos
   parallelizes a single request's resources across cores — that's why
   sequential latency is 12 ms while per-job CPU is 120 ms, and why
   extra concurrency adds latency (c=16 → 205 ms p50) but no
   throughput.
2. **Guardian with one worker peaks at ~377 rps** (~2 cores total:
   1 python worker + OPA) ≈ **5 ms of CPU per job — roughly 20×
   cheaper than Cerbos**. Past c=4 it queues on the single gunicorn
   worker; latency grows but degradation is graceful.
3. Per-pod capacity at this workload: a single-worker Guardian pod
   sustains ~4–5× the request rate of a Cerbos instance, using ~5× less
   CPU. Cerbos scales by adding CPUs/replicas like any stateless PDP,
   but the per-job CPU cost ratio (~20×) carries over.

| user | guardian visible | cerbos visible |
|---|---|---|
| Administrator | 0 tiles | 33 (super-admin rule) |
| student1 | 1 (`ox_mail`) | 10 (`ox_mail` + 9 `tile*`) |
| teacher1 | 5 (`access-*` tiles) | 5 (same teacher tiles) |

Sets differ by design (OR-union model; the PoC Cerbos policy gates more
tiles than the deployed Guardian mapping). Noteworthy real-deployment
fact: `guardian:builtin:super-admin`'s capabilities are scoped to
`guardian:management-api` only, so **Administrator gets zero portal
permissions from the deployed Guardian** — its tiles come purely from
the legacy group filter.

## Interpretation

1. **At portal scale both are fast enough.** 4 ms vs 12 ms per page
   render is invisible next to the UDM user fetch and portal rendering.
   Performance alone does not decide Cerbos vs Guardian here.
2. **The architectural shapes, not the engines, set the numbers.**
   Guardian's integration moved per-tile matching into the portal and
   asks the PDP one constant-size question; it scales O(1) in tiles but
   the *expressiveness* per tile is limited to permission-string
   matching. Cerbos evaluates real per-tile conditions in the PDP and
   pays ~0.3 ms/tile for it.
3. **gRPC did not outweigh the heavier job.** Cerbos's protocol
   advantage is real but small at this payload size; the per-resource
   evaluation cost dominates.
4. **A Cerbos integration that wanted Guardian-shaped numbers could get
   them** by asking a Guardian-shaped question (e.g. one resource
   "portal" with action per tile-group, or principal-only
   PlanResources) — at the cost of the per-tile expressiveness that
   motivates Cerbos in the first place. That trade is the actual
   decision, and it is not a performance decision.

## Environment

| | |
|---|---|
| CPU | AMD Ryzen 7 PRO 5850U, 16 threads |
| Kernel | Linux 6.8.0-52-generic |
| Cerbos | `ghcr.io/cerbos/cerbos:0.46.0`, production univention-guardian config (gRPC :3593, audit/telemetry off, `requestLimits.maxResourcesPerRequest: 50`) |
| Guardian authz-api | `artifacts.software-univention.de/nubus/images/guardian-authorization-api-authorization-api:3.0.9`, gunicorn + 1 uvicorn worker (image default), auth adapter `fast_api_always_authorized` |
| OPA | `openpolicyagent/opa:1.11.0-static` (same OPA version as the deployed guardian-…-opa:3.0.9 image), production bundles from the guardian-hackathon Management API, `--v0-compatible` |
| Data | 33 real portal entries, 3 real users (snapshots in `../benchmark/data/`), icons/photos stripped for both backends |
| Client | Python 3.11, httpx (Guardian) / cerbos gRPC SDK 0.15.1 (Cerbos), persistent connections, sequential |
| CPU caps | none |

`docker stats` CPU snapshots were collected manually during the
saturation sweep (see that section); not collected for the sequential
runs.
