# Notification-API Specification

## Notification
- id (Uid) - (PK) the notification ID (uuid)
- sourceUid (String) - The source (uuid) of the application
- targetUid (String) (optional) - The target (uuid) of a user
- title (String) (optional) - The title of the notification
- details (String) (optional) - A detailed description presented to the user
- severity (Enum) (optional) A theme the notification can appear in (info, success, warning, error)
- receiveTime (DateTime) - The time this notification was received and persisted
- readTime (DateTime) (optional) - The time at which the notification was read/closed. If not given, it was not read yet
- confirmationTime (DateTime) (optional) - The time at which the notification was confirmed. If not given, it was not confirmed yet
- expireTime (DateTime) (optional) - The time at which this notification will expire and delete itself fully from the database
- sticky (Boolean) - A boolean that represents if this notification should appear fixed at the top and is not closable/readable, it can't be dismissed in any way
- needsConfirmation (Boolean) - A boolean that represents wether this notification needs to be confirmed by the user (notification will display a confirm button)
- type (Enum) - Will control further discrimination, can be event, announcement, status or call for now
- data (JsonObject) - A JSON object containing additional data for notifications discriminated by "type"

---

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


