
# README

This branch is used for an explorative analysis of the univention-portal. It
does add various ways to build certain artifacts which can then be user to
experiment with varying setups.

This work is mainly used to prepare the Epic 409 at
<https://git.knut.univention.de/groups/univention/-/epics/409>

Insights from this work are captured into the branch
`jbornhold/409-concept-and-planning` into the notes section.

The content in this branch is not intended or ready for any production like
usage.



## Building artifacts


### Building experimental Debian packages

There is one image in `images/deb-build` which can help to quickly build custom
Debian packages of the portal within a docker container.

An example run could look as follows:

```
docker build --progress=plain --platform=linux/amd64 \
  --output out -f images/deb-build/Dockerfile . -t wip
```

Note that the option `--platform=linux/amd64` is only needed when your docker
host is running on a different architecture. Especially on recent Macbooks this
can be the case.

The command should place the packages into the folder `out/` within the project
source tree.


### Building container images locally

This branch is based upon the containerization work of `pbednarski` from the
branch `pbednarski/containerization`.

An adjusted docker compose file has been created to make it easier to build the
current state into a container images. This file can be found at
`images/docker-compose.yaml`.

The intended usage idea is shown in the following example:

```
# Build images
docker compose -f images/docker-compose.yaml build

# Run them locally
docker compose -f images/docker-compose.yaml up
```


### Gitlab CI

The Gitlab CI integration for this branch has been restored. Images should be
built on every push to the branch automatically.

See the [Pipelines for this
branch](https://git.knut.univention.de/univention/components/univention-portal/-/pipelines?page=1&scope=all&ref=jbornhold%2F409-exploration-wip)
in Gitlab.
