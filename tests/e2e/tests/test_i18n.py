from pages.base import expect
from pages.portal.home_page.logged_in import HomePage


def test_user_can_switch_language_to_german(navigate_to_home_page_logged_out):
    page = navigate_to_home_page_logged_out
    home_page = HomePage(page)
    home_page.switch_language("Deutsch")

    assert home_page.get_language() == "de"

    home_page.reveal_right_side_menu()
    expect(home_page.right_side_menu.menu_entry("Sprache ändern")).to_be_visible()
    expect(home_page.header.get_by_role("button", name="Suche")).to_be_visible()


def test_user_can_switch_language_to_english(navigate_to_home_page_logged_out):
    page = navigate_to_home_page_logged_out
    home_page = HomePage(page)
    home_page.switch_language("Deutsch")
    home_page.switch_language("English")

    assert home_page.get_language() == "en"

    home_page.reveal_right_side_menu()
    expect(home_page.right_side_menu.menu_entry("Change Language")).to_be_visible()
    expect(home_page.header.get_by_role("button", name="Search")).to_be_visible()
