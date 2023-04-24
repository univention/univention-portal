import string
from xml.sax.xmlreader import Locator

from pages.base import BasePage, BasePagePart, expect


class UsersPage(BasePage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.add_user_dialog = AddUserDialog(self.page.get_by_role("dialog", name="Add a new user."))
        # TODO: These should be separated into a user list page part once the page part
        # gets an appropriate `data-testid` attribute or identifier.
        # Currently, it is something generic like `id="umc_widgets_ContainerWidget_10"`
        self.add_user_button = self.page.get_by_role("button", name="Add")
        self.column_header_name = self.page.get_by_role("columnheader", name="Name")
        self.column_header_type = self.page.get_by_role("columnheader", name="Type")
        self.column_header_path = self.page.get_by_role("columnheader", name="Path")
        self.delete_button = self.page.get_by_role("button", name="Delete")
        self.delete_confirm_button = self.page.get_by_role("dialog").filter(has_text="Delete objects").get_by_role("button", name="Delete")

    def navigate(self):
        self.page.goto("/univention/management/?header=try-hide&overview=false&menu=false#module=udm:users/user")
        # TODO: The user list takes unnaturally long to appear. We are using a locator timeout
        # to handle that. Replace this with an increased global timeout as soon as we figure out how.
        expect(self.add_user_button).to_be_visible(timeout=10000)

    def add_user(self, username: string, password: string):
        self.add_user_button.click()
        self.add_user_dialog.add_user(username, password)

    def remove_user(self, username: string):
        self.page.locator(f"[id*={username}]").click()
        self.delete_button.click()
        self.delete_confirm_button.click()
        self.page.locator(f"[id*={username}]").wait_for(state='hidden')

    def get_user(self, username: string) -> Locator:
        self.page.locator(f"[id*={username}]")


class AddUserDialog(BasePagePart):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.last_name = self.get_by_role("textbox", name="Last name *")
        self.username = self.get_by_role("textbox", name="User name *")
        self.submit_user_button = self.get_by_role("button", name="Next")
        self.password_box = self.get_by_role("textbox", name="Password *")
        self.retype_box = self.get_by_role("textbox", name="Password (retype) *")
        self.submit_password_button = self.get_by_role("button", name="Create user")

    def add_user(self, username: string, password: string):
        self.last_name.fill(username)
        self.username.fill(username)
        self.submit_user_button.click()
        self.password_box.fill(password)
        self.retype_box.fill(password)
        self.submit_password_button.click()
        self.page.get_by_text(f"The user \"{username}\" has been created.")
        self.page_part_locator.press("Escape")
        self.page.locator(f"[id*={username}]").wait_for()
