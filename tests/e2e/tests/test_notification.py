from playwright.sync_api import expect
from requests import Session


def test_notification(login_and_clear_old_notifications, notification):
    portal_home_page_logged_in = login_and_clear_old_notifications
    popup_notification_container = portal_home_page_logged_in.popup_notification_container
    expect(popup_notification_container.part).to_be_hidden()
    s = Session()
    response = s.send(notification)
    assert response.ok, \
        f"Got status {response.status_code} while sending notification"
    expect(popup_notification_container.part).to_be_visible()
    expect(popup_notification_container.notifications).to_have_count(1)
    expect(popup_notification_container.notification(0).element).to_be_visible()
