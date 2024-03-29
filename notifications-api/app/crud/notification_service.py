# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

from datetime import datetime, timezone
from typing import List, Optional
from uuid import uuid4

from sqlalchemy.sql.expression import and_, null, or_
from sqlmodel import Session, select

from app.models.notification_model import Notification, NotificationCreate


class NotificationService():

    _db: Session

    def __init__(self, db: Session):
        self._db = db

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
            severity=notification.severity,
            expireTime=notification.expireTime,
            link=notification.link,
        )
        self._db.add(db_notification)
        self._db.commit()
        self._db.refresh(db_notification)
        db_notification._force_to_utc()
        return db_notification

    def get_notifications(
        self,
        query: dict,
    ) -> List[Notification]:
        if query.get('exclude_expired', True):
            statement = select(Notification).where(
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now(timezone.utc),
                ),
            ).limit(query['limit'])
        else:
            statement = select(Notification).limit(query['limit'])

        notifications = self._db.exec(statement).fetchall()
        for notification in notifications:
            notification._force_to_utc()
        return notifications

    def prune_expired_notifications(self) -> None:
        statement = select(Notification).where(
            Notification.expireTime < datetime.now(timezone.utc),
        )

        expired = self._db.exec(statement).fetchall()
        for notification in expired:
            self._db.delete(notification)

        self._db.commit()

    def get_next_notification_expiry(self) -> Optional[datetime]:
        statement = select(Notification) \
            .where(Notification.expireTime != null()) \
            .order_by(Notification.expireTime)

        if notification := self._db.exec(statement).first():
            notification._force_to_utc()
            return notification.expireTime
        else:
            return None

    def get_notification(self, id_: str) -> Notification:
        statement = select(Notification).where(
            and_(
                Notification.id == id_,
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now(timezone.utc),
                ),
            ),
        )

        if notification := self._db.exec(statement).one():
            notification._force_to_utc()
            return notification
        else:
            return None

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
                    Notification.expireTime >= datetime.now(timezone.utc),
                ),
            ),
        )
        new_notifications = self._db.exec(statement).fetchall()
        for notification in new_notifications:
            notification.sseSendTime = datetime.now(timezone.utc)
            self._db.add(notification)
        self._db.commit()
        for notification in new_notifications:
            self._db.refresh(notification)
            notification._force_to_utc()
        return new_notifications

    def hide_notification(self, id: str) -> None:
        statement = select(Notification).where(Notification.id == id)
        notification = self._db.exec(statement).one()
        notification.popup = False
        self._db.add(notification)
        self._db.commit()
