from pages.portal.common.portal_page import PortalPage


class HomePage(PortalPage):
    """
    Common home page stuff applicable for both logged in and logged out state
    should be put here
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
