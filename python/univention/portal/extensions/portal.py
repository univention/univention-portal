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

import os.path
import time
from urllib.parse import urljoin

import requests
import requests.exceptions

from univention.portal import Plugin, config
from univention.portal.log import get_logger
from univention.portal.util import is_current_time_between as is_announcement_visible_now


class Portal(metaclass=Plugin):
    """
    Base (and maybe only) class for a Portal.
    It is the only interface exposed to the portal tools, so you could
    replace it entirely. But these methods need to be implemented:

    `get_user`: Get the user for the current request
    `login_user`: New login for a user
    `login_request`: An anonymous user wants to login
    `get_visible_content`:
            The content that the frontend shall present.
            Should be filtered by the "user". Also gets "admin_mode", a
            boolean indicating whether the user requested all the content
            (and is authorized to do so)
    `get_user_links`:
            Get the user links in the portal, filtered by "user"
            and "admin_mode"
    `get_menu_links`:
            Get the menu links in the portal, filtered by "user"
            and "admin_mode"
    `get_entries`:
            Get all entries of "content", which in turn was the
            return value of `get_visible_content`
    `get_folders`:
            Get all folders of "content", which in turn was the
            return value of `get_visible_content`
    `get_categories`:
            Get all categories of "content", which in turn was the
            return value of `get_visible_content`
    `auth_mode`: Mode for auth based on given "request"
    `may_be_edited`: Whether a "user" may edit this portal
    `get_meta`:
            Get some information about the portal itself, given
            "content" and "categories". Those were return values of
            `get_visible_content` and `get_categories`.
    `refresh`:
            Refresh the portal data if needed ("reason" acts as a hint).
            Thereby allows the object to cache its content.
    `score`: If multiple portals are configured, use the one with the
            highest score for a given "request".

    scorer:
            Object that does the actual scoring. Meant to get a `Scorer` object
    portal_cache:
            Object that holds the cache. Meant to get a `Cache` object
    authenticator:
            Object that does the whole auth thing. Meant to the a `Authenticator` object
    """

    def __init__(self, scorer, portal_cache, authenticator):
        self.scorer = scorer
        self.portal_cache = portal_cache
        self.authenticator = authenticator

    def get_cache_id(self):
        return self.portal_cache.get_id()

    async def get_user(self, request):
        return await self.authenticator.get_user(request)

    async def login_user(self, request):
        return await self.authenticator.login_user(request)

    async def login_request(self, request):
        return await self.authenticator.login_request(request)

    async def logout_user(self, request):
        return await self.authenticator.logout_user(request)

    def get_visible_content(self, user, admin_mode):
        entries = self.portal_cache.get_entries()
        folders = self.portal_cache.get_folders()
        categories = self.portal_cache.get_categories()
        announcements = self.portal_cache.get_announcements()
        visible_entry_dns = self._filter_entry_dns(entries.keys(), entries, user, admin_mode)
        visible_folder_dns = [
            folder_dn
            for folder_dn in folders.keys()
            if admin_mode or len(
                [
                    entry_dn
                    for entry_dn in self._get_all_entries_of_folder(folder_dn, folders, entries)
                    if entry_dn in visible_entry_dns
                ],
            ) > 0
        ]
        visible_category_dns = [
            category_dn
            for category_dn in categories.keys()
            if admin_mode or len(
                [
                    entry_dn
                    for entry_dn in categories[category_dn]["entries"]
                    if entry_dn in visible_entry_dns or entry_dn in visible_folder_dns
                ],
            ) > 0
        ]
        visible_announcement_dns = [
            announcement_dn
            for announcement_dn, announcement in announcements.items()
            if self._announcement_visible(user, announcement)
        ]
        return {
            "entry_dns": visible_entry_dns,
            "folder_dns": visible_folder_dns,
            "category_dns": visible_category_dns,
            "announcement_dns": visible_announcement_dns,
        }

    def get_user_links(self, content):
        links = self.portal_cache.get_user_links()
        return [
            dn for dn in links if dn in content["entry_dns"] or dn in content["folder_dns"]
        ]

    def get_menu_links(self, content):
        links = self.portal_cache.get_menu_links()
        return [
            dn for dn in links if dn in content["entry_dns"] or dn in content["folder_dns"]
        ]

    def get_entries(self, content):
        entries = self.portal_cache.get_entries()
        return [self._map_entry(entries[entry_dn]) for entry_dn in content["entry_dns"]]

    def _map_entry(self, entry):
        # TODO: Pending refactoring to use "icon_url" consistently
        # See https://git.knut.univention.de/univention/components/univention-portal/-/issues/696
        entry["icon_url"] = entry.pop("logo_name")
        return entry

    def get_folders(self, content):
        folders = self.portal_cache.get_folders()
        folders = [folders[folder_dn] for folder_dn in content["folder_dns"]]
        for folder in folders:
            folder["entries"] = [
                entry_dn
                for entry_dn in folder["entries"]
                if entry_dn in content["entry_dns"] or entry_dn in content["folder_dns"]
            ]
        return folders

    def get_categories(self, content):
        categories = self.portal_cache.get_categories()
        categories = [categories[category_dn] for category_dn in content["category_dns"]]
        for category in categories:
            category["entries"] = [
                entry_dn
                for entry_dn in category["entries"]
                if entry_dn in content["entry_dns"] or entry_dn in content["folder_dns"]
            ]
        return categories

    def auth_mode(self, request):
        return self.authenticator.get_auth_mode(request)

    def may_be_edited(self, user):
        return config.fetch('editable') and user.is_admin()

    def get_meta(self, content, categories):
        portal = self.portal_cache.get_portal()
        portal["categories"] = [
            category_dn
            for category_dn in portal["categories"]
            if category_dn in content["category_dns"]
        ]
        portal["content"] = [
            [category_dn, next(category for category in categories if category["dn"] == category_dn)["entries"]]
            for category_dn in portal["categories"]
        ]
        return portal

    def _announcement_visible(self, user, announcement: dict) -> bool:
        return self._announcement_matches_time(announcement) and self._announcement_matches_group(user, announcement)

    def _announcement_matches_time(self, announcement: dict):
        return is_announcement_visible_now(
            announcement.get('visibleFrom'),
            announcement.get('visibleUntil'),
        )

    def _announcement_matches_group(self, user, announcement: dict):
        visible = False
        allowed_groups = announcement.get("allowedGroups")
        if not allowed_groups or allowed_groups == []:
            visible = True
        else:
            for group in allowed_groups:
                if user.is_member_of(group):
                    visible = True
        return visible

    def get_announcements(self, content):
        announcements = self.portal_cache.get_announcements()
        return [announcements[announcement_dn] for announcement_dn in content["announcement_dns"]]

    def _filter_entry_dns(self, entry_dns, entries, user, admin_mode):
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

	def _get_all_entries_of_folder(self, folder_dn, folders, entries):
		def _flatten(folder_dn, folders, entries, ret, already_unpacked_folder_dns):
			for entry_dn in folders[folder_dn]["entries"]:
				if entry_dn in entries:
					if entry_dn not in ret:
						ret.append(entry_dn)
				elif entry_dn in folders:
					if entry_dn not in already_unpacked_folder_dns:
						already_unpacked_folder_dns.append(entry_dn)
						_flatten(entry_dn, folders, entries, ret, already_unpacked_folder_dns)

        ret = []
        _flatten(folder_dn, folders, entries, ret, [])
        return ret

    def refresh(self, reason=None):
        touched = self.portal_cache.refresh(reason=reason)
        touched = self.authenticator.refresh(reason=reason) or touched
        return touched

    def _get_umc_portal(self):
        return UMCPortal(self.scorer, self.authenticator)

    def score(self, request):
        return self.scorer.score(request)


class UMCPortal(Portal):
    def __init__(self, scorer, authenticator):
        self.scorer = scorer
        self.authenticator = authenticator

    def auth_mode(self, request):
        return "ucs"

    def may_be_edited(self, user):
        return False

    def _request_umc_get(self, get_path, headers):
        umc_get_url = config.fetch("umc_get_url")
        if not umc_get_url.endswith("/"):
            umc_get_url = f"{umc_get_url}/"
        uri = urljoin(umc_get_url, get_path)
        body = {"options": {}}
        try:
            response = requests.post(uri, json=body, headers=headers)
        except requests.exceptions.RequestException as exc:
            get_logger("umc").warning("Exception while getting %s: %s", get_path, exc)
            return []
        else:
            if response.status_code != 200:
                get_logger("umc").debug("Status %r while getting %s", response.status_code, get_path)
                return []
            return response.json()[get_path]

    def get_visible_content(self, user, admin_mode):
        headers = user.headers
        categories = self._request_umc_get("categories", headers)
        modules = self._request_umc_get("modules", headers)
        return {
            "umc_categories": categories,
            "umc_modules": modules,
        }

    def get_user_links(self, content):
        return []

    def get_menu_links(self, content):
        return []

    def get_entries(self, content):
        entries = []
        colors = {cat["id"]: cat["color"] for cat in content["umc_categories"] if cat["id"] != "_favorites_"}
        umc_check_icons = config.fetch("umc_check_icons")
        if not umc_check_icons:
            get_logger("umc").debug("UMC icon check disabled")

        for module in content["umc_modules"]:
            if "apps" in module["categories"]:
                continue
            entries.append(self._module_to_entry(module, colors, umc_check_icons))
        return entries

    def _module_to_entry(self, module, colors, umc_check_icons, locale='en_US'):
        icon_url = self._module_icon_url(module, umc_check_icons)
        color = self._module_background_color(module, colors)

        entry = {
            "dn": self._entry_id(module),
            "name": {
                locale: module["name"],
            },
            "description": {
                locale: module["description"],
            },
            "keywords": {
                locale: ' '.join(module["keywords"]),
            },
            "linkTarget": "embedded",
            "target": None,
            "icon_url": icon_url,
            "backgroundColor": color,
            "links": [{
                "locale": locale,
                "value": "/univention/management/?header=try-hide&overview=false&menu=false#module={}:{}".format(module["id"], module.get("flavor", "")),
            }],
            # TODO: missing: in_portal, anonymous, activated, allowedGroups
        }
        return entry

    def _module_icon_url(self, module, umc_check_icons):
        path_prefix = "/univention/management/"
        sub_path = "js/dijit/themes/umc/icons/scalable/{}.svg".format(module["icon"])
        umc_frontend_path = '/usr/share/univention-management-console-frontend/'
        filename = os.path.join(umc_frontend_path, sub_path)

        if umc_check_icons and not os.path.exists(filename):
            icon_url = None
        else:
            icon_url = urljoin(path_prefix, sub_path)

        return icon_url

    def _module_background_color(self, module, colors):
        color = None
        for cat in module["categories"]:
            if cat in colors:
                color = colors[cat]
                break
        return color

    def _entry_id(self, module):
        return "umc:module:{}:{}".format(module["id"], module.get("flavor", ""))

    def get_folders(self, content):
        folders = []
        for category in content["umc_categories"]:
            if category["id"] == "apps":
                continue
            if category["id"] == "_favorites_":
                continue
            entries = [[-module["priority"], module["name"], self._entry_id(module)] for module in content["umc_modules"] if category["id"] in module["categories"]]
            entries = sorted(entries)
            folders.append({
                "name": {
                    "en_US": category["name"],
                    "de_DE": category["name"],
                },
                "dn": category["id"],
                "entries": [entry[2] for entry in entries],
            })
        return folders

    def get_categories(self, content):
        ret = []
        categories = content["umc_categories"]
        categories = sorted(categories, key=lambda entry: entry["priority"], reverse=True)
        modules = content["umc_modules"]
        modules = sorted(modules, key=lambda entry: entry["priority"], reverse=True)
        fav_cat = [cat for cat in categories if cat["id"] == "_favorites_"]
        if fav_cat:
            fav_cat = fav_cat[0]
            ret.append({
                "display_name": {
                    "en_US": fav_cat["name"],
                },
                "dn": "umc:category:favorites",
                "entries": [self._entry_id(mod) for mod in modules if "_favorites_" in mod.get("categories", [])],
            })
        else:
            ret.append({
                "display_name": {
                    "en_US": "Favorites",
                },
                "dn": "umc:category:favorites",
                "entries": [],
            })
        ret.append({
            "display_name": {
                "en_US": "Univention Management Console",
            },
            "dn": "umc:category:umc",
            "entries": [cat["id"] for cat in categories if cat["id"] not in ["_favorites_", "apps"]],
        })
        return ret

    def get_meta(self, content, categories):
        category_dns = ["umc:category:favorites", "umc:category:umc"]
        content = []
        for category_dn in category_dns:
            category = next(cat for cat in categories if cat["dn"] == category_dn)
            content.append([category_dn, category["entries"]])
        return {
            "name": {
                "en_US": "Univention Management Console",
            },
            "defaultLinkTarget": "embedded",
            "ensureLogin": True,
            "categories": category_dns,
            "content": content,
        }

    def refresh(self, reason=None):
        pass

    def get_cache_id(self):
        return str(time.time())
