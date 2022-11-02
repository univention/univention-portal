# Requirements

## Use cases
The following sample use cases are considered when developing this technical concept:
- Events:
  - Nextcloud has a new file that has been shared with the user,
  - The user has been invited into a new chat room in Elements/Matrix
  - User got additional permissions granted
  -	User was added to a group
  -	Invitation to a meeting
  - Element: there is a missed call
  -	UMC updater module: There is an update available for the system or an App
  - Incoming e-mail
  - Incoming chat message
  - Document change (creation, update, deletion)
  - successful/error after installation of an app by AppCenter
- Alerts:
  - Element: There is an incoming video or phone call
  - OX: Sending an E-Mail failed
  - Incoming alerts from a monitoring module (infrastructure monitoring, etc.)
  - Meeting reminder
- Status:
  - Current number of unread messages in OX Inbox – number of new messages in in-box
  - New invitations in the calendar app
  - Number of new direct messages in Chat application
- Announcements (Information from System operator/administrator):
  - Information on software updates
  - Information on downtimes
 
## Requirements
- Applications have the possibility to publish notifications to single users, group of users or all users
- Notifications should be real-time
- Notifications can be status messages 
  - Circle above Tiles
  - clicking on the cirlce will execute an action
- Notifications can be announcements
  - Bar at the top over the whole screen width - need to be closed or confirmed by the user
- Notifications can be events
  - List of speech-bubbles at the side, when opening the bell icon (event tray)
  - first appearance as popup at the side on top to get user attention, disappears after a configurable amount of time - or can be closed by the user
- Notifications can be alerts
  - something that requires immediate attention - e.g. a call
- Certain announcements must be hideable
  > DW: what is the reason for this?
- When a user logs in, the last n notifications from history must be populated into the speech-bubble list
  - number of n last notifications can be configured
  - older notifications are loaded when the user requests by scrolling down the list or clicking a button at the bottom to load more notifications
- Announcements must come in different styles per severity
  - Severity can be info, alert, emergency
- Announcement validity
  - Announcements can become relevant/visible at a certain time
  - Announcements can expire/will be removed at a certain time
  - Validity must consider the timezone in that ... (to be further specified if this is really relevant)
- An event must be visible for a certain time until it hides in the event tray (speech-bubble list)
- Delivery of notifications must be filtered by access control lists derived from LDAP group memberships
  > DW: this needs to be discussed in the configuration part - the Routing keys should be defined for every user and represent the subscription to notifications. We need to discuss where to store them
- Notifications must not be accessible by unauthorized users
-	The system should support multiple connected web/mobile clients for the same user
- Notifications will be visible on any client, the user is logged in with
  - Visual representation might need to be adapted to the clients visual capabilities
- Notifications must have the necessary attributes for beeing uttered by the screen reader
- The user must have the opportunity to subscribe and unsubscribe to/from notification types
- The user must have the opportunity to subscribe and unsubscribe to/from notification channels
-	Notifications can contain links to application content – e.g., when sending mail failed then notification includes a link to the outbox of OX web application



