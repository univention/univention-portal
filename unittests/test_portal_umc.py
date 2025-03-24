# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2025 Univention GmbH

import pytest


@pytest.fixture()
def stub_visible_content(umc_categories_data, umc_modules_data):
    """
    A stub of the data structure which is returned by
    `UMCPortal.get_visible_content`.

    The stub is using the fixtures `umc_categories_data` and `umc_modules_data`
    to build the content.
    """
    return {
        "umc_categories": umc_categories_data,
        "umc_modules": umc_modules_data,
    }


def test_get_entries(mock_portal_config, portal_umc, stub_visible_content):
    mock_portal_config({"umc_check_icons": True})
    entries = portal_umc.get_entries(stub_visible_content)
    expected_entries = [
        {"backgroundColor": "#00acb6",
         "description": {"en_US": "Managing the Univention Portal"},
         "dn": "umc:module:udm:portals/all",
         "keywords": {"en_US": " Portal"},
         "linkTarget": "embedded",
         "links": [{"locale": "en_US",
                    "value": "/univention/management/?header=try-hide&overview=false&menu=false#module=udm:portals/all"}],
         "icon_url": None,
         "name": {"en_US": "Portal"},
         "target": None}]
    assert expected_entries == entries


@pytest.mark.parametrize(
    "umc_check_icons_setting,expected", [
        (True, None),
        (False, "/univention/management/js/dijit/themes/umc/icons/scalable/portal.svg")])
def test_get_entries_returns_icon_url_without_check(
        umc_check_icons_setting, expected, mock_portal_config, portal_umc, stub_visible_content):
    mock_portal_config({"umc_check_icons": umc_check_icons_setting})
    entries = portal_umc.get_entries(stub_visible_content)
    icon_url = entries[0]["icon_url"]
    assert icon_url == expected


def test_get_entries_skips_modules_in_apps(mock_portal_config, portal_umc, stub_visible_content):
    stub_visible_content["umc_modules"][0]["categories"].append("apps")
    mock_portal_config({"umc_check_icons": False})
    entries = portal_umc.get_entries(stub_visible_content)
    assert entries == []


def test_module_icon_url_checks_correct_file_path(mocker, portal_umc, umc_modules_data):
    exists_mock = mocker.patch("os.path.exists")
    stub_module = umc_modules_data[0]
    portal_umc._module_icon_url(stub_module, umc_check_icons=True)
    expected_icon_filename = (
        "/usr/share/univention-management-console-frontend"
        "/js/dijit/themes/umc/icons/scalable/portal.svg")
    exists_mock.assert_called_once_with(expected_icon_filename)
