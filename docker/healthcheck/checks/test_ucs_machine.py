from http import HTTPStatus
from urllib.parse import urljoin
import requests


def test_ucs_machine_is_reachable(environ):
    response = requests.get(environ.UCS_BASE_URL)
    assert response.status_code == HTTPStatus.OK

def test_ucs_machine_exposes_portal_data(environ):
    url = urljoin(environ.UCS_BASE_URL, './univention/internal/portal')
    response = requests.get(url)
    assert response.status_code == HTTPStatus.OK

def test_ucs_machine_exposes_umc(environ):
    url = urljoin(environ.UCS_BASE_URL, './univention/get/session-info')
    response = requests.get(url)
    assert response.status_code == HTTPStatus.UNAUTHORIZED
