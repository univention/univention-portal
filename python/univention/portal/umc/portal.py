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

from .categories import UMCCategories
from .modules import UMCModules


def get_data(headers):
	categories = UMCCategories.load(headers).initialize()
	modules = UMCModules.load(headers).initialize(categories.lookup_related_color)

	meta_categories = [
		categories.favorites_category(modules.get_favorites_sorted),
		categories.umc_category(),
	]

	return {
		"entries": modules.entries(),
		"folders": categories.folders(modules.lookup_related_modules_sorted),
		"categories": meta_categories,
		"meta": UMCCategories.meta(meta_categories),
	}
