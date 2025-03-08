# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest

from univention.portal.user import User


@pytest.fixture()
def user():
    return User(
        username=None,
        display_name=None,
        groups=[],
        headers={},
    )
