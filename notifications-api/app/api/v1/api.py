import asyncio
import json
import logging
from http import HTTPStatus
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Request
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import NoResultFound
from sse_starlette.sse import EventSourceResponse

from app import expiry_pruning, messaging
from app.crud.notification_service import NotificationService
from app.models.notification_model import Notification, NotificationCreate, NotificationType


log = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/notifications/", status_code=201, response_model=Notification,
    tags=["sender"])
async def create_notification(
    data: NotificationCreate,
    background_tasks: BackgroundTasks,
    service: NotificationService = Depends(NotificationService),
) -> Notification:
    """
    Create one notification.

    *Senders* are supposed to use this endpoint in order to submit a
    notification for a specific user.
    """
    if data.has_expired():
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY, detail="Expiry time is in the past.")

    notification = service.create_notification(data)

    event_data = json.dumps(jsonable_encoder(["new_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)

    if notification.expireTime:
        expiry_pruning.reload_pruner()

    return notification


@router.get("/notifications/", tags=["receiver"])
def get_notifications(
    limit: str = Query(default=100),
    type: str = Query(default=NotificationType.EVENT.value),
    service: NotificationService = Depends(NotificationService),
) -> List[Notification]:
    """Read the notifications of the current user."""
    query = {
        'limit': limit,
        'type': type,
    }
    return service.get_notifications(query)


@router.get("/notifications/{id}/", tags=["receiver"])
def get_notification(
    id: str,
    service=Depends(NotificationService),
):
    try:
        return service.get_notification(id)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)


@router.delete("/notifications/{id}/", tags=["receiver", "sender"])
def delete_notification(
    id: str,
    background_tasks: BackgroundTasks,
    service=Depends(NotificationService),
):
    """
    Delete one notification

    Allows to delete a notification. This is intended to be used in the
    following two cases:

    1. A *Sender* can delete a notification if it is not valid anymore.
       A *Sender* is only allowed to delete notifications which it did create
       itself.

    2. A *Receiver* can delete a notification if the user does want it to
       disappear. A *Receiver* can only delete notifications which are targeted
       to the user which it represents.
    """
    try:
        # TODO: Once the current user is known we don't have to read this from the
        # database anymore.
        notification = service.get_notification(id)
        user_uuid = notification.targetUid

        service.delete_notification(id)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    event_data = json.dumps(["deleted_notification", {"id": id}])
    topic = f"user.{user_uuid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


@router.post("/notifications/{id}/hide", tags=["receiver"])
def hide_notification(
    id: str,
    background_tasks: BackgroundTasks,
    service: NotificationService = Depends(NotificationService),
):
    """
    Flag a notification as hidden.

    This will set the attribute `popup` to `false`.
    """
    service.hide_notification(id)

    notification = service.get_notification(id)
    event_data = json.dumps(jsonable_encoder(["updated_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


@router.post("/notifications/{id}/confirm", tags=["receiver"])
def mark_notification_confirmed(
    id: str,
    service: NotificationService = Depends(NotificationService),
) -> Notification:
    return service.confirm_notification(id)


RETRY_TIMEOUT = 15000  # milliseconds


@router.get("/notifications/stream", tags=["receiver"])
async def stream_notifications(request: Request):

    async def event_generator():
        # TODO: Append UUID to the topic once authentication is implemented, so
        # that we have the current user's ID available.
        topic = "user."

        try:
            async for event_data_string in messaging.receive_notifications(topic):
                event_name, notification_data = json.loads(event_data_string)
                log.debug("Streaming out event")
                yield {
                    "event": event_name,
                    "retry": RETRY_TIMEOUT,
                    "data": json.dumps(notification_data),
                }
        except asyncio.CancelledError as e:
            log.info("Client disconnected from event stream: %s", request.client)
            raise e

    return EventSourceResponse(event_generator())
