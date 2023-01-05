# API design consolidation


---

- status: final
- date: 2023-01-05
- deciders: jconde, jbornhold
- consulted: dwolf

---

## Context

The initial API design was inconsistent and not taking into account the intended
usage of `PATCH` and `POST` requests in all regards.


## Decision

Since we are in an early state of the implementation we take the opportunity to
consolidate the API based on the following patterns and principles:

1. Endpoints which reflect a Resource collection MUST end in a slash.

   Example: `/v1/notifications/`

2. Endpoints which are "under" a Resource and modify the parent Resource's state
   MUST use a `POST` request. These endpoints reflect an action to be taken on
   the Resource.

   Example: `/v1/notifications/confirm`


## Considered options

* Usage of `PUT` instead of `POST`

  The request type `PUT` can be used to create or replace a resource. It must
  contain the whole resource in it's body.

  Our endpoints which are on a sub-patch of the Resource are not containing the
  Resource itself. They are more like an action on the parent Resource with side
  effects on the server side.


## References

* Good overview of the semantics in HTTP:
  https://httpwg.org/specs/rfc9110.html#POST
