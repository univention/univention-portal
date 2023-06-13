# Ansible

This folder contains Ansible playbooks to automate various tasks related to the Univention Portal in the *Sovereign Workplace* project.

## Inventory

In order to run the playbooks the developer needs to define an Ansible inventory.
This is usually a file named `hosts.yaml`.

Where this file is located is up to the individual developer.
This allows developers to reuse or define their individual Ansible setup.

You can always define a (project-specific) `hosts.yaml` inside this folder.
This location is already excluded from version control such that each developer can have its own version of this file.

An example is provided in the file [`hosts.yaml.example`](./hosts.yaml.example).

Wherever the inventory is defined, it needs to define a group labeled `ucs_primary`.

Note: make sure that the `ansible_user` is set to `root` for your hosts.

If your inventory (for this project) is defined at `./ansible/hosts.yaml` you need to specify this inventory when running any playbook.

Example:

```shell
ansible-playbook ./ansible/ucs-expose-portal-json-files.yaml -i ./ansible/hosts.yaml
ansible-playbook ./ansible/ucs-umc-open-from-external.yaml -i ./ansible/hosts.yaml
```

## Playbooks

- [`ucs-expose-portal-json-files.yaml`](./ucs-expose-portal-json-files.yaml):
  Patches the UCS webserver to serve `portal.json` and `groups.json` from the UCS cache folder.
  You can revert the changes by running the playbook with the additional option `-t restore` (this selects only task with the tag `restore`).

  Basic auth is used in order to protect these critical resources.
  The username is `portal-server`.
  The `hosts.yaml` contains a variable, `ucs_auth_secret`, which is the shared password between the UCS machine and the portal-server.

  With the inclusion of the portal-listener into the stack, these endpoints should not be accessed anymore.

- [`ucs-umc-open-from-external.yaml`](./ucs-umc-open-from-external.yaml):
  Exposes the UMC API publicly on a dev machine.

  Basic auth is used in order to protect these critical endpoints.
  The username is `portal-server`.
  The `hosts.yaml` contains a variable, `ucs_auth_secret`, which is the shared password between the UCS machine and the portal-server.

  With the inclusion of the containerized umc-server into the stack, these endpoints should not be accessed anymore.
