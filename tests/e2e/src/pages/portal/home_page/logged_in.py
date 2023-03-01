from pages.base import expect
from pages.portal.home_page.base import HomePage
from pages.portal.login_page import LoginPage


class HomePageLoggedIn(HomePage):
    """This represents the logged in state of the portal's home page."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.umc_heading = self.page.get_by_text("Univention Management Console", exact=True)

    def navigate(self, username, password):
        self.page.goto("/")
        try:
            self.check_its_there()
        except AssertionError:
            login_page = LoginPage(self.page)
            login_page.navigate()
            login_page.check_its_there()
            login_page.login(username, password)
        self.reveal_right_side_menu()
        expect(self.right_side_menu.logout_button).to_be_visible()
        expect(self.right_side_menu.login_button).to_be_hidden()

    def check_its_there(self):
        expect(self.umc_heading).to_be_visible()
