# Ansible Playbooks

## Python 3 venv

Sets up a Python venv on a Univention VM.

`ansible/python3-environment.yaml`

Location of the venv can be configured in `ansible/vars/venv.yaml`.

Installed packages can be configured in the playbook.

Installs:

- [Docker SDK for Python](https://docker-py.readthedocs.io/en/stable/)
  required by Ansible on the remote host to manage Docker

---

## JupyterLab

Sets up JupyterLab on a Univention VM.

`ansible/jupyterlab.yaml`

This playbook **implicitly** sets up a Python 3 venv because JupyterLab requires a different *Tornado Web Server* version than the one UCS ships.

Creates a default directory for notebooks at `/root/notebooks`.

You can configure the Jupyter server in `ansible/templates/jupyter/jupyter_server_config.py`.

---

## K8s cluster (Kind) with Tilt

Sets up K8s cluster on a Univention VM.

This playbook **implicitly** sets up a Python 3 venv because Ansible requires a Docker SDK on the remote host.

Playbook can be accustomed in `ansible/vars/k8s-kind.yaml`

```shell title="Usage"
# installs dependencies
ansible-playbook ansible/kind-environment.yaml -i YOUR_INVENTORY -t install

# sets up a Kind cluster on the remote host
ansible-playbook ansible/kind-environment.yaml -i YOUR_INVENTORY -t setup

# deletes Kind cluster on the remote host
# registry container remains -> do 'docker ps'
ansible-playbook ansible/kind-environment.yaml -i YOUR_INVENTORY -t teardown

# removes dependencies
ansible-playbook ansible/kind-environment.yaml -i YOUR_INVENTORY -t teardown
```

```shell title="Docker containers running cluster and local registry"
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                       NAMES
c8b607c3868c        kindest/node:v1.25.3     "/usr/local/bin/entr…"   3 days ago          Up 45 hours         127.0.0.1:35653->6443/tcp   kind-control-plane
1dad18ce1387        registry:2               "/entrypoint.sh /etc…"   3 days ago          Up 45 hours         127.0.0.1:5000->5000/tcp    ctlptl-registry
```

---

## MkDocs static site

Sets up this site to be served from a Univention VM.

`ansible/mkdocs-static-site.yaml`

This playbook **implicitly** sets up a Python 3 venv because Ansible requires a Docker SDK on the remote host.

Refer to the playbook for the details of the setup.

---

## Directory Layout

```shell
ansible
├── kind-environment.yaml
├── jupyterlab.yaml
├── mkdocs-static-site.yaml
├── python3-environment.yaml
├── roles
│   ├── helm
│   │   ├── defaults
│   │   │   └── main.yaml
│   │   └── tasks
│   │       └── main.yaml
│   ├── kind
│   │   ├── defaults
│   │   │   └── main.yaml
│   │   └── tasks
│   │       └── main.yaml
│   ├── kubectl
│   │   ├── defaults
│   │   │   └── main.yaml
│   │   └── tasks
│   │       └── main.yaml
│   └── tilt
│       ├── defaults
│       │   └── main.yaml
│       └── tasks
│           └── main.yaml
├── templates
│   ├── jupyter
│   │   ├─── ipython_config.py
│   │   ├─── ipython_kernel_config.py
│   │   ├─── jupyter_server_config.py.j2
│   │   └─── overrides.json
│   └── k8s-kind
│       └── setup-cluster.yaml.j2
└── vars
    ├── k8s-kind.yaml
    └── venv.yaml
```
