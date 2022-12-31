# Notifications API of the Univention Portal

Notifications API is a service to route information, relevant for a portal user,
from an application like OX or NextCloud or an administrative user to the portal frontend
for live display.


## Running the API locally


### Running the API via docker compose

The API server can be brought up with the following example command:

```
docker compose up
```

Note that fresh images can be built with the `build` subcommand:

```
docker compose build
```


### Initialize the database

Example to initialize the database:

```
docker compose run app /bin/bash
alembic upgrade head
```

The output does look roughly as follows:

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> c83d839fbaad, Create table notification
```

And a file called `notifications.db` should be created.


### Seed the database

It is possible to put a few example notifications into the database with the
following command:

```
docker compose run app python migrations/seed.py
```


## Running the test suite

The test suite is based on `pytest` and can be executed with the following
command:

```
docker compose run test
```

The output should roughly like the following example:

```
============================== test session starts ===============================
platform linux -- Python 3.9.16, pytest-7.2.0, pluggy-1.0.0
rootdir: /app
plugins: anyio-3.6.2, mock-3.10.0, Faker-15.2.0
collected 5 items

tests/test_notification_api.py .....                                       [100%]

=============================== 5 passed in 0.38s ================================
```


## Using the API for HTTP requests

Documentation for the API is automatically generated and available in the local
development server at the following URL:

http://localhost:8080/docs


### Example request

The documentation does include tooling to easily create test requests to the API
endpoints and to explore the API. It also can be used to help generate a curl
command which can be used from the command line as in the following example
which creates a new notification:

```
curl -X 'POST' \
  'http://localhost:8080/v1/notifications' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "sourceUid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "targetUid": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "test from browser",
  "details": "This is the detailed text of the notification",
  "severity": "info",
  "sticky": true,
  "needsConfirmation": true,
  "notificationType": "event",
  "data": {}
}'
```


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
    "details": {
        "type": "String",
        "description": "A detailed description presented to the user",
        "optional": True
    },
    "severity": {
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
    "readTime": {
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
    "notificationType": {
        "type": "NotificationType",
        "description": "Will control further discrimination.",
    }    ,
    "data": {
        "type": "JsonObject",
        "description": "containing additional data for notifications discriminated by 'notification_type'.",
    }
}
```

### `NotificationType`

```json
["event", "announcement", "alert"]
```

### `NotificationSeverity`

```json
["info", "success", "warning", "error"]
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
