# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
"""
Build bundles/CerbosStyleDataBundle.tar.gz: an OPA data bundle whose
roleCapabilityMapping replicates the five Cerbos rules from
../policies/portal_entry.yaml as target-aware Guardian capabilities.

Used by the `guardian-targets` benchmark scenario, where the portal-side
tile discrimination moves into OPA: the request carries all tiles as
targets and each target's permission set either contains
univention-portal:portal:view or not.

Differences from the Cerbos policy, by necessity:
  - Cerbos `roles: ["*"]` has no Guardian equivalent; capabilities hang
    under the role whose membership the Cerbos rule conditions on
    (authenticated-user, teacher) — identical outcomes for the
    snapshot users.
  - `R.attr.name.startsWith("tile")` has no builtin condition; the nine
    tileNN names from data/entries.json are enumerated as an OR.

Run once (output is committed): uv run make_targets_bundle.py
"""

import io
import json
import pathlib
import tarfile


HERE = pathlib.Path(__file__).parent
OUT = HERE / "bundles" / "CerbosStyleDataBundle.tar.gz"

TEACHER_TILES = ["moodle", "itslearning", "sofatutor", "veyon", "teacher-documentation"]


def tile_names() -> list[str]:
    entries = json.loads((HERE / "data" / "entries.json").read_text())
    return sorted(
        e["properties"]["name"]
        for e in entries
        if e["properties"].get("name", "").startswith("tile")
    )


def target_name_is(name: str) -> dict:
    return {
        "name": "guardian:builtin:target_field_equals_value",
        "parameters": {"field": "name", "value": name},
    }


def actor_flag(field: str) -> dict:
    return {
        "name": "guardian:builtin:actor_field_equals_value",
        "parameters": {"field": field, "value": True},
    }


def capability(conditions: list[dict], relation: str) -> dict:
    return {
        "appName": "univention-portal",
        "namespace": "portal",
        "permissions": ["view"],
        "relation": relation,
        "conditions": conditions,
    }


def mapping() -> dict:
    return {
        "univention-portal:portal:authenticated-user": [
            # ox_mail iff isOxUser
            capability([target_name_is("ox_mail"), actor_flag("isOxUser")], "AND"),
            # nextcloud iff nextcloudEnabled
            capability(
                [target_name_is("nextcloud"), actor_flag("nextcloudEnabled")], "AND",
            ),
            # demo tileNN tiles for any authenticated user
            capability([target_name_is(n) for n in tile_names()], "OR"),
        ],
        "univention-portal:portal:teacher": [
            capability([target_name_is(n) for n in TEACHER_TILES], "OR"),
        ],
        # super-admins see everything (empty AND == true)
        "guardian:builtin:super-admin": [capability([], "AND")],
    }


def main():
    data = {"guardian": {"mapping": {"roleCapabilityMapping": mapping()}}}
    # Same layout/manifest shape as the production GuardianDataBundle.
    manifest = {"revision": "", "roots": ["guardian/mapping"], "rego_version": 0}

    def member(name: str, payload: bytes) -> tuple[tarfile.TarInfo, io.BytesIO]:
        info = tarfile.TarInfo(name)  # mtime/uid/gid 0: reproducible output
        info.size = len(payload)
        return info, io.BytesIO(payload)

    with tarfile.open(OUT, "w:gz") as tar:
        for name, obj in (("/data.json", data), ("/.manifest", manifest)):
            tar.addfile(*member(name, json.dumps(obj).encode()))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes, {len(tile_names())} tileNN tiles)")


if __name__ == "__main__":
    main()
