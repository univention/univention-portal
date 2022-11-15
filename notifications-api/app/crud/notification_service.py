from typing import List
from sqlmodel import Session
from uuid import uuid4

from app.db import get_session
from app.models.notification_model import NotificationCreate, Notification


def get_db_session():
    return next(get_session())


class NotificationService():

    def create_notification(
        self,
        notification: NotificationCreate,
        db: Session
    ) -> Notification:
        db_notification = Notification(
            id=uuid4(),
            sourceUid=notification.sourceUid,
            targetUid=notification.targetUid,
            title=notification.title,
            details=notification.details,
            sticky=notification.sticky,
            needsConfirmation=notification.needsConfirmation,
            severity=notification.severity
        )
        db.add(db_notification)
        db.commit()
        return db_notification

    def get_notifications_for_user(
        self,
        user: str,
        db: Session
    ) -> List[Notification]:
        return []
