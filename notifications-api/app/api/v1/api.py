from fastapi import APIRouter, HTTPException, Request, Depends, Query
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session
from typing import List
from sse_starlette.sse import EventSourceResponse
import asyncio
from http import HTTPStatus
import json

from app.models.notification_model import (
    Notification, NotificationCreate, NotificationType)
from app.crud.notification_service import NotificationService
from app.db import get_session


router = APIRouter()


@router.post(
    "/notifications/", status_code=201, response_model=Notification,
    tags=["sender"])
def create_notification(
    data: NotificationCreate,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.create_notification(data, db)


@router.get("/notifications/latest", tags=["client"])
def get_latest_notifications_for_user(
    title: str = Query(default=1),
    limit: str = Query(default=10),
    type: str = Query(default=NotificationType.EVENT.value),
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> List[Notification]:
    query_items = {
        'title': title,
        'limit': limit,
        'type': type
    }
    return service.get_latest_notifications(query_items, db)


@router.post("/notifications/{id}/read", tags=["client"])
def mark_notification_read(
    id: str,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.mark_notification_read(id, db)


@router.post("/notifications/{id}/confirm", tags=["client"])
def mark_notification_confirmed(
    id: str,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> Notification:
    return service.confirm_notification(id, db)


@router.post("/notifications/invalidate", tags=["sender"])
def bulk_invalidate_notifications():
    # TODO: Define input model, so that the schema is documented
    # correctly.
    raise HTTPException(status_code=HTTPStatus.NOT_IMPLEMENTED)


@router.post("/notifications/{id}/invalidate", tags=["sender"])
def invalidate_notification(id: str) -> None:
    raise HTTPException(status_code=HTTPStatus.NOT_IMPLEMENTED)



STREAM_DELAY = 1  # seconds
RETRY_TIMEOUT = 15000  # milliseconds


@router.get("/notifications/stream", tags=["client"])
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
                    "data": json.dumps(jsonable_encoder(notification)),
                }

            await asyncio.sleep(STREAM_DELAY)

    return EventSourceResponse(event_generator())
