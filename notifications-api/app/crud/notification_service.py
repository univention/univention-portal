from datetime import datetime
from typing import List, Optional
from sqlalchemy.sql.expression import and_, or_, null
from sqlmodel import Session, select
from uuid import uuid4

from app.db import get_session
from app.models.notification_model import NotificationCreate, Notification


def get_db_session():
    return next(get_session())


class NotificationService:

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
            expireTime=notification.expireTime,
            confirmationTime=None,
            readTime=None,
            link=notification.link,
            data=notification.data
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification

    def get_notifications(
        self,
        query: dict,
        db: Session
    ) -> List[Notification]:
        if query.get('exclude_expired', True):
            statement = select(Notification).where(
                and_(
                    Notification.notificationType == query['type'],
                    or_(
                        Notification.expireTime == null(),
                        Notification.expireTime >= datetime.now()
                    )
                )
            ).limit(query['limit'])
        else:
            statement = select(Notification).where(
                Notification.notificationType == query['type']
            ).limit(query['limit'])
        return db.exec(statement).fetchall()

    def prune_expired_notifications(
        self,
        db: Session
    ) -> None:
        statement = select(Notification).where(
            Notification.expireTime < datetime.utcnow()
        )

        expired = db.exec(statement).fetchall()
        for notification in expired:
            db.delete(notification)

        db.commit()

    def get_next_notification_expiry(self, db: Session) -> Optional[datetime]:
        statement = select(Notification) \
            .where(Notification.expireTime) \
            .order_by(Notification.expireTime)

        notification = db.exec(statement).first()
        return notification.expireTime if notification else None

    def get_notification(self, id_: str, db: Session) -> Notification:
        statement = select(Notification).where(
            and_(
                Notification.id == id_,
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now()
                )
            )
        )
        return db.exec(statement).one()

    def delete_notification(self, id_: str, db: Session) -> None:
        notification = self.get_notification(id_, db)
        db.delete(notification)
        db.commit()

    def pop_notifications_for_sse(
        self,
        db: Session
    ) -> List[Notification]:
        statement = select(Notification).where(
            and_(
                Notification.sseSendTime == None,  # noqa: E711
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now()
                )
            )
        )
        new_notifications = db.exec(statement).fetchall()
        for notification in new_notifications:
            notification.sseSendTime = datetime.now()
            db.add(notification)
        db.commit()
        for notification in new_notifications:
            db.refresh(notification)
        return new_notifications

    def hide_notification(self, id: str, db: Session) -> None:
        statement = select(Notification).where(Notification.id == id)
        notification = db.exec(statement).one()
        notification.popup = False
        db.add(notification)
        db.commit()

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
