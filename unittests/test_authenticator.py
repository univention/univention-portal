#!/usr/bin/python3
#
# Univention Portal
#
# Copyright 2020 Univention GmbH
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

import pytest
import requests
from univentionunittests import import_module


@pytest.fixture
def user_module(request):
	use_installed = request.config.getoption('--installed-portal')
	return import_module('univention.portal.user', 'python/', 'univention.portal.user', use_installed=use_installed)


def test_imports(dynamic_class):
	assert dynamic_class('Authenticator')
	assert dynamic_class('OpenIDAuthenticator')
	assert dynamic_class('UMCAuthenticator')


class TestUMCAuthenticator:
	_umc_session_url = "umc_session_url"
	_portal_cookie_name = "portal_cookie_name"
	_umc_cookie_name = "umc_cookie_name"
	_default_cookie_name = "UMCSessionId"
	_username = "TestUser"
	_groups = ["TestGroup"]


	@pytest.fixture
	def mocked_authenticator(self, dynamic_class, patch_object_module, mocker):
		Authenticator = dynamic_class('UMCAuthenticator')
		mocked_group_cache = mocker.Mock()
		mocked_group_cache.get.return_value = {self._username: self._groups}
		authenticator = Authenticator(self._umc_session_url, mocked_group_cache, self._portal_cookie_name, self._umc_cookie_name)
		authenticator.requests_get = patch_object_module(authenticator, "requests.get")
		return authenticator


	def test_default_init(self, dynamic_class):
		Authenticator = dynamic_class('UMCAuthenticator')
		default_authenticator = Authenticator(self._umc_session_url, group_cache={})
		assert default_authenticator.umc_session_url == self._umc_session_url
		assert default_authenticator.group_cache == {}
		assert default_authenticator.portal_cookie_name == self._default_cookie_name
		assert default_authenticator.umc_cookie_name == self._default_cookie_name


	def test_refresh(self, mocked_authenticator, mocker):
		mocked_authenticator.refresh("reason")
		mocked_authenticator.group_cache.refresh.assert_called_once_with(reason="reason")


	def test_get_existing_user(self, mocked_authenticator, mocker, user_module):
		# Set up
		cookie = "session_cookie"
		request_mock = mocker.Mock()
		request_mock.get_cookie.return_value = cookie
		mocked_authenticator._get_username = mocker.Mock(return_value=self._username)
		# Execute
		user = mocked_authenticator.get_user(request_mock)
		request_mock.get_cookie.assert_called_once_with(self._portal_cookie_name)
		mocked_authenticator._get_username.assert_called_once_with(cookie)
		assert isinstance(user, user_module.User)
		assert user.username == self._username
		assert user.groups == self._groups


	def test_get_non_existing_user(self, mocked_authenticator, mocker, user_module):
		# Set up
		cookie = "session_cookie"
		request_mock = mocker.Mock()
		request_mock.get_cookie.return_value = cookie
		mocked_authenticator._get_username = mocker.Mock(return_value=None)
		# Execute
		user = mocked_authenticator.get_user(request_mock)
		request_mock.get_cookie.assert_called_once_with(self._portal_cookie_name)
		mocked_authenticator._get_username.assert_called_once_with(cookie)
		assert isinstance(user, user_module.User)
		assert user.username == None
		assert user.groups == []


	def test_get_username(self, mocked_authenticator, mocker):
		mocked_authenticator._ask_umc = mocker.Mock()
		mocked_authenticator._ask_umc.return_value = self._username
		assert mocked_authenticator._get_username("test_session") == self._username.lower()
		assert mocked_authenticator._get_username(None) == None
		mocked_authenticator._ask_umc.return_value = None
		assert mocked_authenticator._get_username("test_session") == None


	def test_ask_umc_request_success(self, mocked_authenticator, mocker):

		def _side_effect(url, cookies={}):
			""" Side effect to simulate successful request with different response data """
			print("Making a request to '%s'" % url)
			response_mock = mocker.Mock()
			test_cookie = cookies.get(self._umc_cookie_name, "")
			response_mock.status_code = 200
			if test_cookie:
				response_mock.json.return_value = {
					'result': {
						'username': self._username
					}
				}
			else:
				response_mock.json.return_value = {}
			print("Received response with status 200")
			return response_mock

		mocked_authenticator.requests_get.side_effect = _side_effect
		test_session = "test_session"
		# Execute with valid session expecting username to be returned
		assert mocked_authenticator._ask_umc(test_session) == self._username
		mocked_authenticator.requests_get.assert_called_once_with(
			self._umc_session_url, 
			cookies={self._umc_cookie_name: test_session}
		)
		# Execute with unknown session expecting username to be None due to KeyError
		assert mocked_authenticator._ask_umc("") == None
		assert mocked_authenticator.requests_get.call_count == 2

	
	def test_ask_umc_request_error(self, mocked_authenticator, mocker):

		def _side_effect(url, cookies={}):
			""" Side effect to simulate request with a http error """
			print("Making a request to '%s'" % url)
			response_mock = mocker.Mock()
			response_mock.status_code = 404
			response_mock.json.side_effect = ValueError
			print("Received response with status 404")
			return response_mock

		mocked_authenticator.requests_get.side_effect = _side_effect
		test_session = "test_session"
		# Execute while expecting a catched internal ValueError
		assert mocked_authenticator._ask_umc(test_session) == None
		mocked_authenticator.requests_get.assert_called_once_with(
			self._umc_session_url,
			cookies={self._umc_cookie_name: test_session}
		)
		# Execute while expecting catched internal RequestException
		mocked_authenticator.requests_get.side_effect = [requests.exceptions.ConnectionError, requests.exceptions.MissingSchema]
		assert mocked_authenticator._ask_umc(test_session) == None
		assert mocked_authenticator._ask_umc(test_session) == None
		assert mocked_authenticator.requests_get.call_count == 3


class TestOpenIDAuthenticator:

	def test_default_init(self, dynamic_class):
		OpenIDAuthenticator = dynamic_class('OpenIDAuthenticator')
		default_openid_authenticator = OpenIDAuthenticator("authorization_endpoint", "client_id")
		assert default_openid_authenticator.authorization_endpoint == "authorization_endpoint"
		assert default_openid_authenticator.client_id == "client_id"
		assert default_openid_authenticator.portal_cookie_name == "UniventionPortalSessionId"
		assert default_openid_authenticator.sessions == {}
