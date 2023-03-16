# Drop invalidate endpoints


---

- status: final
- date: 2023-03-16
- deciders: jbornhold

---

## Context

The original API design did foresee endpoints for invalidation of a
notification, one to invalidate a single notification and one to perform a bulk
invalidation of notifications.

At the same time we did implement a `DELETE` operation on the notification
resource which is needed when a user removes a notification.

The operation to invalidate a notification is essentially the same as removing
the notification. The only difference is the actor.


## Decision

We do not implement the endpoints to invalidate a notification and instead rely
on the existing implementation of the `DELETE` operation.

This way we keep our API documentation compact and don't promise items which we
do not support.


## Consequences

- Our API is simplified and we do not carry endpoints around which are "to be
  implemented".

- The `DELETE` operation will have a more complex authorization logic once
  authorization is going to be implemented.

- Adding special purpose endpoints is possible at any time in the future if a
  real need for them arises and a sponsorship for implementing those is
  provided.
