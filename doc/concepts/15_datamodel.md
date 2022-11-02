# Data Storage and Persistency

- DB model contains two tables 1) for status and 2) for all other messages
- Routing key: {appId}.{appComponent}.{notificationType}.{userId}.{groupId}

# Data Structures

A single notification can be represented with a concise object:

## Notification
- `id` - (PK) the notification ID (uuid)
- `sourceUid` - The source (uuid) of the application
- `targetUid` - The target (uuid) of a user
- `title` - The title of the notification
- `severity` (optional) A theme the notification can appear in (`info`, `success`, `warning`, `error`)
- `details` (optional) - The notification details, shown on demand
- `sendTime` - The time this notification was sent (to be provided by the application)
- `receiveTime` - The time this notification was received and persisted
- `readTime` (optional) - The time at which the notification was read/closed. If not given, it was not read yet
- `confirmationTime` (optional) - The time at which the notification was confirmed. If not given, it was not confirmed yet
- `expireTime` (optional) - The time at which this notification will expire and delete itself fully
    > DW: does delete means from the database? or only not shown anymore?
- `sticky` - A boolean that represents if this notification should appear fixed at the top and is not closable/readable
    > DW: what does this mean - not closable/readable?
- `needsConfirmation` - A boolean that represents wether this notification needs to be confirmed by the user
- `type` - Will control further discrimination, can be `event`, `announcement`, `alert` or `call` for now

Further discrimination handled by `type`:

### ***EventNotification*** (type `event`)
- `callbackUrl` - The URL the user lands on when he clicks on the notification

### ***AnnouncementNotification*** (type `announcement`)
- `infoUrl` - URL to some further additional information

### ***CallNotification*** (type `call`)
- `acceptUrl` - The URL opened when the user accepts the call
- `rejectUrl` - The URL requested when the user rejects the call


## Status messages
Status messages are received by the API. Only the latest value for a certain key is stored. A history of status messages is not available.

- `appId` (PK) - the ID of the application
- `appComponent` (PK) - the name of the component of the application (e.g. "calendar" in OX app) for which the status is
- `userId` (PK) - the ID of the user 
- `statusKey` (PK) - a key that represents an identifier for the status message (e.g. "unread_mails")
- `statusValue` - the value related to the status key (e.g. "24")
