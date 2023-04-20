from site import USER_SITE
from pages.base import expect
from pages.portal.home_page.logged_in import HomePageLoggedIn
from pages.portal.users.users_page import UsersPage
import pytest

# test sequence
# - log in as admin
    # - check if dummy user exists
    # - create dummy user
# - log out
    # - log in as dummy user
        # - open password change dialog
        # - submit new password
    # - log out
    # - log in with new password
    # - log out
# - log in as admin
    # - remove dummy user
# - log out

USERS_PAGE = '/univention/management/?header=try-hide&overview=false&menu=false#module=udm:users/user'
DUMMY_USER_NAME = 'dummy'
DUMMY_USER_PASSWORD_1 = 'firstpass'
DUMMY_USER_PASSWORD_2 = 'secondpass'

@pytest.fixture
def dummy_user(navigate_to_home_page_logged_in, username, password) -> HomePageLoggedIn:
    page = navigate_to_home_page_logged_in
    home_page_logged_in = HomePageLoggedIn(page)
    home_page_logged_in.page.goto(USERS_PAGE)

    users_page = UsersPage(home_page_logged_in.page)
    # TODO: The user list takes unnaturally long to appear. We are using a locator timeout
    # to handle that. Replace this with an increased global timeout as soon as we figure out how.
    expect(users_page.add_user_button).to_be_visible(timeout=10000)
    expect(home_page_logged_in.page.locator('[id*=dummy]')).not_to_be_visible()

    users_page.add_user_button.click()
    users_page.page.get_by_role('textbox', name='Last name *').fill('dummy')
    users_page.page.get_by_role('textbox', name='User name *').fill('dummy')
    users_page.page.get_by_role('button', name='Next').click()
    
    users_page.page.get_by_role('textbox', name='Password *').fill(DUMMY_USER_PASSWORD_1)
    users_page.page.get_by_role('textbox', name='Password (retype) *').fill(DUMMY_USER_PASSWORD_1)
    users_page.page.get_by_role('button', name='Create user').click()
    users_page.page.keyboard.down('Escape')
    home_page_logged_in.logout()

    yield home_page_logged_in

    home_page_logged_in.navigate(username, password)
    home_page_logged_in.page.goto(USERS_PAGE)
    
    expect(home_page_logged_in.page.locator('[id*=dummy]')).to_be_visible(timeout=10000)
    home_page_logged_in.page.locator('[id*=dummy]').click()
    home_page_logged_in.page.get_by_role('button', name='Delete').click()
    home_page_logged_in.page.get_by_role('dialog').filter(has_text='Delete objects').get_by_role('button', name='Delete').click()
    expect(home_page_logged_in.page.locator('[id*=dummy]')).not_to_be_visible()
    home_page_logged_in.logout()


def test_non_admin_can_change_password(dummy_user: HomePageLoggedIn):
    dummy_user.navigate(DUMMY_USER_NAME, DUMMY_USER_PASSWORD_1)
    dummy_user.page.goto('/univention/portal/#/selfservice/passwordchange')
    dummy_user.page.get_by_test_id('password-box').fill(DUMMY_USER_PASSWORD_1)
    dummy_user.page.get_by_test_id('new-password-box').fill(DUMMY_USER_PASSWORD_2)
    dummy_user.page.get_by_test_id('retype-password-box').fill(DUMMY_USER_PASSWORD_2)
    dummy_user.page.get_by_role('button', name='Change password').click()
    dummy_user.logout()
    dummy_user.navigate(DUMMY_USER_NAME, DUMMY_USER_PASSWORD_2)
    dummy_user.logout()
