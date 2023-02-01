"""
Provides a service that prunes expired messages from the database.

It provides a background task which looks for the soonest-expiring notification
and prunes it.
"""
import asyncio
from datetime import datetime
import logging
from typing import Optional
from sqlmodel import Session

from app.crud.notification_service import NotificationService
from app.db import get_session


log = logging.getLogger(__name__)

_background_task: Optional[asyncio.Task] = None


def startup_expiry_pruning():
    log.info("Setting up pruning of expired notification events")
    reload_pruner()
    log.debug("Setup of the the expired notifications pruner is done")


async def expiry_pruner(session: Session):
    """
    Background task that looks for the shortest-lived notification,
    goes to sleep, and wakes up to prune that notification once it is expired.

    The process is repeated until there are no expiring notifications left.
    """
    service = NotificationService()

    while True:
        # wait for the next notification to expire
        expire_time = service.get_next_notification_expiry(session)
        if expire_time is None:
            log.debug("No notifications about to expire")
            return
        log.debug("Next notification to expire is at %s", expire_time)

        sleep_seconds = (expire_time - datetime.now()).total_seconds()
        await asyncio.sleep(sleep_seconds)

        # prune expired notifications from the database
        log.info("Pruning expired notifications")
        service.prune_expired_notifications(session)


def reload_pruner():
    """
    Stop a potentially running background task
    and start a new one -- freshly initialized.
    """
    global _background_task

    if _background_task and (not _background_task.done()) and _background_task.get_loop().is_running():
        # cancel previous task
        _background_task.cancel()

    db_session = next(get_session())
    _background_task = asyncio.create_task(expiry_pruner(db_session))


def stop_pruner():
    """
    Cancel the potentially running background task.

    This is mainly useful in tests.
    """
    global _background_task
    if _background_task and (not _background_task.done()) and _background_task.get_loop().is_running():
        # cancel previous task
        _background_task.cancel()