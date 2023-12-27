# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.models.notification_model import NotificationBase, NotificationSeverity


def test_notification_has_expired():
    notification = NotificationBase(
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        title="foo",
        details="bar",
        severity=NotificationSeverity.INFO,
    )

    # test with `expireTime` in the past
    notification.expireTime = datetime.now(timezone.utc) - timedelta(minutes=1)
    assert notification.has_expired()

    # test with `expireTime` in the future
    notification.expireTime = datetime.now(timezone.utc) + timedelta(minutes=1)
    assert not notification.has_expired()

    # test with `expireTime` unset
    notification.expireTime = None
    assert not notification.has_expired()
