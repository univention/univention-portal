# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaEnv
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationUser
from univention.testing.helm.client.postgresql import Connection


class SettingsTestPostgresqlSecret:
    secret_name = "release-name-notifications-api-postgresql"
    prefix_mapping = {"postgresql.auth": "auth"}


class TestChartCreatesPostgresqlSecretAsOwner(SettingsTestPostgresqlSecret, AuthSecretGenerationUser):
    pass


class TestNotificationApiUsesPostgresqlCredentialsByEnv(SettingsTestPostgresqlSecret, AuthPasswordUsageViaEnv):
    sub_path_env_password = "env[?@name=='DB_PASSWORD']"
    workload_name = "release-name-notifications-api"


class TestConnection(Connection):
    pass
