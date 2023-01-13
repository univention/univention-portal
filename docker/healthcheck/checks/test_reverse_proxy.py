from http import HTTPStatus
from urllib.parse import urljoin

import pytest
import requests


@pytest.fixture
def proxy_url(environ):
    proxy_base_url = environ.REVERSE_PROXY_URL

    def inner(subpath):
        return urljoin(proxy_base_url, subpath)

    return inner


def test_base_redirects(environ):
    response = requests.get(environ.REVERSE_PROXY_URL, allow_redirects=False)
    assert response.status_code == HTTPStatus.FOUND

def test_ucs_machine_is_reachable_via_proxy(proxy_url):
    response = requests.get(proxy_url("/univention/"), allow_redirects=False)
    assert response.status_code == HTTPStatus.FOUND

def test_frontend_is_reachable(proxy_url):
    response = requests.get(proxy_url("/univention/portal/"))
    assert response.status_code == HTTPStatus.OK

def test_portal_server_is_reachable(proxy_url):
    response = requests.get(proxy_url("/univention/portal/portal.json"))
    assert response.status_code == HTTPStatus.OK

def test_notifications_api_is_reachable(proxy_url):
    response = requests.get(proxy_url("/univention/portal/notifications-api/v1/notifications/"))
    assert response.status_code == HTTPStatus.OK
