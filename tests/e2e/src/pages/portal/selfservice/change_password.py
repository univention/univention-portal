import string

from pages.base import BasePage


class ChangePasswordDialogPage(BasePage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.old_password_box = self.page.get_by_test_id('password-box')
        self.new_password_box = self.page.get_by_test_id('new-password-box')
        self.retype_password_box = self.page.get_by_test_id('retype-password-box')
        self.submit_button = self.page.get_by_role('button', name='Change password')

    def navigate(self):
        self.page.goto('/univention/portal/#/selfservice/passwordchange')

    def change_password(self, old_password: string, new_password: string):
        self.old_password_box.fill(old_password)
        self.new_password_box.fill(new_password)
        self.retype_password_box.fill(new_password)
        self.submit_button.click()
