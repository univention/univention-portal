from datetime import datetime
from fastapi import Depends
from redis import Redis
from sqlalchemy.sql.expression import and_, or_, null
from sqlmodel import Session, select
from typing import List, Optional
from uuid import uuid4
import json

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
        receive_time = datetime.now()
        notification_id = str(uuid4())
        db_notification = Notification(
            id=notification_id,
            sourceUid=notification.sourceUid,
            targetUid=notification.targetUid,
            title=notification.title,
            details=notification.details,
            sticky=notification.sticky,
            needsConfirmation=notification.needsConfirmation,
            severity=notification.severity,
            notificationType=notification.notificationType,
            receiveTime=receive_time,
            expireTime=notification.expireTime,
            confirmationTime=None,
            readTime=None,
            link=notification.link,
            data=notification.data
        )
        self._db.add(db_notification)
        self._db.commit()
        self._db.refresh(db_notification)
        self._create_redis_notification(db_notification)
        return db_notification

    def _create_redis_notification(self, notification):
        user_id = "noid"
        notification_id = str(notification.id)
        receive_time = notification.receiveTime

        # Store the notification itself
        self._redis.set(f"notification:{notification_id}", notification.json())

        # Add the notification_id into a sorted set for the given user_id
        self._redis.zadd(
            f"user:{user_id}:notifications",
            {notification_id: receive_time.timestamp()})

        # Remember that notification_id maps to user_id
        self._redis.hset("index:notification.user", notification_id, user_id)

        # If needed, remember notification for expiry.
        # This is only useful if we want to actively prune values.
        if notification.expireTime:
            self._redis.zadd(
                "notification.expiry",
                {json.dumps([user_id, notification_id]): notification.expireTime.timestamp()})

    def get_notifications(
        self,
        query: dict,
    ) -> List[Notification]:
        exclude_expired = query.get('exclude_expired', True)
        if exclude_expired:
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
        db_result = self._db.exec(statement).fetchall()

        user_id = "noid"

        ids = self._redis.zrange(f"user:{user_id}:notifications", 0, -1)
        # TODO: In product we would need a proper handling of binary strings
        keys = [f"notification:{id_.decode()}" for id_ in ids]
        values = self._redis.mget(keys)
        notifications = [Notification.parse_raw(n) for n in values]
        redis_result = [n for n in notifications if n.notificationType == query['type']]
        if exclude_expired:
            now = datetime.now()
            redis_result = [n for n in redis_result if not n.expireTime or n.expireTime >= now]

        return redis_result

    def prune_expired_notifications(self) -> None:
        statement = select(Notification).where(
            Notification.expireTime < datetime.utcnow()
        )

        expired = self._db.exec(statement).fetchall()
        for notification in expired:
            self._db.delete(notification)

        self._db.commit()

        # TODO: prune in Redis

    def get_next_notification_expiry(self) -> Optional[datetime]:
        statement = select(Notification) \
            .where(Notification.expireTime) \
            .order_by(Notification.expireTime)

        notification = self._db.exec(statement).first()
        return notification.expireTime if notification else None

        # TODO: read from Redis

    def get_notification(self, id_: str, _want_db=False) -> Notification:
        statement = select(Notification).where(
            and_(
                Notification.id == id_,
                or_(
                    Notification.expireTime == null(),
                    Notification.expireTime >= datetime.now()
                )
            )
        )
        db_result = self._db.exec(statement).one()

        value = self._redis.get(f"notification:{id_}")
        redis_result = Notification.parse_raw(value)
        if redis_result.expireTime and redis_result.expireTime < datetime.now():
            redis_result = None

        if _want_db:
            return db_result
        return redis_result

    def delete_notification(self, id_: str) -> None:
        notification = self.get_notification(id_, _want_db=True)
        self._db.delete(notification)
        self._db.commit()
        self._delete_redis_notification(id_)

    def _delete_redis_notification(self, id_):
        self._redis.delete(f"notification:{id_}")
        user_id = self._redis.hget("index:notification.user", id_)
        self._redis.zrem(f"user:{user_id}:notifications", id_)
        self._redis.hdel("index:notification.user", id_)

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
        self._hide_redis_notification(notification)

    def _hide_redis_notification(self, notification):
        notification_id = str(notification.id)
        self._redis.set(f"notification:{notification_id}", notification.json())

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
