# Use Basic Auth between the portal-server and UMC

---

- status: final
- date: 2023-03-09
- deciders: tkintscher

---


## Context and Problem Statement

The `portal-server` requires the following resources from the `univention-management-console`:

- `/var/cache/univention-portal/groups.json` and `/var/cache/univention-portal/portal.json`

  In the UCS scenario, these files are shared between the portal-server and the umc
  by running on the same host and accessing the same filesystem.
  The files are not exposed to the public.

  In the (partly-)containerized scenario, the files are exposed through the Apache on the UCS machine under
  - `GET http://ucs/univention/internal/groups`
  - `GET http://ucs/univention/internal/portal`

-  `GET http://ucs/univention/get/session-info`
   in [`extensions/authenticator.py`](https://git.knut.univention.de/univention/components/univention-portal/-/blob/f8d75e15937e4a6f147256f39b33b084d8258fb6/python/univention/portal/extensions/authenticator.py#L144)
   sending the session id of the user in the `Cookie`-header.

   This endpoint is handled by `/usr/sbin/univention-management-console-web-server` on the UCS machine.
   This script [verifies][1] that the requester's IP address (`X-Forwarded-For`) equals `localhost`,
   where the portal-server is expected to reside.

- `POST http://ucs/univention/get/categories`
- `POST http://ucs/univention/get/modules`
   in [`extensions/portal.py`](https://git.knut.univention.de/univention/components/univention-portal/-/blob/f8d75e15937e4a6f147256f39b33b084d8258fb6/python/univention/portal/extensions/portal.py#L323)
   sending the session id of the user in the `Cookie`-header.

   These endpoints are handled by `/usr/sbin/univention-management-console-web-server` on the UCS machine.
   This script [verifies][1] that the requester's IP address (`X-Forwarded-For`) equals `localhost`,
   where the portal-server is expected to reside.

In addition, the `portal-frontend` requires additional resources beyond that, such as:
- `http://ucs/univention/(auth|login)/`

  For the simple login.

- `http://ucs/univention/saml/*`

  For handling the login flow with a SAML IdP (e.g. Keycloak).

- `http://ucs/univention/logout/`

  For logging out and terminating the session on the UCS host.

The UMC also exposes these endpoints which are out of scope for the portal containerization and remain accessible only from localhost for now:

- `http://ucs/univention/(get|set|command|upload)/.*`

[1]: https://git.knut.univention.de/univention/ucs/-/merge_requests/584 (There is an MR which would make the permitted hosts configurable.)


## Considered Options

- Expose everything through the reverse proxy or ingress, and add a fake X-Forwarded-For header.

- Protect the endpoints with Basic auth using a secret shared between the UCS Apache and the portal-server.

- JWT with service tokens.


## Decision Outcome

Chosen option: "Basic auth"

We choose the Basic auth approach for now, but we are going to have to transition to (probably) a token-based approach in the future
as more components are containerized.

The endpoints mentioned above are exposed on the UCS machine
and require Basic auth with the username `portal-server` and an pre-agreed-upon password.
