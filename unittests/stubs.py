# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import copy

from univention.portal.extensions.authenticator import Authenticator
from univention.portal.extensions.cache import CacheAbc, PortalCacheMixin
from univention.portal.user import User


class StubCache(CacheAbc):
    """
    A stub implementation of `CacheAbc` to support testing.

    Attributes and methods related to the stubbing are prefixed with `stub_`
    like `stub_content` and are intended be used to modify the stub for the
    particular test case.
    """

    stub_content = {}

    def __init__(self):
        self.stub_content = copy.deepcopy(self.stub_content)

    def get(self):
        return self.stub_content

    def refresh(self, reason=None):
        pass


class StubPortalCache(PortalCacheMixin, StubCache):

    stub_content = {
        "corner_links": ["cn=corner_links,dc=test"],
        "menu_links": ["cn=menu_links,dc=test"],
        "quick_links": ["cn=quick_links,dc=test"],
        "user_links": ["cn=user_links,dc=test"],
    }


class StubAuthenticator(Authenticator):
    """
    Utility to help testing things like `Portal` which need an `Authenticator`.

    Attributes and methods related to the stubbing are prefixed with `stub_`
    and are to be used to modify the stub for the needs of the test case.
    """

    stub_user = None
    """The authenticator will return this user."""

    def __init__(self, *, user=None):
        self.stub_user = user or User(username=None, display_name=None, groups=[], headers={})

    async def get_user(self, request):  # pragma: no cover
        return self.stub_user
