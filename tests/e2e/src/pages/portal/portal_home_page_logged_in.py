from pages.portal.common.portal_page import PortalPage


class PortalHomePageLoggedIn(PortalPage):
    """This represents the logged in state of the portal's home page."""

    def __init__(self, page):
        super().__init__(page)
        self.umc_heading = page.get_by_text("Univention Management Console")
