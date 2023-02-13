import re

from playwright.sync_api import expect

from pages.base.base_page_part import BasePagePart


class Header(BasePagePart):
    """This represents the portal's top navigation header bar."""

    def __init__(self, page, part, parent):
        super().__init__(page, part, parent)
        self.bell_icon = self.part.get_by_role("button",
                                               name=re.compile("^Notifications"),
                                               )

    def reveal_notification_drawer(self):
        if self.parent.notification_drawer.is_hidden():
            self.bell_icon.click()
            expect(self.parent.notification_drawer.part).to_be_visible()

    def hide_notification_drawer(self):
        if self.parent.notification_drawer.is_visible():
            self.bell_icon.click()
            expect(self.parent.notification_drawer.part).to_be_hidden()
