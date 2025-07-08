# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.postgresql import Auth, Connection, SecretUsageViaEnv


class TestAuth(SecretUsageViaEnv, Auth):

    default_username = "notificationsapi"
    default_database = "notificationsapi"
    secret_name = "release-name-notifications-api-postgresql"


class TestConnection(Connection):
    pass
