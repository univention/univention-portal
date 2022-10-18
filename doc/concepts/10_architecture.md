# Architecture

## Components

- **Application**

  The application eventually triggering a notification
  - list of applications: ox, nextcloud, elements, UMC, UDM, portal, ...

- **MQ**, Message Queue, CQRS

  Usually RabbitMQ or MQTT-Broker that will enable sending messages asynchronically.

- **API**

  An API representing the orchestrator for authorization and message dispatching. Receives message from applications and serves as endpoint for notification subscription clients.

  _Can or can not be UDM-REST-API_ 
  
  >***DW: How can the UDM-REST-API help us here?***

- **RDMBS**, (Relational) Database
  
  A long-term persistent storage for notifications. Allows quick listing, paging and searching for notifications.

- **Socket**, Mercure, SSE/WS

  Enables a web-client to continously receive live messages via a socket mechanism. Runs as a hub that receives messages and publishes them to connected clients. 

- **Frontend**

  This can either be the Univention-Portal, but it can also be the header bar (navigation bar) in applications and probably all other instances that want to show notifications.


## High level control flow

```mermaid

sequenceDiagram
    participant Apps
    participant Backend
    participant Frontend
    Frontend->>Backend: User logged in
    Backend->>Frontend:  Once: Historical notifications from absence time
    Apps->> Backend: New notification content
    Backend->>Frontend:  Continuous and live notifications
    Apps->> Backend: New notification content

```

> **DW:** Do we need the "User ready to receive notifications" or do we want to listen simply for all notifications?
  >> **SKF:** Is it possible to try and call someone who is not logged into the portal?
    >>> If yes, the incoming-call info does not need to be routed if the user is not online and does not need to be persisted, either.
      It will turn into a missed call information and show up the next time the user logs in.

  >> **SKF:** Another question is, which component keeps track of user status. Will the BE query the status from the FE somehow? I don't know if that is possible at all, since no session exists.

# Notification Trigger Process

1. **Application** calls **API** to create a new notification

   e.g.
   ```http
   POST /notifications HTTP/1.1
   Host: api.instance

   {
      "source": "cn=owncloud,cn=apps,cn=univention,dc=intranet,dc=portal,dc=de",
      "target": "cn=johndoe,cn=users,cn=univention,dc=intranet,dc=portal,dc=de",
      "title": "Jane is calling you!",
      "message": "Press \"Accept\" or \"Reject\" to answer the call.",
      "sendTime": "2022-10-05T10:31Z-02:00",
      "expireTime": "2022-10-10T12:35Z-02:00",
      "type": "call",
      "acceptUrl": "https://call.univention.de/join?sessionToken=abcdef",
      "rejectUrl": "https://api.univention.de/reject-call?sessionToken=abcdef"
   }
   ``` 
  > **DW:** source and target should be some uuid as I understood Arvid correctly last time

2. **API** fills out the rest of the data (see [Notification DataStructure](./15_datamodel.md#notification-structure)) and
   1. **either** sends it to the MQ (`Client-Mode`)
   > **DW:** what does client mode mean?
   2. **or** continues on Step 4. (`Listener-Mode`)
3. **API** listens on MQ channel and continously receives new notifications from MQ
4. **API** takes received Notifications and
   1. Persists them in the database
   2. Sends them to the **Socket** (Mercure Hub) for the web-frontend to receive it live

**Notes:**

- Target can be a single user, a group or all users within the domain

# Frontend Process

1. On load after login, **Frontend** requests a quick view of the notifications

   ```http
   GET /notifications?query=latest HTTP/1.1
   Host: api.instance
   ```

   It will receive an array of existing notifications - to be defined how much of the latest notifications are queried (configurable)

   **API** will make sure that the user can only request notifications their DN (user_id) fits in (request header contains the portal access token with user information)
2. **Frontend** connects **Socket** to continously receive new notifications
3. **Frontend** will connect to all applications it knows/displays badges for and calls

   ```http
   GET /.well-known/univention-meta.json HTTP/1.1
   Host: <the application host>
   ```
   >**DW:** do we really want the frontend to ask every app to request the well-known endpoint or may it be better to let it the backend do?
   
   > this is request should go through the intercom service to get the correct application token

   and receives (if available) a meta information to display proper badge information

   ```http
   HTTP/1.1 200 OK
   Content-Type: application/json

   {
    "name": "Open Exchange",
    "badgeLabel": "244",
    "badgeDescription": {
        "de_DE": "244 ungelesene E-Mails",
        "en_GB": "244 unread e-mails"
    }
   }
   ```
   >DW: this is status information. maybe it is necessary to define a more sophisticated data structure here to have more possibilities in interpreting the data

   This meta-info can be cached properly.
4. Depending on `type`, the **Frontend** displays the proper notification view
    > **DW:** which type do you mean?
5. When going to the notification dashboard, **Frontend** calls **API** to receive and filter _all_ notifications
    > **DW:** what is the Notification dashboard?


## Initial notifications 

- initial notifications (especially status messages) to get from the app by means of an .well_known endpoint who provides zero state information (this is necessary for information that is related to the tiles - number of unread emails, etc.)