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

from collections import defaultdict
from pathlib import Path

import requests
import requests.exceptions

import univention.portal.config as config
from univention.portal.log import get_logger

UMC_ROOT_URL = config.fetch("umc_root_url")
UMC_ASSETS_ROOT = Path(config.fetch("umc_assets_root"))
UMC_ICONS_PATH = Path(config.fetch("umc_icons_path"))
UMC_BASE_PATH = config.fetch("umc_base_path")


def _do_request(path, headers):
	uri = f"{UMC_ROOT_URL}/{path}"
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


def get_data(headers):
	categories = _do_request("categories", headers)

	color_lookup = {category["id"]: category["color"] for category in categories}

	modules = []
	related_modules_lookup = defaultdict(list)
	for module in _do_request("modules", headers):
		module["__entry_id"] = _module_entry_id(module)
		module["__entry_link"] = _module_entry_link(module)
		module["__icon_path"] = _module_icon_path(module.get("icon"))
		for category_id in module["categories"]:
			related_modules_lookup[category_id].append(module["__entry_id"])
			if category_id != "_favorites_" and "__color" not in module:
				module["__color"] = color_lookup.get(category_id)
		modules.append(module)

	sorted_modules = _rsort_by_priority(modules)
	sorted_categories = _rsort_by_priority(categories)

	meta_categories = [
		_favorite_category(categories, sorted_modules),
		_umc_category(sorted_categories),
	]

	return {
		"entries": _module_entries(modules),
		"folders": _folders(categories, related_modules_lookup),
		"categories": meta_categories,
		"meta": _meta(meta_categories),
	}


def _rsort_by_priority(collection):
	return sorted(
		collection, key=lambda item: item["priority"], reverse=True
	)


def _module_entry_id(module, prefix="umc:module:"):
	return f"{prefix}{module['id']}:{module.get('flavor', '')}"


def _module_entry_link(module):
	query_string = "?header=try-hide&overview=false&menu=false"
	href_base = f"{UMC_BASE_PATH}/{query_string}"
	return f"{href_base}#module={_module_entry_id(module, prefix='')}"


def _module_icon_path(icon_name):
	icon_path = None
	if (UMC_ASSETS_ROOT / UMC_ICONS_PATH / f"{icon_name}.svg").exists():
		icon_path = f"{UMC_BASE_PATH}/{UMC_ICONS_PATH}/{icon_name}.svg"
	return icon_path


def _module_entries(modules):
	locale = 'en_US'
	return [
		{
			"dn": module["__entry_id"],
			"name": {locale: module["name"]},
			"description": {locale: module["description"]},
			"keywords": {locale: ' '.join(module["keywords"])},
			"linkTarget": "embedded",
			"target": None,
			"logo_name": module["__icon_path"],
			"backgroundColor": module["__color"],
			"links": [{
				"locale": locale,
				"value": module["__entry_link"]
			}],
			# TODO: missing: in_portal, anonymous, activated, allowedGroups
		}
		for module in modules
		if "apps" not in module["categories"]
	]


def _folders(categories, related_modules_lookup):
	return [
		{
			"name": {
				"en_US": category["name"],
				"de_DE": category["name"],
			},
			"dn": category["id"],
			"entries": related_modules_lookup.get(category["id"]),
		}
		for category in categories
		if category["id"] not in ["apps", "_favorites_"]
	]


def _favorite_category(categories, sorted_modules):
	display_name = {"en_US": "Favorites"}
	entries = []

	for category in categories:
		if category["id"] == "_favorites_":
			display_name = {"en_US": category["name"]}
			entries = [
				module["__entry_id"]
				for module in sorted_modules
				if "_favorites_" in module.get("categories", [])
			]
			break

	return {
		"display_name": display_name,
		"dn": "umc:category:favorites",
		"entries": entries,
	}


def _umc_category(sorted_categories):
	return {
		"display_name": {"en_US": "Univention Management Console"},
		"dn": "umc:category:umc",
		"entries": [
			category["id"]
			for category in sorted_categories
			if category["id"] not in ["_favorites_", "apps"]
		]
	}


def _meta(meta_categories):
	return {
		"name": {"en_US": "Univention Management Console"},
		"defaultLinkTarget": "embedded",
		"ensureLogin": True,
		"categories": [category["dn"] for category in meta_categories],
		"content": [[category["dn"], category["entries"]] for category in meta_categories]
	}
