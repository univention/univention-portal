#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import importlib
import logging
from imghdr import what
from urllib.parse import quote

from univention.portal.extensions.reloader_content_base import PortalContentFetcherBase


logger = logging.getLogger(__name__)


class PortalContentFetcherUDM(PortalContentFetcherBase):

    def __init__(self, portal_dn, assets_base_url=None):
        self._portal_dn = portal_dn
        self._assets_base_url = self._validate_assets_base_url(assets_base_url)
        self.assets = []

    def _fetch(self):
        udm_lib = importlib.import_module("univention.udm")
        try:
            udm = self._create_udm_client()
            portal_data = udm.get("portals/portal").get(self._portal_dn)
        except udm_lib.ConnectionError:
            logger.warning("Could not establish UDM connection. Is the LDAP server accessible?")
            return None
        except udm_lib.UnknownModuleType:
            logger.warning("UDM not up to date? Portal module not found.")
            return None
        except udm_lib.NoObject:
            logger.warning("Portal %s not found", self._portal_dn)
            return None

        portal = self._extract_portal(portal_data)
        categories = self._extract_categories(udm, portal_data.props.categories)
        portal_categories = [category for dn, category in categories.items() if category["in_portal"]]
        announcements = self._extract_announcements(udm)

        corner_links = portal_data.props.cornerLinks
        menu_links = portal_data.props.menuLinks
        quick_links = portal_data.props.quickLinks
        user_links = portal_data.props.userLinks

        entry_references = set()
        entry_references.update(
            corner_links,
            menu_links,
            quick_links,
            user_links,
            [entry_dn for category in portal_categories for entry_dn in category["entries"]],
        )

        folders = self._extract_folders(udm, entry_references)
        portal_folders = [folder for dn, folder in folders.items() if folder["in_portal"]]

        entry_references.update(
            [entry_dn for folder in portal_folders for entry_dn in folder["entries"]],
        )
        entries = self._extract_entries(udm, entry_references)

        return {
            "portal": portal,
            "categories": categories,
            "folders": folders,
            "entries": entries,
            "corner_links": corner_links,
            "menu_links": menu_links,
            "quick_links": quick_links,
            "user_links": user_links,
            "announcements": announcements,
        }

    def _create_udm_client(self):
        udm_lib = importlib.import_module("univention.udm")
        return udm_lib.UDM.machine(prefer_local_connection=True).version(3)

    def _extract_portal(self, portal_data):
        portal = {
            "dn": portal_data.dn,
            "showUmc": portal_data.props.showUmc,
            "logo": portal_data.props.logo,
            "background": portal_data.props.background,
            "name": portal_data.props.displayName,
            "defaultLinkTarget": portal_data.props.defaultLinkTarget,
            "ensureLogin": portal_data.props.ensureLogin,
            "categories": portal_data.props.categories,
        }

        portal_name = portal_data.props.name

        if portal["logo"]:
            portal["logo"] = self._collect_asset(portal_data.props.logo.raw, portal_name, "logos")

        if portal["background"]:
            portal["background"] = self._collect_asset(portal_data.props.background.raw, portal_name, "backgrounds")
        return portal

    @classmethod
    def _extract_categories(cls, udm, portal_categories):
        categories = {}

        for category in udm.get("portals/category").search():
            categories[category.dn] = {
                "dn": category.dn,
                "in_portal": category.dn in portal_categories,
                "display_name": category.props.displayName,
                "entries": category.props.entries,
            }

        return categories

    @classmethod
    def _extract_folders(cls, udm, entry_dns):
        folders = {}

        for folder in udm.get("portals/folder").search():
            in_portal = folder.dn in entry_dns

            folders[folder.dn] = {
                "dn": folder.dn,
                "in_portal": in_portal,
                "name": folder.props.displayName,
                "entries": folder.props.entries,
            }

        return folders

    def _extract_entries(self, udm, entry_dns):
        entries = {}

        for entry in udm.get("portals/entry").search():
            if entry.dn in entries:
                continue
            in_portal = entry.dn in entry_dns
            icon_url = None
            if entry.props.icon:
                icon_url = self._collect_asset(entry.props.icon.raw, entry.props.name, "entries")

            entries[entry.dn] = {
                "dn": entry.dn,
                "in_portal": in_portal,
                "name": entry.props.displayName,
                "description": entry.props.description,
                'keywords': entry.props.keywords,
                "icon_url": icon_url,
                "activated": entry.props.activated,
                "anonymous": entry.props.anonymous,
                "allowedGroups": entry.props.allowedGroups,
                "links": entry.props.link,
                "linkTarget": entry.props.linkTarget,
                "target": entry.props.target,
                "backgroundColor": entry.props.backgroundColor,
            }

        return entries

    @classmethod
    def _extract_announcements(cls, udm):
        udm_lib = importlib.import_module("univention.udm")
        announcements = {}

        try:
            announcement_module = udm.get("portals/announcement")
        except udm_lib.UnknownModuleType:
            announcement_module = None
        if not announcement_module:
            logger.warning("UDM not up to date? Announcement module not found.")
            return announcements

        for announcement in announcement_module.search():
            announcements[announcement.dn] = {
                "dn": announcement.dn,
                "allowedGroups": announcement.props.allowedGroups,
                "name": announcement.props.name,
                "message": announcement.props.message,
                "title": announcement.props.title,
                "visibleFrom": str(announcement.props.visibleFrom),
                "visibleUntil": str(announcement.props.visibleUntil),
                "isSticky": announcement.props.isSticky,
                "needsConfirmation": announcement.props.needsConfirmation,
                "severity": announcement.props.severity,
            }

        return announcements

    def _collect_asset(self, content, name, dirname):
        name = name.replace(
            "/", "-",
        )  # name must not contain / and must be a path which can be accessed via the web!
        extension = what(None, content) or "svg"
        path = f"./icons/{quote(dirname)}/{quote(name)}.{quote(extension)}"
        self.assets.append((path, content))
        return path
