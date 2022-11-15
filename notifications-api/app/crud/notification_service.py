from datetime import datetime
from typing import List
from sqlmodel import Session, select
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
            id=str(uuid4()),
            sourceUid=notification.sourceUid,
            targetUid=notification.targetUid,
            title=notification.title,
            details=notification.details,
            sticky=notification.sticky,
            needsConfirmation=notification.needsConfirmation,
            severity=notification.severity,
            notificationType=notification.notificationType,
            receiveTime=datetime.now(),
            confirmationTime=None,
            readTime=None,
            data=notification.data
        )
        db.add(db_notification)
        db.commit()
        return db_notification

    def get_latest_notifications(
        self,
        query: dict,
        db: Session
    ) -> List[Notification]:
        statement = select(Notification).where(Notification.notificationType == query['type']).limit(query['limit'])
        return db.exec(statement).fetchall()

    def mark_notification_read(
        self,
        id: str,
        db: Session
    ) -> Notification:
        statement = select(Notification).where(Notification.id == id)
        notification = db.exec(statement).one()
        notification.readTime = datetime.now()
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    def confirm_notification(
        self,
        id: str,
        db: Session
    ) -> Notification:
        statement = select(Notification).where(Notification.id == id)
        notification = db.exec(statement).one()
        notification.confirmationTime = datetime.now()
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
