# Remote development in K8s cluster on Univention VM

You can set up a remote K8s cluster on your Univention VM and develop in the context of a (semi-) live environment.

[Tilt](https://tilt.dev) is the tool that integrates all related concerns into a powerful UI.

[Kind](https://kind.sigs.k8s.io/) is the provided K8s distribution.
Kind runs K8s inside a Docker container.

## Setup via Ansible

See [playbook documentation](../playbooks.md#k8s-cluster-kind-with-tilt).

## Features

- automated Docker build
- automated K8s deployment
    - support for Helm charts (limited)
- auto-update on code changes
    - watches (configurable) source files
    - syncs code changes into running container
- powerful UI
    - combines build logs and runtime logs from all services
    - search and filter for specific logs (regex supported)
- extensible to run any custom script, either on manual trigger or on event

## Remaining Issues

- [x] Run frontend in Vue development mode (support for Vue-Dev-Tools in browser)
- [ ] Run backend in debugger (PyCharm solution via Debug server starting in container)
