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

import asyncio
from copy import deepcopy
import json
import tempfile
import pytest

from python.univention.portal.extensions.reloader import MtimeBasedLazyFileReloader
from python.univention.portal.extensions.portal import Portal


def test_imports(dynamic_class):
	assert dynamic_class("Portal")

class TestReloader(MtimeBasedLazyFileReloader):

	def __init__(self, portal_file):
		super().__init__(portal_file) 
		self.content = {}

	def get_portal_cache_json(self) -> dict:
		with open(self._cache_file, "r") as portal_cache:
			return json.load(portal_cache)

	def update_portal_cache(self, portal_data: dict):
		self.content = portal_data
		self.refresh("force")

	def _refresh(self):  # pragma: no cover
		with tempfile.NamedTemporaryFile(mode="w", delete=False) as fd:
			json.dump(self.content, fd, sort_keys=True, indent=4)
		return fd


class TestPortal:
	@pytest.fixture
	def mocked_user(self, mocker):
		user = mocker.Mock()
		user.username = "hindenkampp"
		user.display_name = "Hans Hindenkampp"
		user.groups = []
		user.headers = {}
		return user

	@pytest.fixture
	def mocked_anonymous_user(self, mocker):
		user = mocker.Mock()
		user.username = None
		user.display_name = None
		user.groups = []
		user.headers = {}
		return user

	@pytest.fixture
	def portal_file(self, get_file_path):
		return get_file_path("portal_cache.json")

	@pytest.fixture
	def reloader(self, portal_file):
		return TestReloader(portal_file=portal_file)

	@pytest.fixture
	def portal_data(self, reloader):
		original_data = reloader.get_portal_cache_json()
		yield reloader
		reloader.update_portal_cache(original_data)

	@pytest.fixture
	def standard_portal(self, dynamic_class, mocker, portal_file, reloader):
		# Portal = dynamic_class("Portal")
		scorer = dynamic_class("Scorer")()
		portal_cache = dynamic_class("PortalFileCache")(portal_file, reloader)
		authenticator = dynamic_class("UMCAuthenticator")("ucs", "session_url", "group_cache")
		return Portal(scorer, portal_cache, authenticator)

	@pytest.fixture
	def mocked_portal(self, dynamic_class, mocker):
		async def async_magic():
			return

		Portal = dynamic_class("Portal")
		scorer = mocker.Mock()
		portal_cache = mocker.Mock()
		authenticator = mocker.Mock()
		mocker.MagicMock.__await__ = lambda x: async_magic().__await__()
		authenticator.get_user = mocker.MagicMock()
		authenticator.login_user = mocker.MagicMock()
		authenticator.login_request = mocker.MagicMock()
		return Portal(scorer, portal_cache, authenticator)

	def test_user(self, mocked_portal, mocker):
		request = "request"
		loop = asyncio.get_event_loop()
		loop.run_until_complete(mocked_portal.get_user(request))
		mocked_portal.authenticator.get_user.assert_called_once_with(request)

	def test_login(self, mocked_portal, mocker):
		request = "request"
		loop = asyncio.get_event_loop()
		loop.run_until_complete(mocked_portal.login_user(request))
		loop.run_until_complete(mocked_portal.login_request(request))
		mocked_portal.authenticator.login_user.assert_called_once_with(request)
		mocked_portal.authenticator.login_request.assert_called_once_with(request)

	def test_visible_content(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		expected_content = {
			"category_dns": ["cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
			"entry_dns": ["cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
			"folder_dns": [],
			"announcements": [
				{
					"announcement": {
						"name": "",
						"flags": [
							"sticky"
						],
						"severity": "info",
						"title": "",
						"message": "",
						"startTime": "",
						"endTime": ""
					}
				}
			]
		}
		assert content == expected_content

	def test_user_links(self, mocked_user, mocked_anonymous_user, standard_portal):
		content_with_user = standard_portal.get_visible_content(mocked_user, False)
		content_no_user = standard_portal.get_visible_content(mocked_anonymous_user, False)
		content_with_user = standard_portal.get_user_links(content_with_user)
		content_no_user = standard_portal.get_user_links(content_no_user)
		expected_content = []
		assert content_no_user == expected_content
		assert content_with_user == expected_content

	def test_menu_links(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		content = standard_portal.get_menu_links(content)
		expected_content = []
		assert content == expected_content

	def test_portal_entries(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		content = standard_portal.get_entries(content)
		expected_content = [
			{
				"activated": True,
				"allowedGroups": [],
				"anonymous": True,
				"description": {
					"de_DE": u"Zeigt eine \xdcbersicht aller UCS Server in der Dom\xe4ne",
					"en_US": u"Provide an overview of all UCS server in the domain",
					"fr_FR": u"Vue d'ensemble de tous les serveurs UCS du domaine",
				},
				"dn": "cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
				"in_portal": True,
				"linkTarget": "useportaldefault",
				"links": ["/univention/server-overview/"],
				"logo_name": "/univention/portal/icons/entries/server-overview.svg",
				"name": {"de_DE": u"Server\xfcbersicht", "en_US": u"Server overview", "fr_FR": u"Vue d'ensemble de serveurs"},
			},
			{
				"activated": True,
				"allowedGroups": [],
				"anonymous": True,
				"description": {
					"de_DE": u"Univention Management Console zur Ver\xadwal\xadtung der UCS-Dom\xe4ne und des lokalen Systems",
					"en_US": u"Univention Management Console for admin\xadis\xadtra\xadting the UCS domain and the local system",
					"fr_FR": u"Console de gestion Univention pour admin\xadis\xadtrer le domaine UCS et le syst\xe8me local",
				},
				"dn": "cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
				"in_portal": True,
				"linkTarget": "useportaldefault",
				"links": ["/univention/management/"],
				"logo_name": "/univention/portal/icons/entries/umc-domain.svg",
				"name": {"de_DE": u"System- und Dom\xe4neneinstellungen", "en_US": u"System and domain settings", "fr_FR": u"R\xe9glages du syst\xe8me et du domaine"},
			},
			{
				"activated": True,
				"allowedGroups": [
					"cn=g1,cn=groups,dc=intranet,dc=example,dc=de",
					"cn=g2,cn=groups,dc=intranet,dc=example,dc=de"
				],
				"anonymous": True,
				"description": {
					"de_DE": "News, Tipps und Best Practices",
					"en_US": "News, tips and best practices",
					"fr_FR": "Nouvelles, conseils et bonne pratique"
				},
				"dn": "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
				"in_portal": True,
				"linkTarget": "newwindow",
				"links": [
					"https://www.univention.com/news/blog-en/"
				],
				"logo_name": "/univention/portal/icons/entries/univentionblog.png",
				"name": {
					"de_DE": "Univention Blog",
					"en_US": "Univention Blog",
					"fr_FR": "Univention Blog"
				}
			},
		]
		assert content == expected_content

	def test_folders(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		content = standard_portal.get_folders(content)
		expected_content = []
		assert content == expected_content

	def test_categories(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		content = standard_portal.get_categories(content)
		expected_content = [
			{
				"display_name": {"de_DE": u"Verwaltung", "en_US": u"Administration"},
				"dn": u"cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
				"entries": ["cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", u"cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
			},
		]
		assert content == expected_content

	def test_meta(self, mocked_user, standard_portal):
		content = standard_portal.get_visible_content(mocked_user, False)
		categories = standard_portal.get_categories(content)
		content = standard_portal.get_meta(content, categories)
		expected_content = {
			"anonymousEmpty": [],
			"autoLayoutCategories": False,
			"categories": [u"cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
			"content": [
				[
					u"cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
					[u"cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", u"cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", u"cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
				]
			],
			"defaultLinkTarget": u"embedded",
			"dn": u"cn=domain,cn=portal,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
			"in_portal": True,
			"ensureLogin": False,
			"fontColor": u"black",
			"logo": None,
			"name": {u"de_DE": u"Univention Portal", u"en_US": u"Univention Portal", u"fr_FR": u"Portail Univention"},
			"showApps": False,
		}
		assert content == expected_content

	def test_refresh(self, mocked_portal, mocker):
		mocked_portal.portal_cache.refresh = mocker.Mock(return_value=None)
		mocked_portal.authenticator.refresh = mocker.Mock(return_value=None)
		assert mocked_portal.refresh() is None
		mocked_portal.portal_cache.refresh.assert_called_once()
		mocked_portal.authenticator.refresh.assert_called_once()

	def test_score(self, mocked_portal, mocker):
		mocked_portal.scorer.score = mocker.Mock(return_value=5)
		request = mocker.Mock()
		assert mocked_portal.score(request) == 5
		mocked_portal.scorer.score.assert_called_once()
		mocked_portal.scorer.score.assert_called_with(request)

	def test_announcement(self, mocked_user, portal_data, standard_portal):
		input_announcement = {
			"allowedGroups": [],
			"dn": "cn=Testannouncment,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
			"endTime": None,
			"isSticky": False,
			"message": {
				"de_DE": "Dies ist ein Testannouncement das für jeden User, d.h. auch ohne Login sichtbar sein sollte.",
				"en_US": "This is a test announcement that should be visible for all users, as no group restriction is set."
			},
			"name": "Testannouncment",
			"needsConfirmation": False,
			"severity": "info",
			"startTime": None,
			"title": {
				"de_DE": "Öffentliches Announcement",
				"en_US": "Public Announcement"
			}
		}
		input_announcements = {}
		input_announcements["cn=Testannouncment,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet"] = input_announcement
		modifiable_data = portal_data.get_portal_cache_json()
		modifiable_data['announcements'] = input_announcements

		portal_data.update_portal_cache(modifiable_data)
		content = standard_portal.get_visible_content(mocked_user, False)

		output_announcements = standard_portal.get_announcements(content)
		assert output_announcements == input_announcements

	def test_announcements(self, mocked_user, portal_data, standard_portal):
		past_announcement = {}
		present_announcement = {}
		future_announcement = {}
		input_announcements = [
			past_announcement,
			present_announcement,
			future_announcement
   		]
		modifiable_data = portal_data.get_portal_cache_json()
		modifiable_data['announcements'] = input_announcements

		portal_data.update_portal_cache(modifiable_data)
		content = standard_portal.get_visible_content(mocked_user, False)

		output_announcements = standard_portal.get_announcements(content)
		assert output_announcements == input_announcements

