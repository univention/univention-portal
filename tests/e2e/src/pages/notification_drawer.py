from playwright.sync_api import expect

from pages.base.base_page_part import BasePagePart
from pages.exceptions import PortalError
from pages.notification_element import NotificationElement


class NotificationDrawer(BasePagePart):
    """
    This represents the notification drawer that comes out after clicking
    the notification icon (bell) in the portal's navigation header.
    """
    def __init__(self, page, part, parent):
        super().__init__(page, part, parent)
        self.remove_all_button = self.part.get_by_role("button",
                                                       name="Remove all"
                                                       )
        self.no_notifications_heading = self.part.get_by_text("No notifications")
        self.notifications = self.part.locator("//*[starts-with(@data-test, 'notification')]")

    def remove_all_notifications(self):
        self.parent.header.reveal_notification_drawer()
        notifications = [NotificationElement(self.page, locator, self)
                         for locator in self.notifications.all()
                         ]
        if self.no_notifications_heading.is_visible():
            if len(notifications) > 0:
                raise PortalError("'No notifications' visible even when non-zero notifications present")
            else:
                return
        elif len(notifications) == 1:
            notifications[0].close()
            expect(self.part).to_be_hidden()
        else:
            self.remove_all_button.click()
            expect(self.part).to_be_hidden()
