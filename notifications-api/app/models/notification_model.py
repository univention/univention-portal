from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Optional
from uuid import UUID

from pydantic import HttpUrl, validator
from sqlmodel import JSON, Column, Field, SQLModel


def _datetime_is_tz_aware(dt: datetime) -> bool:
    """
    Tests whether the given `datetime` object is timezone-aware.

    See: https://docs.python.org/3/library/datetime.html#determining-if-an-object-is-aware-or-naive

    TODO: Once provided by pydantic, we might be able to use `AwareDatetime` for properties such as `expireTime`
          (see https://github.com/pydantic/pydantic/discussions/3477).
    """
    return (dt.tzinfo is not None) and (dt.tzinfo.utcoffset(dt) is not None)


class NotificationType(str, Enum):
    EVENT = "event"
    ANNOUNCEMENT = "announcement"
    ALERT = "alert"


class NotificationSeverity(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"


class NotificationLink(SQLModel):
    url: HttpUrl
    text: Optional[str]
    target: Optional[str]


class NotificationBase(SQLModel):
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    sticky: Optional[bool]
    needsConfirmation: Optional[bool]
    notificationType: NotificationType
    expireTime: Optional[datetime]
    link: Optional[NotificationLink] = Field(default=None, sa_column=Column(JSON), nullable=True)
    data: Dict = Field(default={}, sa_column=Column(JSON))

    @validator('link')
    def validate_link(cls, link: Optional[NotificationLink]):
        if link:
            return link.dict()
        else:
            return None

    class Config:
        arbitrary_types_allowed = True

    def has_expired(self):
        """Returns `True` when the notification has an expiry time and that time is in the past."""
        return self.expireTime \
            and (self.expireTime < datetime.now(timezone.utc))


class Notification(NotificationBase, table=True):
    id: UUID = Field(primary_key=True)
    receiveTime: datetime
    popup: bool = True
    readTime: Optional[datetime]
    sseSendTime: Optional[datetime]
    confirmationTime: Optional[datetime]

    def _force_to_utc(self):
        """
        Sets all naive datetime properties to timezone-aware datetime properties.

        Beware: This merely sets the UTC timezone identifier on all naive datetimes.
        It does *not* convert between timezones, because it has no way to tell what the original timezone was.

        This method is intended solely for use after database reads which return naive datetimes.
        """
        for key in ['confirmationTime', 'expireTime', 'readTime', 'receiveTime', 'sseSendTime']:
            if value := getattr(self, key):
                setattr(self, key, value.replace(tzinfo=timezone.utc))


class NotificationCreate(NotificationBase):

    @validator('expireTime')
    def expire_time_must_be_timezone_aware(cls, expireTime: Optional[datetime]):
        if (expireTime is None) or _datetime_is_tz_aware(expireTime):
            return expireTime
        else:
            raise ValueError('must be timezone-aware')
