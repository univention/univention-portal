from enum import Enum
from uuid import UUID
from typing import Optional
from sqlmodel import (
    SQLModel,
    Field,
    JSON
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
    id: Optional[UUID] = Field(primary_key=True, default=None)
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    sticky: bool
    needsConfirmation: bool
    notificationType: NotificationType
    # data: JSON

    class Config:
        arbitrary_types_allowed = True


class Notification(NotificationBase, table=True):
    pass


class NotificationCreate(NotificationBase):
    pass
