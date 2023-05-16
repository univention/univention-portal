#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2022 Univention GmbH
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
import os.path
import shutil
import tempfile
from binascii import a2b_base64
from imghdr import what
from pathlib import Path
from urllib.parse import quote, urljoin, urlsplit

import requests

import univention.admin.rest.client as udm_client
from univention.portal import Plugin, config
from univention.portal.util import log_url_safe
from univention.portal.log import get_logger


logger = get_logger("cache")


class Reloader(metaclass=Plugin):
    """
    Our base class for reloading

    The idea is that this class handles the reloading
    for caches.

    `refresh`: In fact the only method. Gets a "reason" so that it can
            decide that a refresh is not necessary. If it was necessary, it
            should return True

    A reason "force" should be treated as very important.
    If the reloader refreshed the content, the overlying cache will reload
    itself.
    """

    def refresh(self, reason=None):  # pragma: no cover
        pass


class HttpReloader(Reloader):
    """A reloader which updates a HTTP resource."""

    _content_fetcher = None

    def __init__(self, url):
        self._ensure_url_is_supported(url)
        self._url = url

    def refresh(self, reason=None):
        class_name = self.__class__.__name__
        if not self._check_reason(reason):
            logger.info("Not refreshing cache, %s, reason: %s", class_name, reason)
            return False
        content = self._generate_content()
        return self._write_content(content)

    def _check_reason(self, reason=None):
        return _check_reason_base(reason)

    def _generate_content(self):
        self._content_fetcher.fetch()

    def _write_content(self, content):
        logger.debug("PUT asset to URL: %s", log_url_safe(self._url))
        result = requests.put(url=self._url, data=content)
        if result.status_code >= requests.codes.bad:
            logger.error("Upload of the image did fail: %s, %s", result.status_code, result.text)
            return False
        return True

    def _ensure_url_is_supported(self, url):
        url_parts = urlsplit(url)
        if url_parts.scheme not in ("http", "https"):
            raise ValueError('Invalid value for "url."', url)


class HttpPortalReloader(HttpReloader):

    def __init__(self, url, portal_dn):
        super().__init__(url)
        self._content_fetcher = PortalContentFetcher(portal_dn)

    def _check_reason(self, reason=None):
        return _check_portal_reason(reason)


class PortalContentFetcher:

    def __init__(self, portal_dn):
        self._portal_dn = portal_dn
        self._assets_root = config.fetch("assets_root")

    def fetch(self):
        udm = self._create_udm_client()
        try:
            portal_module = udm.get("portals/portal")
            if not portal_module:
                get_logger("cache").warning("UDM not up to date? Portal module not found.")
                return None

            portal_data = portal_module.get(self._portal_dn)

        except udm_client.ConnectionError:
            get_logger("cache").warning("Could not establish UDM connection. Is the LDAP server accessible?")
            return None

        except udm_client.NotFound:
            get_logger("cache").warning("Portal %s not found", self._portal_dn)
            return None

        portal = self._extract_portal(portal_data)
        categories = self._extract_categories(udm, portal_data.properties["categories"])
        portal_categories = [category for dn, category in categories.items() if category["in_portal"]]
        user_links = portal_data.properties["userLinks"]
        menu_links = portal_data.properties["menuLinks"]
        folders = self._extract_folders(udm, portal_categories, user_links, menu_links)
        portal_folders = [folder for dn, folder in folders.items() if folder["in_portal"]]
        entries = self._extract_entries(udm, portal_categories, portal_folders, user_links, menu_links)
        announcements = self._extract_announcements(udm)

        return json.dumps(
            {
                "portal": portal,
                "categories": categories,
                "folders": folders,
                "entries": entries,
                "user_links": user_links,
                "menu_links": menu_links,
                "announcements": announcements,
            },
            sort_keys=True,
            indent=4,
        )


    def _create_udm_client(self):
        logger.debug("Connecting to UDM at URL: %s", config.fetch("udm_api_url"))
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
            portal["logo"] = self._write_image(portal["logo"], portal_name, dirname="logos")

        if portal["background"]:
            portal["background"] = self._write_image(
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
    def _extract_folders(cls, udm, portal_categories, user_links, menu_links):
        folders = {}

        for folder in udm.get("portals/folder").search(opened=True):
            in_portal = (
                folder.dn in user_links
                or folder.dn in menu_links
                or any(folder.dn in category["entries"] for category in portal_categories)
            )

            folders[folder.dn] = {
                "dn": folder.dn,
                "in_portal": in_portal,
                "name": folder.properties["displayName"],
                "entries": folder.properties["entries"],
            }

        return folders

    def _extract_entries(self, udm, portal_categories, portal_folders, user_links, menu_links):
        entries = {}

        for entry in udm.get("portals/entry").search(opened=True):
            if entry.dn in entries:
                continue

            in_portal = (
                entry.dn in user_links
                or entry.dn in menu_links
                or any(entry.dn in category["entries"] for category in portal_categories)
                or any(entry.dn in folder["entries"] for folder in portal_folders)
            )

            logo_name = None
            if entry.properties["icon"]:
                logo_name = self._write_image(
                    entry.properties["icon"], entry.properties["name"], dirname="entries",
                )

            entries[entry.dn] = {
                "dn": entry.dn,
                "in_portal": in_portal,
                "name": entry.properties["displayName"],
                "description": entry.properties["description"],
                "keywords": entry.properties["keywords"],
                "logo_name": logo_name,
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

    def _write_image(self, image, name, dirname):
        writer = self._select_image_writer_from_scheme()
        name = name.replace(
            "/", "-",
        )  # name must not contain / and must be a path which can be accessed via the web!
        try:
            binary_image = a2b_base64(image)
            extension = what(None, binary_image) or "svg"
            writer(self._assets_root, name, dirname, extension, binary_image)
        except (OSError, TypeError):
            get_logger("img").exception("Error saving image for %s" % name)
        else:
            return f"./icons/{quote(dirname)}/{quote(name)}.{extension}"


    def _select_image_writer_from_scheme(self):
        assets_root = urlsplit(self._assets_root)
        if assets_root.scheme in ("http", "https"):
            return _write_image_to_http
        return _write_image_to_file


class MtimeBasedLazyFileReloader(Reloader):
    """
    Specialized class that reloads if a certain (cache) file was updated.
    So if a seconds process updated the file and this class is asked to
    reload, it just returns True. If the reason fits, it actually refreshes
    the content and writes it into the file.

    cache_file:
            Filename this object is responsible for
    """

    def __init__(self, cache_file):
        logger.debug("init, %s, cache_file %s", self, cache_file)
        self._cache_file = cache_file
        cache_file_parts = urlsplit(cache_file)
        if cache_file_parts.scheme in ("http", "https"):
            self._asset_writer = AssetWriterHttp()
        else:
            self._asset_writer = AssetWriterFile()
        self._mtime = self._get_mtime()

    def _get_mtime(self):
        try:
            return os.stat(self._cache_file).st_mtime
        except (EnvironmentError, AttributeError) as exc:
            get_logger("cache").warning(f"Unable to get mtime for {exc}")
            return 0

    def _file_was_updated(self):
        mtime = self._get_mtime()
        if mtime > self._mtime:
            self._mtime = mtime
            return True

    def _check_reason(self, reason, content=None):
        return _check_reason_base(reason)

    def refresh(self, reason=None, content=None):
        class_name = self.__class__.__name__
        if not self._check_reason(reason, content=content):
            logger.info("Not refreshing cache, %s, reason: %s", class_name, reason)
            return self._file_was_updated()

        logger.info("Refreshing cache, %s, reason: %s", class_name, reason)
        try:
            binary_data = self._refresh()
        except Exception:
            get_logger("cache").exception("Error during refresh")
            # TODO: Praying and hoping is not really good enough. Refactor.
            # hopefully, we can still work with an older cache?
        else:
            return self._asset_writer.write(self._cache_file, binary_data)

        return self._file_was_updated()

    def _refresh(self):  # pragma: no cover
        pass


class AssetWriterFile:

    def write(self, path_or_url, binary_data):
        # TODO: convert from "file://" URL to filename
        cache_file = path_or_url

        fd = None
        try:
            fd = self._write(binary_data)
        except Exception:
            get_logger("cache").exception("Error during refresh")
            # hopefully, we can still work with an older cache?
        else:
            if fd:
                try:
                    os.makedirs(os.path.dirname(cache_file))
                except EnvironmentError:
                    pass
                shutil.move(fd.name, cache_file)
                self._mtime = self._get_mtime(cache_file)
                return True

    def _write(self, binary_data):
        with tempfile.NamedTemporaryFile(mode="w", delete=False) as fd:
            fd.write(binary_data)
            return fd

    def _get_mtime(self, cache_file):
        try:
            return os.stat(cache_file).st_mtime
        except (EnvironmentError, AttributeError) as exc:
            get_logger("cache").warning(f"Unable to get mtime for {exc}")
            return 0


class AssetWriterHttp:

    def write(self, path_or_url, binary_data):
        self._ensure_url_is_supported(path_or_url)
        logger.debug("PUT asset to URL: %s", log_url_safe(path_or_url))
        result = requests.put(url=path_or_url, data=binary_data)
        if result.status_code >= requests.codes.bad:
            logger.error("Upload of the image did fail: %s, %s", result.status_code, result.text)
            return False
        return True

    def _ensure_url_is_supported(self, path_or_url):
        url_parts = urlsplit(path_or_url)
        if url_parts.scheme not in ("http", "https"):
            raise ValueError('Invalid value for "path_or_url."', path_or_url)


class PortalReloaderUDM(MtimeBasedLazyFileReloader):
    """
    Specialized class that reloads a cache file with the content of a certain
    portal object using UDM. Reacts on reasons like "ldap:portal:<correct_dn>".

    portal_dn:
            DN of the portals/portal object
    cache_file:
            Filename this object is responsible for
    """

    def __init__(self, portal_dn, cache_file):
        super(PortalReloaderUDM, self).__init__(cache_file)
        self._portal_dn = portal_dn

    def _check_reason(self, reason, content=None):
        return _check_portal_reason(reason)

    def _refresh(self):
        content_fetcher = PortalContentFetcher(self._portal_dn)
        return content_fetcher.fetch()


def _write_image_to_http(assets_root, name, dirname, extension, binary_image):
    image_sub_path = f"icons/{quote(dirname)}/{quote(name)}.{quote(extension)}"
    image_url = urljoin(assets_root, image_sub_path)
    logger.debug("PUT image to URL: %s", log_url_safe(image_url))
    if not image_url.startswith(assets_root):
        raise ValueError('Value of "dirname" not allowed', dirname)
    result = requests.put(url=image_url, data=binary_image)
    if result.status_code >= requests.codes.bad:
        logger.error("Upload of the image did fail: %s, %s", result.status_code, result.text)


def _write_image_to_file(assets_root, name, dirname, extension, binary_image):
    path = Path(assets_root) / "icons" / dirname / f"{name}.{extension}"
    logger.debug("Writing image to file: %s", path)
    path.write_bytes(binary_image)


class GroupsReloaderLDAP(MtimeBasedLazyFileReloader):
    """
    Specialized class that reloads a cache file with the content of group object
    in LDAP. Reacts on the reason "ldap:group".

    .. warnings:: As of 4.0.7-8 we use univention-group-membership-cache to
    obtain groups user belongs to; but we cannot change the constructor kwargs
    because customers may have added entries to
    /usr/share/univention-portal/portals.json that still uses them.

    ldap_uri:
            URI for the LDAP connection, e.g. "ldap://ucs:7369"
    binddn:
            The bind dn for the connection, e.g. "cn=ucs,cn=computers,..."
    password_file:
            Filename that holds the password for the binddn, e.g. "/etc/machine.secret"
    ldap_base:
            Base in which the groups are searched in. E.g., "dc=base,dc=com" or "cn=groups,ou=OU1,dc=base,dc=com"
    cache_file:
            Filename this object is responsible for
    """

    def __init__(self, ldap_uri, binddn, password_file, ldap_base, cache_file):
        super(GroupsReloaderLDAP, self).__init__(cache_file)

    def _check_reason(self, reason, content=None):
        return _check_groups_reason(reason)

    def _refresh(self):
        logger.debug("Refreshing groups cache")
        from univention.ldap_cache.frontend import users_groups

        users = users_groups()
        return json.dumps(users, sort_keys=True, indent=4)


def _check_reason_base(reason):
    if reason is None:
        return False
    if reason == "force":
        return True


def _check_groups_reason(reason):
    if _check_reason_base(reason):
        return True
    if reason is None:
        return False
    if reason.startswith("ldap:group"):
        return True
    return False


def _check_portal_reason(reason):
    if _check_reason_base(reason):
        return True
    if reason is None:
        return False
    reason_args = reason.split(":", 2)
    if len(reason_args) < 2:
        return False
    if reason_args[0] != "ldap":
        return False
    return reason_args[1] in ["portal", "category", "entry", "folder", "announcement"]
