# Ansible scripts around Epic 409

This folder does contain Ansible scripts which have been created as part of the
work on Epic 409. The scripts are intended to help other developers as
executable documentation, so that it is easier to reproduce the Spike related
setups.

Compare Epic univention&409 regarding the context.

## How to run this

You have to first adjust things, so that the scripts do actually run against
your VM.

- Especially the file `inventory.yaml` will have to be adjusted.
- The playbooks currently reference a specific host, this needs adjustment as
  well.

Example preparation of a fresh VM:

```
ansible-playbook -i inventory.yaml initialize-ucs-vm.yaml
```

Example command which does apply the work of Spike
univention/components/univention-portal#569 against the prepared VM:

```
ansible-playbook -i inventory.yaml exp-409-spike-containers.yaml
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
