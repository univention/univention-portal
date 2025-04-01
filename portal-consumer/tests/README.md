# Portal Consumer Tests

Unit tests specific to the portal consumer.

Be aware that the portal consumer is using the codebase of the portal server as
a library due to history reasons. Related tests are within the folder
`../../unittests`.

## Requirements

- `docker compose` has to be set up and working


## How to run this manually

```
cd docker

# Run the test suite
docker compose run -it --rm test-chart-portal-consumer

# Deal with trouble via pdb
docker compose run -it --rm test-chart-portal-consumer \
  bash -c "pip install -r requirements-test.txt && \
           helm dependency build helm/portal-consumer/ && \
           pytest --values helm/portal-consumer/linter_values.yaml portal-consumer/tests/chart --pdb"

# Have a shell
docker compose run -it --rm test-chart-portal-consumer bash
pip install -r requirements-test.txt
helm dependency build helm/portal-consumer
pytest --values helm/portal-consumer/linter_values.yaml portal-consumer/tests/chart
```


## Details

- Many tests describe the relevant values fragment in YAML and parse it via
  `yaml.safe_load`. This shall help to make the example snippets comparable to
  an existing `values.yaml` for a Helm chart.
