# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from unittest import mock

import pytest

from univention.portal.user import User


@pytest.fixture()
def portal_mock(user):
    portal = mock.Mock()
    portal.portal_cache = None
    portal.score.return_value = 1
    portal.get_user = mock.AsyncMock(return_value=user)
    portal.refresh = mock.Mock()
    portal.get_cache_id.return_value = None
    portal.get_visible_content.return_value = None
    portal.get_user_links.return_value = None
    portal.get_menu_links.return_value = None
    portal.get_entries.return_value = None
    portal.get_folders.return_value = None
    portal.get_categories.return_value = None
    portal.get_meta.return_value = {"showUmc": False}
    portal.auth_mode.return_value = None
    portal.may_be_edited.return_value = None
    portal.get_announcements.return_value = None
    portal.get_feature_toggles.return_value = {}
    return portal


@pytest.fixture()
def user():
    return User(
        username=None,
        display_name=None,
        groups=[],
        headers={},
    )
