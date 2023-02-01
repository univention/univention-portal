from datetime import datetime
from fastapi import Depends
from redis.asyncio import Redis
from sqlalchemy.sql.expression import and_, or_, null
from sqlmodel import Session, select
from typing import List, Optional
from uuid import uuid4

from app.db import get_session
from app.redis import get_redis
from app.models.notification_model import NotificationCreate, Notification


class NotificationService:

    _db: Session
    _redis: Redis

    def __init__(self, db: Session = Depends(get_session), redis: Redis = Depends(get_redis)):
        self._db = db
        self._redis = redis

    def create_notification(
        self,
        notification: NotificationCreate,
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
        self._db.add(db_notification)
        self._db.commit()
        self._db.refresh(db_notification)
        return db_notification

    def get_notifications(
        self,
        query: dict,
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
        return self._db.exec(statement).fetchall()

    def prune_expired_notifications(self) -> None:
        statement = select(Notification).where(
            Notification.expireTime < datetime.utcnow()
        )

        expired = self._db.exec(statement).fetchall()
        for notification in expired:
            self._db.delete(notification)

        self._db.commit()

    def get_next_notification_expiry(self) -> Optional[datetime]:
        statement = select(Notification) \
            .where(Notification.expireTime) \
            .order_by(Notification.expireTime)

        notification = self._db.exec(statement).first()
        return notification.expireTime if notification else None

    def get_notification(self, id_: str) -> Notification:
        statement = select(Notification).where(
            and_(
                Notification.id == id_,
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now()
                )
            )
        )
        return self._db.exec(statement).one()

    def delete_notification(self, id_: str) -> None:
        notification = self.get_notification(id_)
        self._db.delete(notification)
        self._db.commit()

    def pop_notifications_for_sse(self) -> List[Notification]:
        statement = select(Notification).where(
            and_(
                Notification.sseSendTime == None,  # noqa: E711
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now()
                )
            )
        )
        new_notifications = self._db.exec(statement).fetchall()
        for notification in new_notifications:
            notification.sseSendTime = datetime.now()
            self._db.add(notification)
        self._db.commit()
        for notification in new_notifications:
            self._db.refresh(notification)
        return new_notifications

    def hide_notification(self, id: str) -> None:
        statement = select(Notification).where(Notification.id == id)
        notification = self._db.exec(statement).one()
        notification.popup = False
        self._db.add(notification)
        self._db.commit()

    def mark_notification_read(
        self,
        id: str,
    ) -> Notification:
        statement = select(Notification).where(Notification.id == id)
        notification = self._db.exec(statement).one()
        notification.readTime = datetime.now()
        self._db.add(notification)
        self._db.commit()
        self._db.refresh(notification)
        return notification

    def confirm_notification(
        self,
        id: str,
    ) -> Notification:
        statement = select(Notification).where(Notification.id == id)
        notification = self._db.exec(statement).one()
        notification.confirmationTime = datetime.now()
        self._db.add(notification)
        self._db.commit()
        self._db.refresh(notification)
        return notification
