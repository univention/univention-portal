# Use Basic Auth between the portal-server and UMC

---

- status: final
- date: 2023-03-09
- deciders: tkintscher

---


## Context


### UCS host

The `portal-server` requires the following resources from the UCS host:

- `/var/cache/univention-portal/groups.json` and `/var/cache/univention-portal/portal.json`

  In the UCS scenario, these files are shared between the portal-server and the umc
  by running on the same host and accessing the same filesystem.
  The files are not exposed to the public.

  In the (partly-)containerized scenario, the files are exposed through the Apache on the UCS machine under
  - `GET http://ucs/univention/internal/groups`
  - `GET http://ucs/univention/internal/portal`

### Univention Management Console web server

The UMC webserver handles these endpoints:

`^/univention/((auth|saml|get|set|command|upload|logout)/?.*)$`

They are accessed by both the `portal-server` and the `portal-frontend`.
The endpoint handlers use the UMCSessionId, provided in the Cookie header,
to assign each request to a session.

For security reasons, the server assigns ties each session id to a fixed IP address of the client: \
https://git.knut.univention.de/univention/ucs/-/blob/5.0-3/management/univention-management-console/univention-management-console-web-server#L291

This should be the user's IP address, as these endpoints are accessed from the frontend (the browser context).

In addition, access from localhost is also allowed, as the portal server is expected to reside there.

#### Portal server

The `portal-server` uses endpoints from the UMC webserver, e.g. in order to obtain session data.

-  `GET http://ucs/univention/get/session-info`
   in [`extensions/authenticator.py`](https://git.knut.univention.de/univention/components/univention-portal/-/blob/f8d75e15937e4a6f147256f39b33b084d8258fb6/python/univention/portal/extensions/authenticator.py#L144)
   sending the session id of the user in the `Cookie`-header.

- `POST http://ucs/univention/get/categories`
- `POST http://ucs/univention/get/modules`
   in [`extensions/portal.py`](https://git.knut.univention.de/univention/components/univention-portal/-/blob/f8d75e15937e4a6f147256f39b33b084d8258fb6/python/univention/portal/extensions/portal.py#L323)
   sending the session id of the user in the `Cookie`-header.

## Problem Statement

In the UCS environment, two parties talk to the UMC:
  - The frontend (browser): requests originate from the `client.ip`.
  - The portal-server: requests originate from `localhost`.

In a containerized environment, the portal server is not running on the same host as the UMC.
Thus requests may origiante from
  - the frontend (browser) i.e. the `client.ip`,
  - the portal-server i.e. some cluster IP.

Hence, [this check](https://git.knut.univention.de/univention/ucs/-/blob/5.0-3/management/univention-management-console/univention-management-console-web-server#L297) fails.

The portal-server tries the client's session id to authenticate with the UMC,
but it does not reside at the client's IP address.
A different way is needed for the portal-server to authenticate to the UMC.

## Considered Options

- Expose everything through the reverse proxy or ingress,
  and add a fake X-Forwarded-For header to pretend that everything originates at localhost.

  This is ok for testing, but unsafe in production.

- Protect the endpoints with Basic auth using a secret shared between the UCS Apache and the portal-server.

  This is ok for testing and ok for production as long as the shared secret is make of sufficient length and entropy.

- Also expose the UMC directly on its port (8095):

  This way the portal-server could talk directly to `http://ucs:8095/some_endpoint`
  and send the true client's IP address in the X-Forwarded-For header.

- JWT with service tokens.

  This requires a lot of refactoring, but could be done in the future.

## Decision Outcome

Chosen option: "Basic auth"

We choose the Basic auth approach for now, but we are going to have to transition to (probably) a token-based approach in the future
as more components are containerized.

The endpoints mentioned above are exposed on the UCS machine
and require Basic auth with the username `portal-server` and an pre-agreed-upon password.

In between, the option to expose the UMC directly can be investigated further.
