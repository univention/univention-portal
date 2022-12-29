
from app.crud.notification_service import NotificationService

from datetime import datetime
import json
import pytest
from sqlmodel import Session, create_engine, delete
from uuid import uuid4

from app.db import get_session
from app.main import app
from app.models.notification_model import Notification, NotificationBase

from fastapi.testclient import TestClient


# TODO: Cleanup the whole database session fixtures, copied from the other test file.

# TODO: Cannot we use an in-memory db here?

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



def test_pop_notification_for_sse(filled_db):
    service = NotificationService()
    # TODO: Why is db to be used instead of filled_db?
    result = service.pop_notifications_for_sse(db=db)
    assert len(result) == 2
