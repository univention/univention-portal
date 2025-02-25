# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest

from univention.portal.user import User


@pytest.fixture()
def portal_mock(mocker, user):
    async def get_user():
        return user

    portal = mocker.Mock()
    portal.portal_cache = None
    portal.score = mocker.Mock(return_value=1)
    portal.get_user = async_method_patch(mocker, get_user)
    portal.refresh = mocker.Mock()
    portal.get_cache_id = mocker.Mock(return_value=None)
    portal.get_visible_content = mocker.Mock(return_value=None)
    portal.get_user_links = mocker.Mock(return_value=None)
    portal.get_menu_links = mocker.Mock(return_value=None)
    portal.get_entries = mocker.Mock(return_value=None)
    portal.get_folders = mocker.Mock(return_value=None)
    portal.get_categories = mocker.Mock(return_value=None)
    portal.get_meta = mocker.Mock(return_value={"showUmc": False})
    portal.auth_mode = mocker.Mock(return_value=None)
    portal.may_be_edited = mocker.Mock(return_value=None)
    portal.get_announcements = mocker.Mock(return_value=None)
    portal.get_feature_toggles = mocker.Mock(return_value={})

    return portal


@pytest.fixture()
def user():
    return User(
        username=None,
        display_name=None,
        groups=[],
        headers={},
    )


def async_method_patch(mocker, callable):
    mocker.MagicMock.__await__ = lambda _: callable().__await__()
    return mocker.MagicMock()
