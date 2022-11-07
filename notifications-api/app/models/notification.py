from datetime import datetime
from enum import Enum
from uuid import UUID
from sqlmodel import (
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
    source_uuid: UUID
    target_uuid: UUID
    title: str
    type: NotificationType
    severity: NotificationSeverity
    send_time: datetime


class Notification(NotificationBase, table=True):
    id: UUID = Field(primary_key=True)


class NotificationCreate(NotificationBase):
    pass
