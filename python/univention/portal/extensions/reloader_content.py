#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2024 Univention GmbH
#
# https://www.univention.de/
#
# All rights reserved.
#
# The source code of this program is made available
# under the terms of the GNU Affero General Public License version 3
# (GNU AGPL V3) as published by the Free Software Foundation.
#
# Binary versions of this program provided by Univention to you as
# well as other copyrighted, protected or trademarked materials like
# Logos, graphics, fonts, specific documentations and configurations,
# cryptographic keys etc. are subject to a license agreement between
# you and Univention and not subject to the GNU AGPL V3.
#
# In the case you use this program under the terms of the GNU AGPL V3,
# the program is provided in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public
# License with the Debian GNU/Linux or Univention distribution in file
# /usr/share/common-licenses/AGPL-3; if not, see
# <https://www.gnu.org/licenses/>.
#

import json
from binascii import a2b_base64
from imghdr import what
from pathlib import Path
from urllib.parse import quote, urljoin

import univention.admin.rest.client as udm_client
from univention.portal import config
from univention.portal.log import get_logger
from univention.portal.util import log_url_safe


logger = get_logger(__name__)


class PortalContentFetcherUDMREST:

    def __init__(self, portal_dn, assets_base_url=None):
        self._portal_dn = portal_dn
        if assets_base_url and not assets_base_url.endswith("/"):
            assets_base_url += "/"
        self._assets_base_url = assets_base_url
        self.assets = []

    def fetch(self):
        result = self._fetch()
        return json.dumps(result, sort_keys=True, indent=4)

    def _fetch(self):
        udm = self._create_udm_client()
        try:
            portal_module = udm.get("portals/portal")
            if not portal_module:
                get_logger("cache").warning("UDM not up to date? Portal module not found.")
                return None

            portal_data = portal_module.get(self._portal_dn)

        except udm_client.ConnectionError:
            get_logger("cache").exception("Could not establish UDM connection. Is the LDAP server accessible?")
            raise

        except udm_client.NotFound:
            get_logger("cache").warning("Portal %s not found", self._portal_dn)
            return None

        portal = self._extract_portal(portal_data)
        categories = self._extract_categories(udm, portal_data.properties["categories"])
        portal_categories = [category for dn, category in categories.items() if category["in_portal"]]
        announcements = self._extract_announcements(udm)

        corner_links = portal_data.properties["cornerLinks"]
        menu_links = portal_data.properties["menuLinks"]
        quick_links = portal_data.properties["quickLinks"]
        user_links = portal_data.properties["userLinks"]

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

        result = {
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
        return result

    def _create_udm_client(self):
        logger.debug("Connecting to UDM at URL: %s", log_url_safe(config.fetch("udm_api_url")))
        udm = udm_client.UDM.http(
            config.fetch('udm_api_url'),
            config.fetch('udm_api_username'),
            Path(config.fetch("udm_api_password_file")).read_text().strip(),
        )
        return udm

    def _extract_portal(self, portal_data):
        portal = {
            "dn": portal_data.dn,
            "showUmc": portal_data.properties["showUmc"],
            "logo": portal_data.properties["logo"],
            "background": portal_data.properties["background"],
            "name": portal_data.properties["displayName"],
            "defaultLinkTarget": portal_data.properties["defaultLinkTarget"],
            "ensureLogin": portal_data.properties["ensureLogin"],
            "categories": portal_data.properties["categories"],
        }

        portal_name = portal_data.properties["name"]

        if portal["logo"]:
            portal["logo"] = self._collect_asset(portal["logo"], portal_name, dirname="logos")

        if portal["background"]:
            portal["background"] = self._collect_asset(
                portal["background"], portal_name, dirname="backgrounds")

        return portal

    @classmethod
    def _extract_categories(cls, udm, portal_categories):
        categories = {}

        for category in udm.get("portals/category").search(opened=True):
            categories[category.dn] = {
                "dn": category.dn,
                "in_portal": category.dn in portal_categories,
                "display_name": category.properties["displayName"],
                "entries": category.properties["entries"],
            }

        return categories

    @classmethod
    def _extract_folders(cls, udm, entry_dns):
        folders = {}

        for folder in udm.get("portals/folder").search(opened=True):
            in_portal = folder.dn in entry_dns

            folders[folder.dn] = {
                "dn": folder.dn,
                "in_portal": in_portal,
                "name": folder.properties["displayName"],
                "entries": folder.properties["entries"],
            }

        return folders

    def _extract_entries(self, udm, entry_dns):
        entries = {}

        for entry in udm.get("portals/entry").search(opened=True):
            if entry.dn in entries:
                continue
            in_portal = entry.dn in entry_dns
            icon_url = None
            if entry.properties["icon"]:
                icon_url = self._collect_asset(entry.properties["icon"], entry.properties["name"], dirname="entries")

            entries[entry.dn] = {
                "dn": entry.dn,
                "in_portal": in_portal,
                "name": entry.properties["displayName"],
                "description": entry.properties["description"],
                "keywords": entry.properties["keywords"],
                "icon_url": icon_url,
                "activated": entry.properties["activated"],
                "anonymous": entry.properties["anonymous"],
                "allowedGroups": entry.properties["allowedGroups"],
                "links": [{'locale': _[0], 'value': _[1]} for _ in entry.properties["link"]],
                "linkTarget": entry.properties["linkTarget"],
                "target": entry.properties["target"],
                "backgroundColor": entry.properties["backgroundColor"],
            }

        return entries

    @classmethod
    def _extract_announcements(cls, udm):
        ret = {}

        announcement_module = udm.get("portals/announcement")
        if not announcement_module:
            get_logger("cache").warning("UDM not up to date? Announcement module not found.")
            return ret

        for announcement in udm.get("portals/announcement").search(opened=True):
            ret[announcement.dn] = {
                "dn": announcement.dn,
                "allowedGroups": announcement.properties["allowedGroups"],
                "name": announcement.properties["name"],
                "message": announcement.properties["message"],
                "title": announcement.properties["title"],
                "visibleFrom": announcement.properties["visibleFrom"],
                "visibleUntil": announcement.properties["visibleUntil"],
                "isSticky": announcement.properties["isSticky"],
                "needsConfirmation": announcement.properties["needsConfirmation"],
                "severity": announcement.properties["severity"],
            }

        return ret

    def _collect_asset(self, content, name, dirname):
        name = name.replace(
            "/", "-",
        )  # name must not contain / and must be a path which can be accessed via the web!
        binary_content = a2b_base64(content)
        extension = what(None, binary_content) or "svg"
        path = f"./icons/{dirname}/{name}.{extension}"
        self.assets.append((path, binary_content))
        asset_url = self._asset_url(path)
        return asset_url

    def _asset_url(self, path):
        url = urljoin(self._assets_base_url, quote(path))
        return url


class GroupsContentFetcher:

    assets = ()

    def fetch(self):
        users = self._get_users_from_ldap()
        content = json.dumps(users, sort_keys=True, indent=4)
        return content

    def _get_users_from_ldap(self):
        from univention.ldap_cache.frontend import users_groups

        users = users_groups()
        return users
