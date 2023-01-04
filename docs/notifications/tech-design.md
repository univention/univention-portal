# Technical design


## Guiding assumptions

- Keep BackendNotifications and LocalNotifications apart from each other,
  esp. within the store
- BackendNotifications are integrated with the notification-api so that
  "store.backendNotifications" does reflect the state of the backend.
- Distinguish "UI" from "Store"
- The UI does render all notifications from the Store.
- When the UI asks the Store to get all notifications, then the Store
  returns a list which is made by concatenating "store.notifiations"
  and "store.backendNotifications".
- No smart sorting will be implemented. (avoid efforts, and take Ingo's mail
  into account).


## State mutation pattern

### No backend state

Usually in the frontend, we see the following approach:

1. All changes are introduced by triggering an event (dispatch).
2. The event handler on the `Store` triggers a mutation.
3. Changes of the `Store` do then trigger events for the UI, so that components
   are rendered again where needed.


```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    User ->> UI: remove Notification
    UI -) Store: event

    Store ->> Store: mutate state, remove notification

    Store -) UI: event

    UI ->> UI: render Notifications
```


### Backend state as in BackendNotifications

The difference is that the `Store` does not "own" the whole state anymore. The
backend state is now "owned" by the `notifications-api` and this adds one extra
layer around the event handling.

1. All changes are introduced by triggering an event (dispatch).
2. The event handler on the `Store` does then "forward" the event to the
   `notifications-api` if the affected object is owned by the
   `notifications-api`. Technically the event is forwarded via an HTTP request.
3. The `notifications-api` then internally updates it's state. And this does
   trigger internal events.
4. The `notifications-api` does deliver this event to the event stream, so that
   all frontends of this user will receive the update event.
5. The `Store` in the frontend receives the event out of the `EventSource` and
   now it mutates the state in the `Store`.
6. Changes of the `Store` do then trigger events for the UI, so that components
   are rendered again where needed.


```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    User ->> UI: remove Notification
    UI -) Store: event

    Note over notifications-api, Store: Forward event to API

    activate Store
    Store ->> notifications-api: delete notification
    notifications-api -->> Store: OK
    deactivate Store

    Note over notifications-api, Store: Event pushed to all frontends

    notifications-api --) Store: event: updated notification

    activate Store
    Store ->> Store: mutate state
    Store -) UI: event
    deactivate Store

    UI ->> UI: render Notifications
```

## Interaction sequence


### User opens the portal

The frontend does two things:

1. The `Store` loads the latest BackendNotifications from the API
2. The `Store` connects to the event stream.

Hint: Client side `EventSource` is used, see
https://developer.mozilla.org/en-US/docs/Web/API/EventSource

```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    User ->> UI: Opens portal
    UI -) Store: onload

    Note over Store: Bootstrap store
    Store ->> notifications-api: fetch latest notifications
    notifications-api -->> Store: return data
    Store ->> Store: mutate state
    Store -) UI: event
    UI ->> UI: render Notifications

    Note over Store: Open event stream
    Store ->> notifications-api: open event stream

```


### Events are pushed to the frontend


Each event is handled by the `Store` and the state within the `Store` is mutated
based on the type and data of the event.


```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    Note over Store: Open event stream
    Store ->> notifications-api: open event stream

    Note over notifications-api, Store: Response chunk per event

    notifications-api --) Store: event: ping

    notifications-api --) Store: event: created notification
    Store ->> Store: mutate state, add Notification
    Store -) UI: event
    UI ->> UI: render Notifications

    notifications-api --) Store: event: updated notification

    Store ->> Store: mutate state, update Notification
    Store -) UI: event
    UI ->> UI: render Notifications

    notifications-api --) Store: event: deleted notification

    Store ->> Store: mutate state, delete Notification
    Store -) UI: event
    UI ->> UI: render Notifications

```

### CLARIFY -- User deletes a BackendNotification

The key is, that the event only triggers a request to the `notifications-api`.

Due to this API call the `Store` will get a push event with the deleted
notification.

This way we avoid any smart logic in the frontend.

```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    Note over User: Delete Notification
    User ->> UI: Remove notification
    UI -) Store: event
    Store ->> notifications-api: delete notification

    notifications-api --) Store: event: deleted Notification

    Store ->> Store: mutate state, delete Notification
    Store -) UI: event
    UI ->> UI: render Notifications
```

### CLARIFY -- A popup notification has been hidden automatically

The key is, that the event only triggers a request to the `notifications-api`.
Same as delete above.


```mermaid

sequenceDiagram

    participant notifications-api
    participant Store
    participant UI
    actor User

    Note over UI: Hide Notification
    UI ->> UI: timeout
    UI -) Store: event: hide Notification
    Store ->> notifications-api: hide notification

    notifications-api --) Store: event: updated Notification

    Store ->> Store: mutate state, update Notification
    Store -) UI: event
    UI ->> UI: render Notifications
```
