from playwright.sync_api import expect

from pages.portal_home_page_logged_in import PortalHomePageLoggedIn


def test_login(page, login_page, username, password):
    login_page.login(username, password)
    portal_home_page_logged_in = PortalHomePageLoggedIn(page)
    expect(portal_home_page_logged_in.umc_heading).to_be_visible()
