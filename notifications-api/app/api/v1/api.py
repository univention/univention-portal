# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

import asyncio
import json
import logging
import textwrap
from http import HTTPStatus
from typing import List

from fastapi import APIRouter, BackgroundTasks, Body, HTTPException, Query, Request
from fastapi.encoders import jsonable_encoder
from sqlalchemy.exc import NoResultFound
from sse_starlette.sse import EventSourceResponse as EventSourceResponseBase

from app import expiry_pruning, messaging
from app.crud.notification_service import NotificationService
from app.db import get_session
from app.models.notification_model import NotificationCreate, NotificationRead


log = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/notifications/", status_code=201, response_model=NotificationRead,
    tags=["sender"])
async def create_notification(
    background_tasks: BackgroundTasks,
    data: NotificationCreate = Body(
        examples={
            "normal": {
                "summary": "Minimal notification",
                "value": {
                    "sourceUid": "b45f9389-a00f-41aa-96b2-e3ce3d15d377",
                    "targetUid": "13af2f92-9661-4386-b521-daaff8a1bbec",
                    "title": "New Message",
                    "details": "You have been mentioned in the channel #api-example.",
                    "severity": "info",
                },
            },
            "link": {
                "summary": "Notification with a link",
                "value": {
                    "sourceUid": "b45f9389-a00f-41aa-96b2-e3ce3d15d377",
                    "targetUid": "13af2f92-9661-4386-b521-daaff8a1bbec",
                    "title": "New Message",
                    "details": "You have been mentioned in the channel #api-example.",
                    "severity": "info",
                    "link": {
                        "url": "https://chat.example/channel/api-example/msg-id",
                        "text": "#api-example",
                    },
                },
            },
            "expiring": {
                "summary": "Expiring notification",
                "description": (
                    "Set expireTime to be in the future when trying this out. "
                    "Values in the past will be rejected, since it does not make sense "
                    "to create an already expired notification."
                ),
                "value": {
                    "sourceUid": "b45f9389-a00f-41aa-96b2-e3ce3d15d377",
                    "targetUid": "13af2f92-9661-4386-b521-daaff8a1bbec",
                    "title": "New Message",
                    "details": "You have been mentioned in the channel #api-example.",
                    "severity": "info",
                    "expireTime": "2022-03-18T10:00Z",
                },
            },
        }),
) -> NotificationRead:
    """
    Create one notification.

    *Senders* are supposed to use this endpoint in order to submit a
    notification for a specific user.
    """
    if data.has_expired():
        raise HTTPException(status_code=HTTPStatus.UNPROCESSABLE_ENTITY, detail="Expiry time is in the past.")

    with next(get_session()) as db:
        service = NotificationService(db)
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
) -> List[NotificationRead]:
    """Read the notifications of the current user."""
    query = {
        'limit': limit,
    }

    with next(get_session()) as db:
        service = NotificationService(db)
        return service.get_notifications(query)


@router.get("/notifications/{id}/", tags=["receiver"])
def get_notification(
    id: str,
) -> NotificationRead:
    with next(get_session()) as db:
        service = NotificationService(db)
        try:
            return service.get_notification(id)
        except NoResultFound:
            raise HTTPException(status_code=HTTPStatus.NOT_FOUND)


@router.delete("/notifications/{id}/", tags=["receiver", "sender"], status_code=HTTPStatus.NO_CONTENT)
def delete_notification(
    id: str,
    background_tasks: BackgroundTasks,
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
        with next(get_session()) as db:
            service = NotificationService(db)
            notification = service.get_notification(id)
            user_uuid = notification.targetUid

            service.delete_notification(id)
    except NoResultFound:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND)

    event_data = json.dumps(["deleted_notification", {"id": id}])
    topic = f"user.{user_uuid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


@router.post("/notifications/{id}/hide", tags=["receiver"], status_code=HTTPStatus.NO_CONTENT)
def hide_notification(
    id: str,
    background_tasks: BackgroundTasks,
):
    """
    Flag a notification as hidden.

    This will set the attribute `popup` to `false`.
    """
    with next(get_session()) as db:
        service = NotificationService(db)
        service.hide_notification(id)
        notification = service.get_notification(id)

    event_data = json.dumps(jsonable_encoder(["updated_notification", notification]))
    topic = f"user.{notification.targetUid}"
    background_tasks.add_task(messaging.publish_notification, topic, event_data)


RETRY_TIMEOUT = 15000  # milliseconds


class EventSourceResponse(EventSourceResponseBase):
    media_type = "text/event-stream"


@router.get(
    "/notifications/stream", tags=["receiver"],
    response_class=EventSourceResponse,
    responses={
        200: {
            "content": {
                "text/event-stream": {
                    "examples": {
                        "ping": {
                            "value": textwrap.dedent(
                                """\
                                event: ping
                                data: 2022-03-18 10:00:00.448431
                                """,
                            ),
                        },
                        "new_notification": {
                            "value": textwrap.dedent(
                                """\
                                event: new_notification
                                data: {"link": null, "targetUid": "13af2f92-9661-4386-b521-daaff8a1bbec", "details": "You have been mentioned in the channel #api-example.", "expireTime": null, "popup": true, "title": "New Message", "sourceUid": "b45f9389-a00f-41aa-96b2-e3ce3d15d377", "severity": "info", "id": "ae371f63-c9e2-4825-b8da-6dcf215cb9f2", "sseSendTime": null}
                                retry: 15000
                                """,
                            ),
                        },
                        "updated_notification": {
                            "value": textwrap.dedent(
                                """\
                                event: updated_notification
                                data: {"link": null, "targetUid": "13af2f92-9661-4386-b521-daaff8a1bbec", "details": "You have been mentioned in the channel #api-example.", "expireTime": null, "popup": false, "title": "New Message", "sourceUid": "b45f9389-a00f-41aa-96b2-e3ce3d15d377", "severity": "info", "id": "ae371f63-c9e2-4825-b8da-6dcf215cb9f2", "sseSendTime": null}
                                retry: 15000
                                """,
                            ),
                        },
                        "deleted_notification": {
                            "value": textwrap.dedent(
                                """\
                                event: deleted_notification
                                data: {"id": "ae371f63-c9e2-4825-b8da-6dcf215cb9f2"}
                                retry: 15000
                                """,
                            ),
                        },
                    },
                },
            },
        },
    })
async def stream_notifications(request: Request):
    """
    Stream notification events as `event-stream`.

    This endpoint is streaming notification events which shall be consumed on
    web clients as `EventSource`.

    The supported events are:

    - `new_notification` - This event will be sent if a new notification has been
      created.

    - `deleted_notification` - This event will be sent if a notification has been deleted.
      This way multiple clients can stay in sync about the notification state.

    - `updated_notification` - Changed to a notification will trigger this
      event. This way multiple clients will keep their state in sync.
    """

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
