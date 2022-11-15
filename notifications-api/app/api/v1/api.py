from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List

from app.models.notification_model import NotificationCreate, Notification
from app.crud.notification_service import NotificationService
from app.db import get_session


router = APIRouter()


@router.get("/")
def say_hello():
    return {"message": "Hello, world!"}


@router.post("/notifications", status_code=201)
def create_notification(
    data: NotificationCreate,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.create_notification(data, db).json()


@router.get("/notifications/{user}/latest")
def get_latest_notifications_for_user(
    user: str,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> List[Notification]:
    return service.get_notifications_for_user(user, db)
