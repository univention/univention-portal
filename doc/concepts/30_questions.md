# Questions

- Should the central navigation also get support for these notifications?
- How the connected applications are mapping user_id, group_id, etc. (keycloak topic, ask Jaime and Yannik)
- How a message from app should look like - default JSON schema, supported fields, etc.


- Terminology discussion: Events, Alerts, Status, Announcements, Calls
  - Alerts are probably announcements
  - calls could be a specialization of alerts/announcements

- Is it acceptable for call notifications to receive the recipient with some delay (network latency, message routing, etc.?) What other channels are there for a call to reach the recipient?
- How to handle read status
  - Information needs to flow from the user, presumably needs to be stored in the backend