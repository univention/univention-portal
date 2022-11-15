# Working with container images locally

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
```

A simple interaction example with the running containers:

```sh
$ curl http://localhost:8080/
<!DOCTYPE html><htm [...]

$ curl http://localhost:8095/univention/portal/portal.json
{"cache_id": "1667994988.804391", "user_links": [], "menu_links": [...]
```
