# FastAPI-Prototype

```shell
cp .env.example .env
# adapt .env to your environment, especially UID / GID for local mounted volumes

# create your local DB
docker compose run notifications-api alembic upgrade head

# seed dummy notifications
docker compose run notifications-api python migrations/seed.py

# start your local stack
docker compose up [portal-backend | notifications-api | mercure-hub | keycloak | docs]
```

Core setup for services is defined in `docker-compose.yml`.

Overrides for local development are defined in `docker-compose.override.yml`.

## What is included

- [FastAPI](https://fastapi.tiangolo.com/)
- [SQLModel](https://sqlmodel.tiangolo.com/) (sitting on top of [SQLAlchemy](https://www.sqlalchemy.org/))
- [alembic](https://alembic.sqlalchemy.org/en/latest/index.html) for database migration management
- [Faker](https://faker.readthedocs.io/en/master/) for easy generation of dummy data

---

- [Mercure](https://mercure.rocks/docs/mercure)
- [Keycloak](https://www.keycloak.org/documentation)
- [MkDocs Material](https://squidfunk.github.io/mkdocs-material/) for beautiful docs

## Database

```shell
# Database migrations (in context of notifications api)
docker compose [exec | run] notifications-api alembic upgrade head
docker compose [exec | run] notifications-api alembic downgrade base

# Seeding of dummy data
docker compose run notifications-api python migrations/seed.py
```

## Python package dependencies

```shell
docker compose [exec | run] notifications-api poetry add aiohttp
docker compose [exec | run] notifications-api poetry update
```
