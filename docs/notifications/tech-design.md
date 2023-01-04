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
