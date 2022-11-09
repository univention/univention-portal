# Working with container images locally

An adjusted docker compose file has been created to make it easier to build the
current state into container images and to run those images. This file can be found at
`images/docker-compose.yaml`.

The intended usage idea is shown in the following example:

```sh
# Build images
docker compose -f images/docker-compose.yaml build

# Run the containers locally
docker compose -f images/docker-compose.yaml up
```

A simple interaction example with the running container:

```sh
$ curl http://localhost:8095/univention/portal/portal.json
{"cache_id": "1667994988.804391", "user_links": [], "menu_links": [...]
```
