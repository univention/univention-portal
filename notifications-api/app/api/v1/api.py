from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Depends, Query
from fastapi.encoders import jsonable_encoder
from http import HTTPStatus
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session
from sse_starlette.sse import EventSourceResponse
from typing import List
import asyncio
import json
import logging

from app import messaging
from app.crud.notification_service import NotificationService
from app.db import get_session
from app.models.notification_model import (
    Notification, NotificationCreate, NotificationType)


log = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/notifications/", status_code=201, response_model=Notification,
    tags=["sender"])
async def create_notification(
    data: NotificationCreate,
    background_tasks: BackgroundTasks,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session),
) -> Notification:
    notification = service.create_notification(data, db)
    event_data = json.dumps(jsonable_encoder(["new_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)
    return notification


@router.get("/notifications/", tags=["client"])
def get_notifications(
    limit: str = Query(default=100),
    type: str = Query(default=NotificationType.EVENT.value),
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
) -> List[Notification]:
    """
    Read the notifications of the current user.
    """
    query = {
        'limit': limit,
        'type': type
    }
    return service.get_notifications(query, db)


@router.get("/notifications/{id}/", tags=["client"])
def get_notification(
    id: str,
    service=Depends(NotificationService),
    db=Depends(get_session),
):
    try:
        return service.get_notification(id, db)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)


@router.delete("/notifications/{id}/", tags=["client"])
def delete_notification(
    id: str,
    background_tasks: BackgroundTasks,
    service=Depends(NotificationService),
    db=Depends(get_session),
):
    try:
        # TODO: Once the current user is known we don't have to read this from the
        # database anymore.
        notification = service.get_notification(id, db)
        user_uuid = notification.targetUid

        service.delete_notification(id, db)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    event_data = json.dumps(["deleted_notification", {"id": id}])
    topic = f"user.{user_uuid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


@router.post("/notifications/{id}/hide", tags=["client"])
def hide_notification(
    id: str,
    background_tasks: BackgroundTasks,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session),
):
    """
    Flag a notification as hidden.

    This will set the attribute `popup` to `false`.
    """
    service.hide_notification(id, db)

    notification = service.get_notification(id, db)
    event_data = json.dumps(jsonable_encoder(["updated_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


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
    """
    NOT YET IMPLEMENTED

    The bulk notification endpoint shall allow a sender to invalidate a list of
    notifications. See the endpoint `notifications/{id}/invalidate` regagrding
    further details.
    """
    # TODO: Define input model, so that the schema is documented
    # correctly.
    raise HTTPException(status_code=HTTPStatus.NOT_IMPLEMENTED)


@router.post("/notifications/{id}/invalidate", tags=["sender"])
def invalidate_notification(id: str) -> None:
    """
    NOT YET IMPLEMENTED

    The invalidation endpoint allows to invalidate a single notification.

    The sending application is expected to use this endpoint if a notification
    is not relevant anymore from the perspective of a sender.
    """
    raise HTTPException(status_code=HTTPStatus.NOT_IMPLEMENTED)


STREAM_DELAY = 1  # seconds
RETRY_TIMEOUT = 15000  # milliseconds


@router.get("/notifications/stream", tags=["client"])
async def stream_notifications(
    request: Request,
    service: NotificationService = Depends(NotificationService),
    db: Session = Depends(get_session)
):

    # TODO: implement request disconnect check, separate loop?
    # if await request.is_disconnected():
    #     break

    async def event_generator():
        # TODO: Append UUID to the topic once authentication is implemented, so
        # that we have the current user's ID available.
        topic = "user."
        async for event_data_string in messaging.receive_notifications(topic):
            event_name, notification_data = json.loads(event_data_string)
            log.debug("Streaming out event")
            yield {
                "event": event_name,
                "retry": RETRY_TIMEOUT,
                "data": json.dumps(notification_data),
            }

    return EventSourceResponse(event_generator())
