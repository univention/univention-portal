# Important setup steps

## ForwardAgent

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
