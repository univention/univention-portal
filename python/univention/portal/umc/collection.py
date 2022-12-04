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

import requests
import requests.exceptions

import univention.portal.config as config
from univention.portal.log import get_logger
from .collection import UMCCollection

UMC_ROOT_URL = config.fetch("umc_root_url")


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


class UMCCollection:
	URL_PATH = None
	DEFAULT_LOCALE = "en_US"

	def __init__(self, collection):
		self._collection = collection

	@classmethod
	def load(cls, headers):
		return cls(_do_request(cls.URL_PATH, headers))

	@property
	def sorted(self):
		return self._rsort_by_priority(self._collection)

	@staticmethod
	def _rsort_by_priority(collection):
		return sorted(
			collection, key=lambda item: item["priority"], reverse=True
		)
