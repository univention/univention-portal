import string

from pages.base import BasePage, BasePagePart, expect


# TODO: The two classes in here should be handled in a better way,
# once there is a concept for handling the two different testing environments
# SouvAP and local UCS


class UsersPage(BasePage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: These should be separated into a user list page part once the page part
        # gets an appropriate `data-testid` attribute or identifier.
        # Currently, it is something generic like `id="umc_widgets_ContainerWidget_10"`

        self.add_user_button = self.page.get_by_role("button", name="Add")
        self.column_header_name = self.page.get_by_role("columnheader", name="Name")
        self.column_header_type = self.page.get_by_role("columnheader", name="Type")
        self.column_header_path = self.page.get_by_role("columnheader", name="Path")


class UCSUsersPage(BasePage):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # TODO: using an iFrame here might be different in the SouvAP env
        # and will likely break test_users_page.
        self.iframe = self.page.frame_locator("iframe[title=\"Users\"]")
        self.add_user_dialog = AddUserDialog(self.iframe.locator(":scope"))
        # TODO: These should be separated into a user list page part once the page part
        # gets an appropriate `data-testid` attribute or identifier.
        # Currently, it is something generic like `id="umc_widgets_ContainerWidget_10"`

        self.add_user_button = self.iframe.get_by_role("button", name="Add")
        self.column_header_name = self.iframe.get_by_role("columnheader", name="Name")
        self.column_header_type = self.iframe.get_by_role("columnheader", name="Type")
        self.column_header_path = self.iframe.get_by_role("columnheader", name="Path")
        self.delete_button = self.iframe.get_by_role("button", name="Delete")
        self.delete_confirm_button = self.iframe.get_by_role("dialog").filter(has_text="Delete objects").get_by_role("button", name="Delete")

    def add_user(self, username: string, password: string):
        expect(self.add_user_button).to_be_visible(timeout=10000)
        self.add_user_button.click()
        self.add_user_dialog.add_user(username, password)
        expect(self.iframe.locator(f"[id*={username}]")).to_be_visible()

    def remove_user(self, username: string):
        self.iframe.locator(f"[id*={username}]").click()
        self.delete_button.click()
        self.delete_confirm_button.click()
        self.iframe.locator(f"[id*={username}]").wait_for(state='hidden')


class AddUserDialog(BasePagePart):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.container_indicator = self.get_by_label("User template")
        self.last_name = self.get_by_role("textbox", name="Last name *")
        self.username = self.get_by_role("textbox", name="User name *")
        self.next_button = self.get_by_role("button", name="Next")
        self.password_box = self.get_by_role("textbox", name="Password *")
        self.retype_box = self.get_by_role("textbox", name="Password (retype) *")
        self.submit_password_button = self.get_by_role("button", name="Create user")

    def add_user(self, username: string, password: string):
        # expect(self.container_indicator).to_be_visible()
        self.next_button.click()
        self.last_name.fill(username)
        self.username.fill(username)
        self.next_button.click()
        self.password_box.fill(password)
        self.retype_box.fill(password)
        self.submit_password_button.click()
        expect(self.get_by_text(f"The user \"{username}\" has been created.")).to_be_visible()
        self.page_part_locator.press("Escape")
