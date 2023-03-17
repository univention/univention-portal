# Notifications API of the Univention Portal

Notifications API is a service to route information, relevant for a portal user,
from an application like OX or NextCloud or an administrative user to the portal frontend
for live display.


## Running the API locally


### Running the API via docker compose

The API server can be brought up with the following example command:

```
docker compose up
```

Note that fresh images can be built with the `build` subcommand:

```
docker compose build
```


### Initialize the database

Example to initialize the database:

```
docker compose run -it --rm app alembic upgrade head
```

The output does look roughly as follows:

```
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> c83d839fbaad, Create table notification
```

And a file called `notifications.db` should be created.


### Seed the database

It is possible to put a few example notifications into the database with the
following command:

```
docker compose run app python migrations/seed.py
```


## Running the test suite

The test suite is based on `pytest` and can be executed with the following
command:

```
docker compose run test
```

The output should roughly like the following example:

```
============================== test session starts ===============================
platform linux -- Python 3.9.16, pytest-7.2.0, pluggy-1.0.0
rootdir: /app
plugins: anyio-3.6.2, mock-3.10.0, Faker-15.2.0
collected 5 items

tests/test_notification_api.py .....                                       [100%]

=============================== 5 passed in 0.38s ================================
```


## Development tasks

### Freezing requirements

Freezing the requirements should be done via a clean virtual environment. The
process has been documented in the file `freeze-requirements.sh`. The file can
be executed as shown below:

```
docker compose run -it --rm app ./freeze-requirements.sh
```

### Changing (migrating) the database schema

The following example helps to generate a new migration script. First the model
definitions should be adjusted in Python code, and then the example will produce
something useful:

```
docker compose run -it --rm app alembic revision --autogenerate
```

Afterwards inspect and adapt the generated migration. Testing the migration can
be easily done with the following commands:

```
docker compose run -it --rm app alembic upgrade +1
docker compose run -it --rm app alembic downgrade -1
```

## Using the API for HTTP requests

Documentation for the API is automatically generated and available in the local
development server at the following URL:

http://localhost:8096/docs
