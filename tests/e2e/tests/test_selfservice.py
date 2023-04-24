import pytest

from pages.base import expect
from pages.portal.home_page.logged_in import HomePageLoggedIn
from pages.portal.selfservice.change_password import ChangePasswordDialogPage
from pages.portal.users.users_page import UsersPage


DUMMY_USER_NAME = "dummy"
DUMMY_USER_PASSWORD_1 = "firstpass"
DUMMY_USER_PASSWORD_2 = "secondpass"


@pytest.fixture()
def dummy_user_home(navigate_to_home_page_logged_in, username, password) -> HomePageLoggedIn:
    page = navigate_to_home_page_logged_in
    home_page = HomePageLoggedIn(page)

    users_page = UsersPage(page)
    users_page.navigate()
    users_page.add_user(DUMMY_USER_NAME, DUMMY_USER_PASSWORD_1)

    home_page.logout()

    yield home_page

    home_page.navigate(username, password)

    users_page.navigate()
    users_page.remove_user(DUMMY_USER_NAME)

    home_page.logout()


def test_non_admin_can_change_password(dummy_user_home: HomePageLoggedIn):
    dummy_user_home.navigate(DUMMY_USER_NAME, DUMMY_USER_PASSWORD_1)

    change_password_page = ChangePasswordDialogPage(dummy_user_home.page)
    change_password_page.navigate()
    change_password_page.change_password(DUMMY_USER_PASSWORD_1, DUMMY_USER_PASSWORD_2)

    dummy_user_home.logout()
    dummy_user_home.navigate(DUMMY_USER_NAME, DUMMY_USER_PASSWORD_2)
    expect(dummy_user_home.page).not_to_have_title("Univention Login")
    dummy_user_home.logout()
