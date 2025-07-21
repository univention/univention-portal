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
from datetime import datetime, timedelta
from unittest import mock

import pytest

from univention.portal import user
from univention.portal.extensions.portal import Portal
from univention.portal.extensions.reloader import MtimeBasedLazyFileReloader


def test_imports(dynamic_class):
    assert dynamic_class("Portal")


class StubReloader(MtimeBasedLazyFileReloader):

    def __init__(self, portal_file):
        super().__init__(portal_file)
        self.content = {}

    def get_portal_cache_json(self) -> dict:
        with open(self._cache_file) as portal_cache:
            return json.load(portal_cache)

    def update_portal_cache(self, portal_data: dict):
        self.content = portal_data
        self.refresh("force")

    def _refresh(self):  # pragma: no cover
        content = json.dumps(self.content, sort_keys=True, indent=4)
        assets = []
        return (content, assets)


@pytest.fixture()
def mocked_user(mocker):
    user = mocker.Mock()
    user.username = "hindenkampp"
    user.display_name = "Hans Hindenkampp"
    user.groups = []
    user.headers = {}
    return user


@pytest.fixture()
def mocked_anonymous_user(mocker):
    user = mocker.Mock()
    user.username = None
    user.display_name = None
    user.groups = []
    user.headers = {}
    return user


@pytest.fixture()
def portal_file(get_file_path):
    return get_file_path("portal_cache.json")


@pytest.fixture()
def reloader(portal_file, mock_portal_config):
    mock_portal_config({"assets_root": "/stub_assets_root"})
    return StubReloader(portal_file=portal_file)


@pytest.fixture()
def portal_data(reloader):
    original_data = reloader.get_portal_cache_json()
    yield reloader
    reloader.update_portal_cache(original_data)


@pytest.fixture()
def standard_portal(dynamic_class, portal_file, reloader):
    scorer = dynamic_class("Scorer")()
    portal_cache = dynamic_class("PortalFileCache")(portal_file, reloader)
    authenticator = dynamic_class("UMCAuthenticator")("ucs", "session_url", "group_cache")
    return Portal(scorer, portal_cache, authenticator)


@pytest.mark.asyncio()
async def test_user(portal, mocker):
    get_user_mock = mocker.patch.object(portal.authenticator, "get_user")
    request = "request"
    await portal.get_user(request)
    get_user_mock.assert_called_once_with(request)


@pytest.mark.asyncio()
async def test_login(portal, mocker):
    login_user_mock = mocker.patch.object(portal.authenticator, "login_user")
    login_request_mock = mocker.patch.object(portal.authenticator, "login_request")
    request = "request"
    await portal.login_user(request)
    await portal.login_request(request)
    login_user_mock.assert_called_once_with(request)
    login_request_mock.assert_called_once_with(request)


def test_visible_content(mocked_user, standard_portal):
    content = standard_portal.get_visible_content(mocked_user, False)
    expected_content = {
        "category_dns": ["cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
        "entry_dns": ["cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
        "folder_dns": [],
        "announcement_dns": ["cn=Testannouncment,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet"],
    }
    assert content == expected_content


class TestLinkLists:

    def test_does_not_contain_other_entry_for_authenticated_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user)
        assert links == []

    def test_contains_visible_entry_for_authenticated_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
            in_link_lists=[portal_link_list.portal_attr],
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user)
        assert links == ["cn=test-entry,dc=test"]

    def test_hides_anonymous_entry_for_authenticated_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
            in_link_lists=[portal_link_list.portal_attr],
            anonymous=True,
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user)
        assert links == []

    def test_contains_visible_entry_for_anonymous_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user_anonymous,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
            in_link_lists=[portal_link_list.portal_attr],
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user_anonymous)
        assert links == ["cn=test-entry,dc=test"]

    def test_contains_anonymous_entry_for_anonymous_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user_anonymous,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
            in_link_lists=[portal_link_list.portal_attr],
            anonymous=True,
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user_anonymous)
        assert links == ["cn=test-entry,dc=test"]

    def test_does_not_contain_other_entry_for_anonymous_user(
        self, portal_link_list, portal, stub_portal_cache, stub_user,
    ):
        stub_portal_cache.stub_add_entry(
            dn="cn=test-entry,dc=test",
            anonymous=True,
        )
        links = _get_links_from_portal(portal, portal_link_list.portal_attr, stub_user)
        assert links == []


def _get_links_from_portal(portal, link_list, user):
    content = portal.get_visible_content(user, False)
    getter = getattr(portal, f"get_{link_list}")
    links = getter(content)
    return links


def test_portal_entries(mocked_user, standard_portal):
    content = standard_portal.get_visible_content(mocked_user, False)
    content = standard_portal.get_entries(content)
    expected_content = [
        {
            "activated": True,
            "allowedGroups": [],
            "anonymous": True,
            "description": {
                "de_DE": "Zeigt eine \xdcbersicht aller UCS Server in der Dom\xe4ne",
                "en_US": "Provide an overview of all UCS server in the domain",
                "fr_FR": "Vue d'ensemble de tous les serveurs UCS du domaine",
            },
            "dn": "cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
            "in_portal": True,
            "linkTarget": "useportaldefault",
            "links": ["/univention/server-overview/"],
            "icon_url": "/univention/portal/icons/entries/server-overview.svg",
            "name": {"de_DE": "Server\xfcbersicht", "en_US": "Server overview", "fr_FR": "Vue d'ensemble de serveurs"},
        },
        {
            "activated": True,
            "allowedGroups": [],
            "anonymous": True,
            "description": {
                "de_DE": "Univention Management Console zur Ver\xadwal\xadtung der UCS-Dom\xe4ne und des lokalen Systems",
                "en_US": "Univention Management Console for admin\xadis\xadtra\xadting the UCS domain and the local system",
                "fr_FR": "Console de gestion Univention pour admin\xadis\xadtrer le domaine UCS et le syst\xe8me local",
            },
            "dn": "cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
            "in_portal": True,
            "linkTarget": "useportaldefault",
            "links": ["/univention/management/"],
            "icon_url": "/univention/portal/icons/entries/umc-domain.svg",
            "name": {"de_DE": "System- und Dom\xe4neneinstellungen", "en_US": "System and domain settings", "fr_FR": "R\xe9glages du syst\xe8me et du domaine"},
        },
        {
            "activated": True,
            "allowedGroups": [
                "cn=g1,cn=groups,dc=intranet,dc=example,dc=de",
                "cn=g2,cn=groups,dc=intranet,dc=example,dc=de",
            ],
            "anonymous": True,
            "description": {
                "de_DE": "News, Tipps und Best Practices",
                "en_US": "News, tips and best practices",
                "fr_FR": "Nouvelles, conseils et bonne pratique",
            },
            "dn": "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
            "in_portal": True,
            "linkTarget": "newwindow",
            "links": [
                "https://www.univention.com/news/blog-en/",
            ],
            "icon_url": "/univention/portal/icons/entries/univentionblog.png",
            "name": {
                "de_DE": "Univention Blog",
                "en_US": "Univention Blog",
                "fr_FR": "Univention Blog",
            },
        },
    ]
    assert content == expected_content


def test_folders(mocked_user, standard_portal):
    content = standard_portal.get_visible_content(mocked_user, False)
    content = standard_portal.get_folders(content)
    expected_content = []
    assert content == expected_content


def test_categories(mocked_user, standard_portal):
    content = standard_portal.get_visible_content(mocked_user, False)
    content = standard_portal.get_categories(content)
    expected_content = [
        {
            "display_name": {"de_DE": "Verwaltung", "en_US": "Administration"},
            "dn": "cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
            "entries": ["cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
        },
    ]
    assert content == expected_content


def test_meta(mocked_user, standard_portal):
    content = standard_portal.get_visible_content(mocked_user, False)
    categories = standard_portal.get_categories(content)
    content = standard_portal.get_meta(content, categories)
    expected_content = {
        "anonymousEmpty": [],
        "autoLayoutCategories": False,
        "categories": ["cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
        "content": [
            [
                "cn=domain-admin,cn=category,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
                ["cn=umc-domain,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=server-overview,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de", "cn=univentionblog,cn=entry,cn=portals,cn=univention,dc=intranet,dc=example,dc=de"],
            ],
        ],
        "defaultLinkTarget": "embedded",
        "dn": "cn=domain,cn=portal,cn=portals,cn=univention,dc=intranet,dc=example,dc=de",
        "in_portal": True,
        "ensureLogin": False,
        "fontColor": "black",
        "logo": None,
        "name": {"de_DE": "Univention Portal", "en_US": "Univention Portal", "fr_FR": "Portail Univention"},
        "showApps": False,
    }
    assert content == expected_content


def test_refresh(portal, mocker):
    mocker.patch.object(portal.portal_cache, "refresh", return_value=None)
    mocker.patch.object(portal.authenticator, "refresh", return_value=None)
    assert portal.refresh() is None
    portal.portal_cache.refresh.assert_called_once()
    portal.authenticator.refresh.assert_called_once()


def test_score(portal, mocker):
    mocker.patch.object(portal.scorer, "score", return_value=5)
    request = mocker.Mock()
    assert portal.score(request) == 5
    portal.scorer.score.assert_called_once_with(request)


@pytest.mark.parametrize("umc_get_url", [
    "http://ucshost.test/univention/get",
    "http://ucshost.test/univention/get/",
])
def test_umc_portal_request_umc_get_uses_configured_url(
    umc_get_url, mocker, mock_portal_config,
):
    from univention.portal.extensions.portal import UMCPortal

    requests_post = mocker.patch('requests.post')
    mock_portal_config({"umc_get_url": umc_get_url})
    portal = UMCPortal(mock.Mock(), mock.Mock())
    portal._request_umc_get('stub_path', mock.Mock())

    requests_post.assert_called_with(
        "http://ucshost.test/univention/get/stub_path",
        json=mock.ANY, headers=mock.ANY)


def test_announcement(mocked_user, portal_data, standard_portal):
    input_announcement = {
        "allowedGroups": [],
        "dn": "cn=Testannouncment,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "visibleUntil": None,
        "isSticky": False,
        "message": {
            "de_DE": "Dies ist ein Testannouncement das für jeden User, d.h. auch ohne Login sichtbar sein sollte.",
            "en_US": "This is a test announcement that should be visible for all users, as no group restriction is set.",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": None,
        "title": {
            "de_DE": "Öffentliches Announcement",
            "en_US": "Public Announcement",
        },
    }
    input_announcements = {
        input_announcement["dn"]: input_announcement,
    }
    modifiable_data = portal_data.get_portal_cache_json()
    modifiable_data["announcements"] = input_announcements

    portal_data.update_portal_cache(modifiable_data)
    content = standard_portal.get_visible_content(mocked_user, False)
    result_announcements = standard_portal.get_announcements(content)

    assert input_announcement["dn"] in content["announcement_dns"]
    assert len(content["announcement_dns"]) == 1
    assert input_announcement in result_announcements
    assert len(result_announcements) == 1


def test_announcements(mocked_user, portal_data, standard_portal):
    past_announcement = {
        "allowedGroups": [],
        "dn": "cn=Testannouncment1,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": (datetime.now() - timedelta(minutes=2)).isoformat(),
        "visibleUntil": (datetime.now() - timedelta(minutes=1)).isoformat(),
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    present_announcement = {
        "allowedGroups": [],
        "dn": "cn=Testannouncment2,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": (datetime.now() - timedelta(minutes=2)).isoformat(),
        "visibleUntil": (datetime.now() + timedelta(minutes=2)).isoformat(),
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    future_announcement = {
        "allowedGroups": [],
        "dn": "cn=Testannouncment3,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": (datetime.now() + timedelta(minutes=1)).isoformat(),
        "visibleUntil": (datetime.now() + timedelta(minutes=2)).isoformat(),
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    input_announcements = {
        past_announcement["dn"]: past_announcement,
        present_announcement["dn"]: present_announcement,
        future_announcement["dn"]: future_announcement,
    }
    modifiable_data = portal_data.get_portal_cache_json()
    modifiable_data['announcements'] = input_announcements

    portal_data.update_portal_cache(modifiable_data)
    content = standard_portal.get_visible_content(mocked_user, False)
    result_announcements = standard_portal.get_announcements(content)

    assert present_announcement["dn"] in content["announcement_dns"]
    assert len(content["announcement_dns"]) == 1
    assert present_announcement in result_announcements
    assert len(result_announcements) == 1


def test_announcement_groups(portal_data, standard_portal):

    test_user = user.User(
        username="hindenkampp",
        display_name="Hans Hindenkampp",
        groups=["public_society"],
        headers={})

    visible_announcement_1 = {
        "allowedGroups": [],
        "dn": "cn=Testannouncment1,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": None,
        "visibleUntil": None,
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    visible_announcement_2 = {
        "allowedGroups": ["public_society"],
        "dn": "cn=Testannouncment2,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": None,
        "visibleUntil": None,
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    invisible_announcement = {
        "allowedGroups": ["secret_society"],
        "dn": "cn=Testannouncment3,cn=announcement,cn=portals,cn=univention,dc=some-testenv,dc=intranet",
        "isSticky": False,
        "message": {
            "de_DE": "Testannouncement",
        },
        "name": "Testannouncment",
        "needsConfirmation": False,
        "severity": "info",
        "visibleFrom": None,
        "visibleUntil": None,
        "title": {
            "de_DE": "Öffentliches Announcement",
        },
    }
    input_announcements = {
        visible_announcement_1["dn"]: visible_announcement_1,
        visible_announcement_2["dn"]: visible_announcement_2,
        invisible_announcement["dn"]: invisible_announcement,
    }
    modifiable_data = portal_data.get_portal_cache_json()
    modifiable_data['announcements'] = input_announcements

    portal_data.update_portal_cache(modifiable_data)
    content = standard_portal.get_visible_content(test_user, False)
    result_announcements = standard_portal.get_announcements(content)

    assert visible_announcement_1["dn"] in content['announcement_dns']
    assert visible_announcement_2["dn"] in content['announcement_dns']
    assert invisible_announcement["dn"] not in content['announcement_dns']
    assert len(content["announcement_dns"]) == 2

    assert visible_announcement_1 in result_announcements
    assert visible_announcement_2 in result_announcements
    assert invisible_announcement not in result_announcements
    assert len(result_announcements) == 2


def test_get_feature_toggles_is_empty_by_default(standard_portal, mock_portal_config):
    mock_portal_config({})
    features = standard_portal.get_feature_toggles()
    assert features == {}


def test_get_feature_toggles_returns_configured_values(standard_portal, mock_portal_config):
    mock_portal_config({
        "feature_toggles": {
            "notifications_api": True,
        },
    })
    features = standard_portal.get_feature_toggles()
    assert features == {"notifications_api": True}


def test_get_newsfeed_config_is_empty_by_default(standard_portal, mock_portal_config):
    newsfeed_config = standard_portal.get_newsfeed_config()
    assert newsfeed_config == {}


def test_get_newsfeed_config_returns_configured_values(standard_portal, mock_portal_config):
    stub_newsfeed_config = {
        "feedType": "stub feed type",
        "feedUrl": {
            "de_DE": "https://blog.test/feed-de-DE/",
            "en_US": "https://blog.test/feed-en-EN/",
        },
        "homeUrl": {
            "de_DE": "https://blog.test/news-de-DE/",
            "en_US": "https://en.blog.test/",
        },
        "icsSilentLoginUrl": "https://ics.internal.test",
    }
    mock_portal_config({
        "newsfeed_config": stub_newsfeed_config,
    })
    newsfeed_config = standard_portal.get_newsfeed_config()
    assert newsfeed_config == stub_newsfeed_config
