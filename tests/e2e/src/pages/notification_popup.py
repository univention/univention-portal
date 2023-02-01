from pages.base.base_page_part import BasePagePart
from pages.notification_drawer import NotificationElement


class PopupNotificationContainer(BasePagePart):
    """
    This represents the invisible container that holds the popup notifications
    (the ones that popup on the screen and disappear after a while)
    """
    def __init__(self, page, part, parent):
        super().__init__(page, part, parent)
        self.notifications = self.part.locator("//*[starts-with(@data-test, 'notification')]")

    def notification(self, n):
        count = self.notifications.count()
        if n >= count:
            raise IndexError(f"You are trying to access the {n}th popup notification, "
                             f"but here are only {count} popup notifications"
                             )
        return NotificationElement(self.page, self.notifications.nth(n), self)
