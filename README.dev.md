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
- [Helm in `helm/`](./helm) -- Helm is used as a package manager to ease the
  installation in Kubernetes.
- [Gitlab CI in `.gitlab-ci.yml`](./.gitlab-ci.yml) -- The pipeline
  configuration shows which checks are automatically run and how they are run.

## Working with container images locally

### Preparation of a UCS machine for development

Have a UCS machine ready for development. The machine has to be patched so that
it can be integrated into a development environment, see the folder
[`ansible/`](./ansible/) regarding details.

1. Define your inventory file if it's not yet there.
2. Apply the playbooks as shown in the below example.

```shell
ansible-playbook -i ansible/hosts.yaml \
    ansible/ucs-umc-open-from-external.yaml \
    ansible/ucs-expose-portal-json-files.yaml
```

### Preparation of Keycloak for development

In `docker/docker-compose.yaml` you can find a service called `keycloak` which
you will need to use the notifications OIDC.

1. Download your UCS CA certificate and place it in `docker/keycloak/ucs-root-ca.crt`.
2. Run `docker-compose up -d keycloak --build` on the `docker` folder.
3. Access Keycloak on `localhost:8097` and access with the credentials on the environment variables.
4. Select the `Ucs` realm on the top left corner.

5. Go to `User federation` on the bottom left menu.
  1. Select LDAP and configure your `Connection URL` to your UCS IP, like: `ldap://10.200.71.10:7389`
  2. You should be able to test the connection.
  3. Go to your UCS machine and run `` echo `cat /etc/idp-ldap-user.secret` ``.
  4. Set the LDAP `Bind credentials` to the value from the previous step.
  5. Go back to your UCS machine and `ucr get ldap/base`.
  6. Change the `Bind DN` base part to the one above.
  7. You should be able to test the authentication.
  8. Under `LDAP searching and updating` change the `Users DN` to the value above.
  9. Press `Save` at the bottom of the screen.

6. Enable the SAML login on the UCS machine with the playbook:
  ```shell
  ansible-playbook -i ansible/hosts.yaml ansible/ucs-login-with-local-keycloak.yaml
  ```
7. Step 7 copied the SSL certificate from the UCS host to the local reverse-proxy.
   Follow the next section to rebuild the images (including the SSL certificates)
   and restart the stack.

> Feel free to play around with `portal-notifications` client and mappings.
> The default configuration provided might not be valid for your setup for some cases.

### Build and run containers locally

An adjusted docker compose file has been created to make it easier to build the
current state into container images and to run those images. This file can be
found at `docker/docker-compose.yaml`. It will run the production containers in
a local setup.

Preparation:

- Ensure that you have a local copy of the file `/docker/.env.example`, otherwise
  `docker compose` will refuse to run your containers.

  ```sh
  cp docker/.env.example docker/.env
  ```

- You have to set at least the correct value for `UCS_BASE_URL`, so that your
  UCS machine will be reached.

- The other values should work out of the box and only need modification in
  adjusted setups or non-Linux systems.

Example:

```sh
# Be inside the folder docker
cd docker

# Build images
docker compose build

# Run the containers locally
docker compose up
```

Check if http://localhost:8000/ does give you a "roughly" working portal.

### Interaction from the command line

A simple interaction example with the running containers:

```sh
$ curl http://localhost:8080/
<!DOCTYPE html><htm [...]

$ curl http://localhost:8095/univention/portal/portal.json
{"cache_id": "1667994988.804391", "user_links": [], "menu_links": [...]
```

### Local development

#### Run a development server

You can run a development server of the frontend and then start the other
services based on the docker compose file:

```sh
# Bring up proxy and portal server
cd docker
docker compose up --build portal-server reverse-proxy notifications-api

# Run the frontend dev server locally
cd frontend
yarn serve
```

The idea of the `reverse-proxy` is that any combination of production and
development containers and processes is possible, as long as they bind to the
correct ports on the local machine.

See [`docker/reverse-proxy/`](./docker/reverse-proxy/) regarding further
details.

#### Utilities provided via docker compose

Further examples regarding provided containers:

```sh
# Make sure you are in the folder "docker"
cd docker

# Build images
docker compose build portal-server

# Run the containers locally
docker compose up portal-server

# Run the portal server tests locally
docker compose run test

# Run the linter container
docker compose run pre-commit

# Generate the Helm chart readmes
docker compose run helm-docs
```
