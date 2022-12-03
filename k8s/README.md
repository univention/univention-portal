# Kubernetes Experiments

This folder contains Kubernetes experiments around Issue
univention/components/univention-portal#555.


## How to use

Currently there are just a bunch of Kubernetes objects serialized into YAML
files in this folder. These can be applied via `kubectl apply -f filename.yaml`.


## Prepare container images

The Pod configuration expects images to be available locally with a specific tag
name.

They can be made available with the following example commands:

```
docker build -f docker/frontend/Dockerfile --platform linux/amd64 -t local/portal-frontend .
docker build -f docker/portal-server/Dockerfile --platform linux/amd64 -t local/portal-server .
```
