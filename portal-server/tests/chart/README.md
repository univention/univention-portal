# Unittests

This folder contains a set of unit tests which cover the behavior of the chart.


## Requirements

- `docker compose` has to be set up and working


## How to run this manually

```
cd docker

# Run the test suite
docker compose run -it --rm test-chart-portal-server

# Deal with trouble via pdb
docker compose run -it --rm test-chart-portal-server \
  bash -c "pip install -r requirements-test.txt && \
           helm dependency build helm/portal-server/ && \
           pytest --values helm/portal-server/linter_values.yaml portal-server/tests/chart --pdb"

# Have a shell
docker compose run -it --rm test-chart-portal-server bash
pip install -r requirements-test.txt
helm dependency build helm/portal-server
pytest --values helm/portal-server/linter_values.yaml portal-server/tests/chart
```


## Details

- Many tests describe the relevant values fragment in YAML and parse it via
  `yaml.safe_load`. This shall help to make the example snippets comparable to
  an existing `values.yaml` for a Helm chart.
