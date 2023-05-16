import pytest
from unittest import mock

import stub_udm_client
from univention.portal.extensions import reloader


stub_url = "http://stub_user:stub_password@stub_host.test/stub_path/file.json"
stub_portal_dn = "cn=domain,cn=portal,cn=test"


@pytest.fixture()
def http_reloader():
    """An instance of HttpReloader."""
    instance = reloader.HttpReloader(stub_url)
    instance._content_fetcher = mock.Mock()
    return instance


@pytest.fixture()
def http_portal_reloader(mocker, mock_portal_config):
    """An instance of HttpPortalReloader."""
    mock_portal_config({"assets_root": "http://stub-host/"})
    instance = reloader.HttpPortalReloader(stub_url, stub_portal_dn)
    return instance


@pytest.mark.parametrize("url", [
    "http://stub-host.test/stub-path/file",
    "http://stub_user:stub_pass@stub-host.test/stub-path/file",
    "https://stub-host.test/stub-path/file",
    "https://stub_user:stub_pass@stub-host.test/stub-path/file",
])
def test_http_reloader_accepts_http_urls(url):
    http_reloader = reloader.HttpReloader(url)
    assert http_reloader._url == url


@pytest.mark.parametrize("url", [
    "file:///stub-path/file",
    "ftp://stub-host.test/stub-path/file",
    "/stub-path/file",
])
def test_http_reloader_raises_value_error_on_unsupported_urls(url):
    with pytest.raises(ValueError):
        reloader.HttpReloader(url)


def test_http_reloader_uses_content_fetcher(http_reloader, mocker):
    result_mock = mock.Mock()
    result_mock.status_code = 201
    mocker.patch("requests.put", return_value=result_mock)

    http_reloader.refresh(reason="force")
    http_reloader._content_fetcher.fetch.assert_called_once()


def test_http_reloader_puts_content_to_url(http_reloader, mocker):
    result_mock = mock.Mock()
    result_mock.status_code = 201
    put_mock = mocker.patch("requests.put", return_value=result_mock)
    http_reloader._generate_content = mock.Mock(return_value=b"stub_content")

    result = http_reloader.refresh(reason="force")
    put_mock.assert_called_once_with(url=stub_url, data=b"stub_content")
    assert result


def test_http_portal_reloader_uses_portal_content_fetcher(http_portal_reloader):
    assert isinstance(http_portal_reloader._content_fetcher, reloader.PortalContentFetcher)


def test_http_portal_reloader_checks_reason(http_portal_reloader, mocker):
    check_reason_mock = mocker.patch.object(reloader, "_check_portal_reason")
    http_portal_reloader._check_reason("stub_reason")
    check_reason_mock.assert_called_once_with("stub_reason")


def test_portal_content_fetcher_returns_content(mock_portal_config, mocker):
    mock_portal_config({"assets_root": "http://stub-host/"})
    result_mock = mock.Mock()
    result_mock.status_code = 201
    mocker.patch("requests.put", return_value=result_mock)
    mocker.patch.object(
        reloader.PortalContentFetcher, "_create_udm_client",
        return_value=stub_udm_client.StubUDMClient())
    content_fetcher = reloader.PortalContentFetcher(stub_portal_dn)
    content = content_fetcher.fetch()
    expected_content = """{
    "announcements": {
        "cn=stub_category,dc=stub,dc=test": {
            "allowedGroups": "stub_allowedGroups",
            "dn": "cn=stub_category,dc=stub,dc=test",
            "isSticky": "stub_isSticky",
            "message": "stub_message",
            "name": "stub_name",
            "needsConfirmation": "stub_needsConfirmation",
            "severity": "stub_severity",
            "title": "stub_title",
            "visibleFrom": "stub_visibleFrom",
            "visibleUntil": "stub_visibleeUntil"
        }
    },
    "categories": {
        "cn=stub_category,dc=stub,dc=test": {
            "display_name": "stub_displayName",
            "dn": "cn=stub_category,dc=stub,dc=test",
            "entries": [
                "stub_entry"
            ],
            "in_portal": false
        }
    },
    "entries": {
        "cn=stub_category,dc=stub,dc=test": {
            "activated": "stub_activated",
            "allowedGroups": "stub_allowedGroups",
            "anonymous": "stub_anonymous",
            "backgroundColor": "stub_backgroundColor",
            "description": "stub_description",
            "dn": "cn=stub_category,dc=stub,dc=test",
            "in_portal": false,
            "keywords": "stub_keywords",
            "linkTarget": "stub_linkTarget",
            "links": [
                {
                    "locale": "s",
                    "value": "t"
                },
                {
                    "locale": "s",
                    "value": "t"
                }
            ],
            "logo_name": "./icons/entries/stub_name.svg",
            "name": "stub_displayName",
            "target": "stub_target"
        }
    },
    "folders": {
        "cn=stub_category,dc=stub,dc=test": {
            "dn": "cn=stub_category,dc=stub,dc=test",
            "entries": [
                "stub_entry"
            ],
            "in_portal": false,
            "name": "stub_displayName"
        }
    },
    "menu_links": "stub_menuLinks",
    "portal": {
        "background": "./icons/backgrounds/stub_name.svg",
        "categories": [
            "stub_category"
        ],
        "defaultLinkTarget": "stub_defaultLinkTarget",
        "dn": "cn=cn=domain,cn=portal,cn=test,dc=stub,dc=test",
        "ensureLogin": "stub_ensureLogin",
        "logo": "./icons/logos/stub_name.svg",
        "name": "stub_displayName",
        "showUmc": true
    },
    "user_links": "stub_userLinks"
}"""
    assert content == expected_content


@pytest.mark.parametrize("reason,expected", [
    ("force", True),
    ("stub_reason", False),
    (None, False),
    ("stub:reason", False),
    ("ldap:entry", True),
    ("ldap:group", False),
])
def test_check_portal_reason_returns_expected_value(reason, expected):
    result = reloader._check_portal_reason(reason)
    assert result == expected


@pytest.mark.parametrize("reason,expected", [
    ("force", True),
    ("stub_reason", False),
    (None, False),
    ("stub:reason", False),
    ("ldap:entry", False),
    ("ldap:group", True),
])
def test_check_groups_reason_returns_expected_value(reason, expected):
    result = reloader._check_groups_reason(reason)
    assert result == expected
