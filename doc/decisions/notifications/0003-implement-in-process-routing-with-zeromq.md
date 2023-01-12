# Implement routing in-process only


---

- status: final
- date: 2023-01-11
- deciders: jbornhold

---

## Context

The notifications-api has to route incoming events to all listening clients for
the respective user. This means that a topic based publish and subscribe pattern
is needed.

From the architectural context we know that RabbitMQ is likely going to be added
into the system. A recent research unveiled that also Redis is a well fitting
candidate which could provide needed persistence as well as the needed topic
based publish / subscribe model.

Currently we use a PostgreSQL as a persistence layer.


## Decision

As a first step the routing will be implemented in-process only. ZeroMQ is
leveraged as a library to provide a process internal publish / subscribe
mechanism.

This allows to take the decision regarding the right tool for routing and for
persistence without time pressure, and it gives us now already a working system.

The implementation will be limited to in-process communication, so that
development of complex code for handling failure cases of a network socket can
be avoided. Otherwise we would have to develop a protocol on top of the ZeroMQ
sockets and would not give us the desired low effort solution anymore.


## Consequences

- The notifications-api does not yet support multi-process operation. This does
  limit scaling options.
