from pages.base import expect
from pages.portal.users.users_page import UsersPage


def test_user_list(navigate_to_users_page):
    page, tab_admin = navigate_to_users_page
    users_page = UsersPage(tab_admin)
    # TODO: The user list takes unnaturally long to appear. We are using a locator timeout
    # to handle that. Replace this with an increased global timeout as soon as we figure out how.
    expect(users_page.add_user_button).to_be_visible(timeout=10000)
    expect(users_page.column_header_name).to_be_visible()
    expect(users_page.column_header_type).to_be_visible()
    expect(users_page.column_header_path).to_be_visible()
