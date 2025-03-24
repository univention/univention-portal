#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2025 Univention GmbH
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

from importlib import reload
from os import path
from typing import NamedTuple

import pytest

from stubs import StubAuthenticator, StubPortalCache
from univention.portal.extensions.portal import Portal, UMCPortal
from univention.portal.extensions.scorer import Scorer
from univention.portal.user import User


@pytest.fixture(scope="session", autouse=True)
def faker_session_locale():
    return ["en_US", "de_DE", "fr_FR"]


@pytest.fixture()
def dynamic_class():
    from univention import portal

    return portal.get_dynamic_classes


# Helper function fixtures


@pytest.fixture()
def patch_object_module(mocker):
    """Helper to patch module level library imports of an object or class"""

    def _(obj, module_name):
        return mocker.patch(f"{obj.__module__}.{module_name}")

    return _


@pytest.fixture()
def get_file_path(request):
    """Helper to get the absolute path of test files in the unittests directory"""
    unittest_path = request.fspath.dirname
    files_directory = "files"

    def _(file_name):
        return path.join(unittest_path, files_directory, file_name)

    return _


@pytest.fixture()
def mock_portal_config(mocker):
    """
    Returns a callable which can be used to inject configuration values.

    The callable can be used multiple times to update the configuration
    incrementally.
    """
    from univention.portal import config

    reload(config)
    mocker.patch.object(config.load, "never_loaded", False)

    def _mock_portal_config(values):
        mocker.patch.dict(config._DB, values)

    return _mock_portal_config


@pytest.fixture()
def mocked_portal_config(get_file_path):
    from univention.portal import config

    reload(config)
    config._CONF = get_file_path("config*.json")
    return config


@pytest.fixture()
def stub_portal_cache(faker):
    """
    A `CacheAbc` implementation to be used as a stub for testing.

    This is an instance of `StubPortalCache` and can be modified for the
    particular test as needed.
    """
    return StubPortalCache(faker)


@pytest.fixture()
def stub_authenticator(stub_user):
    """
    An `Authenticator` implementation to be used as a stub for testing.

    This is an instance of `StubAuthenticator` and can be modified for the
    particular test as needed.
    """
    return StubAuthenticator(user=stub_user)


@pytest.fixture()
def stub_scorer():
    """
    A stub for the `Scorer`.

    This is directly an instance of the base class `Scorer`.
    """
    return Scorer()


@pytest.fixture()
def stub_user(faker):
    """An authenticated `User` instance."""
    user = User(
        username=faker.user_name(),
        display_name=faker.name(),
        groups=[],
        headers={},
    )
    return user


@pytest.fixture()
def stub_user_anonymous():
    """An anonymous `User` instance."""
    user = User(
        username=None,
        display_name=None,
        groups=[],
        headers={},
    )
    return user


@pytest.fixture()
def portal(stub_scorer, stub_portal_cache, stub_authenticator):
    """
    A `Portal` instance with dependencies replaced by stubs.

    The idea is that this object can be used directly for testing without
    having to worry about calls into external dependencies being made, e.g. UMC
    or UDM.

    The stubs are prepared so that their content can be modifier as needed by
    the respective test case.
    """
    portal = Portal(stub_scorer, stub_portal_cache, stub_authenticator)
    return portal


@pytest.fixture()
def portal_umc(stub_scorer, stub_authenticator, umc_categories_data, umc_modules_data, mocker):
    """
    An `UMCPortal` instance with stubs and mocked UMC access.

    The stubs are prepared so that the content can be modified as needed by the
    respective test case.

    The mocked UMC calls have `side_effects` configured, the first one returns
    the fixture `umc_categories_data` and the second call returns
    `umc_modules_data`.
    """
    portal = UMCPortal(stub_scorer, stub_authenticator)
    mocker.patch.object(
        portal,
        "_request_umc_get",
        side_effect=[umc_categories_data, umc_modules_data, Exception("Only two calls expected!")],
    )
    return portal


class PortalLinkList(NamedTuple):
    """
    Represents a "link list" in the context of the Portal.

    The Portal has multiple "link lists" which are expected to show specific
    common behavior.
    """

    udm_attr: str
    """
    UDM attribute name.
    """

    portal_attr: str
    """
    Portal attribute name.
    """

    def testid(self):
        return self.portal_attr


@pytest.fixture(
    params=[
        PortalLinkList("cornerLinks", "corner_links"),
        PortalLinkList("menuLinks", "menu_links"),
        PortalLinkList("quickLinks", "quick_links"),
        PortalLinkList("userLinks", "user_links"),
    ],
    ids=PortalLinkList.testid,
)
def portal_link_list(request):
    """
    Parametrized fixture which returns the link lists in the Portal.

    The fixture will return a `PotralLinkList` instance per link list supported
    in the portal.
    """
    link_list = request.param
    return link_list


@pytest.fixture()
def umc_categories_data():
    """
    Stub categories data as returned by the UMC.

    See `UMCPortal._request_umc_get` regarding the related implmentation.
    """
    return [{
        "color": "#00acb6",
        "icon": "category-domain.svg",
        "id": "domain",
        "name": "Domain",
        "priority": 60.0,
    }]


@pytest.fixture()
def umc_modules_data():
    """
    Stub modules data as returned by the UMC.

    See `UMCPortal._request_umc_get` regarding the related implmentation.
    """
    return [{
        "categories": ["domain"],
        "description": "Managing the Univention Portal",
        "flavor": "portals/all",
        "icon": "portal",
        "id": "udm",
        "keywords": ["", "Portal"],
        "name": "Portal",
        "priority": -1.0,
        "url": None,
        "version": None,
    }]
