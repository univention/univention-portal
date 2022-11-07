import json
from pathlib import Path
from typing import Dict

from fastapi import (
    APIRouter,
    Depends,
)
from pydash import py_
from starlette.status import (
    HTTP_200_OK,
    # HTTP_404_NOT_FOUND,
)

router = APIRouter()


def _filter_entry_dns(self, entry_dns, entries, user, admin_mode):
    """
    get dn's of valid entries
    """
    filtered_dns = []
    for entry_dn in entry_dns:
        entry = entries.get(entry_dn)
        if entry is None:
            continue
        if not admin_mode:
            if not entry["in_portal"]:
                continue
            if not entry["activated"]:
                continue
            if entry["anonymous"] and not user.is_anonymous():
                continue
            if entry["allowedGroups"]:
                for group in entry["allowedGroups"]:
                    if user.is_member_of(group):
                        break
                else:
                    continue
        filtered_dns.append(entry_dn)
    return filtered_dns


def get_visible_content(self, user, admin_mode):
    entries = self.portal_cache.get_entries()
    folders = self.portal_cache.get_folders()
    categories = self.portal_cache.get_categories()
    visible_entry_dns = self._filter_entry_dns(
        entries.keys(), entries, user, admin_mode
    )
    visible_folder_dns = [
        folder_dn
        for folder_dn in folders.keys()
        if admin_mode
        or len(
            [
                entry_dn
                for entry_dn in self._get_all_entries_of_folder(
                    folder_dn, folders, entries
                )
                if entry_dn in visible_entry_dns
            ]
        )
        > 0
    ]
    visible_category_dns = [
        category_dn
        for category_dn in categories.keys()
        if admin_mode
        or len(
            [
                entry_dn
                for entry_dn in categories[category_dn]["entries"]
                if entry_dn in visible_entry_dns or entry_dn in visible_folder_dns
            ]
        )
        > 0
    ]
    return {
        "entry_dns": visible_entry_dns,
        "folder_dns": visible_folder_dns,
        "category_dns": visible_category_dns,
    }


@router.get(
    "/", response_model=Dict, status_code=HTTP_200_OK, tags=["Portal"],
)
async def portal():
    admin_mode = False
    user = {
        "username": "demo",
        "display_name": "Demo User",
        "groups": [],
        "headers": [],
    }

    with Path("./app/portal.json").open() as fd:
        data = json.load(fd)

    if admin_mode:
        entries = py_(data["entries"])

    entries = py_(data["entries"]).filter({"in_portal": True, "activated": True,})
    return {
        "entries": entries.value(),
    }
