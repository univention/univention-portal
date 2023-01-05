from datetime import datetime
from uuid import uuid4
import json

import pytest


sourceUid = str(uuid4())
targetUid = str(uuid4())
request_data = {
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


def test_create_notification(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_get_latest_notifications(filled_db, client):
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_mark_notification_read(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.post(f'/v1/notifications/{id}/read')
    readTime = response.json()['readTime']
    readDateTime = datetime.fromisoformat(readTime)
    assert readDateTime > now


def test_mark_notification_confirmed(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.post(f'/v1/notifications/{id}/confirm')
    assert datetime.fromisoformat(response.json()['confirmationTime']) > now


@pytest.mark.asyncio
async def test_stream_notifications(filled_db, mocker):
    from app.api.v1.api import stream_notifications
    from app.crud.notification_service import NotificationService

    request = mocker.MagicMock()
    request.is_disconnected = mocker.AsyncMock(side_effect=[False, True])
    mocker.patch('app.api.v1.api.STREAM_DELAY', new=0)

    service = NotificationService()

    result = await stream_notifications(request, service, filled_db)
    body = [x async for x in result.body_iterator]
    event = body.pop()

    assert event['event'] == "new_notification"
    assert_is_valid_json(event['data'])


def assert_is_valid_json(value):
    json.loads(value)
