# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH
"""
Simulates portal tile visibility under the OR-union integration model:

    visible = legacy_portal_allowed  &  cerbos_allowed

per user. Each system is queried independently; a tile is shown if either
system approves. Cerbos can only add allows, never restrict.

Pipeline per user:
  1. Fetch UDM user (full properties).
  2. Compute the legacy portal's set: a simplified port of
     `Portal._filter_entry_dns` with Guardian disabled (the most common
     deployment state today). Tiles with `guardianPermissionView` set are
     hidden by the legacy path; group-based gating handles the rest.
  3. Build a Cerbos principal and resource list; POST one CheckResources.
     Cerbos returns ALLOW for tiles whose specific rule matches.
  4. Union the two sets and print both halves plus the union.
"""

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
# Legacy portal logic (simplified port of Portal._filter_entry_dns)
# ----------------------------------------------------------------------


def legacy_portal_filter(user: UDMObject, entries: list[UDMObject]) -> set[str]:
    """
    Mimics the portal's existing _filter_entry_dns with Guardian disabled:
    tiles carrying guardianPermissionView are hidden; the rest are gated
    by allowedGroups (empty -> visible to all logged-in users).
    """
    user_groups = set(user.properties.get("groups") or [])
    visible: set[str] = set()
    for e in entries:
        p = e.properties
        if not p.get("in_portal", True):
            continue
        if not p.get("activated", True):
            continue
        # anonymous-only tiles are hidden from logged-in users
        if p.get("anonymous"):
            continue
        # Guardian disabled: any tile with the field is hidden by legacy.
        if p.get("guardianPermissionView"):
            continue
        allowed_groups = p.get("allowedGroups") or []
        if allowed_groups and not (set(allowed_groups) & user_groups):
            continue
        visible.add(e.dn)
    return visible


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
        props.get("guardianInheritedRoles") or [],
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
            f"roles={(u.properties.get('guardianRoles') or []) + (u.properties.get('guardianInheritedRoles') or [])!r}",
        )

    resources = [build_resource(e) for e in entries]
    by_dn = {e.dn: e for e in entries}

    # Per-user: legacy set, cerbos set, union
    legacy_sets: dict[str, set[str]] = {}
    cerbos_sets: dict[str, set[str]] = {}
    for uname, user in users.items():
        legacy_sets[uname] = legacy_portal_filter(user, entries)
        principal = build_principal(user)
        try:
            decisions = cerbos_check(cerbos, principal, resources)
        except httpx.HTTPError as exc:
            console.print(f"[red]Cerbos request failed for {uname}: {exc}[/red]")
            return 1
        cerbos_sets[uname] = {dn for dn, ok in decisions.items() if ok}

    # Per-user summary
    console.print("\n[bold]Per-user visibility (legacy | cerbos | union)[/bold]")
    for uname in users:
        legacy = legacy_sets[uname]
        cerbos_set = cerbos_sets[uname]
        union = legacy | cerbos_set
        console.print(
            f"\n  [bold cyan]{uname}[/bold cyan]: "
            f"legacy={len(legacy)}  cerbos={len(cerbos_set)}  "
            f"[bold]union={len(union)}[/bold]",
        )
        for dn in sorted(union, key=lambda d: by_dn[d].properties.get("name", "")):
            name = by_dn[dn].properties.get("name", "?")
            in_l = dn in legacy
            in_c = dn in cerbos_set
            src = (
                "[green]L+C[/green]" if in_l and in_c
                else "[blue]L  [/blue]" if in_l
                else "[magenta]  C[/magenta]"
            )
            console.print(f"    {src}  {name}")

    # Matrix view across users, restricted to tiles where at least one
    # decision is interesting (Cerbos or legacy says yes for some user, or
    # the tile has a guardianPermissionView marker worth highlighting).
    interesting = sorted(
        {
            dn
            for s in list(legacy_sets.values()) + list(cerbos_sets.values())
            for dn in s
        }
        | {e.dn for e in entries if e.properties.get("guardianPermissionView")},
        key=lambda d: by_dn[d].properties.get("name", ""),
    )
    table = Table(title="Decision matrix (L=legacy, C=cerbos)", show_lines=False)
    table.add_column("tile")
    for uname in users:
        table.add_column(uname, justify="center")
    for dn in interesting:
        name = by_dn[dn].properties.get("name", "?")
        row = [name]
        for uname in users:
            in_l = dn in legacy_sets[uname]
            in_c = dn in cerbos_sets[uname]
            cell = (
                "[green]L+C[/green]" if in_l and in_c
                else "[blue]L[/blue]" if in_l
                else "[magenta]C[/magenta]" if in_c
                else "[dim]-[/dim]"
            )
            row.append(cell)
        table.add_row(*row)
    console.print("\n")
    console.print(table)

    return 0


if __name__ == "__main__":
    sys.exit(main())
