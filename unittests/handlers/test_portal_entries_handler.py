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

from stubs import StubPortalCache
from univention.portal.extensions.cache_object_storage import PortalFileCacheObjectStorage
from univention.portal.main import build_routes


class StubPortalCacheObjectStorage(StubPortalCache, PortalFileCacheObjectStorage):
    """Specialized stub class which will pass the `isinstance` check in the handler."""


@pytest.fixture
def stub_portal_cache_object_storage(faker):
    return StubPortalCacheObjectStorage(faker)


class TestPortalEntriesHandlerNoHttpCache:

    @pytest.fixture
    def app(self, portal):
        routes = build_routes({"default": portal}, mock.Mock())
        return tornado.web.Application(routes)

    @pytest.mark.gen_test
    def test_get_portals_json_standard(self, http_client, base_url, portal, mocker):
        refresh_mock = mocker.patch.object(portal, "refresh")
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        assert response.code == 200
        refresh_mock.assert_not_called()

    @pytest.mark.gen_test
    def test_calls_refresh_on_object_storage_cache(
        self, http_client, base_url, portal, mocker, stub_portal_cache_object_storage,
    ):
        portal.portal_cache = stub_portal_cache_object_storage
        refresh_mock = mocker.patch.object(portal, "refresh")
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        assert response.code == 200
        refresh_mock.assert_called_once()

    @pytest.mark.gen_test
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

    @pytest.mark.gen_test
    def test_get_portals_returns_feature_configuration(
            self, http_client, base_url, mock_portal_config):
        mock_portal_config({
            "editable": False,
            "feature_toggles": {
                "notifications_api": False,
            },
        })
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data["feature_toggles"] == {"notifications_api": False}

    @pytest.mark.gen_test
    def test_get_portals_returns_empty_newsfeed_configuration(
        self, http_client, base_url, mock_portal_config,
    ):
        mock_portal_config({
            "editable": False,
            "newsfeed_config": {},
        })
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data["newsfeed_config"] == {}

    @pytest.mark.gen_test
    def test_get_portals_returns_newsfeed_configuration(
            self, http_client, base_url, mock_portal_config):
        mock_portal_config({
            "editable": False,
            "newsfeed_config": {
                "stub": "value",
            },
        })
        mock_portal_config({"test": "value"})
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data["newsfeed_config"] == {"stub": "value"}

    @pytest.mark.gen_test
    def test_get_portals_returns_links(
            self, portal_link_list, http_client, base_url, stub_portal_cache):
        entry_dn = f"cn={portal_link_list.portal_attr},dc=test"
        stub_portal_cache.stub_add_entry(entry_dn, in_link_lists=[portal_link_list.portal_attr])
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body)
        assert data[portal_link_list.portal_attr] == [entry_dn]


class TestPortalEntriesHandlerObjectStorageCache:

    @pytest.fixture
    def portal(self):
        portal = mock.Mock(spec=["refresh", "score"])
        portal.score.return_value = 0.5
        return portal

    @pytest.fixture
    def app(self, portal):
        routes = build_routes({"default": portal}, mock.Mock())
        return tornado.web.Application(routes)

    @pytest.mark.gen_test
    def test_calls_refresh_on_object_storage_cache_before_usage(
        self, http_client, base_url, portal, mocker, stub_portal_cache_object_storage,
    ):
        # TODO: We depend on the calls being made in the correct order if the
        # object storage cache backend is used.
        #
        # Long-term the code will have to be refactored, so that the implicit
        # refresh handling is in line with the file based implementation of the
        # cache. Then this test and the call to "portal.refresh" in the entries
        # handler can be removed.
        portal.portal_cache = stub_portal_cache_object_storage
        response = yield http_client.fetch(f"{base_url}/_/portal.json", raise_error=False)
        assert response.code == 500
        portal.refresh.assert_called_once()


class TestPortalEntriesHandlerNoPortal:

    @pytest.fixture
    def app(self) -> tornado.web.Application:
        return tornado.web.Application(build_routes({}, mock.Mock()))

    @pytest.mark.gen_test
    async def test_no_portals(self, http_client, base_url):
        response = await http_client.fetch(f"{base_url}/_/portal.json", raise_error=False)
        assert response.code == 404


# NOTE: Ensure coverage of the UMCPortal class being used as a configured
# portal via "portals.json". Compare the CLI script "univention-portal" which
# allows to generate the configuration for this.
class TestPortalEntriesHandlerWithUmcPortal:

    @pytest.fixture
    def app(self, portal_umc):
        routes = build_routes({"default": portal_umc}, mock.Mock())
        return tornado.web.Application(routes)

    @pytest.mark.gen_test
    def test_get_portal_json(
        self, http_client, base_url, umc_categories_data, umc_modules_data, mocker,
    ):
        response = yield http_client.fetch(f"{base_url}/_/portal.json")
        data = json.loads(response.body.decode())

        assert response.code == 200
        assert len(data["entries"]) == len(umc_modules_data)
        # NOTE: There is always a category "Favorites" injected
        assert len(data["categories"]) == len(umc_categories_data) + 1
