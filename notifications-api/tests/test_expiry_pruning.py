# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

import asyncio
from datetime import datetime, timedelta, timezone
from uuid import uuid4

import pytest

from app import expiry_pruning
from app.crud.notification_service import NotificationService
from app.models.notification_model import Notification


# expiry for a short-lived notification
expire_fast = timedelta(seconds=3)
# expiry for a long-lived notification
expire_slow = timedelta(days=3)


@pytest.fixture()
def test_db(empty_db):
    db = empty_db
    db.add(Notification(
        id=str(uuid4()),
        details="some details",
        title="non-expiring notification",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        expireTime=None,
    ))
    db.add(Notification(
        id=str(uuid4()),
        details="some details",
        title="short-lived notification",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        expireTime=datetime.now(timezone.utc) + expire_fast,
    ))
    db.add(Notification(
        id=str(uuid4()),
        details="some details",
        title="long-lived notification",
        severity="info",
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        expireTime=datetime.now(timezone.utc) + expire_slow,
    ))
    db.commit()
    return db


@pytest.mark.asyncio()
async def test_prune_notifications_after_expiry(test_db):
    # the test_db contains one notification to expire very soon
    expiry_pruning.startup_expiry_pruning()

    # wait for it to expire
    # (wait a little longer to allow the pruner to run)
    await asyncio.sleep(expire_fast.total_seconds() * 1.01)

    # grab remaining notifications
    service = NotificationService(test_db)
    query = {'limit': 100, 'type': "event"}
    notifications = service.get_notifications(query)

    # the expired notification should be gone
    assert not any(
        notification.title == "short-lived notification"
        for notification in notifications)

    assert len(notifications) == 2

    # the longer-lived notification should still be there
    assert any(
        notification.title == "long-lived notification"
        for notification in notifications)
    # the non-expiring notification should still be there
    assert any(
        notification.title == "non-expiring notification"
        for notification in notifications)

    # cancel the pruning task
    expiry_pruning.stop_pruner()
    test_db.close()


@pytest.mark.asyncio()
async def test_pruner_waits_for_expiretime(test_db):
    # the initial database contains sooner- and later-expiring notifications
    service = NotificationService(test_db)
    query = {'limit': 100, 'type': "event"}
    notifications = service.get_notifications(query)
    assert any(n.title == "short-lived notification" for n in notifications) \
        and any(n.title == "long-lived notification" for n in notifications) \
        and any(n.title == "non-expiring notification" for n in notifications)

    # run the pruner
    pruner_task = asyncio.create_task(expiry_pruning.expiry_pruner())

    # wait for the short-lived notification to expire
    earliest: Notification = min(filter(lambda n: n.expireTime, notifications), key=lambda n: n.expireTime)
    sleep_seconds = (earliest.expireTime - datetime.now(timezone.utc)).total_seconds()
    await asyncio.sleep(sleep_seconds * 1.01)

    # no remaining notifications should have an expireTime in the past
    service._db.expire_all()
    remaining = service.get_notifications(query)
    assert all((n.expireTime is None) or (n.expireTime > datetime.now(timezone.utc)) for n in remaining)
    # the longer-lasting and non-expiring notifications should still be there
    assert any(n.title == "long-lived notification" for n in remaining) \
        and any(n.title == "non-expiring notification" for n in remaining)

    # the pruner task should still be running, as there are notifications expiring later
    assert not pruner_task.done()

    # cancel the pruning task and release the database lock for the next test
    pruner_task.cancel()
    test_db.close()


@pytest.mark.asyncio()
async def test_pruner_no_expiry(test_db):
    # prepare the database, so that it only contains non-expiring notifications
    service = NotificationService(test_db)
    query = {'limit': 100, 'type': "event"}
    notifications = service.get_notifications(query)
    for notification in notifications:
        if notification.expireTime:
            service.delete_notification(notification.id)

    notifications = service.get_notifications(query)
    assert len(notifications) == 1 \
        and all(n.expireTime is None for n in notifications)

    # run the pruner
    await expiry_pruning.expiry_pruner()

    # should quit with nothing to do
    # and the non-expiring notifications should still be there
    remaining = service.get_notifications(query)
    assert len(remaining) == 1 \
        and remaining[0].title == "non-expiring notification"

    test_db.close()


@pytest.mark.asyncio()
async def test_pruner_soon_expiring(test_db):
    # prepare the database, so that it only contains soon- and non-expiring notifications
    service = NotificationService(test_db)
    query = {'limit': 100, 'type': "event"}
    notifications = service.get_notifications(query)
    for notification in notifications:
        if notification.title == "long-lived notification":
            service.delete_notification(notification.id)

    notifications = service.get_notifications(query)
    assert len(notifications) == 2 \
        and any(n.title == "short-lived notification" for n in notifications) \
        and any(n.title == "non-expiring notification" for n in notifications)

    # run the pruner
    await expiry_pruning.expiry_pruner()

    # should quit after the notification nearby has expired
    # and the non-expiring notification should still be there
    service._db.expire_all()
    remaining = service.get_notifications(query)
    assert len(remaining) == 1 \
        and remaining[0].title == "non-expiring notification"

    test_db.close()


@pytest.mark.asyncio()
async def test_pruner_reload_cancels_old_task(test_db):
    # the database must contain a long-running notification
    service = NotificationService(test_db)
    query = {'limit': 100, 'type': "event"}
    notifications = service.get_notifications(query)
    assert any(n.title == "long-lived notification" for n in notifications)

    # start the pruner and make sure that it is running
    expiry_pruning.startup_expiry_pruning()

    task = expiry_pruning._background_task
    assert not task.done()

    # wait and reload the pruner
    await asyncio.sleep(0.1)
    expiry_pruning.reload_pruner()
    await asyncio.sleep(0.1)

    # the old task should have been stopped and a new one started
    assert task.done()

    new_task = expiry_pruning._background_task
    assert not new_task.done()

    # clean up after testing
    expiry_pruning.stop_pruner()
    test_db.close()
