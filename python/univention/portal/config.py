#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2025 Univention GmbH
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


import json
from glob import glob

from .log import get_logger


# TODO: Planned refactoring of the configuration processing
#
# We aim to add validation around the configuration based on Pydantic, so that
# there is protection against wrong types in the configuration file. Together
# with this change the load of the configuration shall be triggered from
# `main:run_server` instead of being done on-demand. Together with the Pydantic
# based configuration model we want to also add initial log output of the
# configuration, assuming that Pydantic's support for sensitive values will
# help to ensure that there is no accidental logging of sensitive information.


logger = get_logger("config")

_CONF = "/usr/lib/univention-portal/config/*.json"
_DB = {}


def load():
    _DB.clear()
    try:
        for fname in sorted(glob(_CONF)):
            with open(fname) as fd:
                _DB.update(json.load(fd))
    except EnvironmentError:
        pass
    else:
        load.never_loaded = False
        _log_configuration()


load.never_loaded = True


def fetch(key):
    if load.never_loaded:
        load()
    return _DB[key]


def fetch_with_default(key, *, default):
    try:
        return fetch(key)
    except KeyError:
        return default


def _log_configuration():
    logger.info("Feature toggles: %s", fetch_with_default("feature_toggles", default={}))
