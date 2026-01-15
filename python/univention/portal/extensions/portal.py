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

import os.path
import time
from pathlib import Path
from urllib.parse import urljoin

import requests
import requests.exceptions

from univention.portal import Plugin, config
from univention.portal.log import get_logger
from univention.portal.udm import AsyncUdmClient
from univention.portal.user import User
from univention.portal.util import is_current_time_between as is_announcement_visible_now


try:
    from guardian_authorization_client import GuardianAuthorizationClient
    GUARDIAN_AVAILABLE = True
except ImportError:
    GuardianAuthorizationClient = None
    GUARDIAN_AVAILABLE = False


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

    portal_cache = None

    def __init__(self, scorer, portal_cache, authenticator):
        self.scorer = scorer
        self.portal_cache = portal_cache
        self.authenticator = authenticator
        self._guardian_client = None
        self._udm_client = None

    @staticmethod
    def _is_guardian_enabled():
        """Check if Guardian integration is enabled via configuration."""
        guardian_config = config.fetch_with_default("guardian", default={})
        return guardian_config.get("enabled", False) and GUARDIAN_AVAILABLE

    def _get_guardian_client(self):
        """Lazily initialize and return the Guardian client."""
        if self._guardian_client is not None:
            return self._guardian_client
        if not self._is_guardian_enabled():
            return None
        guardian_config = config.fetch_with_default("guardian", default={})
        keycloak_config = guardian_config.get("keycloak", {})

        guardian_fqdn = guardian_config.get("fqdn")
        guardian_scheme = guardian_config.get("scheme", "http")
        keycloak_fqdn = keycloak_config.get("fqdn")
        keycloak_scheme = keycloak_config.get("scheme", "http")
        keycloak_username = keycloak_config.get("username")
        keycloak_password = keycloak_config.get("password")
        keycloak_realm = keycloak_config.get("realm", "nubus")

        if guardian_fqdn and keycloak_fqdn and keycloak_username and keycloak_password:
            self._guardian_client = GuardianAuthorizationClient(
                guardian_fqdn,
                keycloak_fqdn,
                username=keycloak_username,
                password=keycloak_password,
                realm=keycloak_realm,
                scheme=guardian_scheme,
                keycloak_scheme=keycloak_scheme,
            )
        else:
            get_logger("portal").warning(
                "Guardian integration enabled but missing configuration. "
                "Required: guardian.fqdn, guardian.keycloak.fqdn, guardian.keycloak.username, guardian.keycloak.password",
            )
        return self._guardian_client

    def _get_udm_client(self):
        """Lazily initialize and return the UDM client."""
        if self._udm_client is None:
            self._udm_client = AsyncUdmClient(
                udm_api_url=config.fetch('udm_api_url'),
                username=config.fetch('udm_api_username'),
                password=Path(config.fetch("udm_api_password_file")).read_text().strip(),
            )
        return self._udm_client

    def get_cache_id(self):
        return self.portal_cache.get_id()

    async def get_user(self, request) -> User:
        return await self.authenticator.get_user(request)

    async def login_user(self, request):
        return await self.authenticator.login_user(request)

    async def login_request(self, request):
        return await self.authenticator.login_request(request)

    async def logout_user(self, request):
        return await self.authenticator.logout_user(request)

    def get_feature_toggles(self):
        return config.fetch_with_default("feature_toggles", default={})

    def get_newsfeed_config(self):
        return config.fetch_with_default("newsfeed_config", default={})

    async def get_visible_content(self, user, admin_mode):
        entries = self.portal_cache.get_entries()
        folders = self.portal_cache.get_folders()
        categories = self.portal_cache.get_categories()
        announcements = self.portal_cache.get_announcements()

        guardian_permissions = await self._get_guardian_permissions(user)

        visible_entry_dns = self._filter_entry_dns(
            entries.keys(),
            entries,
            user,
            admin_mode,
            guardian_permissions=guardian_permissions,
        )
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

    async def _get_guardian_permissions(self, user):
        """
        Fetch Guardian permissions for the user.

        Returns a list of permissions if Guardian is enabled and user is logged in,
        otherwise returns None.
        """
        if not self._is_guardian_enabled():
            return None

        # Anonymous users don't have Guardian permissions
        if not user.is_logged_in():
            get_logger("portal").debug("User is not logged in, skipping Guardian permission check.")
            return []

        guardian_client = self._get_guardian_client()
        if guardian_client is None:
            get_logger("portal").warning("Guardian client not available, skipping permission check.")
            return None

        try:
            get_logger("portal").info("User is logged in, fetching user details from UDM Rest API.")
            udm_client = self._get_udm_client()
            udm_user_data = await udm_client.get_user(
                user.user_dn, include_guardian_inherited_roles=True)

            actor = self._build_guardian_actor(udm_user_data)

            get_logger("portal").debug(
                "Fetching Guardian permissions for actor: %s with roles: %s, attributes: %s",
                actor["id"], actor["roles"], actor.get("attributes", {}))
            # For general permissions, we don't need targets (pass None, not empty targets)
            guardian_response = guardian_client.get_permissions(
                actor,
                targets=None,
                contexts=[],
                namespaces=["univention-portal:portal"],
                extra_request_data={},
                include_general_permissions=True,
            )

            general_permissions = guardian_response.get("general_permissions", set())
            get_logger("portal").info("Guardian returned %d general permissions", len(general_permissions))
            return list(general_permissions) if general_permissions else []

        except Exception as exc:
            get_logger("portal").error(
                "Failed to fetch Guardian permissions: %s. "
                "Falling back to group-based filtering.",
                exc,
                exc_info=True,
            )
            return None

    def _build_guardian_actor(self, udm_user_data):
        """
        Build the actor dict for Guardian from UDM user data.

        Passes the complete user object (all UDM properties) to Guardian,
        so that Guardian can evaluate any attribute of the user in conditions
        (e.g., actor_field_equals_value(nextcloudEnabled, true)).
        """
        # Use DN as actor ID for consistency with UDM
        # DN is always long enough to satisfy Guardian's minLength requirement
        user_properties = udm_user_data.get("properties", {})
        actor = {
            "id": udm_user_data.get("dn", ""),
            "roles": [],
            "attributes": user_properties,
        }

        # Get roles assigned directly to the user and the inherited from groups
        guardian_roles = user_properties.get("guardianRoles") or []
        inherited_roles = user_properties.get("guardianInheritedRoles") or []

        all_roles = list(guardian_roles) + list(inherited_roles)

        if all_roles:
            get_logger("portal").debug(
                "Found %d Guardian roles for user (%d direct, %d inherited).",
                len(all_roles), len(guardian_roles), len(inherited_roles))
            # Roles should be strings in the format "app:namespace:role"
            # The GuardianAuthorizationClient will convert them to dicts via expand_role_string()
            actor["roles"] = all_roles

        return actor

    def get_user_links(self, content):
        links = self.portal_cache.get_user_links()
        return self._filter_visible_links(links, content)

    def get_menu_links(self, content):
        links = self.portal_cache.get_menu_links()
        return self._filter_visible_links(links, content)

    def get_corner_links(self, content):
        links = self.portal_cache.get_corner_links()
        return self._filter_visible_links(links, content)

    def get_quick_links(self, content):
        links = self.portal_cache.get_quick_links()
        return self._filter_visible_links(links, content)

    def _filter_visible_links(self, links, content):
        return [
            dn for dn in links if dn in content["entry_dns"] or dn in content["folder_dns"]
        ]

    def get_entries(self, content):
        entries = self.portal_cache.get_entries()
        return [entries[entry_dn] for entry_dn in content["entry_dns"]]

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

    def _filter_entry_dns(self, entry_dns, entries, user, admin_mode, guardian_permissions=None):
        """
        Filter entry DNs based on visibility rules.

        Args:
            entry_dns: Iterable of entry DNs to filter
            entries: Dict of entry data keyed by DN
            user: The current user
            admin_mode: Whether admin mode is enabled
            guardian_permissions: List of Guardian permissions, None if Guardian is disabled,
                                  empty list if user has no permissions

        Returns:
            List of visible entry DNs
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

                # Check Guardian permission if entry has one configured
                if entry.get("guardianPermissionView"):
                    # If Guardian is disabled (None), skip entries with Guardian permissions
                    if guardian_permissions is None:
                        get_logger("portal").debug(
                            "Entry %s has guardianPermissionView but Guardian is disabled, hiding entry.",
                            entry_dn,
                        )
                        continue

                    # Check if user has the required permission
                    # guardianPermissionView should be the full permission string like
                    # "univention-portal:portal:view-admin-tiles"
                    # guardian_permissions is a list of permission strings from Guardian
                    required_permission = entry["guardianPermissionView"]
                    has_permission = required_permission in guardian_permissions

                    if has_permission:
                        get_logger("portal").debug(
                            "Entry %s visible: user has permission %s",
                            entry_dn, required_permission,
                        )
                        filtered_dns.append(entry_dn)
                    else:
                        get_logger("portal").debug(
                            "Entry %s hidden: user lacks permission %s (has: %s)",
                            entry_dn, required_permission, guardian_permissions,
                        )
                    continue

                # Group-based filtering (existing logic)
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
                elif entry_dn in folders and entry_dn not in already_unpacked_folder_dns:
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

    async def get_visible_content(self, user, admin_mode):
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

    def get_corner_links(self, content):
        return []

    def get_quick_links(self, content):
        return []

    def get_announcements(self, content):
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
