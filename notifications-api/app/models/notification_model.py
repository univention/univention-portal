from datetime import datetime
from enum import Enum
from uuid import UUID
from typing import Dict, Optional
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


class NotificationBase(SQLModel):
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    sticky: Optional[bool]
    needsConfirmation: Optional[bool]
    notificationType: NotificationType
    data: Dict = Field(default={}, sa_column=Column(JSON))


class Notification(NotificationBase, table=True):
    id: UUID = Field(primary_key=True)
    receiveTime: datetime
    readTime: Optional[datetime]
    confirmationTime: Optional[datetime]
    expireTime: Optional[datetime]


class NotificationCreate(NotificationBase):
    pass
