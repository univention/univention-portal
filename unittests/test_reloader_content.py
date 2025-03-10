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

import copy
import json

import pytest

import stub_udm_client
import univention.admin.rest.client as udm_client
from univention.portal.extensions.reloader_content import GroupsContentFetcher, PortalContentFetcherUDMREST


stub_portal_dn = "cn=portal,dc=test"


def test_portal_content_fetcher_propagates_connectionerror(mocker):
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)
    udm_return = mocker.Mock()
    udm_return.get.side_effect = udm_client.ConnectionError
    mocker.patch.object(
        PortalContentFetcherUDMREST, "_create_udm_client",
        return_value=udm_return)

    with pytest.raises(udm_client.ConnectionError):
        content_fetcher.fetch()


def test_collect_asset_returns_relative_asset_url_by_default():
    portal_content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)
    asset_url = portal_content_fetcher._collect_asset(b"<svg />", "stub_name", "stub_dirname")
    assert asset_url == "./icons/stub_dirname/stub_name.svg"


@pytest.mark.parametrize("base_url", [
    "https://external.store.example/stub_bucket",
    "https://external.store.example/stub_bucket/",
])
def test_collect_asset_returns_external_url(base_url):
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn, assets_base_url=base_url)
    asset_url = content_fetcher._collect_asset(b"<svg />", "stub_name", "stub_dirname")
    assert asset_url == "https://external.store.example/stub_bucket/icons/stub_dirname/stub_name.svg"


@pytest.mark.parametrize("udm_property, portal_key", [
    ("cornerLinks", "corner_links"),
    ("menuLinks", "menu_links"),
    ("quickLinks", "quick_links"),
    ("userLinks", "user_links"),
])
def test_portal_content_fetcher_adds_referred_entries_from_link_list(udm_property, portal_key, mocker):
    stub_udm = stub_udm_client.StubUDMClient()

    # Add a Portal Entry which is only in the link list under test
    stub_entry = stub_udm_client.StubUDMObject(
        "cn=entry,cn=testcase,dc=test",
        stub_udm,
        copy.deepcopy(stub_udm_client.entry_properties))
    stub_entry_module = stub_udm.get("portals/entry")
    stub_entry_module.stub_add_object(stub_entry)
    stub_portal_module = stub_udm.get("portals/portal")
    stub_portal = stub_portal_module.get("cn=portal,dc=test")
    stub_portal.properties[udm_property].append(stub_entry.dn)

    mocker.patch.object(
        PortalContentFetcherUDMREST, "_create_udm_client",
        return_value=stub_udm)
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)

    content = content_fetcher._fetch()

    link_list_entries = set(content[portal_key])
    entries = set(content["entries"].keys())
    assert link_list_entries <= entries
    for entry_dn in link_list_entries:
        entry = content["entries"][entry_dn]
        # Every referred to Portal Entry has to be recognized as being in the Portal
        assert entry["in_portal"] is True


def test_portal_content_fetcher_returns_content(mocker):
    mocker.patch.object(
        PortalContentFetcherUDMREST, "_create_udm_client",
        return_value=stub_udm_client.StubUDMClient())
    content_fetcher = PortalContentFetcherUDMREST(stub_portal_dn)
    content = content_fetcher._fetch()
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
                "entries": ["stub_entry"],
                "in_portal": False,
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
                "in_portal": False,
                "name": "stub_displayName",
            },
        },
        "portal": {
            "background": "./icons/backgrounds/stub_name.svg",
            "categories": ["stub_category"],
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
