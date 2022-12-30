# Ansible

This folder contains Ansible playbooks to automate various tasks related to the Univention Portal in the *Sovereign Workplace* project.

## Inventory

In order to run the playbooks the developer needs to define an Ansible inventory.
This is usually a file named `hosts.yml`.

Where this file is located is up to the individual developer.
This allows developers to reuse or define their individual Ansible setup.

You can always define a (project-specific) `hosts.yml` inside this folder.
This location is already excluded from version control such that each developer can have its own version of this file.

Here is an example for that file:

```shell
all:
  hosts:
  children:
    univention:
      hosts:
        univention-vm:
          ansible_host: 10.200.112.10
      vars:
        ansible_user: root
```

Wherever the inventory is defined, it needs to define a host labelled `univention-vm`.
This is the host against the playbooks are defined.

Note: make sure that you define an `univention-vm` host.

Note: make sure that the `ansible_user` is set to `root` for your `univention-vm` host.

If your inventory (for this project) is defined at `./ansible/hosts.yml` you need to specify this inventory when running any playbook.

Example:

```shell
ansible-playbook ./ansible/apache2-portal-updates.yml -i ./ansible/hosts.yml
```

## Playbooks

- **apache2-portal-updates.yml**:
  Patches the UCS webserver to serve `portal.json` and `groups.json` from the UCS cache folder.
  You can revert the changes by running the playbook with the additional option `-t restore` (this selects only task with the tag `restore`).
  This playbook already defines a variable, `internal_ip_address` that can be used to IP-restrict access to these critical resources once the Apache configuration is adapted to support this feature (see `templates/apache2-portal-updates/univention-internal.conf.j2`)
