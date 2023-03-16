import asyncio
import json
from datetime import datetime, timedelta, timezone
from http import HTTPStatus
from uuid import uuid4

import pytest


sourceUid = str(uuid4())
targetUid = str(uuid4())


@pytest.fixture()
def request_data():
    return {
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
            "additionalProperty2": 45,
        },
    }


@pytest.fixture(autouse=True)
def mock_messaging(mocker):
    mocker.patch('app.messaging.publish_notification')


def test_create_notification(empty_db, request_data, client):
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.CREATED
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_create_notification_with_expiry_with_tz(empty_db, request_data, client):
    request_data["expireTime"] = "2099-01-26T12:34:56Z"
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.CREATED
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_create_notification_with_expiry_without_tz(empty_db, request_data, client):
    request_data["expireTime"] = "2099-01-26T12:34:56"
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_create_notification_already_expired_with_tz(empty_db, request_data, client):
    request_data["expireTime"] = "2001-01-26T12:34:56+01:00"
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_create_notification_already_expired_without_tz(empty_db, request_data, client):
    request_data["expireTime"] = "2001-01-26T12:34:56"
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.UNPROCESSABLE_ENTITY


def test_create_notification_with_link(empty_db, request_data, client):
    request_data["link"] = {
        "url": "https://www.univention.de",
        "text": "univention web site",
        "target": "_self",
    }
    response = client.post('/v1/notifications/', json=request_data)
    assert response.status_code == HTTPStatus.CREATED
    response_json = response.json()
    assert response_json['link'] == request_data['link']


def test_get_notifications(filled_db, client):
    response = client.get('/v1/notifications/')
    assert response.status_code == HTTPStatus.OK
    assert len(response.json()) == 1


def test_hide_notification(empty_db, request_data, client):
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


def test_get_notification(empty_db, request_data, client):
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


def test_delete_notification(empty_db, request_data, client):
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


def test_mark_notification_read(empty_db, request_data, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/')
    id = response.json()[0]['id']
    now = datetime.now(timezone.utc)
    response = client.post(f'/v1/notifications/{id}/read')
    readTime = response.json()['readTime']
    readDateTime = datetime.fromisoformat(readTime)
    assert readDateTime > now


def test_mark_notification_confirmed(empty_db, request_data, client):
    response = client.post('/v1/notifications/', json=request_data)
    response = client.get('/v1/notifications/')
    id = response.json()[0]['id']
    now = datetime.now(timezone.utc)
    response = client.post(f'/v1/notifications/{id}/confirm')
    assert datetime.fromisoformat(response.json()['confirmationTime']) > now


@pytest.mark.asyncio()
async def test_stream_notifications(mocker):
    from app import messaging
    from app.api.v1.api import stream_notifications

    request = mocker.MagicMock()
    mock_receiver = mocker.patch.object(messaging, "receive_notifications")
    stub_data = json.dumps(["stub_topic", {"stub": "value"}])
    mock_receiver().__aiter__.return_value = [stub_data]

    result = await stream_notifications(request)
    body = [x async for x in result.body_iterator]
    event = body.pop()

    assert event['event'] == "stub_topic"
    assert_is_valid_json(event['data'])


@pytest.mark.asyncio()
async def test_get_expired_notifications(empty_db, request_data, client):
    # create a notification that expires in 1 second
    notification_json = dict(**request_data)
    notification_json['expireTime'] = (datetime.now(timezone.utc) + timedelta(seconds=1)).isoformat()
    response = client.post('/v1/notifications/', json=notification_json)
    assert response.status_code == HTTPStatus.CREATED
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid

    response = client.get('/v1/notifications/')
    assert response.status_code == HTTPStatus.OK
    assert len(response.json()) == 1

    # wait until notification has expired
    await asyncio.sleep(1.1)

    # notification should not be returned anymore
    response = client.get('/v1/notifications/')
    assert response.status_code == HTTPStatus.OK
    assert len(response.json()) == 0


@pytest.mark.asyncio()
async def test_get_expired_notification(empty_db, request_data, client):
    # create a notification that expires in 100 ms
    notification_json = dict(**request_data)
    notification_json['expireTime'] = (datetime.now(timezone.utc) + timedelta(seconds=0.1)).isoformat()
    response = client.post('/v1/notifications/', json=notification_json)
    assert response.status_code == HTTPStatus.CREATED
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid

    response = client.get('/v1/notifications/' + response_json['id'])
    assert response.status_code == HTTPStatus.OK

    # wait until notification has expired
    await asyncio.sleep(1.1)

    # notification should not be returned anymore
    response = client.get('/v1/notifications/' + response_json['id'])
    assert response.status_code == HTTPStatus.NOT_FOUND


def assert_is_valid_json(value):
    json.loads(value)
