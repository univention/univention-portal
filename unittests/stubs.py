# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import copy
from collections.abc import Sequence

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


# TODO: Change once the Python version has been upgraded in the test runner to >= 3.12
LdapDn = str
# type LdapDn = str

class StubPortalCache(PortalCacheMixin, StubCache):

    def __init__(self):
        entries = []
        self.stub_content = {
            "categories": {},
            "entries": {e["dn"]: e for e in entries},
            "folders": {},
            "corner_links": [],
            "menu_links": [],
            "quick_links": [],
            "user_links": [],
        }

    def stub_add_entry(self, dn: LdapDn, in_link_lists: Sequence = ()):
        entry_data = self.stub_entry_data(dn)
        self.stub_content["entries"][dn] = entry_data
        for link_list in in_link_lists:
            self.stub_content[link_list].append(dn)

    def stub_entry_data(self, dn: LdapDn, anonymous=False):
        data = {
            "activated": True,
            "allowedGroups": [],
            "anonymous": anonymous,
            "description": {
                "de_DE": "News, Tipps und Best Practices",
                "en_US": "News, tips and best practices",
                "fr_FR": "Nouvelles, conseils et bonne pratique",
            },
            "dn": dn,
            "icon_url": "/univention/portal/icons/entries/blog.png",
            "in_portal": True,
            "linkTarget": "newwindow",
            "links": ["https://blog.example"],
            "name": {
                "de_DE": "Blog",
                "en_US": "Blog",
                "fr_FR": "Blog",
            },
        }
        return data


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
