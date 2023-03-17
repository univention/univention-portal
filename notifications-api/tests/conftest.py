
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, delete

from app import expiry_pruning
from app.db import get_session
from app.main import app
from app.models.notification_model import Notification, NotificationBase


SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False},
)


def override_get_db() -> Session:
    with Session(engine) as session:
        yield session


@pytest.fixture()
def client():
    """Return a prepared instance of FastAPI's TestClient."""
    test_client = TestClient(app)
    return test_client


@pytest.fixture(scope="session")
def patch_db_session():
    """
    Patch the database session in "app".

    This ensures that the test database is used when testing anything database
    related.
    """
    NotificationBase.metadata.create_all(bind=engine)
    app.dependency_overrides[get_session] = override_get_db

    # also patch the expiry pruner
    expiry_pruning.get_session = override_get_db


@pytest.fixture()
def empty_db(patch_db_session):
    """Return an empty database session."""
    db = next(override_get_db())
    statement = delete(Notification)
    db.exec(statement)
    db.commit()
    return db


@pytest.fixture()
def filled_db(empty_db):
    """
    Return a filled database session with two notifications in the
    database.
    """
    db = empty_db
    db.add(Notification(
        id=str(uuid4()),
        details="Test value of attribute details",
        title="Test value of attribute title",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
    ))
    db.commit()
    return db


@pytest.fixture()
def stub_uuid():
    """An unused uuid value as a string."""
    return str(uuid4())
