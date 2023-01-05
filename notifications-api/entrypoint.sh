#!/usr/bin/env bash
set -e

echo "Ensuring database schema is upgraded if needed"
alembic upgrade head

exec "$@"
