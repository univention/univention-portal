from datetime import datetime, timedelta
from uuid import uuid4

from app.models.notification_model import NotificationBase, NotificationSeverity, NotificationType


def test_notification_has_expired():
    notification = NotificationBase(
        sourceUid=str(uuid4()),
        targetUid=str(uuid4()),
        title="foo",
        details="bar",
        severity=NotificationSeverity.INFO,
        notificationType=NotificationType.EVENT,
        data=dict(),
    )

    # test with `expireTime` in the past
    notification.expireTime = datetime.now() - timedelta(minutes=1)
    assert notification.has_expired()

    # test with `expireTime` in the future
    notification.expireTime = datetime.now() + timedelta(minutes=1)
    assert not notification.has_expired()

    # test with `expireTime` unset
    notification.expireTime = None
    assert not notification.has_expired()