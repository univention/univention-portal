from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, Depends, Query
from fastapi.encoders import jsonable_encoder
from http import HTTPStatus
from sqlalchemy.exc import NoResultFound
from sse_starlette.sse import EventSourceResponse
from typing import List
import asyncio
import json
import logging

from app import expiry_pruning, messaging
from app.crud.notification_service import NotificationService
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
) -> Notification:
    if data.has_expired():
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY, detail="Expiry time is in the past.")

    notification = service.create_notification(data)

    event_data = json.dumps(jsonable_encoder(["new_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)

    if notification.expireTime:
        expiry_pruning.reload_pruner()

    return notification


@router.get("/notifications/", tags=["client"])
def get_notifications(
    limit: str = Query(default=100),
    type: str = Query(default=NotificationType.EVENT.value),
    service: NotificationService = Depends(NotificationService),
) -> List[Notification]:
    """Read the notifications of the current user."""
    query = {
        'limit': limit,
        'type': type
    }
    return service.get_notifications(query)


@router.get("/notifications/{id}/", tags=["client"])
def get_notification(
    id: str,
    service=Depends(NotificationService),
):
    try:
        return service.get_notification(id)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)


@router.delete("/notifications/{id}/", tags=["client"])
def delete_notification(
    id: str,
    background_tasks: BackgroundTasks,
    service=Depends(NotificationService),
):
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


@router.post("/notifications/{id}/hide", tags=["client"])
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


@router.post("/notifications/{id}/read", tags=["client"])
def mark_notification_read(
    id: str,
    service: NotificationService = Depends(NotificationService),
) -> Notification:
    return service.mark_notification_read(id)


@router.post("/notifications/{id}/confirm", tags=["client"])
def mark_notification_confirmed(
    id: str,
    service: NotificationService = Depends(NotificationService),
) -> Notification:
    return service.confirm_notification(id)


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


RETRY_TIMEOUT = 15000  # milliseconds


@router.get("/notifications/stream", tags=["client"])
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
