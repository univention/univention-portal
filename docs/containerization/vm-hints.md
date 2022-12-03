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

## Activating the serial console

Compare the file
[`ucs-vm-adapted-for-local-run.yaml`](../../ansible/ucs-vm-adapted-for-local-run.yaml)
to find an example configuration, so that the serial console works in the UCS
vm.

## Handling qcow2 images

The correct tool to use is `qemu-img`. It does allow to combine an image with
it's base file, to extract snapshots and all other needed operations.


### Information about an image

`qemu-img` does show snapshot information and also if there is a reference to a
backing file:

```
jbornhold@skurup:/var/lib/libvirt/images$ qemu-img info ./jbornhold_clean-0.qcow2
image: ./jbornhold_clean-0.qcow2
file format: qcow2
virtual size: 50G (53687091200 bytes)
disk size: 15G
cluster_size: 65536
backing file: /var/lib/libvirt/templates/single/UCS/5.0-2+e339_generic-unsafe_amd64/5.0.2+339_generic-unsafe-0.qcow2
Snapshot list:
ID        TAG                 VM SIZE                DATE       VM CLOCK
1         Fresh Setup               0 2022-11-25 18:46:45   00:00:00.000
2         Fresh Setup with SSH Key      0 2022-11-25 19:34:16   00:00:00.000
3         Initialized via ansible   1.5G 2022-11-25 22:23:22   02:49:01.208
Format specific information:
    compat: 1.1
    lazy refcounts: false
    refcount bits: 16
    corrupt: false
```

### Extracting a base snapshot

The following example shows how to extract a snapshot and keep the backing file reference:

```
qemu-img convert -p -s 1 -O qcow2 -o backing_file=/var/lib/libvirt/templates/single/UCS/5.0-2+e339_generic-unsafe_amd64/5.0.2+339_generic-unsafe-0.qcow2 jbornhold_clean-0.qcow2 /tmp/jbornhold_clean-sn1.qcow2
```

### Rebasing to correct file paths

When using files on another machine and in different paths, then the reference
to the backing file has to be adjusted. This can be done with the `rebase`
subcommand:

```
qemu-img rebase -u -f qcow2 -F qcow2 -b /Users/johannes/wu/vms/knut-domain/5.0.2+339_generic-unsafe_amd64/5.0.2+339_generic-unsafe-0.qcow2 fresh-setup-with-ssh-key.qcow2
```
