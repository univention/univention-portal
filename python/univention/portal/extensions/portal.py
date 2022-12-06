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

import os.path
import operator as op
import time
from functools import reduce

import requests
import requests.exceptions

import univention.portal.config as config
from univention.portal import Plugin
from univention.portal.log import get_logger


class Portal(metaclass=Plugin):
	def __init__(self, scorer, portal_cache, authenticator):
		self.scorer = scorer
		self.portal_cache = portal_cache
		self.authenticator = authenticator

	async def get_user(self, request):
		return await self.authenticator.get_user(request)

	async def login_user(self, request):
		return await self.authenticator.login_user(request)

	async def login_request(self, request):
		return await self.authenticator.login_request(request)

	async def logout_user(self, request):
		return await self.authenticator.logout_user(request)

	def get_data(self, user, admin_mode=False):
		cache_id = self.portal_cache.get_id()
		entries = self.portal_cache.get_entries()
		folders = self.portal_cache.get_folders()
		categories = self.portal_cache.get_categories()
		portal = self.portal_cache.get_portal()

		if not admin_mode:
			entries = {
				dn: entry
				for dn, entry in entries.items()
				if self._is_visible_entry(entry, user)
			}
			folders = self._filter_visible_folders(folders, entries)
			categories = {
				dn: entry
				for dn, entry in categories.items()
				if dn in entries or dn in folders
			}

		portal["categories"] = self._unique_intersection(portal["categories"], categories.keys())
		portal["content"] = [
			[dn, categories[dn]["entries"]] for dn in portal["categories"]
		]

		return {
			"cache_id": cache_id,
			"user_links": self._unique_intersection(
				self.portal_cache.get_user_links(), entries.keys(), folders.keys()
			),
			"menu_links": self._unique_intersection(
				self.portal_cache.get_menu_links(), entries.keys(), folders.keys()
			),
			"entries": list(entries.values()),
			"folders": self._filter_property(
				folders.values(), property="entries", white_lists=[entries.keys(), folders.keys()]
			),
			"categories": self._filter_property(
				categories.values(), property="entries", white_lists=[entries.keys(), folders.keys()]
			),
			"portal": portal,
		}

	@staticmethod
	def _is_visible_entry(entry, user):
		if not entry["in_portal"]:
			return False
		if not entry["activated"]:
			return False
		if entry["anonymous"] and not user.is_anonymous():
			return False
		if entry["allowedGroups"]:
			return set(user.groups) & set(entry["allowedGroups"])

		return True

	@staticmethod
	def _filter_visible_folders(folders, visible_entry_dns):
		visible = set()
		folder_entries = {}
		while True:
			no_change = True
			for dn, folder in folders.items():
				if dn in visible:
					continue
				if dn not in folder_entries:
					folder_entries[dn] = set(folder["entries"])
				if (
					visible & folder_entries[dn]
					or visible_entry_dns & folder_entries[dn]
				):
					visible.add(dn)
					no_change = False
			if no_change:
				break

		return {dn: folder for dn, folder in folders.items() if dn in visible}

	@staticmethod
	def _unique_intersection(*iterables):
		return list(reduce(op.and_, [set(_) for _ in iterables]))

	@classmethod
	def _filter_property(cls, collection, property, white_lists):
		for item in collection:
			item[property] = cls._unique_intersection(item[property], *white_lists)

		return collection

	def auth_mode(self, request):
		return self.authenticator.get_auth_mode(request)

	def may_be_edited(self, user):
		return config.fetch('editable') and user.is_admin()

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
		uri = f"{umc_get_url}/{get_path}"
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
		locale = 'en_US'
		for module in content["umc_modules"]:
			if "apps" in module["categories"]:
				continue
			logo_name = "/univention/management/js/dijit/themes/umc/icons/scalable/{}.svg".format(module["icon"])
			if not os.path.exists(os.path.join("/usr/share/univention-management-console-frontend/", logo_name[23:])):
				logo_name = None
			color = None
			for cat in module["categories"]:
				if cat in colors:
					color = colors[cat]
					break
			entries.append({
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
				"logo_name": logo_name,
				"backgroundColor": color,
				"links": [{
					"locale": locale,
					"value": "/univention/management/?header=try-hide&overview=false&menu=false#module={}:{}".format(module["id"], module.get("flavor", ""))
				}],
				# TODO: missing: in_portal, anonymous, activated, allowedGroups
			})
		return entries

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
				"entries": [self._entry_id(mod) for mod in modules if "_favorites_" in mod.get("categories", [])]
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
			"entries": [cat["id"] for cat in categories if cat["id"] not in ["_favorites_", "apps"]]
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
			"content": content
		}

	def refresh(self, reason=None):
		pass

	def get_cache_id(self):
		return str(time.time())
