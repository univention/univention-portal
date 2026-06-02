<!--
SPDX-License-Identifier: AGPL-3.0-only
SPDX-FileCopyrightText: 2026 Univention GmbH
-->

# Option: user-attribute name lives on the tile, not in the policy

## What the current PoC does (for contrast)

The current `policies/portal_entry.yaml` hard-codes the user-attribute
name (`isOxUser`, `nextcloudEnabled`) inside each rule:

```yaml
- actions: [view]
  effect: EFFECT_ALLOW
  roles: ["*"]
  condition:
    match:
      expr: R.attr.name == "ox_mail" && P.attr.isOxUser == true

- actions: [view]
  effect: EFFECT_ALLOW
  roles: ["*"]
  condition:
    match:
      expr: R.attr.name == "nextcloud" && P.attr.nextcloudEnabled == true
```

Adding a new app-gated tile (e.g. "Moodle requires `moodleEnabled`")
needs a new policy rule. The Cerbos policy file is touched every time.

## The data-driven alternative

Move the user-attribute name **onto the tile** as a new field. The
policy becomes generic — one rule that reads the name from the tile and
looks up the matching value on the user.

### Tile-side change

Add a new optional field on `portal/entry`, e.g.:

```yaml
requiredUserAttribute: "nextcloudEnabled"
```

Set per tile by an administrator. Empty/unset for tiles that aren't
gated by Cerbos.

For the hackathon PoC you can avoid an actual UDM schema change by
reusing the existing `guardianPermissionView` string field and just
storing the attribute name inside it (e.g. set
`guardianPermissionView: "nextcloudEnabled"` on the Nextcloud tile).

### Policy-side change

The policy file collapses to a single generic rule for any tile that
carries the field:

```yaml
- actions: [view]
  effect: EFFECT_ALLOW
  roles: ["*"]
  condition:
    match:
      expr: |
        has(R.attr.requiredUserAttribute)
        && R.attr.requiredUserAttribute != ""
        && R.attr.requiredUserAttribute in P.attr
        && P.attr[R.attr.requiredUserAttribute] == true
```

Adding a tile for a new app: zero policy edits. The admin sets
`requiredUserAttribute: "<flag-name>"` on the tile.

### Why this works

CEL supports dynamic map indexing — `P.attr[<string-expression>]` — so a
tile carrying the *name* of an attribute can be evaluated by a generic
expression that doesn't know the name in advance. This is an official,
documented pattern, not a hack:

- Cerbos docs, *Conditions* page, list/map operations table:
  `P.attr.clients["acme"]["active"] == true` (dynamic key indexing on
  principal attrs) — `docs/modules/policies/pages/conditions.adoc:379`
  in the local Cerbos checkout.
- CEL test fixture exercising the same shape on a dynamic, non-literal
  key: `internal/test/testdata/cel_eval/maps_and_lists.yaml:45,60`
  (`P.attr["1-2-3"]`).
- Upstream CEL specification — language intro:
  <https://github.com/google/cel-spec/blob/master/doc/intro.md>, linked
  from the same Cerbos page.

## Tradeoffs

### Pros

- **No policy edit per new tile or new app.** All churn happens in UDM,
  not in YAML deployed to Cerbos.
- **Admins self-serve** through the existing portal tile UI.
- **Tile is the single source of truth** for "what makes me visible."
  No registry to keep in sync.

### Cons

- **Boolean-only.** The single generic rule above tests
  `P.attr[name] == true`. It cannot express:
  - compound conditions (attribute X **and** role Y),
  - non-boolean comparisons (license tier is "premium", country is
    "DE"),
  - time windows, look-ups, or anything multi-step.
- The mental model is "the tile stores a flag name; the user has that
  flag" — which closely mirrors what today's Guardian implementation
  does in spirit. The change is moving the lookup from a flat
  permission list into Cerbos's CEL.

### Extension: small comparator DSL on the tile

If boolean isn't enough, the tile can grow two more fields:

```yaml
requiredAttribute: licenseTier
requiredOperator: in            # one of: equals, in, gte, exists
requiredValue: ["pro", "enterprise"]
```

The policy dispatches on `requiredOperator`. Covers ~80% of real-world
gates (boolean, equality, set membership, range checks). Stops short of
compound conditions and look-ups.

The price is that you've designed a small DSL on the tile schema. For
anything beyond that — keep a per-tile or per-app rule in the policy
(the current PoC pattern).

## When to pick this

Pick **this option** if:

- The gate for every Cerbos-managed tile is "is this boolean flag on the
  user true?".
- The flags are provisioned reliably into LDAP/UDM by an upstream
  system, and you trust that as the source of truth.
- You want zero policy churn during app onboarding.

Pick the **current PoC pattern** (per-tile rules in the policy file) if:

- App access gates need more than a boolean (roles, time, compound).
- You want Cerbos to be the authoritative answer to "can this user
  access app X?", with the *rule* — not just a flag — owned by the
  policy.

The two approaches can also coexist on the same `portal:entry`
resource: tiles with `requiredUserAttribute` use the generic rule;
tiles without it but matching a per-name rule use the specific rule.

## Concretely, what changes in this repo to try it

1. On the test deployment, set `guardianPermissionView: "isOxUser"` on
   the `ox_mail` tile and `guardianPermissionView: "nextcloudEnabled"`
   on the `nextcloud` tile (any UDM admin tool).
2. Replace `policies/portal_entry.yaml`'s per-app rules with the single
   generic rule shown above, reading from `R.attr.guardianPermissionView`
   in place of `R.attr.requiredUserAttribute`.
3. Re-run `uv run poc.py`. The Nextcloud / OX gates behave the same as
   before; the policy file is now ~10 lines shorter and never needs to
   change to onboard another app whose access is gated by a single
   boolean LDAP flag.
