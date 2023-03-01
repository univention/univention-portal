from pages.base import BasePagePart


class NotificationsContainer(BasePagePart):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.notifications = self.locator("//*[starts-with(@data-test, 'notification')]")

    def notification(self, n):
        count = self.notifications.count()
        if n >= count:
            raise IndexError(f"You are trying to access the {n}th popup notification, "
                             f"but here are only {count} popup notifications",
                             )
        return NotificationElement(self.notifications.nth(n))


class NotificationDrawer(NotificationsContainer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.remove_all_button = self.get_by_role("button", name="Remove all")
        self.no_notifications_heading = self.get_by_text("No notifications")

    def click_remove_all_button(self):
        self.remove_all_button.click()


class PopupNotificationContainer(NotificationsContainer):
    pass


class NotificationElement(BasePagePart):
    """This represents a single notification element."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.close_button = self.locator("//*[contains(@data-test, 'closeNotification')]")
        self.link = self.get_by_role("link")
        self.title = self.locator("//div[@class='notification__title']")
        self.details = self.locator("//div[@class='notification__description']")

    def click_close_button(self):
        self.close_button.click()
