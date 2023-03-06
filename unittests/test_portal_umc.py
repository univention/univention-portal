from unittest import mock

import pytest


@pytest.fixture()
def stub_visible_content():
    """
    A stub of the datastructure which is returned by `UMCPortal.get_visible_content`.

    The stub contains a minimal set of one module and the category of this module.
    """
    return {
        "umc_categories": [
            {"color": "#00acb6",
             "icon": "category-domain.svg",
             "id": "domain",
             "name": "Domain",
             "priority": 60.0}],
        "umc_modules": [
            {"categories": ["domain"],
             "description": "Managing the Univention Portal",
             "flavor": "portals/all",
             "icon": "portal",
             "id": "udm",
             "keywords": ["", "Portal"],
             "name": "Portal",
             "priority": -1.0,
             "url": None,
             "version": None}],
    }


def test_get_entries(mock_portal_config, stub_visible_content):
    from univention.portal.extensions.portal import UMCPortal

    mock_portal_config({"umc_check_logos": True})
    portal = UMCPortal(mock.Mock(), mock.Mock())
    entries = portal.get_entries(stub_visible_content)
    expected_entries = [
        {"backgroundColor": "#00acb6",
         "description": {"en_US": "Managing the Univention Portal"},
         "dn": "umc:module:udm:portals/all",
         "keywords": {"en_US": " Portal"},
         "linkTarget": "embedded",
         "links": [{"locale": "en_US",
                    "value": "/univention/management/?header=try-hide&overview=false&menu=false#module=udm:portals/all"}],
         "logo_name": None,
         "name": {"en_US": "Portal"},
         "target": None}]
    assert expected_entries == entries


@pytest.mark.parametrize(
    "umc_check_logos_setting,expected", [
        (True, None),
        (False, "/univention/management/js/dijit/themes/umc/icons/scalable/portal.svg")])
def test_get_entries_returns_logo_name_without_check(
        umc_check_logos_setting, expected, mock_portal_config, stub_visible_content):
    from univention.portal.extensions.portal import UMCPortal

    mock_portal_config({"umc_check_logos": umc_check_logos_setting})
    portal = UMCPortal(mock.Mock(), mock.Mock())
    entries = portal.get_entries(stub_visible_content)
    logo_name = entries[0]["logo_name"]
    assert logo_name == expected
