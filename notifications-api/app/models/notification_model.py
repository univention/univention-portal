# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

from datetime import datetime, timezone
from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import HttpUrl, validator
from sqlmodel import JSON, Column, Field, SQLModel


class NotificationSeverity(str, Enum):
    INFO = "info"
    SUCCESS = "success"
    WARNING = "warning"
    ERROR = "error"


class NotificationLink(SQLModel):
    url: HttpUrl
    text: Optional[str]
    target: Optional[str]

    class Config:
        fields = {
            "url": {
                "description": (
                    "The accepted URLs are limited to HTTP and HTTPS, they must be absolute URLs."
                ),
            },
            "target": {
                "example": "_blank",
            },
        }
        schema_extra = {
            "example": {
                "url": "https://chat.example/channel/api-example/msg-id",
                "text": "#api-example",
            },
        }


class NotificationBase(SQLModel):
    sourceUid: UUID
    targetUid: UUID
    title: str
    details: str
    severity: NotificationSeverity
    expireTime: Optional[datetime]
    link: Optional[NotificationLink] = Field(default=None, sa_column=Column(JSON), nullable=True)

    class Config:
        fields = {
            "sourceUid": {
                "title": "LDAP-UID of Sender",
                "example": UUID("b45f9389-a00f-41aa-96b2-e3ce3d15d377"),
            },
            "targetUid": {
                "title": "LDAP-UID of Receiver",
                "example": UUID("13af2f92-9661-4386-b521-daaff8a1bbec"),
            },
            "title": {
                "description": (
                    "The notification title shall be visible to the user in a highlighted way. "
                    "The title should be kept short."
                ),
                "example": "New Message",
            },
            "details": {
                "description": (
                    "The notification details shall be visible to the user below the title. "
                    "The details can be longer than the title."
                ),
                "example": "You have been mentioned in the channel #api-example.",
            },
            "severity": {
                "description": (
                    "The severity influences how the notification will be displayed to the user. "
                    "Typically this influences the background color. It does not influence "
                    "if the notification is shown or not."
                ),
                "example": NotificationSeverity.INFO,
            },
            "expireTime": {
                "description": (
                    "A point in time at which the notification is not relevant anymore. "
                    "After this point in time the notification shall not be presented to the "
                    "user anymore."
                ),
                "example": "2023-03-18T10:00Z",
            },
            "link": {
                "description": (
                    "Allows to augment the notification with a link. "
                    "The intended usage is to provide a link which the user can follow "
                    "to reach the resource which the notification is about."
                ),
            },

        }

    @validator('link')
    def validate_link(cls, link: Optional[NotificationLink]):
        if link:
            return link.dict()
        else:
            return None

    def has_expired(self):
        """Returns `True` when the notification has an expiry time and that time is in the past."""
        return self.expireTime \
            and (self.expireTime < datetime.now(timezone.utc))


class NotificationRead(NotificationBase):
    id: UUID = Field(primary_key=True)
    popup: bool = True

    class Config:
        fields = {
            "id": {
                "title": "Notification ID",
                "description": (
                    "The ID of the notification is automatically generated and "
                    "stable over the lifetime of this notification."
                ),
                "example": "940ebfa5-a416-403a-a233-c5ccae4fec88",
            },
            "popup": {
                "description": (
                    "A flag to indicate if the notification shall pop up in the "
                    "*Receiver* UI."
                ),
                "example": True,
            },
        }


class Notification(NotificationRead, table=True):
    sseSendTime: Optional[datetime]

    def _force_to_utc(self):
        """
        Sets all naive datetime properties to timezone-aware datetime properties.

        Beware: This merely sets the UTC timezone identifier on all naive datetimes.
        It does *not* convert between timezones, because it has no way to tell what the original timezone was.

        This method is intended solely for use after database reads which return naive datetimes.
        """
        for key in ['expireTime', 'sseSendTime']:
            if value := getattr(self, key):
                setattr(self, key, value.replace(tzinfo=timezone.utc))


class NotificationCreate(NotificationBase):

    @validator('expireTime')
    def expire_time_must_be_timezone_aware(cls, expireTime: Optional[datetime]):
        if (expireTime is None) or _datetime_is_tz_aware(expireTime):
            return expireTime
        else:
            raise ValueError('must be timezone-aware')


def _datetime_is_tz_aware(dt: datetime) -> bool:
    """
    Tests whether the given `datetime` object is timezone-aware.

    See: https://docs.python.org/3/library/datetime.html#determining-if-an-object-is-aware-or-naive

    TODO: Once provided by pydantic, we might be able to use `AwareDatetime` for properties such as `expireTime`
          (see https://github.com/pydantic/pydantic/discussions/3477).
    """
    return (dt.tzinfo is not None) and (dt.tzinfo.utcoffset(dt) is not None)
