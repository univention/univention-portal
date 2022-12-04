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

from collection import defaultdict
from pathlib import Path

import univention.portal.config as config
from .collection import UMCCollection

UMC_BASE_PATH = config.fetch("umc_base_path")
UMC_ASSETS_ROOT = Path(config.fetch("umc_assets_root"))
UMC_ICONS_PATH = Path(config.fetch("umc_icons_path"))


class UMCModules(UMCCollection):
	URL_PATH = 'modules'
	HREF_QUERY_STRING = "?header=try-hide&overview=false&menu=false"

	def __init__(self, collection):
		super().__init__(collection)
		self._lookup_modules_by_category = defaultdict(list)

	def initialize(self, lookup_related_color):
		for module in self.sorted:
			module["__entry_id"] = f"umc:module:{self._module_entry_id(module)}"
			module["__entry_link"] = self._module_entry_link(module)
			module["__icon_path"] = self._module_icon_path(module.get("icon"))

			for category_id in module["categories"]:
				self._lookup_modules_by_category[category_id].append(
					module["__entry_id"]
				)

				if category_id != "_favorites_" and "__color" not in module:
					module["__color"] = lookup_related_color.get(category_id)

		return self

	@property
	def lookup_related_modules_sorted(self):
		return self._lookup_modules_by_category

	def entries(self):
		return [
			{
				"dn": module["__entry_id"],
				"name": {self.DEFAULT_LOCALE: module["name"]},
				"description": {self.DEFAULT_LOCALE: module["description"]},
				"keywords": {self.DEFAULT_LOCALE: ' '.join(module["keywords"])},
				"linkTarget": "embedded",
				"target": None,
				"logo_name": module["__icon_path"],
				"backgroundColor": module["__color"],
				"links": [{
					"locale": self.DEFAULT_LOCALE,
					"value": module["__entry_link"]
				}],
				# TODO: missing: in_portal, anonymous, activated, allowedGroups
			}
			for module in self._collection
			if "apps" not in module["categories"]
		]

	def get_favorites_sorted(self):
		return [
			module["__entry_id"] for module in self.sorted
			if "_favorites_" in module.get("categories", [])
		]

	@staticmethod
	def _module_entry_id(module):
		return f"{module['id']}:{module.get('flavor', '')}"

	@classmethod
	def _module_entry_link(cls, module):
		href_base = f"{UMC_BASE_PATH}/{cls.QUERY_STRING}"

		return f"{href_base}#module={cls._module_entry_id(module)}"

	@staticmethod
	def _module_icon_path(icon_name):
		icon_path = None
		if (UMC_ASSETS_ROOT / UMC_ICONS_PATH / f"{icon_name}.svg").exists():
			icon_path = f"{UMC_BASE_PATH}/{UMC_ICONS_PATH}/{icon_name}.svg"

		return icon_path
