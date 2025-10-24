# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
from unittest import mock

import pytest
from tornado.httpclient import HTTPClientError

from univention.portal.udm import AsyncUdmClient, UnexpectedResult


@pytest.fixture()
def udm_user_stub():
    return {
        "id": "stub-id",
    }


@pytest.fixture()
def AsyncHTTPClient_stub(udm_user_stub):
    stub = mock.Mock()
    stub().fetch = mock.AsyncMock()
    response = mock.Mock()
    response.body = json.dumps(udm_user_stub)
    stub().fetch.return_value = response
    return stub


@pytest.fixture(autouse=True)
def mock_http_client(AsyncHTTPClient_stub, mocker):
    mocker.patch("univention.portal.udm.AsyncHTTPClient", AsyncHTTPClient_stub)
    return AsyncHTTPClient_stub


@pytest.mark.asyncio()
async def test_get_user_returns_udm_object(udm_user_stub):
    udm_client = AsyncUdmClient("stub_url", "stub_user", "stub_password")
    data = await udm_client.get_user("user_dn")
    assert data == udm_user_stub


@pytest.mark.asyncio()
@pytest.mark.parametrize("results_count", [0, 2])
async def test_get_user_ensures_exactly_one_result(mocker, udm_user_stub, results_count):
    udm_client = AsyncUdmClient("stub_url", "stub_user", "stub_password")
    fetch_from_udm_mock = mocker.patch.object(udm_client, "_fetch_from_udm")
    fetch_from_udm_mock.return_value = {
        "results": results_count,
        "_embedded": {
            "udm:object": [udm_user_stub] * results_count,
        },
    }
    with pytest.raises(UnexpectedResult):
        await udm_client.get_user("username")


@pytest.mark.asyncio()
@pytest.mark.parametrize("response_error, ExpectedException", [
    (HTTPClientError(code=404, message="Not Found"), UnexpectedResult),
    (HTTPClientError(code=500, message="Server Error"), UnexpectedResult),
])
async def test_get_user_ensures_valid_response(
    mock_http_client, response_error, ExpectedException,
):
    mock_http_client().fetch = mock.AsyncMock(side_effect=response_error)
    udm_client = AsyncUdmClient("stub_url", "stub_user", "stub_password")
    with pytest.raises(ExpectedException):
        await udm_client.get_user("user_dn")


@pytest.mark.asyncio()
@pytest.mark.parametrize("response_body, ExpectedException", [
    ("invalid", json.JSONDecodeError),
    ("<html><div>stub result</div></html>", json.JSONDecodeError),
])
async def test_get_user_raises_on_unexpected_response(
    mock_http_client, response_body, ExpectedException,
):
    (await mock_http_client().fetch()).body = response_body
    udm_client = AsyncUdmClient("stub_url", "stub_user", "stub_password")
    with pytest.raises(ExpectedException):
        await udm_client.get_user("user_dn")


@pytest.mark.asyncio()
@pytest.mark.parametrize("user_dn, ExpectedException", [
    ("", ValueError),
    (None, ValueError),
])
async def test_get_user_validates_user_dn(
    mock_http_client, user_dn, ExpectedException,
):
    udm_client = AsyncUdmClient("stub_url", "stub_user", "stub_password")
    with pytest.raises(ExpectedException):
        await udm_client.get_user(user_dn)


@pytest.mark.asyncio()
async def test_fetch_from_udm_requsets_user_data(mock_http_client):
    udm_client = AsyncUdmClient("stub_url/", "stub_user", "stub_password")
    await udm_client._fetch_from_udm("stub_udm_query")
    mock_http_client().fetch.assert_called_with(
        "stub_url/stub_udm_query",
        auth_username="stub_user",
        auth_password="stub_password",
        headers={"accept": "application/json"},
    )


@pytest.mark.asyncio()
@pytest.mark.parametrize("udm_api_url, expected_url", [
    ("", "/stub_udm_query"),
    ("/", "/stub_udm_query"),
    ("stub_url", "stub_url/stub_udm_query"),
    ("stub_url/", "stub_url/stub_udm_query"),
    ("/stub_url", "/stub_url/stub_udm_query"),
    ("/stub_url/", "/stub_url/stub_udm_query"),
])
async def test_async_udm_client_ensures_trailing_slash(mock_http_client, udm_api_url, expected_url):
    udm_client = AsyncUdmClient(udm_api_url, "stub_user", "stub_password")
    url = udm_client._build_full_url("stub_udm_query")
    assert url == expected_url
