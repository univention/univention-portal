#!/usr/bin/env bash
set -e

if [ "$(echo $APPLY_DATABASE_MIGRATIONS | tr '[:upper:]' '[:lower:]')" = "true" ]
then
    echo "Ensuring database schema is upgraded if needed"
    alembic upgrade head
fi

exec "$@"
