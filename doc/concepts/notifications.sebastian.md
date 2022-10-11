# Notifications in Univention Portal

## Use Cases

- Information from Applications
  - Number of unread messages
  - Incoming call
  - Meeting reminder
  - Incoming e-mail
  - Incoming chat message
  - Document change (creation, update, deletion)
- Information from the organization
- Administrator information
  - Information on software updates
  - Information on downtimes

## Attributes of notifications:
- urgency: immediate reaction required or not
- importance: affects safety or security, legal information, service administration, ...
- implies action: answer a call, respond to a message, update a Document

## Requirements

- There are four types of notifications: announcements (probably rename to alert), events, status messages and calls
  - Announcements: Information that is 
  - Events: 
  - Status messages: 
- Notifications should be real-time
- Notifications can be status messages 
  - Circle above Tiles
- Notifications can be announcements
  - Bar at the top
- Notifications can be events
  - List of speech-bubbles at the side, when opening the bell icon (event tray)
- Certain announcements must be hideable
- When a user logs in, the last n notifications from history must be populated
- Announcements must come in different styles per severity
  - Severity can be info, alert, emergency
- Announcement validity
  - Announcements can become relevant/visible at a certain time
  - Announcements can expire/will be removed at a certain time
  - Validity must consider the timezone in that ... (to be further specified if this is really relevant)
- An event must be visible for a certain time until it hides in the event tray
- Delivery of notifications must be filtered by access control lists derived from LDAP group memberships
- Notifications must not be accessible by unauthorized users
- Notifications will be visible on any client, the user is logged in with
  - Visual representation might need to be adapted to the clients visual capabilities
- Notifications must have the necessary attributes for beeing uttered by the screen reader

## UI Elements

- Header bar
- Notification bell
- 


## High Level Architecture

```mermaid

sequenceDiagram
    participant Apps
    participant Backend
    participant Frontend
    Frontend->>Backend: User logged in
    Backend->>Apps: User ready to receive notifications
    Apps->> Backend: New notification content
    Backend->>Frontend:  Once: Historical notifications from absence time
    Backend->>Frontend:  Continuous and live notifications

```

- DW: Do we need the "User ready to receive notifications" or do we want to listen simply for all notifications?
  - Is it possible to try and call someone who is not logged into the portal?
    - If yes, the incoming-call info does not need to be routed if the user is not online and does not need to be persisted, either.
      It will turn into a missed call information and show up the next time the user logs in.
  - Another question is, which component keeps track of user status. Will the BE query the status from the FE somehow? I don't know if that is possible at all, since no session exists.

## Open Questions

- Terminology discussion: Events, Alerts, Status, Announcements, Calls
  - Alerts are probably announcements
  - calls could be a specialization of alerts/announcements

- Is it acceptable for call notifications to receive the recipient with some delay (network latency, message routing, etc.?) What other channels are there for a call to reach the recipient?
