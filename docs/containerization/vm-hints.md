# VM Hints

## Running a local VM with QEMU

The following command shows a way to run a given UCS VM locally.

Be aware that there may be issues with user permissions due to the bridge
networking setup. The call is based on an example on MacOS, so the interface
naming around the parameter `-nic` is likely different on a Linux host.

```
qemu-system-x86_64 \
  -m 2G \
  -smp cpus=4,sockets=1,cores=4,threads=1 \
  -machine pc-q35-2.8 \
  -serial mon:stdio \
  -nic vmnet-bridged,ifname=en7 \
  fresh-setup-with-ssh-key.qcow2
```
