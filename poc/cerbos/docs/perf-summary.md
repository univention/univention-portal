<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# Cerbos vs OPA-Guardian: portal authorization results

One-page summary for the team review.
Full methodology, raw runs and attribution experiments: `perf-results.md`.

The benchmarked job: which tiles a user may see on one portal page.
Each backend is measured exactly as it would be integrated.

## TLDR

- Latency is low across the board (4 to 12 ms), but it sits in the critical path,
  on top of the 30 to 50 ms UDM user fetch. The differences between options are real.
- At equal work (evaluate every tile with its full attributes in one request),
  OPA-Guardian costs ~11 to 12 ms, Cerbos 4.4 ms. Cerbos is about 2.5x to 3x faster at the same job.
- Today's Guardian integration is fast (3.7 ms) only because it does less:
  a constant actor-only query plus portal-side string matching.
  No per-tile rules, no CEL, far less expressive.
- Core: Cerbos (0.53, the version Nubus ships) is faster at equal work,
  and unlocks a substantially cleaner, more powerful per-tile authorization integration.

The integration model is the real reason to choose it, not the milliseconds:
per-tile rules live in one CEL policy,
instead of being split between Guardian permission-strings and portal-side matching.
(Architectural judgement, not a benchmark number.)

## What's under test

- **OPA-Guardian, actor-only**: today's portal integration.
  One actor-only request; the portal matches returned permission strings to each tile.
  Constant cost in tile count, least expressive.
- **OPA-Guardian, targets**: what-if. Send all tiles as full objects, OPA gates each.
  The Cerbos integration pattern, implemented on Guardian.
- **Cerbos 0.46**: older version, before the 0.51 performance fix.
  Shown for contrast only. Not deployed.
- **Cerbos 0.53**: per-tile evaluation in the PDP. Current upstream, the version Nubus ships.

## Results

3 real users, 33 real tiles. p50/p99 are sequential latency.
`max req/s` is peak throughput under concurrent load.

| flavor | request shape / work done | p50 | p99 | saturation req/s |
|---|---|---|---|---|
| OPA-Guardian, actor-only | actor only; portal-side string match | **3.7 ms** | 6.7 | ~377¹ |
| OPA-Guardian, targets | actor **+ all 33 tiles**; OPA gates each | **11.3 ms** | 22.3 | not tested |
| Cerbos 0.46 (old image) | actor **+ all 33 tiles**; PDP gates each | **12.1 ms** | 25.2 | ~80 |
| **Cerbos 0.53 (shipped)** | actor **+ all 33 tiles**; PDP gates each | **4.4 ms** | 7.2 | **~1,300** |

## CPU

Doing the per-tile job, Cerbos 0.53 uses ~7.5 ms of CPU per request.
OPA-Guardian needs ~20 ms for the same work (~2.6x more); the old 0.46 needed ~120 ms.

## Caveats & open questions

**Tile count.** Tested at 33, production caps at 50 per request.
Cerbos grows gently per tile, actor-only Guardian is flat. Non-issue at portal scale.

**Rule count.** The 4.4 ms is the 5-rule PoC policy.
A realistic policy is ~28 rules, adding about 0.02 ms per rule (~0.6 ms, so ~5 ms total).
Slightly slower, immaterial.

**Other.**
- These are PDP-only numbers. The 30 to 50 ms UDM user fetch is PDP-independent and excluded.
- Auth disabled on Guardian (no JWT validation per request), which flatters Guardian slightly.
