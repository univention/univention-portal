# Warning

This folder is a merge from our progress on `default` and contains also old
ansible scripts from spikes. See below.


# Ansible

This folder contains Ansible playbooks to automate various tasks related to the Univention Portal in the *Sovereign Workplace* project.

## Inventory

In order to run the playbooks the developer needs to define an Ansible inventory.
This is usually a file named `hosts.yml`.

Where this file is located is up to the individual developer.
This allows developers to reuse or define their individual Ansible setup.

You can always define a (project-specific) `hosts.yml` inside this folder.
This location is already excluded from version control such that each developer can have its own version of this file.

An example is provided in the file [`hosts.yaml.example`](./hosts.yaml.example).

Wherever the inventory is defined, it needs to define a group labeled `ucs_dev_machines`.

Note: make sure that the `ansible_user` is set to `root` for your hosts.

If your inventory (for this project) is defined at `./ansible/hosts.yml` you need to specify this inventory when running any playbook.

Example:

```shell
ansible-playbook ./ansible/ucs-expose-portal-json-files.yaml -i ./ansible/hosts.yml
```

## Playbooks

- [`ucs-expose-portal-json-files.yaml`](./ucs-expose-portal-json-files.yaml):
  Patches the UCS webserver to serve `portal.json` and `groups.json` from the UCS cache folder.
  You can revert the changes by running the playbook with the additional option `-t restore` (this selects only task with the tag `restore`).
  This playbook already defines a variable, `internal_ip_address` that can be used to IP-restrict access to these critical resources once the Apache configuration is adapted to support this feature (see `templates/ucs-expose-portal-json-files/univention-internal.conf.j2`)
- [`ucs-umc-open-from-external.yaml`](./ucs-umc-open-from-external.yaml):
  Exposes the UMC API publicly on a dev machine.



# Ansible scripts around Epic 409

This folder does contain Ansible scripts which have been created as part of the
work on Epic 409. The scripts are intended to help other developers as
executable documentation, so that it is easier to reproduce the Spike related
setups.

Compare Epic univention&409 regarding the context.

## How to run this

You have to first adjust things, so that the scripts do actually run against
your VM.

- Especially the inventory files will have to be adjusted.
- The playbooks currently reference a specific host, this needs adjustment as
  well.

Example preparation of a fresh VM:

```
ansible-playbook -i inventory/knut.yaml initialize-ucs-vm.yaml
```

Example command which does apply the work of Spike
univention/components/univention-portal#569 against the prepared VM:

```
ansible-playbook -i inventory/knut.yaml exp-409-spike-containers.yaml
```


## Important setup steps


### Installing Ansible requirements

Example command:

```
ansible-galaxy collection install -r requirements.yaml
```

### ForwardAgent

If you want to be able to clone repositories via SSH on your VMs, then you will
have to forward the ssh agent so that your local private key can be used.

Configure either your `~/.ssh/config` or your `~/.ansible.cfg` accordingly.

The SSH Configuration might look as the following example:

```
Host 10.200.115.*
  User user
  ForwardAgent yes
```

Testing if things work:

```sh
$ YOUR_VM_IP=10.200.115.20
$ ssh user@${YOUR_VM_IP}
$ ssh -T git@git.knut.univention.de
Welcome to GitLab, @jbornhold!
```
