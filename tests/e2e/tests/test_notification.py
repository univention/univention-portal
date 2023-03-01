from requests import Session

from pages.base import expect
from pages.portal.home_page.logged_in import HomePageLoggedIn


def test_notification(login_and_clear_old_notifications, prepped_notification):
    page = login_and_clear_old_notifications
    home_page_logged_in = HomePageLoggedIn(page)
    expect(home_page_logged_in.popup_notification_container).to_be_hidden()
    s = Session()
    response = s.send(prepped_notification)
    assert response.ok, \
        f"Got status {response.status_code} while sending notification"
    expect(home_page_logged_in.popup_notification_container).to_be_visible()
    expect(home_page_logged_in.popup_notification_container.notifications).to_have_count(1)
    expect(home_page_logged_in.popup_notification_container.notification(0)).to_be_visible()
