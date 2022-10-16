# Questions

> DW: Should the central navigation also get support for these notifications?

> DW: How the connected applications are mapping user_id, group_id, etc. (keycloak topic, ask Jaime and Yannik)
  >> DW: the apps know a UCS internal uuid of the user "entryuuid", which should be used

> SKF: Terminology discussion: Events, Alerts, Status, Announcements, Calls
  >> - Alerts are probably announcements
  >> - calls could be a specialization of alerts/announcements

> SKF: Is it acceptable for call notifications to receive the recipient with some delay (network latency, message routing, etc.?) What other channels are there for a call to reach the recipient?
  >> DW: how do we handle/know about when during the call the caller hangs up? This probably is another notification that we need to define as a type?

> SKF: How to handle read status
  >> - Information needs to flow from the user, presumably needs to be stored in the backend
  >> - DW: this shoulb be handled by the API


---  
# Results of discussion from 6.10.2022

- RabbitMQ will make probably more work than it solves real problems
- Solution to have a service process (node.js, nextJS, etc.) that receives messages and publishes them in an async and unblocking way
- an RDBMS is used to support message persistency and historization of messages
- Mercure service (deployed as sidecar) to act as a middleware service for message push support (SSE, WebSocket)
- this solution provides notifications as push and only when there is new information available - a current status will only be achieved when a status change get published
