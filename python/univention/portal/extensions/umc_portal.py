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

from pathlib import Path

import requests
import requests.exceptions

import univention.portal.config as config
from univention.portal.log import get_logger


class UMCPortal:
	UMC_ROOT_URL = config.fetch("umc_root_url")
	UMC_ASSETS_ROOT = Path(config.fetch("umc_assets_root"))
	UMC_ICONS_PATH = Path(config.fetch("umc_icons_path"))
	UMC_BASE_PATH = config.fetch("umc_base_path")

	def __init__(self, user):
		self._user = user

	def get_data(self, portal_categories):
		headers = self._user.headers
		umc_categories = self._request_umc_get("categories", headers)
		umc_modules = self._request_umc_get("modules", headers)

		categories = [
			self.get_favorite_category(umc_modules, umc_categories),
			self.get_umc_category(umc_categories),
		]

		return {
			"entries": self.get_entries(umc_modules, umc_categories),
			"folders": self.get_folders(umc_modules, umc_categories),
			"categories": categories,
			"meta": self.get_meta([*portal_categories, *categories]),
		}

	@staticmethod
	def _entry_id(module, prefix="umc:module:"):
		return f"{prefix}{module['id']}:{module.get('flavor', '')}"

	@classmethod
	def get_entries(cls, modules, categories):
		entries = []
		locale = 'en_US'
		colors = {
			cat["id"]: cat["color"]
			for cat in categories
			if cat["id"] != "_favorites_"
		}

		for module in modules:
			if "apps" in module["categories"]:
				continue

			logo_name = None
			if (cls.UMC_ASSETS_ROOT / cls.UMC_ICONS_PATH / f"{module['icon']}.svg").exists():
				logo_name = f"{cls.UMC_BASE_PATH}/{cls.UMC_ICONS_PATH}/{module['icon']}.svg"

			color = None
			for cat in module["categories"]:
				if cat in colors:
					color = colors[cat]
					break

			query_string = "?header=try-hide&overview=false&menu=false"
			href_base = f"{cls.UMC_BASE_PATH}/{query_string}"
			entries.append({
				"dn": cls._entry_id(module),
				"name": {locale: module["name"]},
				"description": {locale: module["description"]},
				"keywords": {locale: ' '.join(module["keywords"])},
				"linkTarget": "embedded",
				"target": None,
				"logo_name": logo_name,
				"backgroundColor": color,
				"links": [{
					"locale": locale,
					"value": f"{href_base}#module={cls._entry_id(module, prefix='')}"
				}],
				# TODO: missing: in_portal, anonymous, activated, allowedGroups
			})

		return entries

	@classmethod
	def get_folders(cls, modules, categories):
		folders = []
		for category in categories:
			if category["id"] in ["apps", "_favorites_"]:
				continue

			entries = sorted([
				[-module["priority"], module["name"], cls._entry_id(module)]
				for module in modules
				if category["id"] in module["categories"]
			])

			folders.append({
				"name": {
					"en_US": category["name"],
					"de_DE": category["name"],
				},
				"dn": category["id"],
				"entries": [entry[-1] for entry in entries],
			})

		return folders

	@classmethod
	def get_favorite_category(cls, modules, categories):
		display_name = {"en_US": "Favorites"}
		entries = []

		for category in categories:
			if category["id"] == "_favorites_":
				modules = sorted(
					modules, key=lambda entry: entry["priority"], reverse=True
				)
				display_name = {"en_US": category["name"]}
				entries = [
					cls._entry_id(module)
					for module in modules
					if "_favorites_" in module.get("categories", [])
				]
				break

		return {
			"display_name": display_name,
			"dn": "umc:category:favorites",
			"entries": entries,
		}

	@staticmethod
	def get_umc_category(categories):
		categories = sorted(
			categories, key=lambda entry: entry["priority"], reverse=True
		)

		return {
			"display_name": {"en_US": "Univention Management Console"},
			"dn": "umc:category:umc",
			"entries": [
				category["id"]
				for category in categories
				if category["id"] not in ["_favorites_", "apps"]
			]
		}

	@staticmethod
	def get_meta(categories):
		category_dns = ["umc:category:favorites", "umc:category:umc"]
		content = [
			[category["dn"], category["entries"]]
			for category in categories
			if category["dn"] in category_dns
		]

		return {
			"name": {"en_US": "Univention Management Console"},
			"defaultLinkTarget": "embedded",
			"ensureLogin": True,
			"categories": category_dns,
			"content": content
		}

	@classmethod
	def _request_umc_get(cls, path, headers):
		uri = f"{cls.UMC_ROOT_URL}/{path}"
		try:
			response = requests.post(uri, headers=headers, json={"options": {}})
		except requests.exceptions.RequestException as exc:
			get_logger("umc").warning("Exception while getting %s: %s", path, exc)
			return []
		else:
			if response.status_code != 200:
				get_logger("umc").debug("Status %r while getting %s", response.status_code, path)
				return []
			return response.json()[path]
