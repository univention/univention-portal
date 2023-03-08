# Handling of logging in containers


---

- status: final
- date: 2022-11-07
- deciders: jbornhold and others
- note: captured in retrospect for the purpose of documenting this decision

---


## Context

We added a new deployment path for the portal-server and the portal-frontend
which is based on containers.

The portal-server was and potentially still is writing logs to files.


## Decision

All logging output shall go to `stdout` and `stderr` by default. The environment
of the running container has to deal with the further processing of the logs.


## Consequences

We may have to make logging configurable, so that we can ensure to have the
correct behavior in the container cases and still can support the established
behavior in other deployment paths.

For containers we will have a default approach of how to handle logging, so that
we will achieve a higher degree of consistency.

Integration into the deployment targets like Kubernetes is simplified because
operators do not have to extract relevant information out of log files and can
instead rely on capturing the outputs of the process from inside the container.


## Not in scope of the decision

We did not look into the question of how the logging output should be formatted
and the question if there should be a default structure defined.
