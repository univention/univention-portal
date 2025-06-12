# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.postgresql import PostgresqlAuth, PostgresqlConnection


class TestPostgresqlAuth(PostgresqlAuth):

    default_username = "notificationsapi"
    default_database = "notificationsapi"
    secret_name = "release-name-notifications-api-postgresql"


class TestPostgresqlConnection(PostgresqlConnection):
    pass
