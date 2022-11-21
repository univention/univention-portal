# Souv AP Notifications

Notifications API is a service to route information, relevant for a portal user,
from an application like OX or NextCloud or an administrative user to the portal frontend
for live display.

## Using the API for HTTP requests

## Data Model

### Full Notification, as internally stored

```json
{
    "id": {
        "type": "UUID",
        "description": "the unique notification ID",
        "primary_key": True
    },
    "sourceUid": {
        "type": "String",
        "description": "uniquely identifies the issuer of the notification",
    },
    "targetUid": {
        "type": "String",
        "description": "uniquely identifies the target of the notification, i.e. the user",
        "optional": True
    },
    "title": {
        "type": "String",
        "description": "The title of the notification, as in 'headline'",
        "optional": True /* TBD: why can this be optional? */
    },
    "title": {
        "type": "String",
        "description": "The title of the notification, as in 'headline'",
        "optional": True
    },
    "details": {
        "type": "String",
        "description": "A detailed description presented to the user",
        "optional": True
    },
    "details": {
        "type": "NotificationSeverity",
        "description": "A theme the notification can appear in",
        "optional": True,
        "default" "info"
    },
    "receiveTime": {
        "type": "String",
        "description": "An ISO date-time string, recording when this notification was received and persisted",
        "internal": True,
    },
    "receiveTime": {
        "type": "String",
        "description": "An ISO date-time string, recording at which time the notification was read/closed.",
        "optional": True,
    },
    "confirmationTime": {
        "type": "String",
        "description": "An ISO date-time string, recording at which time the notification was confirmed.",
        "optional": True,
    },
    "expireTime": {
        "type": "String",
        "description": "An ISO date-time string, recording at which time this notification will expire and be deleted from the database.",
        "optional": True,
    },
    "sticky": {
        "type": "boolean",
        "description": "If 'True', this notification will appear at the top of the portal and can't be dismissed in any way.",
        "optional": True,
        "default": False
    },
    "needsConfirmation": {
        "type": "boolean",
        "description": "If 'True', this notification needs to be confirmed by the user (widget will contain a 'confirm' button).",
        "optional": True,
        "default": False
    },
    "notification_type": {
        "type": "NotificationType",
        "description": "Will control further discrimination.",
    }    ,
    "data": {
        "type": "JsonObject",
        "description": "containing additional data for notifications discriminated by 'notification_type'.",
    }
}
```


## Create an Event notification (Full example)

Operation: createNotification

```http
POST /api/notifications HTTP/1.1
Authorization: <tbd>
Content-Type: application/json
Accept: application/json

{
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "title": "Hello from application!",
  "details": "This is just an example notification.",
  "severity": "info",
  "sticky": false,
  "needsConfirmation": false,
  "type": "event",
  "data": {
    "additionalProperty1": "some value",
    "additionalProperty2": 45
  }
}

---
HTTP/1.1 201 Created
Content-Type: application/json
Location: /api/notifications/0ceeef2223

{
  "id": "0ceeef2223",
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "title": "Hello from application!",
  "details": "This is just an example notification.",
  "severity": "info",
  "receiveTime": "2022-08-11T16:22:34Z-02:00",
  "readTime": null,
  "confirmationTime": null,
  "expireTime": null,
  "sticky": false,
  "needsConfirmation": false,
  "type": "event",
  "data": {
    "additionalProperty1": "some value",
    "additionalProperty2": 45
  }
}
```

---

## Create a Status update

Operation: createNotification

```http
POST /api/notifications HTTP/1.1
Authorization: <tbd>
Content-Type: application/json
Accept: application/json

{
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "type": "status",
  "data": {
    "badgeLabel": "233",
    "badgeDescription": {
      "de": "233 ungelesene E-Mails",
      "en": "233 unread E-Mails"
  }
}

---
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0ceeef2223",
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "title": null,
  "details": null,
  "severity": "info",
  "receiveTime": "2022-08-11T16:22:34Z-02:00",
  "readTime": null,
  "confirmationTime": null,
  "expireTime": null,
  "sticky": false,
  "needsConfirmation": false,
  "type": "status",
  "data": {
    "badgeLabel": "233",
    "badgeDescription": {
      "de": "233 ungelesene E-Mails",
      "en": "233 unread E-Mails"
  }
}

```

---

Operation: getLatestNotifications

```http
GET /api/notifications/latest?page=1&limit=10&type=event HTTP/1.1
Authorization: <tbd>
Accept: application/json

---
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "0ceeef2223",
    "sourceUid": "<uid of the app>",
    "targetUid": "<uid of the user>",
    "title": "Hello from application!",
    "details": "This is just an example notification.",
    "severity": "info",
    "receiveTime": "2022-08-11T16:22:34Z-02:00",
    "readTime": null,
    "confirmationTime": null,
    "expireTime": null,
    "sticky": false,
    "needsConfirmation": false,
    "type": "event",
    "data": {
      "additionalProperty1": "some value",
      "additionalProperty2": 45
    }
  },
  {
    "id": "0ceeef5463",
    "sourceUid": "<uid of the app>",
    "targetUid": "<uid of the user>",
    "title": "Hello from application!",
    "details": "This is just an example notification.",
    "severity": "info",
    "receiveTime": "2022-08-11T15:22:34Z-02:00",
    "readTime": "2022-08-11T16:22:34Z-02:00",
    "confirmationTime": "2022-08-11T16:22:34Z-02:00",
    "expireTime": null,
    "sticky": false,
    "needsConfirmation": false,
    "type": "event",
    "data": {
      "additionalProperty1": "some value",
      "additionalProperty2": 45
    }
  },
  // ...
]
```

---

Operation: readNotification

```http
PATCH /api/notifications/0ceeef2223/read HTTP/1.1
Authorization: <tbd>
Accept: application/json

---
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0ceeef2223",
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "title": "Hello from application!",
  "details": "This is just an example notification.",
  "severity": "info",
  "receiveTime": "2022-08-11T15:22:34Z-02:00",
  "readTime": "2022-08-11T16:22:34Z-02:00",
  "confirmationTime": null,
  "expireTime": null,
  "sticky": false,
  "needsConfirmation": false,
  "type": "event",
  "data": {
    "additionalProperty1": "some value",
    "additionalProperty2": 45
  }
}
```

---

Operation: confirmNotification

```http
PATCH /api/notifications/0ceeef2223/confirm HTTP/1.1
Authorization: <tbd>
Accept: application/json

---
HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0ceeef2223",
  "sourceUid": "<uid of the app>",
  "targetUid": "<uid of the user>",
  "title": "Hello from application!",
  "details": "This is just an example notification.",
  "severity": "info",
  "receiveTime": "2022-08-11T15:22:34Z-02:00",
  "readTime": null,
  "confirmationTime": "2022-08-11T16:22:34Z-02:00",
  "expireTime": null,
  "sticky": false,
  "needsConfirmation": false,
  "type": "event",
  "data": {
    "additionalProperty1": "some value",
    "additionalProperty2": 45
  }
}
```

---

Operation: getHubs

```http
GET /api/hubs HTTP/1.1
Authorization: <tbd>
Accept: application/json

---
HTTP/1.1 200 OK
Content-Type: application/json

[
  "http://notification.univention.de/hub/user/123444",
  "http://notification.univention.de/hub/broadcast"
]
```
