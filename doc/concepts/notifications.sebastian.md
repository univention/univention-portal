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


## Requirements

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
- an event must be visible for a certain time until it hides in the event tray
- Delivery of notifications must be filtered by access control lists derived from LDAP group memberships
- Notifications must not be accessible by unauthorized users


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

## Open Questions