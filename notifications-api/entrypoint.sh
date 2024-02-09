#!/usr/bin/env bash
# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

set -e

if [ "$(echo $APPLY_DATABASE_MIGRATIONS | tr '[:upper:]' '[:lower:]')" = "true" ]
then
    echo "Ensuring database schema is upgraded if needed"
    alembic upgrade head
fi

exec "$@"
