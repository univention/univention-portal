# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
"""
Simulates the portal's tile-visibility filtering step against a real UDM
deployment and a local Cerbos. No portal involvement.

Pipeline per user:
  1. Fetch UDM user (full properties).
  2. Build a Cerbos principal (id=DN, roles=guardianRoles+inherited, attr=props).
  3. Fetch all portals/entry objects (full properties).
  4. Build Cerbos resources (one per entry; id=DN, kind=portal:entry, attr=props).
  5. POST a single CheckResources to Cerbos.
  6. Print the tiles where Cerbos returned ALLOW for action 'view'.

The point of the PoC is to validate the contract shape and that the policy
discriminates between users correctly; the portal's actual filter logic is
NOT replicated here.
"""

from __future__ import annotations

import os
import sys
from dataclasses import dataclass
from typing import Any

import httpx
from rich.console import Console
from rich.table import Table

# ----------------------------------------------------------------------
# Configuration
# ----------------------------------------------------------------------

UDM_BASE = os.environ.get(
    "UDM_BASE",
    "https://portal.guardian-hackathon.univention.dev/univention/udm",
)
UDM_USER = os.environ.get("UDM_USER", "Administrator")
UDM_PASSWORD = os.environ.get(
    "UDM_PASSWORD",
    "b30665941288528735bf8aa04655188c1328509b",
)
CERBOS_BASE = os.environ.get("CERBOS_BASE", "http://localhost:3592")

TEST_USERS = ["Administrator", "student1", "teacher1"]

console = Console()


# ----------------------------------------------------------------------
# UDM
# ----------------------------------------------------------------------


@dataclass
class UDMObject:
    dn: str
    properties: dict[str, Any]


def udm_fetch_user(client: httpx.Client, username: str) -> UDMObject | None:
    r = client.get(
        f"{UDM_BASE}/users/user/",
        params={"query[username]": username},
        headers={"Accept": "application/json"},
    )
    r.raise_for_status()
    objs = r.json().get("_embedded", {}).get("udm:object", [])
    if not objs:
        return None
    o = objs[0]
    return UDMObject(dn=o["dn"], properties=o.get("properties", {}))


def udm_fetch_portal_entries(client: httpx.Client) -> list[UDMObject]:
    r = client.get(
        f"{UDM_BASE}/portals/entry/",
        params={"query[name]": "*", "limit": 500},
        headers={"Accept": "application/json"},
    )
    r.raise_for_status()
    return [
        UDMObject(dn=o["dn"], properties=o.get("properties", {}))
        for o in r.json().get("_embedded", {}).get("udm:object", [])
    ]


# ----------------------------------------------------------------------
# Cerbos data shaping
# ----------------------------------------------------------------------


def _sanitize_for_cerbos(value: Any) -> Any:
    """
    Cerbos attr is map<string, google.protobuf.Value>. Drop None values
    so CEL `has()` returns false for missing fields, and recursively clean
    nested dicts/lists.
    """
    if isinstance(value, dict):
        return {k: _sanitize_for_cerbos(v) for k, v in value.items() if v is not None}
    if isinstance(value, list):
        return [_sanitize_for_cerbos(v) for v in value if v is not None]
    return value


def build_principal(user: UDMObject) -> dict[str, Any]:
    props = user.properties
    roles = list(props.get("guardianRoles") or []) + list(
        props.get("guardianInheritedRoles") or []
    )
    if not roles:
        # Cerbos requires at least one role on the principal.
        roles = ["anonymous"]
    return {
        "id": user.dn,
        "roles": roles,
        "attr": _sanitize_for_cerbos(props),
    }


def build_resource(entry: UDMObject) -> dict[str, Any]:
    return {
        "actions": ["view"],
        "resource": {
            "kind": "portal:entry",
            "id": entry.dn,
            "attr": _sanitize_for_cerbos(entry.properties),
        },
    }


# ----------------------------------------------------------------------
# Cerbos
# ----------------------------------------------------------------------


def cerbos_check(
    client: httpx.Client,
    principal: dict[str, Any],
    resources: list[dict[str, Any]],
) -> dict[str, bool]:
    """Returns {entry_dn: True/False} for action 'view'."""
    body = {
        "requestId": "poc",
        "principal": principal,
        "resources": resources,
    }
    r = client.post(f"{CERBOS_BASE}/api/check/resources", json=body, timeout=10.0)
    r.raise_for_status()
    out: dict[str, bool] = {}
    for entry in r.json().get("results", []):
        dn = entry["resource"]["id"]
        out[dn] = entry["actions"].get("view") == "EFFECT_ALLOW"
    return out


# ----------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------


def main() -> int:
    auth = httpx.BasicAuth(UDM_USER, UDM_PASSWORD)
    udm = httpx.Client(auth=auth, verify=True, timeout=30.0)
    cerbos = httpx.Client(timeout=10.0)

    console.print(f"[dim]UDM:[/dim] {UDM_BASE}")
    console.print(f"[dim]Cerbos:[/dim] {CERBOS_BASE}")

    console.print("\n[bold]Fetching portal entries...[/bold]")
    entries = udm_fetch_portal_entries(udm)
    console.print(f"  {len(entries)} entries.")

    console.print("\n[bold]Fetching users...[/bold]")
    users: dict[str, UDMObject] = {}
    for uname in TEST_USERS:
        u = udm_fetch_user(udm, uname)
        if u is None:
            console.print(f"  [red]{uname}: not found[/red]")
            continue
        users[uname] = u
        console.print(
            f"  {uname}: isOxUser={u.properties.get('isOxUser')!r:5s} "
            f"nextcloudEnabled={u.properties.get('nextcloudEnabled')!r:5s} "
            f"roles={(u.properties.get('guardianRoles') or []) + (u.properties.get('guardianInheritedRoles') or [])!r}"
        )

    resources = [build_resource(e) for e in entries]

    visibility: dict[str, dict[str, bool]] = {}
    for uname, user in users.items():
        principal = build_principal(user)
        try:
            visibility[uname] = cerbos_check(cerbos, principal, resources)
        except httpx.HTTPError as exc:
            console.print(f"[red]Cerbos request failed for {uname}: {exc}[/red]")
            return 1

    # Print per-user visible tile list
    console.print("\n[bold]Visible tiles per user[/bold]")
    for uname in users:
        v = visibility[uname]
        visible = sorted(
            e.properties.get("name", e.dn) for e in entries if v.get(e.dn, False)
        )
        console.print(
            f"\n  [bold cyan]{uname}[/bold cyan] sees {len(visible)} tiles:"
        )
        for name in visible:
            console.print(f"    - {name}")

    # Print a matrix for tiles that have a gate
    gated = [e for e in entries if e.properties.get("guardianPermissionView")]
    table = Table(title="Gated tiles - decision matrix", show_lines=False)
    table.add_column("tile")
    table.add_column("guardianPermissionView")
    for uname in users:
        table.add_column(uname, justify="center")
    for e in sorted(gated, key=lambda e: e.properties.get("name", "")):
        name = e.properties.get("name", "?")
        gpv = e.properties.get("guardianPermissionView", "")
        row = [name, gpv]
        for uname in users:
            ok = visibility[uname].get(e.dn, False)
            row.append("[green]ALLOW[/green]" if ok else "[red]DENY[/red]")
        table.add_row(*row)
    console.print("\n")
    console.print(table)

    return 0


if __name__ == "__main__":
    sys.exit(main())
