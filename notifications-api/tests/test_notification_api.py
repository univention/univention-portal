from datetime import datetime
import json
import pytest
from sqlmodel import Session, create_engine, delete
from uuid import uuid4

from app.db import get_session
from app.main import app
from app.models.notification_model import Notification, NotificationBase

from fastapi.testclient import TestClient

SQLALCHEMY_DATABASE_URL = "sqlite:///./test2.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)


def override_get_db() -> Session:
    with Session(engine) as session:
        yield session


NotificationBase.metadata.create_all(bind=engine)
app.dependency_overrides[get_session] = override_get_db
client = TestClient(app)
db = next(override_get_db())


@pytest.fixture()
def empty_db():
    statement = delete(Notification)
    db.exec(statement)
    db.commit()


@pytest.fixture()
def filled_db(empty_db):
    db.add(Notification(
        id=str(uuid4()),
        details="some details",
        title="some title",
        notificationType="event",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        receiveTime=datetime.now()
    ))
    db.add(Notification(
        id=str(uuid4()),
        details="some details",
        title="some title",
        notificationType="announcement",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        receiveTime=datetime.now()
    ))
    db.commit()


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


def test_create_notification(empty_db):
    response = client.post('/v1/notifications', request_data)
    assert response.status_code == 201
    response_json = response.json()
    assert response_json['id'] is not None
    assert response_json['sourceUid'] == sourceUid
    assert response_json['targetUid'] == targetUid


def test_get_latest_notifications(filled_db):
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_mark_notification_read(empty_db):
    response = client.post('/v1/notifications', request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.patch(f'/v1/notifications/{id}/read')
    readTime = response.json()['readTime']
    readDateTime = datetime.fromisoformat(readTime)
    assert readDateTime > now


def test_confirm_notification(empty_db):
    response = client.post('/v1/notifications', request_data)
    response = client.get('/v1/notifications/latest?page=1&limit=10&type=event')
    id = response.json()[0]['id']
    now = datetime.now()
    response = client.patch(f'/v1/notifications/{id}/confirm')
    assert datetime.fromisoformat(response.json()['confirmationTime']) > now
