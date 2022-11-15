from enum import Enum
from uuid import UUID
from typing import Optional
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
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    sticky: Optional[bool]
    needsConfirmation: Optional[bool]
    notificationType: NotificationType
    # data: JSON

    class Config:
        arbitrary_types_allowed = True


class Notification(NotificationBase, table=True):
    id: UUID = Field(primary_key=True)
    pass


class NotificationCreate(NotificationBase):
    pass
