from datetime import datetime
from enum import Enum
from uuid import UUID
from typing import Dict, Optional
from pydantic import HttpUrl, validator
from sqlmodel import (
    JSON,
    Column,
    SQLModel,
    Field,
)


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
    def validate_link(cls, link: NotificationLink):
        if link:
            return link.dict()
        else:
            return None

    class Config:
        arbitrary_types_allowed = True

    def has_expired(self):
        """
        Returns `True` when the notification has an expiry time and that time is in the past.
        """
        return self.expireTime \
            and (self.expireTime < datetime.now(self.expireTime.tzinfo))


class Notification(NotificationBase, table=True):
    id: UUID = Field(primary_key=True)
    receiveTime: datetime
    popup: bool = True
    readTime: Optional[datetime]
    sseSendTime: Optional[datetime]
    confirmationTime: Optional[datetime]


class NotificationCreate(NotificationBase):
    pass
