from pages.base import BasePage


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
