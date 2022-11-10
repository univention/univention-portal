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
    notification_data = {
        "title": "my notification",
        "source_uuid": str(uuid4()),
        "target_uuid": str(uuid4()),
        "type": "event",
        "severity": "info",
        "send_time": datetime.now().isoformat()
    }
    response = requests.post("http://0.0.0.0:8000/v1/notifications", json.dumps(notification_data))
    assert response.status_code == 200
