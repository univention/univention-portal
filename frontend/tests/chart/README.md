# Helm chart Unittests

This folder contains a set of unit tests which cover the behavior of the chart.


## Requirements

- `docker compose` has to be set up and working


## How to run this manually

```
cd docker

# Run the test suite
docker compose run -it --rm test-chart-portal-frontend

# Have a shell
docker compose run -it --rm test-chart-portal-frontend bash
pytest --values helm/portal-frontend/linter_values.yaml frontend/tests/chart
```


## Details

- Many tests describe the relevant values fragment in YAML and parse it via
  `yaml.safe_load`. This shall help to make the example snippets comparable to
  an existing `values.yaml` for a Helm chart.
