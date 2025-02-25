# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

import pytest
import tornado

from univention.portal.main import build_routes


@pytest.fixture()
def app(portal_mock):
    routes = build_routes({
        "default": portal_mock,
    })
    return tornado.web.Application(routes)


@pytest.fixture()
def api_base_url(base_url):
    """The base URL for the API endpoints."""
    return f"{base_url}/portal-slug/api/v1"


@pytest.mark.gen_test()
async def test_unauthenticated_user_returns_empty_dict(http_client, api_base_url):
    response = await http_client.fetch(f"{api_base_url}/me")
    data = json.loads(response.body)
    assert data == {}
