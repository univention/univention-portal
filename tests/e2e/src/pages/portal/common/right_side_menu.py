from pages.base import BasePagePart


class RightSideMenu(BasePagePart):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.logout_button = self.get_by_role("button", name="Logout")
        self.login_button = self.get_by_role("button", name="Login")

    def click_logout_button(self):
        self.logout_button.click()

    def click_login_button(self):
        self.login_button.click()

    def click_entry(self, name):
        self.menu_entry(name).click()

    def menu_entry(self, name):
        return self.page_part_locator.get_by_role("button", name=name)

    def click_sub_entry(self, name):
        self.sub_menu_entry(name).click()

    def sub_menu_entry(self, name):
        return self.page_part_locator.get_by_role("link", name=name)
