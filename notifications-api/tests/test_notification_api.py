from datetime import datetime
from http import HTTPStatus
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


@pytest.fixture(autouse=True)
def mock_messaging(mocker):
    mocker.patch('app.messaging.publish_notification')


def test_create_notification(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_get_notifications(filled_db, client):
    response = client.get('/v1/notifications/')
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_hide_notification(empty_db, client):
    client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/')
    notification_data = response.json()[0]
    assert notification_data["popup"]

    notification_id = response.json()[0]['id']

    response = client.post(f'/v1/notifications/{notification_id}/hide')
    assert response.status_code == HTTPStatus.OK

    # TODO: we don't have a GET endpoint yet for a single notification,
    # refactor once this is implemented.
    response = client.get('/v1/notifications/')
    notification_data = response.json()[0]
    assert not notification_data["popup"]


def test_get_notification(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    notification_data = response.json()
    notification_id = notification_data['id']

    response = client.get(f'/v1/notifications/{notification_id}/')
    response_data = response.json()
    assert response.status_code == HTTPStatus.OK
    for key, value in request_data.items():
        assert response_data[key] == value


def test_get_notification_missing(stub_uuid, empty_db, client):
    response = client.get(f'/v1/notifications/{stub_uuid}/')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_delete_notification(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    notification_data = response.json()
    notification_id = notification_data['id']

    response = client.delete(f'/v1/notifications/{notification_id}/')
    assert response.status_code == HTTPStatus.OK

    response = client.get(f'/v1/notifications/{notification_id}/')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_delete_notification_missing(stub_uuid, empty_db, client):
    response = client.delete(f'/v1/notifications/{stub_uuid}/')
    assert response.status_code == HTTPStatus.NOT_FOUND


def test_mark_notification_read(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.post(f'/v1/notifications/{id}/read')
    readTime = response.json()['readTime']
    readDateTime = datetime.fromisoformat(readTime)
    assert readDateTime > now


def test_mark_notification_confirmed(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.post(f'/v1/notifications/{id}/confirm')
    assert datetime.fromisoformat(response.json()['confirmationTime']) > now


@pytest.mark.xfail(reason="Implementation is pending")
def test_invalidate_one_notification_by_sender(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    id = response.json()['id']
    response = client.post(f'/v1/notifications/{id}/invalidate')
    assert response.status_code == "200"


@pytest.mark.xfail(reason="Implementation is pending")
def test_bulk_invalidate_many_notifications_by_sender(empty_db, client):
    response = client.post('/v1/notifications/', json=request_data)
    id1 = response.json()['id']
    response = client.post('/v1/notifications/', json=request_data)
    id2 = response.json()['id']
    ids = [id1, id2]
    response = client.post('/v1/notifications/invalidate', json=ids)
    assert response.status_code == "200"


@pytest.mark.asyncio
async def test_stream_notifications(empty_db, mocker):
    from app import messaging
    from app.api.v1.api import stream_notifications
    from app.crud.notification_service import NotificationService

    request = mocker.MagicMock()
    mock_receiver = mocker.patch.object(messaging, "receive_notifications")
    stub_data = json.dumps(["stub_topic", {"stub": "value"}])
    mock_receiver().__aiter__.return_value = [stub_data]

    service = NotificationService()

    result = await stream_notifications(request, service, empty_db)
    body = [x async for x in result.body_iterator]
    event = body.pop()

    assert event['event'] == "stub_topic"
    assert_is_valid_json(event['data'])


def assert_is_valid_json(value):
    json.loads(value)
