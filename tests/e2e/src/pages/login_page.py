from pages.portal_page import PortalPage


class LoginPage(PortalPage):
    def __init__(self, page):
        super().__init__(page)
        self.username_input = page.get_by_label("Username")
        self.password_input = page.get_by_label("Password", exact=True)
        self.login_button = page.get_by_role("button", name="Login")

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
