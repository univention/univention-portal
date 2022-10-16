# Attributes of Notifications
- urgency: immediate reaction required or not
- importance: affects safety or security, legal information, service administration, ...
- implies action: answer a call, respond to a message, update a Document


# Data Storage and Persistency

- DB model contains different tables for status messages and alert/events messages
- alerts/events messages for information about actions (threshold limits, file shared, email received, invitation to group, etc.)
- alerts/events messages to store in structure (id, timestamp, {decomposed}routing_key, message - TBD finally)

- status messages for information about changing states (number of unread emails, etc.)
- status messages to store in structure (decomposed_status_routing_key, status_key, status_value, link - TBD finally) - this will only store the last status value for a certain routing_key (PK is the decomposed_status_routing_key)

# Notification Structure

A single notification can be represented with a concise object

**Notification**
- `source` - The source DN of the application
- `target` - The target DN, can target a user or a group
- `title` - The title of the notification
- `severity` (optional) A theme the notification can appear in (`info`, `success`, `warn`, `danger`)
- `message` (optional) - The notification message, shown when notification details are to be shown
- `sendTime` - The time this notification was sent
- `receiveTime` - The time this notification was received and persisted
- `readTime` (optional) - The time at which the notification was read/closed. If not given, it was not read yet
- `confirmTime` (optional) - The time at which the notification was confirmed. If not given, it was not confirmed yet
- `expireTime` (optional) - The time at which this notification will expire and delete itself fully
- `sticky` - A boolean that represents wether this notification should appear fixed at the top and is not closable/readable
- `needsConfirmation` - A boolean that represents wether this notification needs to be confirmed by the user
- `type` - Will control further discrimination, can be `event`, `announcement` or `call` for now

Further discrimination handled by `type`:

**EventNotification** (type `event`)
- `callbackUrl` - The URL the user lands on when he clicks on the notification

**AnnouncementNotification** (type `announcement`)

(No special fields for now)

**CallNotification** (type `call`)
- `acceptUrl` - The URL opened when the user accepts the call
- `rejectUrl` - The URL requested when the user rejects the call
