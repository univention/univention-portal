import json
from uuid import uuid4

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_hello():
    response = client.get("/v1/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, world!"}


def test_create_notification():
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
    response = client.post("/v1/notifications", request_data)
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_get_latest_notifications():
    response = client.get("/v1/notifications/test_user/latest")
    assert response.status_code == 200
    assert response.json() == []


def test_get_notification_by_id():
    raise NotImplementedError()


def test_mark_notification_read():
    raise NotImplementedError()


def test_confirm_notification():
    raise NotImplementedError()


def test_delete_notification():
    raise NotImplementedError()
