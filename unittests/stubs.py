import copy

from univention.portal.extensions.cache import CacheAbc, PortalCacheMixin


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
