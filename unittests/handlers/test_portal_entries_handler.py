#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2024 Univention GmbH
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
from unittest import mock

import pytest
import tornado.testing
import tornado.web

from univention.portal.main import build_routes


class TestPortalEntriesHandlerNoHttpCache:

    @pytest.fixture()
    def app(self, portal):
        routes = build_routes({"default": portal}, mock.Mock())
        return tornado.web.Application(routes)

    @pytest.mark.gen_test()
    def test_get_portals_json_standard(self, http_client, base_url, portal, mocker):
        refresh_mock = mocker.patch.object(portal, "refresh")
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        assert response.code == 200
        refresh_mock.assert_not_called()

    @pytest.mark.gen_test()
    def test_get_portals_returns_empty_feature_configuration(
        self, http_client, base_url, mock_portal_config,
    ):
        mock_portal_config({
            "editable": False,
            "feature_toggles": {},
        })
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data["feature_toggles"] == {}

    @pytest.mark.gen_test()
    def test_get_portals_returns_feature_configuration(
            self, http_client, base_url, mock_portal_config):
        mock_portal_config({
            "editable": False,
            "feature_toggles": {
                "notifications_api": False,
            },
        })
        mock_portal_config({"test": "value"})
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data["feature_toggles"] == {"notifications_api": False}

    @pytest.mark.gen_test()
    def test_get_portals_returns_links(
            self, portal_link_list, http_client, base_url, stub_portal_cache):
        entry_dn = f"cn={portal_link_list.portal_attr},dc=test"
        stub_portal_cache.stub_add_entry(entry_dn, in_link_lists=[portal_link_list.portal_attr])
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data[portal_link_list.portal_attr] == [entry_dn]


class TestPortalEntriesHandlerNoPortal:

    @pytest.fixture()
    def app(self) -> tornado.web.Application:
        return tornado.web.Application(build_routes({}, mock.Mock()))

    @pytest.mark.gen_test()
    async def test_no_portals(self, http_client, base_url):
        response = await http_client.fetch(f"{base_url}/_/portal.json", raise_error=False)
        assert response.code == 404


# NOTE: Ensure coverage of the UMCPortal class being used as a configured
# portal via "portals.json". Compare the CLI script "univention-portal" which
# allows to generate the configuration for this.
class TestPortalEntriesHandlerWithUmcPortal:

    @pytest.fixture()
    def app(self, portal_umc):
        routes = build_routes({"default": portal_umc}, mock.Mock())
        return tornado.web.Application(routes)

    @pytest.mark.gen_test()
    def test_get_portal_json(
        self, http_client, base_url, umc_categories_data, umc_modules_data, mocker,
    ):
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body.decode())

        assert response.code == 200
        assert len(data["entries"]) == len(umc_modules_data)
        # NOTE: There is always a category "Favorites" injected
        assert len(data["categories"]) == len(umc_categories_data) + 1
