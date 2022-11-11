from datetime import datetime
import requests
import json
from uuid import uuid4


def test_hello():
    response = requests.get("http://0.0.0.0:8000/v1/")
    assert response.status_code == 200
    response_content = json.loads(response.text)
    assert response_content["message"] == "Hello, world!"


def test_create_notification():
    id = uuid4().hex
    sourceUid = uuid4().hex
    targetUid = uuid4().hex
    request_data = {
        "id": id,
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
    }
    response = requests.post("http://0.0.0.0:8000/v1/notifications", json.dumps(request_data))
    assert response.status_code == 201
    response_content = json.loads(response.text)
    assert response_content == {
        "id": id,
        "sourceUid": sourceUid,
        "targetUid": targetUid,
        "title": "Hello from application!",
        "details": "This is just an example notification.",
        "severity": "info",
        "receiveTime": "2022-08-11T16:22:34Z-02:00",
        "readTime": None,
        "confirmationTime": None,
        "expireTime": None,
        "sticky": False,
        "needsConfirmation": False,
        "notificationType": "event",
        "data": {
            "additionalProperty1": "some value",
            "additionalProperty2": 45
    }
}
