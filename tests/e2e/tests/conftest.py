import uuid
from urllib.parse import urljoin

import pytest
import requests
from playwright.sync_api import expect

from pages.portal.login_page import LoginPage
from pages.portal.portal_home_page_logged_in import PortalHomePageLoggedIn
from pages.portal.portal_home_page_public import PortalHomePagePublic


def pytest_addoption(parser):
    parser.addoption("--username", default="Administrator",
                     help="Portal login username",
                     )
    parser.addoption("--password", default="univention",
                     help="Portal login password",
                     )
    parser.addoption("--notifications-api-base-url",
                     default="http://localhost:8000/univention/portal/notifications-api/",
                     help="Base URL of the notification API",
                     )
    parser.addoption("--portal-base-url", default="http://localhost:8000",
                     help="Base URL of the univention portal",
                     )


@pytest.fixture()
def username(pytestconfig):
    return pytestconfig.option.username


@pytest.fixture()
def password(pytestconfig):
    return pytestconfig.option.password


@pytest.fixture()
def notifications_api_base_url(pytestconfig):
    return pytestconfig.getoption("--notifications-api-base-url")


@pytest.fixture()
def browser_context_args(browser_context_args, pytestconfig):
    browser_context_args["base_url"] = pytestconfig.getoption("--portal-base-url")
    return browser_context_args


@pytest.fixture()
def portal_home_page_public(page):
    page.goto("/")
    this_page = PortalHomePagePublic(page)
    expect(this_page.login_widget).to_be_visible()
    return this_page


@pytest.fixture()
def login_page(page, portal_home_page_public):
    portal_home_page_public.click_login_widget()
    this_page = LoginPage(page)
    expect(this_page.username_input).to_be_visible()
    expect(this_page.password_input).to_be_visible()
    expect(this_page.login_button).to_be_visible()
    return this_page


@pytest.fixture()
def portal_home_page_logged_in(page, login_page, username, password):
    login_page.login(username=username,
                     password=password,
                     )
    this_page = PortalHomePageLoggedIn(page)
    expect(this_page.umc_heading).to_be_visible()
    return this_page


@pytest.fixture()
def login_and_clear_old_notifications(portal_home_page_logged_in):
    header = portal_home_page_logged_in.header
    notification_drawer = portal_home_page_logged_in.notification_drawer
    notification_drawer.remove_all_notifications()
    header.reveal_notification_drawer()
    expect(notification_drawer.no_notifications_heading).to_be_visible()
    expect(notification_drawer.notifications).to_have_count(0)
    header.hide_notification_drawer()
    yield portal_home_page_logged_in
    notification_drawer.remove_all_notifications()
    header.reveal_notification_drawer()
    expect(notification_drawer.no_notifications_heading).to_be_visible()
    expect(notification_drawer.notifications).to_have_count(0)


@pytest.fixture()
def notification(notifications_api_base_url):
    unique_id = str(uuid.uuid4())
    json_data = {
        "sourceUid": unique_id,
        "targetUid": unique_id,
        "title": "string",
        "details": "string",
        "severity": "info",
        "sticky": True,
        "needsConfirmation": True,
        "notificationType": "event",
        "link": {
            "url": "https://example.org",
            "text": "string",
            "target": "string",
        },
        "data": {},
    }
    raw_request = requests.Request(
        "POST",
        url=urljoin(notifications_api_base_url, "./v1/notifications"),
        json=json_data,
    )
    prepped_request = raw_request.prepare()
    return prepped_request
