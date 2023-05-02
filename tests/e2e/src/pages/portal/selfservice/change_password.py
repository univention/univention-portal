import re
import string

from pages.base import BasePage
from pages.portal.home_page.logged_in import HomePageLoggedIn


class ChangePasswordDialogPage(BasePage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.old_password_box = self.page.get_by_test_id('password-box')
        self.new_password_box = self.page.get_by_test_id('new-password-box')
        self.retype_password_box = self.page.get_by_test_id('retype-password-box')
        self.submit_button = self.page.get_by_role('button', name='Change password')

    def navigate(self, username, password):
        home_page_logged_in = HomePageLoggedIn(self.page)
        home_page_logged_in.navigate(username, password)
        home_page_logged_in.reveal_right_side_menu()
        home_page_logged_in.right_side_menu.click_entry("User settings")
        # TODO: Using regular expression to target both UCS and SouvAP envs. Needs a better solution.
        home_page_logged_in.right_side_menu.click_sub_entry(re.compile("Change your password|Update my password"))

    def change_password(self, old_password: string, new_password: string):
        self.old_password_box.fill(old_password)
        self.new_password_box.fill(new_password)
        self.retype_password_box.fill(new_password)
        self.submit_button.click()
