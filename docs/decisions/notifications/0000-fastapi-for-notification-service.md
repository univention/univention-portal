# FastAPI for notification service

---

- status: accepted
- date: 2022-11-08
- deciders: phoenix-portal
- consulted:
    Florian Best
    Johannes Bornhold (extern)
    Torben Köhn (extern)
    Sebastian König-Festl (extern)
    Mark Lindhout (extern)
    Arvid Requate
    Daniel Wolf (extern)
    Theodros Zelleke (extern)

---

## Context and Problem Statement

An API needs to be defined to allow for pushing notifications from Apps to a portal User.
This API needs to be written in Python and a suitable server stack needs to be chosen.

We want to use *FastAPI* to be the API container, as it provides for an API driven workflow
and OpenAPI documentation out of the box.

## Decision Drivers

- OpenAPI documentation out of the box
- API centric development
- Developer experience and state-of-the-art development

## Considered Options

- *Tornado*, as it is the Python server that is already used for the portal backend
- *FastAPI*

## Decision Outcome

*FastAPI* was accepted by all people involved. Notification service will be based on *FastAPI*.
It was also discussed, whether a switch of the portal backend to *FastAPI* in one go would be
a practical thing to do, but that was postponed until efforts, particularly in regards to
existing authentication integrations, can be estimated.

### Positive Consequences

- Expected lower development efforts compared to using *Tornado*
- Microservice Architecture
- Consistent Documentation from the start

### Negative Consequences

- addition to tech stack
- at least intermediate rise in project complexity

## More Information

https://fastapi.tiangolo.com/
