from fastapi import APIRouter, Request, Depends, Query
from sqlmodel import Session
from typing import List
from sse_starlette.sse import EventSourceResponse
import asyncio

from app.models.notification_model import NotificationCreate, Notification
from app.crud.notification_service import NotificationService
from app.db import get_session


router = APIRouter()


# TODO: Check if this is intentional or clean up Maybe there is a common
# practice for API entry points like a ping or so, would be useful as a way to
# troubleshoot issues in deployment.
@router.get("/")
def say_hello():
    return {"message": "Hello, world!"}


@router.post("/notifications", status_code=201, response_model=Notification)
def create_notification(
    data: NotificationCreate,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.create_notification(data, db)


@router.get("/notifications/latest")
def get_latest_notifications_for_user(
    title: str = Query(default=1),
    limit: str = Query(default=10),
    # TODO: We have constants defined in our models for this, check
    # why those are not used here.
    type: str = Query(default='event'),
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> List[Notification]:
    query_items = {
        'title': title,
        'limit': limit,
        'type': type
    }
    return service.get_latest_notifications(query_items, db)


@router.patch("/notifications/{id}/read")
def mark_notification_read(
    id: str,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.mark_notification_read(id, db)


@router.patch("/notifications/{id}/confirm")
def mark_notification_read(
    id: str,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.confirm_notification(id, db)


STREAM_DELAY = 1  # seconds
RETRY_TIMEOUT = 15000  # milliseconds


@router.get("/notifications/stream")
async def stream_notifications(
    request: Request,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
):
    async def event_generator():
        while True:
            # If client closes connection, stop sending events
            if await request.is_disconnected():
                break

            new_notifications = service.pop_notifications_for_sse(db)
            # Checks for new messages and return them to client if any
            for notification in new_notifications:
                yield {
                    "event": "new_notification",
                    "retry": RETRY_TIMEOUT,
                    "data": notification
                }

            await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(event_generator())
