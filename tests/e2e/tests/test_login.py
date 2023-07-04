from playwright_pages_base import expect
from playwright_pages_ucs_portal.home_page.logged_in import HomePageLoggedIn
from playwright_pages_ucs_portal.login_page import LoginPage


def test_login(navigate_to_login_page, username, password):
    page = navigate_to_login_page
    login_page = LoginPage(page)
    login_page.login(username, password)
    home_page_logged_in = HomePageLoggedIn(page)
    # TODO: We are only checking the login state here since there doesn't seem to be
    # anything common between the UCS and SouvAP envs that's unique to the home page's logged-in state
    home_page_logged_in.reveal_area(home_page_logged_in.right_side_menu, home_page_logged_in.header.hamburger_icon)
    expect(home_page_logged_in.right_side_menu.logout_button).to_be_visible()
    expect(home_page_logged_in.right_side_menu.login_button).to_be_hidden()
