from datetime import datetime
from enum import Enum
from uuid import UUID
from sqlmodel import (
    SQLModel,
    Field
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
    id: UUID = Field(primary_key=True)

    class Config:
        arbitrary_types_allowed = True


class Notification(NotificationBase, table=True):
    pass


class NotificationCreate(NotificationBase):
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    sticky: bool
    needsConfirmation: bool
    notificationType: NotificationType
    data: dict
