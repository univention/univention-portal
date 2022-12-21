# Use Debian base image to avoid mixing Debs with custom compiled fragments

---

- status: accepted
- date: 2022-11-30
- deciders: arequate, fbest, jbornhold
- consulted: SouvAP Dev team

---

## Context and Problem Statement

The previous `portal-server` container did use `python:3.7-slim-buster` as a
base image. While experimenting with the container on a UCS virtual machine, we
faced side effects of a slightly different Python interpreter inside of the
container and a mismatch between installed Debian packages and this interpreter:

- Interoperability with `gdb` and `python-dbg` was broken, extraction of a
  traceback of a hanging python process did not work.
- Mixing of the Debian `python-dev` with the interpreter in `/usr/local/bin`.


## Considered Options

- Stay with the image as is
- Switch to plain Debian base image


## Decision Outcome

For now we move to plain Debian base images for cases where we would otherwise
have a mixup of fragments from different sources (e.g. Debian package, and
custom compiled artifact) with a real potential to cause trouble.


## More Information

* Python wiki [DebuggingWithGdb](https://wiki.python.org/moin/DebuggingWithGdb)
  contains details regarding the usage of `gdb` to get a traceback out of a
  hanging process.
