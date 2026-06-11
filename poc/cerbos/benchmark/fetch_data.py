# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
"""
Fetch the benchmark payload snapshots from UDM once, so bench.py runs
offline and reproducibly.

Writes:
  data/entries.json  - all portal entries [{dn, properties}, ...]
  data/users.json    - {username: {dn, properties}} for the test users

Binary-ish payload fields (base64 icons, photos, certificates) are
stripped here, for BOTH backends — the production integration should
never ship those to a PDP (see docs/sample-request.md: 95 KB -> ~5 KB).
"""

import json
import os
import pathlib
import sys

import httpx


UDM_BASE = os.environ.get(
    "UDM_BASE",
    "https://portal.guardian-hackathon.univention.dev/univention/udm",
)
UDM_USER = os.environ.get("UDM_USER", "Administrator")
UDM_PASSWORD = os.environ.get(
    "UDM_PASSWORD",
    "b30665941288528735bf8aa04655188c1328509b",
)

TEST_USERS = ["Administrator", "student1", "teacher1"]

# Stripped from entry/user properties before snapshotting.
BINARY_FIELDS = {"icon", "jpegPhoto", "userCertificate", "pictureUri"}

DATA_DIR = pathlib.Path(__file__).parent / "data"


def strip_binary(properties: dict) -> dict:
    return {k: v for k, v in properties.items() if k not in BINARY_FIELDS}


def main() -> int:
    client = httpx.Client(
        auth=httpx.BasicAuth(UDM_USER, UDM_PASSWORD),
        headers={"Accept": "application/json"},
        timeout=30.0,
    )

    r = client.get(f"{UDM_BASE}/portals/entry/", params={"query[name]": "*", "limit": 500})
    r.raise_for_status()
    entries = [
        {"dn": o["dn"], "properties": strip_binary(o.get("properties", {}))}
        for o in r.json().get("_embedded", {}).get("udm:object", [])
    ]
    print(f"entries: {len(entries)}")

    users = {}
    for uname in TEST_USERS:
        r = client.get(f"{UDM_BASE}/users/user/", params={"query[username]": uname})
        r.raise_for_status()
        objs = r.json().get("_embedded", {}).get("udm:object", [])
        if not objs:
            print(f"user {uname}: NOT FOUND", file=sys.stderr)
            return 1
        o = objs[0]
        users[uname] = {"dn": o["dn"], "properties": strip_binary(o.get("properties", {}))}
        roles = (o["properties"].get("guardianRoles") or []) + (
            o["properties"].get("guardianInheritedRoles") or []
        )
        print(f"user {uname}: roles={roles}")

    DATA_DIR.mkdir(exist_ok=True)
    (DATA_DIR / "entries.json").write_text(json.dumps(entries, indent=1))
    (DATA_DIR / "users.json").write_text(json.dumps(users, indent=1))
    print(f"wrote {DATA_DIR}/entries.json and {DATA_DIR}/users.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
