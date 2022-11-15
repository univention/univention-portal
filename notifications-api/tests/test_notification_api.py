from datetime import datetime
import json
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app
from app.db import get_session

app.dependency_overrides[get_session] = get_session

client = TestClient(app)


def test_hello():
    response = client.get('v1')
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, world!"}


sourceUid = str(uuid4())
targetUid = str(uuid4())
request_data = json.dumps({
    "sourceUid": sourceUid,
    "targetUid": targetUid,
    "title": "Hello from application!",
    "details": "This is just an example notification.",
    "severity": "info",
    "sticky": False,
    "needsConfirmation": False,
    "notificationType": "event",
    "data": {
        "additionalProperty1": "some value",
        "additionalProperty2": 45
    }
})


def test_create_notification():
    response = client.post('/v1/notifications', request_data)
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_get_latest_notifications():
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    assert response.status_code == 200
    assert False, "seed test database and check for validity of results"


def test_mark_notification_read():
    response = client.post('/v1/notifications', request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.patch(f'/v1/notifications/{id}/read')
    readTime = response.json()['readTime']
    readDateTime = datetime.fromisoformat(readTime)
    assert readDateTime > now


def test_confirm_notification():
    response = client.post('/v1/notifications', request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.patch(f'/v1/notifications/{id}/confirm')
    assert datetime.fromisoformat(response.json()['confirmationTime']) > now
