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

from .collection import UMCCollection


class UMCCategories(UMCCollection):
	URL_PATH = 'categories'

	def __init__(self, collection):
		super().__init__(collection)
		self._lookup_color = {}
		self._favorites_category = None

	def initialize(self):
		for category in self._collection:
			self._lookup_color[category["id"]] = category.get("color")
			if category["id"] == "_favorites_" and not self._favorites_category:
				self._favorites_category = category

		return self

	@property
	def lookup_related_color(self):
		return self._lookup_color

	def folders(self, related_modules):
		return [
			{
				"name": {
					"en_US": category["name"],
					"de_DE": category["name"],
				},
				"dn": category["id"],
				"entries": related_modules.lookup_modules_sorted(category["id"]),
			}
			for category in self._collection
			if category["id"] not in ["apps", "_favorites_"]
		]

	def favorites_category(self, get_favorite_modules_sorted):
		if not self._favorites_category:
			return self._default_favorites_category()

		return {
			"display_name": {self.DEFAULT_LOCALE: self._favorites_category["name"]},
			"dn": "umc:category:favorites",
			"entries": get_favorite_modules_sorted(),
		}

	def umc_category(self):
		return {
			"display_name": {"en_US": "Univention Management Console"},
			"dn": "umc:category:umc",
			"entries": [
				category["id"] for category in self.sorted
				if category["id"] not in ("_favorites_", "apps")
			]
		}

	@staticmethod
	def meta(meta_categories):
		return {
			"name": {"en_US": "Univention Management Console"},
			"defaultLinkTarget": "embedded",
			"ensureLogin": True,
			"categories": [category["dn"] for category in meta_categories],
			"content": [[category["dn"], category["entries"]] for category in meta_categories]
		}

	@staticmethod
	def _default_favorites_category():
		return {
			"display_name": {"en_US": "Favorites"},
			"dn": "umc:category:favorites",
			"entries": [],
		}
