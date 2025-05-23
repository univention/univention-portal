# Unittests

This folder contains a set of unit tests which cover the behavior of the chart.

These tests are based on `helm-test-harness`. See
<https://git.knut.univention.de/univention/dev/nubus-for-k8s/common-helm> for
further details.


## Requirements

- `docker compose` has to be set up and working


## How to run this manually in a container

```
cd docker

# Run the test suite
docker compose run -it --rm test-chart-portal-server

# Deal with trouble via pdb
docker compose run -it --rm test-chart-portal-server pytest portal-server/tests/chart --pdb

# Have a shell
docker compose run -it --rm test-chart-portal-server bash
pytest portal-server/tests/chart
```


## Development

The Helm chart related tests do currently not provide their own Python
environment. The environment from `common-helm` should be used for this purpose:

```
uv --project ~/work/common-helm run bash
uv --project ~/work/common-helm run zsh
```

Note that `~/work/common-helm` has to be adjusted with your local clone of the
`common-helm` repository.
