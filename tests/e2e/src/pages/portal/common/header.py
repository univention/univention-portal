import re

from pages.base import BasePagePart


class Header(BasePagePart):
    """This represents the portal's top navigation header bar."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.bell_icon = self.get_by_role("button",
                                          name=re.compile("^Notifications"),
                                          )
        self.hamburger_icon = self.locator("#header-button-menu")

    def click_bell_icon(self):
        self.bell_icon.click()

    def click_hamburger_icon(self):
        self.hamburger_icon.click()
