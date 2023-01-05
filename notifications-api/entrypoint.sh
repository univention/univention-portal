#!/usr/bin/env bash
set -e

if [ "$APPLY_DATABASE_MIGRATIONS" = "true" ]
then
    echo "Ensuring database schema is upgraded if needed"
    alembic upgrade head
fi

exec "$@"
