# Switch to PostgreSQL


---

- status: final
- date: 2023-01-09
- deciders: jbornhold

---

## Context

The current development environment and the current demo environment for the
Notifications API use SQLite as database.

When adding the second migration regarding the database schema it turned out
that SQLite cannot handle schema migrations. This is due to lacking support for
the statement `ALTER TABLE`.


## Decision

Both environments will be changed so that they run with PostgreSQL by default,
so that the database migrations work as expected.

In the demo environment we run the migrations automatically, so that following
the progress on the `develop` branch should be automatic.

In the development environment the migrations are by default not automatically
applied, so that a developer can migrate forward and backward as needed.


## Consequences

- An additional container is needed to run the setup. It does contain the
  PostgreSQL sever.

- Client libraries have to be added into the container image of the
  Notifications API.

## References

- *Demo Environment* -- See `docker/docker-compose.yaml`.

- *Development Environment* -- See `notifications-api/docker-compose.yaml`.

- SQLite documentation regarding `ALTER TABLE`:
  https://www.sqlite.org/lang_altertable.html
