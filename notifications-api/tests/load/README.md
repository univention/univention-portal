# Load Testing

Using [locust](https://locust.io).

## Setup
- Install locust: `pip install locust`

## Run
- On the shell, run `locust`.
- Open http://localhost:8089 and start a test with
  number of users 300,
  spawn rate 25 /s,
  on host http://localhost:8096

## Issues Under Load

### Database Pool not Replenished

There seems to be an issue when using FastAPI with dependency injection (and possibly sync SQLAlchemy).
In short,
under high load the HTTP connection handlers and the database connection cleanup
compete for resources and can cause the service to become unresponsive.

With dependency injection
the database dependency should automatically be cleaned up after the request completes,
but it seems to happend in a different thread.
Once the database pool is exhausted
all threads are waiting for a database handle,
these sync calls are blocking,
and no thread is left to run the clean-up.
Only when the pool request times out and fails
connections may be returned to the pool,
but this takes time and new incoming HTTP connections
also compete for the same resources.

- https://github.com/tiangolo/fastapi/issues/3205
- https://github.com/tiangolo/full-stack-fastapi-postgresql/issues/104
- https://github.com/harsh8398/fastapi-dependency-issue

For the time being,
the database session is not handled through dependency injection,
but rather by using `db.get_session()` as a context manager,
which is instanciated and exited inside the FastAPI handler.

This ensures that the database connection is acquired and released
inside the same thread, before the request is completed.

