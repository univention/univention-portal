import re

from pages.base import expect
from pages.portal.common.portal_page import PortalPage
from pages.portal.home_page.logged_out import HomePageLoggedOut


class LoginPage(PortalPage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: Using regular expr to target different langs in SouvAP env. Needs better solution.
        # In headed mode, default language is English. In headless mode, it is Deutsch.
        self.username_input = self.page.get_by_label(re.compile("^(Username|Benutzername)"))
        self.password_input = self.page.get_by_label(re.compile("^Passwor(d|t)"))
        # TODO: Using regular expression to target both UCS and SouvAP envs. Needs a better solution.
        self.login_button = self.page.get_by_role("button", name=re.compile("^(Login|Sign In|Anmelden)"))

    def navigate(self):
        home_page = HomePageLoggedOut(self.page)
        home_page.navigate()
        home_page.check_its_there()
        self.reveal_right_side_menu()
        expect(self.right_side_menu.login_button).to_be_visible()
        expect(self.right_side_menu.logout_button).to_be_hidden()
        self.right_side_menu.click_login_button()

    def check_its_there(self):
        expect(self.username_input).to_be_visible()

    def fill_username(self, username):
        self.username_input.fill(username)

    def fill_password(self, password):
        self.password_input.fill(password)

    def click_login_button(self):
        self.login_button.click()

    def login(self, username, password):
        self.fill_username(username)
        self.fill_password(password)
        self.click_login_button()
