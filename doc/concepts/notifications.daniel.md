# User Related App Notifications in Univention Portal

## Results of discussion from 6.10.2022

- RabbitMQ will make probably more work than it solves real problems
- Solution to have a service process (node.js, nextJS, etc.) that receives messages and publishes them in an async and unblocking way
- an RDBMS is used to support message persistency and historization of messages
- Mercure service (deployed as sidecar) to act as a middleware service for message push support (SSE, WebSocket)
- this solution provides notifications as push and only when there is new information available - a current status will only be achieved when a status change get published

## Data Storage and Persistency

- DB model contains different tables for status messages and alert/events messages
- alerts/events messages for information about actions (threshold limits, file shared, email received, invitation to group, etc.)
- alerts/events messages to store in structure (id, timestamp, {decomposed}routing_key, message - TBD finally)

- status messages for information about changing states (number of unread emails, etc.)
- status messages to store in structure (decomposed_status_routing_key, status_key, status_value, link - TBD finally) - this will only store the last status value for a certain routing_key (PK is the decomposed_status_routing_key)

## Initial notifications 

- initial notifications (especially status messages) to get from the app by means of an .well_known endpoint who provides zero state information (this is necessary for information that is related to the tiles - number of unread emails, etc.)

## Configuration

- routing key contains: {unique_app_name}.{app_component}.{message_type}.{user_id}.{group_id}
- subscribers can subscribe to routing keys - same approach as topic subscriptions in rabbitmq (concrete RK part value, *, #) - the list of possible subscription keys are configured for the user in UDM

## TODO

- better define use cases and message types, data structure

## Questions
- Should the central navigation also get support for these notifications?
- How the connected applications are mapping user_id, group_id, etc. (keycloak topic, ask Jaime and Yannik)
- How a message from app should look like - default JSON schema, supported fields, etc.
