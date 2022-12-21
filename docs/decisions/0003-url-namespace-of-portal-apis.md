# Consistent usage of the URL namespace


---

- status: final
- date: 2023-01-06
- deciders: jbornhold, dwolf

---


## Context

We have a development setup in which we expose all components behind a reverse
proxy, so that they can consistently interact with each other. Our deployment
targets App Center and Kubernetes are also both using a reverse proxy in front
of the components:

- Kubernetes uses the concept of an Ingress.

- App Center is running inside of the UCS machine and has the Apache httpd
  available which acts as a reverse proxy for external access into the UCS
  machine.

The first new component is the `notifications-api` and adding it into the
reverse proxy setups did pose the question of where to put it in the URL
namespace.


## Decision

We expose portal related APIs underneath the portal prefix, so that all
components can also be used together under a different prefix.

Example of our default way of exposing it:

```
# Prefix
/univention/portal/

# notifications-api
/univention/portal/notifications-api/
```

We consider this the best fit, because the `notifications-api` is considered to
be a part of the portal.


## Consequences

Running multiple portal instances with different prefixes is possible in a
consistent way. As an example they could be deployed into different Kubernetes
namespaces or into different docker compose namespaces, so that the URLs would
look as follows:

```
# first instance with default configuration
/univention/portal/
/univention/potral/notifications-api/

# second instance with custom configuration
/univention/other-portal/
/univention/other-portal/notifications-api/
```
