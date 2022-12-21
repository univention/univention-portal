# Environment defaults for Linux machines


---

- status: final
- date: 2023-01-05
- deciders: dwolf, jbornhold

---

## Context

We have evolved the building blocks for a container-based local development
environments over time and support so far working on the following three layers:

- Basic layer -- Most components can be started locally, without containers at
  all, if a developer prefers this.
- Docker layer -- All containerized components can be built and used with plain
  `docker`.
- Docker Compose layer -- We have various compose files which make the usage for
  a developer a little bit more convenient.

Test sessions with `jconde` and `dwolf` have shown that our example files
regarding the environment configuration (dotenv files) are currently not fitting
for working on Linux machines.

One example is the usage of `host.docker.internal`.


## Decision

We keep the values in our default configuration files consistently with values
which work when working on a Linux based machine.

Adjustments for other machines like macOS or Windows will be provided in the
README notes or in the comments within the respective files.
