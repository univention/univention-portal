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
- The main runs use toy-sized rule sets (5 Cerbos rules; small
  hackathon roleCapabilityMapping). The deployed Guardian mapping is
  actually 24 roles / 28 capabilities, so a faithful Cerbos policy is
  ~5× bigger than what the headline measures. Rule-count scaling is
  measured separately on 0.53 (see "Rule-count scaling") and is a
  non-issue there; on 0.46 it would not have been.
- Laptop hardware, Docker on localhost, sequential requests from a
  Python client (one extra container-bridge hop, identical for both).
  Absolute numbers ±20%; the relative comparison is the result.
- Both stacks were up simultaneously; the idle one consumes ~no CPU
  during the other's sequential run.

## Headline

| | p50 | p90 | p99 | mean | sequential req/s |
|---|---|---|---|---|---|
| **OPA-Guardian** (HTTP, actor-only + portal-side matching) | **3.7 ms** | 5.1 ms | 6.7 ms | 3.9 ms | ~257 |
| **Cerbos 0.46.0** (gRPC, 33 tiles as resources; version shipped by univention-guardian) | **12.1 ms** | 21.6 ms | 25.2 ms | 14.2 ms | ~71 |
| **Cerbos 0.53.0** (same job, current upstream) | **4.4 ms** | 5.3 ms | 7.2 ms | 4.6 ms | ~219 |
| **OPA-Guardian targets** (what-if: Cerbos-style, 33 tiles as targets) | **11.3 ms** | 16.9 ms | 22.3 ms | 12.0 ms | ~84 |

**Against the shipped Cerbos 0.46.0, the OPA-Guardian job is ~3×
faster at the real portal size of 33 tiles** — despite Guardian being
a Python FastAPI hop in front of OPA over HTTP/JSON, and Cerbos being
a single Go server spoken to over gRPC. The reason is the integration
shape, not engine quality: Guardian's request carries only the actor
and its evaluation cost is constant in tile count, while Cerbos
receives and evaluates all 33 tiles per request (~0.3 ms per tile on
0.46, see attribution below).

**Against Cerbos 0.53.0 the gap disappears** (4.4 vs 3.7 ms, plus ~10×
saturation throughput vs 0.46): upstream fixed the dominant CPU
hotspot — per-evaluation CEL program re-planning — in 0.51.0. See the
version-sensitivity section. univention-guardian ships 0.46.0.

The guardian-targets row proves the shape-not-engine point directly:
the same Guardian stack asked the **Cerbos-shaped question** (full
user + all 33 tile objects in one request, per-tile conditions
evaluated in OPA) lands at Cerbos 0.46's wall-clock latency — while
using **~6× less CPU per job** (see the what-if section) — yet is
~2.5× slower than Cerbos 0.53 at the same question.

## Full runs

2,000 timed requests per run after 200 warmup, 3 users round-robin,
runs interleaved A,B,A,B,A,B. Raw data: `../benchmark/results.jsonl`.

| run | backend | p50 | p90 | p99 | max | mean ± stddev | req/s |
|---|---|---|---|---|---|---|---|
| 1 | cerbos 0.46.0 | 12.25 | 21.92 | 25.69 | 32.60 | 14.36 ± 4.46 | 69.6 |
| 1 | guardian | 3.73 | 5.26 | 7.22 | 38.99 | 3.86 ± 1.38 | 259.1 |
| 2 | cerbos 0.46.0 | 12.02 | 21.58 | 25.59 | 40.68 | 14.11 ± 4.41 | 70.8 |
| 2 | guardian | 3.79 | 5.00 | 6.31 | 17.05 | 3.91 ± 0.84 | 255.9 |
| 3 | cerbos 0.46.0 | 11.99 | 21.35 | 24.46 | 33.83 | 13.99 ± 4.29 | 71.5 |
| 3 | guardian | 3.73 | 5.01 | 6.49 | 51.08 | 3.92 ± 1.37 | 255.1 |
| 1 | guardian-targets | 11.15 | 16.46 | 20.23 | 53.46 | 11.72 ± 4.10 | 85.3 |
| 2 | guardian-targets | 11.56 | 17.61 | 26.65 | 44.97 | 12.40 ± 4.57 | 80.6 |
| 3 | guardian-targets | 11.19 | 16.55 | 20.13 | 49.02 | 11.77 ± 4.12 | 84.9 |
| 1 | cerbos 0.53.0 | 4.43 | 5.25 | 7.14 | 8.23 | 4.58 ± 0.58 | 218.1 |
| 2 | cerbos 0.53.0 | 4.39 | 5.26 | 7.21 | 9.68 | 4.57 ± 0.65 | 218.8 |
| 3 | cerbos 0.53.0 | 4.38 | 5.30 | 7.25 | 8.84 | 4.55 ± 0.66 | 219.6 |

All values in ms. Repetitions agree within ~2% on p50 — thermal/noise
effects were negligible at this load. The guardian-targets runs were
taken ~10 h after the interleaved cerbos/guardian runs, back-to-back
(interleaving would have required an OPA bundle swap per repetition);
same harness, same sandbox, same network path.

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

**Where the Cerbos CPU goes: ~half fixed machinery, ~half CEL
condition machinery.** Policy-variant probe (hot-reload via
`watchForChanges`, 500 requests each, original policy restored after):

| policy variant | CEL evals per resource | p50 | mean ± stddev | req/s |
|---|---|---|---|---|
| original 5 conditioned rules | up to 5 | 11.5 | 12.96 ± 2.96 | 77 |
| 1 rule, one trivial condition | 1 | 7.8 | 8.16 ± 1.34 | 122 |
| 1 rule, no condition | 0 | 5.7 | 5.85 ± 0.66 | 171 |

- With **zero** policy logic the 33-resource job still costs 5.7 ms —
  per-resource fan-out machinery (gRPC decode, one work item per
  resource across the worker pool of NumCPU+4 goroutines, spans, eval
  context + caches, audit-trail merging, result building).
- Each condition-bearing rule adds ~1–2 ms per request. The cause is
  in the source, not the rule content: Cerbos **re-plans the CEL
  program on every condition evaluation**
  (`internal/conditions/cerbos_lib.go` `ContextEval` →
  `env.PlanProgram(ast, …)` per call, v0.46.0) because the
  request-constant `now()` is injected via a program decorator.
  cel-go program planning (building the interpretable tree) costs far
  more than evaluating these trivial expressions; ~5 rules × 33
  resources ≈ 165 plans per request, plus the allocation/GC load.
- This also resolves the bimodality note below: with conditions
  removed, stddev collapses from ±2.96 to ±0.66 ms — the spread is
  GC/allocation churn from condition evaluation, not user or payload.
- No single rule is "the expensive one": cost scales with the number
  of condition evaluations; the expressions themselves are
  interchangeable at this size.

Caveat: wall-clock attribution under intra-request parallelism is
approximate; an exact split would need a pprof CPU profile of the
Cerbos process.

**Bimodality in Cerbos** (p90 ≈ 2× p50, two modes ~11 ms apart) is not
explained by user, payload, or warmup; explained by the probe above
(GC/scheduler under condition-evaluation allocation load).

## What-if: Guardian asked the Cerbos-shaped question (guardian-targets)

**This is not the production integration** — the portal never sends
targets today. The scenario answers: what would OPA-Guardian cost if it
did the *same job the same way* as Cerbos — full user + all 33 tile
objects in one request, per-tile gating inside the PDP, no portal-side
string matching?

Setup (`bench.py guardian-targets`): same images and endpoint, but the
request body carries all 33 tiles as full `targets` (~38 KB vs ~5 KB
actor-only), and OPA runs `bundles/CerbosStyleDataBundle.tar.gz` — a
roleCapabilityMapping replicating the five Cerbos rules with
target-aware builtin conditions (built by `make_targets_bundle.py`).
Two translation compromises: Cerbos `roles: ["*"]` becomes capabilities
under the role the rule conditions on, and `name.startsWith("tile")`
becomes an enumerated OR over the nine `tileNN` names — Guardian's
builtin conditions cannot express prefix matching (custom conditions
require deploying extra Rego). Sanity: the decision sets are
**identical to Cerbos's** for all three users (33 / 10 / 5).

Result (3 × 2,000 requests): **p50 11.3 ms, ~84 req/s — statistically
indistinguishable from Cerbos's 12.1 ms**, with a lighter tail
(p90 16.9 vs 21.6 ms). The HTTP/JSON + FastAPI hop and the 38 KB body
cost roughly what Cerbos's gRPC saves; the per-tile evaluation
dominates both.

`docker stats` mid-run (sequential, c=1): `opa-bench` **145%**,
`authz-api-bench` **25%** ≈ 1.7 cores at ~84 jobs/s → **~20 ms CPU per
job** (~17 ms OPA ≈ 0.5 ms/tile, ~3 ms API layer). Cerbos burns
~120 ms CPU per identical job (saturation section) — **~6× more**.
Same wall-clock, very different CPU appetite: Cerbos parallelizes one
request's resources across ~10 cores to reach 12 ms; OPA does the same
work on < 2 cores. (OPA above 100% during a strictly sequential run
indicates some intra-request parallelism/GC, same caveat as the Cerbos
bimodality note.) Untested here: how guardian-targets saturates under
concurrency — the single gunicorn worker that capped the production
scenario at ~377 rps would cap this one far lower, but per-job CPU
suggests it would still out-throughput Cerbos per core.

## Saturation scenario (concurrency sweep)

N harness threads, each with its own connection/channel and driver
instance, 20 s per level, users round-robin. `client cpu` is the
harness's own CPU use (max 0.57 cores — the client was never the
bottleneck). Guardian ran the image default of **1 gunicorn worker**
here (multi-worker variant below).

| c | cerbos p50 | cerbos rps | guardian p50 | guardian rps |
|---|---|---|---|---|
| 1  | 13.5 ms | 64 | 4.5 ms | 211 |
| 2  | 24.7 ms | 78 | 6.5 ms | 293 |
| 4  | 49.3 ms | 81 | 10.2 ms | **377** |
| 8  | 98.6 ms | 80 | 21.0 ms | 371 |
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

## Version sensitivity: the same job on Cerbos 0.53.0

Re-run on 2026-06-12 with `ghcr.io/cerbos/cerbos:0.53.0` (server
version verified via gRPC ServerInfo), same config, same policies, same
harness and network path. Not interleaved with the Guardian runs (one
day apart).

| | p50 | p90 | p99 | mean ± stddev | req/s |
|---|---|---|---|---|---|
| 0.46.0 (3-run aggregate) | 12.1 | 21.6 | 25.2 | 14.2 ± 4.4 | ~71 |
| **0.53.0** (3 runs: 4.43/4.39/4.38) | **4.4** | 5.3 | 7.2 | 4.6 ± 0.6 | ~219 |

**2.7× faster, bimodality gone** (stddev ±0.6 vs ±4.4), and the
saturation ceiling moved by an order of magnitude:

| c | 0.46 p50 / rps | 0.53 p50 / rps |
|---|---|---|
| 4 | 49.3 ms / 81 | 4.5 ms / **847** |
| 8 | 98.6 ms / 80 | 7.9 ms / **977**¹ |

¹ at c=8 the Python harness burns 1.37 cores — the client, not Cerbos,
is approaching its limit; the real server ceiling is higher.

The policy-variant probe confirms *what* got fixed: on 0.53 the
original 5-rule policy (4.43 ms), one-condition (4.66 ms) and
no-condition (4.46 ms) variants are all equal — **the per-condition
cost that made up half of 0.46's latency is gone**. Cause: upstream
PR #2883 ("Cache-friendly time decorator, caching CEL Programs",
released in **0.51.0**) — `now()` is now resolved from the activation
at eval time instead of being baked into the program at plan time, so
CEL programs are planned once and cached instead of re-planned on
every condition evaluation (the exact hotspot identified in the
attribution section). The remaining fixed machinery also got cheaper
(5.7 → 4.4 ms for the condition-free job).

Consequences for the comparison:

- **The "OPA-Guardian is 3× faster" headline is a 0.46 statement.** On
  0.53 the gap to the actor-only integration is 4.4 vs 3.7 ms —
  within noise of each other — while Cerbos evaluates real per-tile
  conditions.
- The guardian-targets what-if (11.3 ms) is now ~2.5× *slower* than
  Cerbos 0.53 answering the same per-tile question.
- The 0.46-based CPU-per-job figures (~120 ms, "~20× more than
  Guardian") do not apply to 0.53. CPU per job was not re-measured
  (no `docker stats` snapshot for these runs), but the ~12×
  throughput jump on the same hardware bounds it at roughly an order
  of magnitude lower.
- **univention-guardian currently ships 0.46.0** — if Cerbos is
  chosen, upgrading the shipped version is the single cheapest
  performance win available.

Raw data: `results.jsonl`, labels `v0.53-*`.

## Rule-count scaling (Cerbos 0.53.0)

Closes the "toy-scale rule sets" caveat. The headline policy has 5
rules; a faithful translation of the deployed Guardian mapping (24
roles / 28 capabilities) would be ~25–30. Does that hurt?

Method (`make_rulecount_policy.py`, hot-reloaded, 600 requests each,
2026-06-16): N rules whose conditions are all false for the real
tiles, so Cerbos never resolves `view` early and evaluates **every**
rule for **every** one of the 33 resources (N×33 CEL evals/request —
the worst case). Original policy restored after.

| rules N | p50 | mean ± stddev | req/s |
|---|---|---|---|
| 1 | 2.09 | 2.25 ± 0.61 | 444 |
| 5 | 2.14 | 2.37 ± 0.67 | 421 |
| 10 | 2.36 | 2.55 ± 0.65 | 393 |
| 25 | 2.76 | 2.94 ± 0.60 | 340 |
| 50 | 3.13 | 3.36 ± 0.72 | 297 |
| 100 | 4.22 | 4.48 ± 1.00 | 223 |

≈ **2.05 ms fixed + 0.022 ms per rule** (≈ 0.65 µs per single CEL
evaluation). At the real-policy-equivalent ~28 rules: **~2.7 ms**.
Even 100 rules, all evaluated against all 33 tiles, stays at 4.2 ms.
**Rule count is not a performance concern on 0.53.**

Contrast with 0.46, where the attribution probe measured one *evaluated*
conditioned rule at +2.1 ms across 33 resources (0.064 ms/eval) — ~100×
the 0.53 per-eval cost, the direct signature of the per-evaluation CEL
re-planning that 0.51.0 fixed. Extrapolated, ~28 worst-case rules on
0.46 would have been tens of ms per request; 100 rules well over
100 ms. The toy-scale caveat was a real risk on the shipped version and
is neutralised by the upgrade.

Two honesty notes:
- The synthetic conditions are a single `==` that short-circuits, the
  cheapest possible rule. Real rules (list membership, `startsWith`,
  two clauses) cost more per evaluation, so 0.022 ms/rule is a **lower
  bound** on per-rule cost. Even at a generous 3× it is ~0.07 ms/rule —
  still negligible at any realistic count. (This is also why synthetic
  N=5 here, 2.14 ms, is below the real 5-rule policy's 4.4 ms.)
- Different day from the headline runs; read the slope, not the
  absolute floor, as the result. Raw data: labels `rulecount-*-v0.53`.

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
5. **The reverse experiment was measured, not speculated** (what-if
   section): Guardian answering the Cerbos-shaped question matches
   Cerbos's latency at ~6× less CPU per job. So even the per-tile
   evaluation style does not require Cerbos on performance grounds —
   what Cerbos buys is CEL expressiveness (e.g. `startsWith`,
   arbitrary expressions) versus Guardian's fixed builtin-condition
   vocabulary, plus the policy-authoring model around it.
6. **Points 1–5 describe Cerbos 0.46.0** — the version
   univention-guardian ships. On 0.53.0 (version-sensitivity section)
   the Cerbos job drops to 4.4 ms / ~850+ rps: latency-parity with the
   actor-only Guardian integration and ~2.5× faster than
   guardian-targets at the same per-tile question. The performance
   argument between the two engines largely dissolves on a current
   Cerbos; what remains is the integration-shape and expressiveness
   trade.

## Environment

| | |
|---|---|
| CPU | AMD Ryzen 7 PRO 5850U, 16 threads |
| Kernel | Linux 6.8.0-52-generic |
| Cerbos | `ghcr.io/cerbos/cerbos:0.46.0` (main runs; matches univention-guardian) and `0.53.0` (version-sensitivity re-run), production univention-guardian config (gRPC :3593, audit/telemetry off, `requestLimits.maxResourcesPerRequest: 50`) |
| Guardian authz-api | `artifacts.software-univention.de/nubus/images/guardian-authorization-api-authorization-api:3.0.9`, gunicorn + 1 uvicorn worker (image default), auth adapter `fast_api_always_authorized` |
| OPA | `openpolicyagent/opa:1.11.0-static` (same OPA version as the deployed guardian-…-opa:3.0.9 image), production bundles from the guardian-hackathon Management API, `--v0-compatible` |
| Data | 33 real portal entries, 3 real users (snapshots in `../benchmark/data/`), icons/photos stripped for both backends |
| Client | Python 3.11, httpx (Guardian) / cerbos gRPC SDK 0.15.1 (Cerbos), persistent connections, sequential |
| CPU caps | none |

`docker stats` CPU snapshots were collected manually during the
saturation sweep and during the sequential guardian-targets runs (see
those sections); not collected for the other sequential runs.
