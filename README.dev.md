# Univention Portal - Developer Information



## Overview

The following components form the Univention portal:

- [Frontend in `frontend/`](./frontend/) -- The client side implementation of
  the portal.
- [Server in `./`](./) -- The portal server is currently located in the root
  folder. The source code is in [`python/`](./python/) and the tests are inside
  of [`unittests/`](./unittests/).
- [Notifications API in `notifications-api/`](./notifications-api/) -- The
  backend api needed for server side notification handling.



## Utilities

The following utilities are in use for development, ci integration and
packaging:

- [Ansible in `ansible/`](./ansible/) -- Ansible scripts which capture useful
  and needed tweaks to adjust the state of a given UCS machine.
- [Debian Package in `debian/`](./debian/) -- (deprecated) Configuration and
  scripts to build a Debian package out of the codebase. This has in the past
  also been used to develop the portal on a UCS machine. We keep it in a working
  state until the migration towards containers has been fully achieved and
  proven to be solid also for all use cases from a developer's perspective.
- [Docker in `docker/`](./docker) -- Docker based tooling is kept inside of the
  subdirectory `./docker/`. An exception are the Dockerfiles related to a
  component, those are typically in the root folder of the respective component.
  The packaging of new components is only based on docker containers, old
  components are being migrated into a container based packaging.
- [Docker Compose in `docker/`](./docker) -- Docker compose is in use as a
  convenience utility to ease the process of starting the application locally.
- [Gitlab CI in `.gitlab-ci.yml`](./.gitlab-ci.yml) -- The pipeline
  configuration shows which checks are automatically run and how they are run.



## Working with container images locally

An adjusted docker compose file has been created to make it easier to build the
current state into container images and to run those images. This file can be found at
`docker/docker-compose.yaml`.

Preparation:

- Ensure that you have a local copy of the files `/docker/.env\..*`, otherwise
  `docker compose` will refuse to run your containers.

The intended usage idea is shown in the following example:

```sh
# Build images
docker compose -f docker/docker-compose.yaml build

# Run the containers locally
docker compose -f docker/docker-compose.yaml up

# Run the tests locally
docker compose -f docker/docker-compose.yaml run test

# Run the linter container
docker compose -f docker/docker-compose.yaml run pre-commit
```

A simple interaction example with the running containers:

```sh
$ curl http://localhost:8080/
<!DOCTYPE html><htm [...]

$ curl http://localhost:8095/univention/portal/portal.json
{"cache_id": "1667994988.804391", "user_links": [], "menu_links": [...]
```
