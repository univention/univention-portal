from pages.base import BasePage, expect
from pages.portal.common.header import Header
from pages.portal.common.notifications import NotificationDrawer, PopupNotificationContainer
from pages.portal.common.right_side_menu import RightSideMenu
from pages.portal.exceptions import PortalError


class PortalPage(BasePage):
    """
    All portal pages should be derived from this class.
    Access to shared parts (i.e. parts that all pages have) are provided using
    instance variables. For example, to get the header, you can do
    the following.

    ```
    class MyPage(PortalPage):
        ...

    def test_something(page):
        my_page = MyPage(page)
        header = my_page.header  # Get the navigation header
        # Now, do something with the header
        header.reveal_notification_drawer()
    ```
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.header = Header(self.page.locator("#portal-header"))
        self.notification_drawer = NotificationDrawer(self.page.locator("#notifications-all"))
        self.popup_notification_container = PopupNotificationContainer(
            self.page.locator("#notifications-visible"),
        )
        self.right_side_menu = RightSideMenu(self.page.locator("#portal-sidenavigation"))

    def reveal_notification_drawer(self):
        if self.notification_drawer.is_hidden():
            self.header.click_bell_icon()
        expect(self.notification_drawer).to_be_visible()

    def hide_notification_drawer(self):
        if self.notification_drawer.is_visible():
            self.header.click_bell_icon()
        expect(self.notification_drawer).to_be_hidden()

    def remove_all_notifications(self):
        self.reveal_notification_drawer()
        count = self.notification_drawer.notifications.count()
        if self.notification_drawer.no_notifications_heading.is_visible():
            if count > 0:
                raise PortalError("'No notifications' visible even when non-zero notifications present")
            else:
                self.hide_notification_drawer()
        elif count == 1:
            self.notification_drawer.notification(0).click_close_button()
            expect(self.notification_drawer).to_be_hidden()
        else:
            self.notification_drawer.click_remove_all_button()
            expect(self.notification_drawer).to_be_hidden()
        self.reveal_notification_drawer()
        expect(self.notification_drawer.no_notifications_heading).to_be_visible()
        expect(self.notification_drawer.notifications).to_have_count(0)
        self.hide_notification_drawer()

    def reveal_side_nav_drawer(self):
        if self.right_side_menu.is_hidden():
            self.header.click_hamburger_icon()
        expect(self.right_side_menu).to_be_visible()

    def hide_side_nav_drawer(self):
        if self.right_side_menu.is_visible():
            self.header.click_hamburger_icon()
        expect(self.right_side_menu).to_be_hidden()

    def logout(self):
        self.reveal_side_nav_drawer()
        logout_button_visible = self.right_side_menu.logout_button.is_visible()
        login_button_visible = self.right_side_menu.login_button.is_visible()
        if login_button_visible and logout_button_visible:
            raise PortalError("Both login and logout buttons are visible in the side navigation drawer")
        elif logout_button_visible:
            self.right_side_menu.click_logout_button()
