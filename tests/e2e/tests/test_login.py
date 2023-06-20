from pages.base import expect
from pages.portal.home_page.logged_in import HomePageLoggedIn
from pages.portal.login_page import LoginPage


def test_login(navigate_to_login_page, username, password):
    page = navigate_to_login_page
    login_page = LoginPage(page)
    login_page.login(username, password)

    home_page_logged_in = HomePageLoggedIn(page)
    home_page_logged_in.assert_logged_in()
