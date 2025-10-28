#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import json
from unittest import mock

import pytest
import tornado


def test_imports(dynamic_class):
    assert dynamic_class("Authenticator")
    assert dynamic_class("UMCAuthenticator")


class TestUMCAuthenticator:
    _auth_mode = "ucs"
    _umc_session_url = "umc_session_url"
    _umc_cookie_name = "UMCSessionId"
    _username = "TestUser"
    _user_dn = "uid=TestUser,cn=users,dc=univention-organization,dc=intranet"
    _groups = ["TestGroup"]

    @pytest.fixture()
    def mocked_authenticator(self, dynamic_class, patch_object_module, mocker):
        Authenticator = dynamic_class("UMCAuthenticator")
        mocked_group_cache = mocker.Mock()
        mocked_group_cache.get.return_value = {self._username.lower(): self._groups}
        authenticator = Authenticator(self._auth_mode, self._umc_session_url, mocked_group_cache)
        authenticator.httpclient_fetch = patch_object_module(authenticator, "AsyncHTTPClient.fetch")
        return authenticator

    def test_default_init(self, dynamic_class):
        Authenticator = dynamic_class("UMCAuthenticator")
        default_authenticator = Authenticator(self._auth_mode, self._umc_session_url, group_cache={})
        assert default_authenticator.auth_mode == self._auth_mode
        assert default_authenticator.umc_session_url == self._umc_session_url
        assert default_authenticator.group_cache == {}

    def test_refresh(self, mocked_authenticator, mocker):
        mocked_authenticator.refresh("reason")
        mocked_authenticator.group_cache.refresh.assert_called_once_with(reason="reason")

    @pytest.mark.asyncio()
    async def test_get_existing_user(self, mocked_authenticator, mocker):
        from univention.portal import user as user_module

        cookie = "session_cookie"
        request_mock = mocker.Mock()
        cookie_mock = mocker.Mock()
        cookie_mock.value = cookie
        request_mock.cookies = {self._umc_cookie_name: cookie_mock}
        request_mock.request.headers = {}
        mocked_authenticator._get_username = mock.AsyncMock(return_value=(self._username.lower(), self._username, self._user_dn))

        user = await mocked_authenticator.get_user(request_mock)
        mocked_authenticator._get_username.assert_called_once_with({self._umc_cookie_name: cookie})
        assert isinstance(user, user_module.User)
        assert user.username == self._username.lower()
        assert user.groups == [x.lower() for x in self._groups]

    @pytest.mark.asyncio()
    async def test_get_non_existing_user(self, mocked_authenticator, mocker):
        from univention.portal import user as user_module

        cookie = "session_cookie"
        request_mock = mocker.Mock()
        cookie_mock = mocker.Mock()
        cookie_mock.value = cookie
        request_mock.cookies = {self._umc_cookie_name: cookie_mock}
        request_mock.request.headers = {}
        mocked_authenticator._get_username = mock.AsyncMock(return_value=(None, None, None))

        user = await mocked_authenticator.get_user(request_mock)
        mocked_authenticator._get_username.assert_called_once_with({self._umc_cookie_name: cookie})

        assert isinstance(user, user_module.User)
        assert user.is_anonymous()
        assert user.username is None
        assert user.groups == []

    @pytest.mark.asyncio()
    async def test_get_username(self, mocked_authenticator, mocker):
        mocked_authenticator._ask_umc = mock.AsyncMock(return_value=(self._username, self._user_dn))
        assert await mocked_authenticator._get_username({self._umc_cookie_name: "test_session"}) == (self._username.lower(), self._username, self._user_dn)
        assert await mocked_authenticator._get_username({}) == (None, None, None)

        mocked_authenticator._ask_umc.return_value = (None, None)
        assert await mocked_authenticator._get_username({self._umc_cookie_name: "test_session"}) == (None, None, None)

        mocked_authenticator._ask_umc.return_value = (self._username, self._user_dn)
        umc_cookie_name = f"{self._umc_cookie_name}-1234"
        assert await mocked_authenticator._get_username({umc_cookie_name: "test_session"}) == (self._username.lower(), self._username, self._user_dn)

    @pytest.mark.asyncio()
    async def test_ask_umc_request_success(self, mocked_authenticator, mocker):
        async def _side_effect(req):
            """Side effect to simulate successful request with different response data"""
            print("Making a request to '%s'" % req.url)
            response_mock = mocker.Mock()
            test_cookie = req.headers.get('Cookie', '').split(',')
            test_cookie = [c.strip().split('=') for c in test_cookie]
            test_cookie = {k.strip(): v.strip() for k, v in test_cookie}.get(self._umc_cookie_name, "")
            if test_cookie:
                response_mock.body = json.dumps({"result": {"username": self._username, "user_dn": self._user_dn}}).encode()
            else:
                response_mock.body = b'{}'
            print("Received response with status 200")
            return response_mock

        mocked_authenticator.httpclient_fetch.side_effect = _side_effect
        test_session = {self._umc_cookie_name: "test_session"}

        # Execute with valid session expecting username to be returned
        assert await mocked_authenticator._ask_umc(test_session, {}) == (self._username, self._user_dn)
        assert mocked_authenticator.httpclient_fetch.call_count == 1

        # Execute with unknown session expecting username to be None due to KeyError
        assert await mocked_authenticator._ask_umc({self._umc_cookie_name: ""}, {}) == (None, None)
        assert mocked_authenticator.httpclient_fetch.call_count == 2

    @pytest.mark.asyncio()
    async def test_ask_umc_request_error(self, mocked_authenticator, mocker):
        async def _side_effect(req):
            """Side effect to simulate request with a http error"""
            print("Making a request to '%s'" % req.url)
            response_mock = mocker.Mock()
            response_mock.status_code = 404
            response_mock.body.decode.return_value = b'X'
            print("Received response with status 404")
            return response_mock

        mocked_authenticator.httpclient_fetch.side_effect = _side_effect
        test_session = {self._umc_cookie_name: "test_session"}
        # Execute while expecting a catched internal ValueError
        assert await mocked_authenticator._ask_umc(test_session, {}) == (None, None)
        assert mocked_authenticator.httpclient_fetch.call_count == 1
        # Execute while expecting catched internal RequestException
        mocked_authenticator.httpclient_fetch.side_effect = [tornado.httpclient.HTTPError(404), IOError]
        assert await mocked_authenticator._ask_umc(test_session, {}) == (None, None)
        assert await mocked_authenticator._ask_umc(test_session, {}) == (None, None)
        assert mocked_authenticator.httpclient_fetch.call_count == 3
