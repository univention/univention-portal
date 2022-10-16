- [Introduction](#introduction)
- [Terminology](#terminology)
- [Use Cases](./05_requirements.md#use-cases)
- [Requirements](./05_requirements.md#requirements-1)

- [Architecture](./10_architecture.md)
    - [Components](./10_architecture.md#components)
    - [High level control flow](./10_architecture.md#high-level-control-flow)
    - [Notification Trigger Process](./10_architecture.md#notification-trigger-process)
    - [Frontend Process](./10_architecture.md#frontend-process)
---
## Introduction

[Epic 356](https://git.knut.univention.de/groups/univention/-/epics/356) describes the feature “Events/Alerts by Apps” for the Portal component. The present document describes a technical concept for implementation of such a feature.

1. Solution to have a service process (node.js, nextJS, etc.) that receives messages by an HTTP POST request and publishes them in an async and unblocking way to subscribed recreivers
1. an RDBMS is used to support message persistency and historization of messages
1. Mercure service (deployed as sidecar) to act as a middleware service for message push support (SSE, WebSocket)
1. this solution provides notifications as push and only when there is new information available - a current status will only be achieved when a status change get published

---
## Terminology

- **Notification** - 
- **Message** - the concrete implementation of a notification
- **Message Types**
    - _Event_ - the standard notification that informs about system events that do not need immediate attention (e.g. received a new email) 
    - _Announcement_ - something that needs greater attention and is displayed as a colored bar over the whole screen (e.g. server maintenance today at 16:00)
    - _Status_ - user specific information from an application about the status of a certain fact (e.g. number of unread emails)
    - _Alert_ - notification about something that needs immediate attention
        - _Call_ - a specialisation of an alert, with defined response actions (answer, reject)
- **Application** - the emitter of messages
- **Client** - the receiver of messages
- **Publisher** - entity that publishes messages
- **Subscriber** - entity that subscribes to certain kind of messages