from fastapi import APIRouter, Depends, Query
from sqlmodel import Session
from typing import List

from app.models.notification_model import NotificationCreate, Notification
from app.crud.notification_service import NotificationService
from app.db import get_session


router = APIRouter()


@router.get("/")
def say_hello():
    return {"message": "Hello, world!"}


@router.post("/notifications", status_code=201, response_model=Notification)
def create_notification(
    data: NotificationCreate,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session),
) -> Notification:
    return service.create_notification(data, db)


@router.get("/notifications/latest")
def get_latest_notifications_for_user(
    title: str = Query(default=1),
    limit: str = Query(default=10),
    type: str = Query(default="event"),
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session),
) -> List[Notification]:
    query_items = {"title": title, "limit": limit, "type": type}
    return service.get_latest_notifications(query_items, db)


@router.patch("/notifications/{id}/read")
def mark_notification_read(
    id: str, service: NotificationService = Depends(NotificationService), db: Session = Depends(get_session)
) -> Notification:
    return service.mark_notification_read(id, db)


@router.patch("/notifications/{id}/confirm")
def mark_notification_read(
    id: str, service: NotificationService = Depends(NotificationService), db: Session = Depends(get_session)
) -> Notification:
    return service.confirm_notification(id, db)
