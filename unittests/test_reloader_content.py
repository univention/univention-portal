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

import copy
import json

import pytest

import stub_udm_client
import univention.admin.rest.client as udm_client
from univention.portal.extensions.reloader_content import GroupsContentFetcher, PortalContentFetcherUDMREST
from univention.portal.extensions.reloader_udm import PortalContentFetcherUDM


stub_portal_dn = "cn=portal,dc=test"


@pytest.fixture(
    params=[
        PortalContentFetcherUDMREST,
        PortalContentFetcherUDM,
    ],
    ids=lambda cls: cls.__name__,
)
def portal_content_fetcher_cls(request, mocker):
    """
    Returns the class of the portal content fetcher.

    The method `_create_udm_client` will be mocked to return a stub udm client.

    The fixture is parametrized and returns the two implementations of the
    content fetcher.
    """
    PortalContentFetcherClass = request.param
    stub_udm = stub_udm_client.StubUDMClient(flavor=PortalContentFetcherClass.__name__)
    mocker.patch.object(PortalContentFetcherClass, "_create_udm_client", return_value=stub_udm)
    return PortalContentFetcherClass


@pytest.fixture()
def portal_content_fetcher(portal_content_fetcher_cls):
    """
    Returns an instance of the portal content fetcher.

    This fixture is parametrized by using the fixture
    `portal_content_fetcher_cls`. It returns an instance of the given class.
    """
    content_fetcher = portal_content_fetcher_cls(stub_portal_dn)
    return content_fetcher


@pytest.fixture()
def stub_udm(portal_content_fetcher_cls):
    """Provides the stub udm client for a portal content fetcher."""
    return portal_content_fetcher_cls._create_udm_client()


def test_portal_content_fetcher_propagates_connectionerror(mocker):
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)
    udm_return = mocker.Mock()
    udm_return.get.side_effect = udm_client.ConnectionError
    mocker.patch.object(
        PortalContentFetcherUDMREST, "_create_udm_client",
        return_value=udm_return)

    with pytest.raises(udm_client.ConnectionError):
        content_fetcher.fetch()


def test_collect_asset_returns_relative_asset_url_by_default(portal_content_fetcher):
    asset_url = portal_content_fetcher._collect_asset(b"<svg />", "stub_name", "stub_dirname")
    assert asset_url == "./icons/stub_dirname/stub_name.svg"


@pytest.mark.parametrize("base_url", [
    "https://external.store.example/stub_bucket",
    "https://external.store.example/stub_bucket/",
])
def test_collect_asset_returns_external_url_udm_rest(base_url):
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn, assets_base_url=base_url)
    asset_url = content_fetcher._collect_asset(b"<svg />", "stub_name", "stub_dirname")
    assert asset_url == "https://external.store.example/stub_bucket/icons/stub_dirname/stub_name.svg"


# TODO: This behavior does not seem to be useful. The implementation should
# probably just raise an exception if `assets_base_url` has a value other than
# None or the empty string.
@pytest.mark.parametrize("base_url", [
    "https://external.store.example/stub_bucket",
    "https://external.store.example/stub_bucket/",
])
def test_collect_asset_returns_external_url(base_url):
    content_fetcher = PortalContentFetcherUDM(stub_portal_dn, assets_base_url=base_url)
    asset_url = content_fetcher._collect_asset(b"<svg />", "stub_name", "stub_dirname")
    assert asset_url == "./icons/stub_dirname/stub_name.svg"


def test_portal_content_fetcher_adds_referred_entries_from_link_list(
    portal_content_fetcher, stub_udm, portal_link_list, mocker,
):
    stub_entry = _create_stub_entry(stub_udm)
    stub_portal_module = stub_udm.get("portals/portal")
    stub_portal = stub_portal_module.get("cn=portal,dc=test")
    stub_portal.stub_properties[portal_link_list.udm_attr].append(stub_entry.dn)

    content = portal_content_fetcher._fetch()

    link_list_entries = set(content[portal_link_list.portal_attr])
    entries = set(content["entries"].keys())
    assert link_list_entries <= entries
    for entry_dn in link_list_entries:
        entry = content["entries"][entry_dn]
        # Every referred to Portal Entry has to be recognized as being in the Portal
        assert entry["in_portal"] is True


def test_portal_content_fetcher_adds_referred_folders_from_link_list(
    portal_content_fetcher, stub_udm, portal_link_list, mocker,
):
    stub_folder = _create_stub_folder(stub_udm)
    stub_portal_module = stub_udm.get("portals/portal")
    stub_portal = stub_portal_module.get("cn=portal,dc=test")
    stub_portal.stub_properties[portal_link_list.udm_attr].append(stub_folder.dn)

    content = portal_content_fetcher._fetch()

    link_list_entries = set(content[portal_link_list.portal_attr])
    folders_and_entries = set()
    folders_and_entries.update(
        content["folders"].keys(),
        content["entries"].keys(),
    )
    assert link_list_entries <= folders_and_entries
    assert stub_folder.dn in link_list_entries
    assert content["folders"][stub_folder.dn]["in_portal"] is True


def test_portal_content_fetcher_adds_referred_entries_from_category(
    portal_content_fetcher, stub_udm, mocker,
):
    stub_entry = _create_stub_entry(stub_udm)
    stub_category_module = stub_udm.get("portals/category")
    stub_category = stub_category_module.get("cn=category,dc=test")
    stub_category.stub_properties["entries"].append(stub_entry.dn)

    content = portal_content_fetcher._fetch()

    assert content["entries"][stub_entry.dn]["in_portal"] is True


def test_portal_content_fetcher_adds_referred_folders_from_category(
    portal_content_fetcher, stub_udm, mocker,
):
    stub_folder = _create_stub_folder(stub_udm)
    stub_category_module = stub_udm.get("portals/category")
    stub_category = stub_category_module.get("cn=category,dc=test")
    stub_category.stub_properties["entries"].append(stub_folder.dn)

    content = portal_content_fetcher._fetch()

    assert content["folders"][stub_folder.dn]["in_portal"] is True


def test_portal_content_fetcher_adds_referred_entries_from_folder(
    portal_content_fetcher, stub_udm, mocker,
):
    stub_entry = _create_stub_entry(stub_udm)
    stub_folder_module = stub_udm.get("portals/folder")
    stub_folder = stub_folder_module.get("cn=folder,dc=test")
    stub_folder.stub_properties["entries"].append(stub_entry.dn)

    content = portal_content_fetcher._fetch()

    assert content["entries"][stub_entry.dn]["in_portal"] is True


def _create_stub_entry(stub_udm):
    stub_entry = stub_udm_client.StubUDMObject(
        "cn=entry,cn=testcase,dc=test",
        stub_udm,
        copy.deepcopy(stub_udm_client.entry_properties))
    stub_entry_module = stub_udm.get("portals/entry")
    stub_entry_module.stub_add_object(stub_entry)
    return stub_entry


def _create_stub_folder(stub_udm):
    stub_folder = stub_udm_client.StubUDMObject(
        "cn=folder,cn=testcase,dc=test",
        stub_udm,
        copy.deepcopy(stub_udm_client.folder_properties))
    stub_entry_module = stub_udm.get("portals/folder")
    stub_entry_module.stub_add_object(stub_folder)
    return stub_folder


def test_portal_content_fetcher_returns_content(portal_content_fetcher, mocker):
    content = portal_content_fetcher._fetch()
    expected_content = {
        "announcements": {
            "cn=announcement,dc=test": {
                "allowedGroups": "stub_allowedGroups",
                "dn": "cn=announcement,dc=test",
                "isSticky": "stub_isSticky",
                "message": "stub_message",
                "name": "stub_name",
                "needsConfirmation": "stub_needsConfirmation",
                "severity": "stub_severity",
                "title": "stub_title",
                "visibleFrom": "stub_visibleFrom",
                "visibleUntil": "stub_visibleeUntil",
            },
        },
        "categories": {
            "cn=category,dc=test": {
                "display_name": "stub_displayName",
                "dn": "cn=category,dc=test",
                "entries": ["cn=folder,dc=test"],
                "in_portal": True,
            },
        },
        "entries": {
            "cn=entry,dc=test": {
                "activated": "stub_activated",
                "allowedGroups": "stub_allowedGroups",
                "anonymous": "stub_anonymous",
                "backgroundColor": "stub_backgroundColor",
                "description": "stub_description",
                "dn": "cn=entry,dc=test",
                "guardianPermissionView": "stub_guardianPermissionView",
                "icon_url": "./icons/entries/stub_name.svg",
                "in_portal": False,
                "keywords": "stub_keywords",
                "linkTarget": "stub_linkTarget",
                "links": [{"locale": "stub_locale", "value": "stub_link"}],
                "name": "stub_displayName",
                "target": "stub_target",
            },
            "cn=entry-for-link-list,dc=test": {
                "activated": "stub_activated",
                "allowedGroups": "stub_allowedGroups",
                "anonymous": "stub_anonymous",
                "backgroundColor": "stub_backgroundColor",
                "description": "stub_description",
                "dn": "cn=entry-for-link-list,dc=test",
                "guardianPermissionView": "stub_guardianPermissionView",
                "icon_url": "./icons/entries/stub_name.svg",
                "in_portal": True,
                "keywords": "stub_keywords",
                "linkTarget": "stub_linkTarget",
                "links": [{"locale": "stub_locale", "value": "stub_link"}],
                "name": "stub_displayName",
                "target": "stub_target",
            },
        },
        "folders": {
            "cn=folder,dc=test": {
                "dn": "cn=folder,dc=test",
                "entries": ["stub_entry"],
                "in_portal": True,
                "name": "stub_displayName",
            },
        },
        "portal": {
            "background": "./icons/backgrounds/stub_name.svg",
            "categories": ["cn=category,dc=test"],
            "defaultLinkTarget": "stub_defaultLinkTarget",
            "dn": "cn=portal,dc=test",
            "ensureLogin": "stub_ensureLogin",
            "logo": "./icons/logos/stub_name.svg",
            "name": "stub_displayName",
            "showUmc": True,
        },
        "corner_links": ["cn=entry-for-link-list,dc=test"],
        "menu_links": ["cn=entry-for-link-list,dc=test"],
        "quick_links": ["cn=entry-for-link-list,dc=test"],
        "user_links": ["cn=entry-for-link-list,dc=test"],
        "central_navigation": [],
    }
    assert content == expected_content


def test_portal_content_fetcher_fetch_returns_json(mocker):
    stub_content = {"stub_result": "stub_value"}
    mocker.patch.object(
        PortalContentFetcherUDMREST, "_fetch",
        return_value=stub_content,
    )
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)
    content = content_fetcher.fetch()
    assert json.loads(content) == stub_content


def test_group_content_fetcher_returns_content(mocker):
    stub_users = {
        'administrator': [
            'cn=computers,cn=groups,dc=univention,dc=intranet',
            'cn=dc backup hosts,cn=groups,dc=univention,dc=intranet',
            'cn=dc slave hosts,cn=groups,dc=univention,dc=intranet',
            'cn=domain admins,cn=groups,dc=univention,dc=intranet',
            'cn=domain users,cn=groups,dc=univention,dc=intranet',
            'cn=windows hosts,cn=groups,dc=univention,dc=intranet'],
        'join-backup': [
            'cn=backup join,cn=groups,dc=univention,dc=intranet',
            'cn=computers,cn=groups,dc=univention,dc=intranet',
            'cn=dc backup hosts,cn=groups,dc=univention,dc=intranet',
            'cn=dc slave hosts,cn=groups,dc=univention,dc=intranet',
            'cn=slave join,cn=groups,dc=univention,dc=intranet',
            'cn=windows hosts,cn=groups,dc=univention,dc=intranet'],
        'join-slave': [
            'cn=computers,cn=groups,dc=univention,dc=intranet',
            'cn=dc slave hosts,cn=groups,dc=univention,dc=intranet',
            'cn=slave join,cn=groups,dc=univention,dc=intranet'],
        'testuser': [
            'cn=domain users,cn=groups,dc=univention,dc=intranet'],
        'ucs-sso': [
            'cn=domain users,cn=groups,dc=univention,dc=intranet'],
        'user': [
            'cn=domain admins,cn=groups,dc=univention,dc=intranet',
            'cn=domain users,cn=groups,dc=univention,dc=intranet'],
    }

    mocker.patch.object(GroupsContentFetcher, "_get_users_from_ldap", return_value=stub_users)
    content_fetcher = GroupsContentFetcher()
    content = content_fetcher.fetch()
    assert json.loads(content) == stub_users
    assert len(content_fetcher.assets) == 0
