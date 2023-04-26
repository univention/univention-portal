import re

from pages.base import expect
from pages.portal.home_page.base import HomePage
from pages.portal.login_page import LoginPage


class HomePageLoggedIn(HomePage):
    """This represents the logged in state of the portal's home page."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.umc_heading = self.page.get_by_text("Univention Management Console", exact=True)
        self.users_tile = self.page.get_by_role("link", name=re.compile("User New Tab|Users iFrame"))

    def navigate(self, username, password):
        self.page.goto("/")
        try:
            expect(self.cookie_dialog).to_be_visible()
        except AssertionError:
            pass
        else:
            self.accept_cookies()
        self.reveal_right_side_menu()
        try:
            # Checking login state only since check_its_there() is currently empty
            expect(self.right_side_menu.logout_button).to_be_visible()
            expect(self.right_side_menu.login_button).to_be_hidden()
        except AssertionError:
            login_page = LoginPage(self.page)
            login_page.navigate()
            login_page.check_its_there()
            login_page.login(username, password)
            self.reveal_right_side_menu()
            expect(self.right_side_menu.logout_button).to_be_visible()
            expect(self.right_side_menu.login_button).to_be_hidden()
        finally:
            self.hide_right_side_menu()

    def check_its_there(self):
        # TODO: There seems to be nothing that's necessarily common between the UCS and SouvAP envs
        # We resort to checking nothing here.
        pass

    def click_users_tile(self):
        self.users_tile.click()
