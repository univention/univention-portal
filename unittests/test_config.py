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

from imp import reload

import pytest


@pytest.fixture
def mocked_portal_config(get_file_path):
	from univention.portal import config

	reload(config)
	config._CONF = get_file_path("config*.json")
	return config


def test_load_config_success(mocked_portal_config):
	# Set up
	mocked_portal_config._DB = {"old": "value"}
	expected_config = {"port": 8090, "fqdn": "dataport.ucs", "url": "http://127.0.0.1:8090", "test": True}
	# Execute
	assert mocked_portal_config.load.never_loaded is True
	mocked_portal_config.load()
	assert mocked_portal_config.load.never_loaded is False
	assert mocked_portal_config._DB == expected_config


def test_load_config_error(mocker, mocked_portal_config):
	# Set up
	mocked_portal_config._DB = {"old": "value"}
	mocker.patch.object(mocked_portal_config, "open", side_effect=EnvironmentError)
	# Execute
	assert mocked_portal_config.load.never_loaded is True
	mocked_portal_config.load()
	assert mocked_portal_config._DB == {}
	assert mocked_portal_config.load.never_loaded is True
	assert mocked_portal_config._DB == {}


def test_fetch_key(mocker, mocked_portal_config):
	# Set up
	def config_loaded():
		mocked_portal_config.load.never_loaded = False

	load_mock = mocker.patch.object(mocked_portal_config, "load", side_effect=config_loaded)
	mocked_portal_config._DB = {"port": 443, "fqdn": "dataport.ucs"}
	# Execute
	assert mocked_portal_config.fetch("port") == 443
	assert mocked_portal_config.load.never_loaded is False
	assert mocked_portal_config.fetch("fqdn") == "dataport.ucs"
	with pytest.raises(KeyError):
		mocked_portal_config.fetch("no_key")
	load_mock.assert_called_once()


def test_config_via_environment(mocker, mocked_portal_config):
	mocker.patch.dict("os.environ", {
		"PORTAL_UMC_API_URL": "stub_umc_api_url_from_env",
	})
	assert mocked_portal_config.fetch("umc_api_url") == "stub_umc_api_url_from_env"


def test_config_via_environment_has_priority(mocker, mocked_portal_config):
	assert mocked_portal_config.fetch("url") == "http://127.0.0.1:8090"
	reload(mocked_portal_config)
	mocker.patch.dict("os.environ", {
		"PORTAL_URL": "https://from-environment.test",
	})
	assert mocked_portal_config.fetch("url") == "https://from-environment.test"
