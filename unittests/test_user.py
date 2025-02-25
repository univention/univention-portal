# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest

from univention.portal.user import User


@pytest.mark.parametrize("username, expected_logged_in", [
    ("stub-user", True),
    (None, False),
])
def test_is_logged_in(username, expected_logged_in):
    user = User(username=username, display_name=None, groups=[], headers=None)
    assert user.is_logged_in() == expected_logged_in
