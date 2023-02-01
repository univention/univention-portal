from pages.portal_page import PortalPage


class PortalHomePagePublic(PortalPage):
    """
    This represents the portal homepage from the point-of-view of a user
    who has not yet logged in.
    """
    def __init__(self, page):
        super().__init__(page)
        self.login_widget = page.get_by_role("link", name="Login Same tab")

    def click_login_widget(self):
        self.login_widget.click()
