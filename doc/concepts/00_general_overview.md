# Results of discussion from 6.10.2022

- RabbitMQ will make probably more work than it solves real problems
- Solution to have a service process (node.js, nextJS, etc.) that receives messages and publishes them in an async and unblocking way
- an RDBMS is used to support message persistency and historization of messages
- Mercure service (deployed as sidecar) to act as a middleware service for message push support (SSE, WebSocket)
- this solution provides notifications as push and only when there is new information available - a current status will only be achieved when a status change get published
