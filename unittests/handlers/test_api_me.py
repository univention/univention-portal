# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
from unittest import mock

import pytest
import tornado

from univention.portal.main import build_routes


@pytest.fixture()
def udm_client_stub():
    """
    Stub for the `AsyncUdmClient` which returns stub user data.

    The return value can be changed by setting
    `udm_client_stub.get_user.return_value` to a new value.
    """
    result = mock.Mock()
    result.get_user = mock.AsyncMock()
    result.get_user.return_value = {
        "id": "stub-id",
        "dn": "stub-dn",
        "uuid": "stub-uuid",
        "properties": {
            "username": "stub-username",
        },
    }
    return result


@pytest.fixture()
def app(portal, udm_client_stub):
    routes = build_routes({"default": portal}, udm_client_stub)
    return tornado.web.Application(routes)


@pytest.fixture()
def api_base_url(base_url):
    """The base URL for the API endpoints."""
    return f"{base_url}/portal-slug/api/v1"


@pytest.mark.gen_test()
async def test_unauthenticated_user_returns_empty_dict(
    stub_authenticator, stub_user_anonymous, http_client, api_base_url,
):
    stub_authenticator.stub_user = stub_user_anonymous
    response = await http_client.fetch(f"{api_base_url}/me")
    data = json.loads(response.body)
    assert data == {}


@pytest.mark.gen_test()
async def test_authenticated_user_returns_user_data_from_udm(
    http_client, api_base_url, stub_user, udm_client_stub,
):
    response = await http_client.fetch(f"{api_base_url}/me")
    data = json.loads(response.body)
    udm_user_data = await udm_client_stub.get_user(stub_user.username)
    expected_data = {
        "id": udm_user_data["id"],
        "dn": udm_user_data["dn"],
        "uuid": udm_user_data["uuid"],
        "user": udm_user_data["properties"],
    }
    assert data == expected_data
