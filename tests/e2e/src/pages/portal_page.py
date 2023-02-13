from pages.base.base_page import BasePage
from pages.header import Header
from pages.notification_drawer import NotificationDrawer
from pages.notification_popup import PopupNotificationContainer


class PortalPage(BasePage):
    """
    All portal pages should be derived from this class.
    Access to shared parts (i.e. parts that all pages have) are provided using
    instance variables. For example, to get the navigation header, you can do
    the following.

    ```
    class MyPage(PortalPage):
        ...

    my_page = MyPage(page)
    header = my_page.header  # Get the header
    # Now, do something with the header
    header.reveal_notification_drawer()
    ```
    """

    def __init__(self, page):
        super().__init__(page)
        self.header = Header(self.page,
                             self.page.locator("#portal-header"),
                             self
                             )
        self.notification_drawer = NotificationDrawer(self.page,
                                                      self.page.locator("#notifications-all"),
                                                      self
                                                      )
        self.popup_notification_container = PopupNotificationContainer(
            self.page, self.page.locator("#notifications-visible"), self
        )
