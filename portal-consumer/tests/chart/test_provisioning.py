# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaEnv
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationOwner
from univention.testing.helm.auth_flavors.username import AuthUsername, AuthUsernameViaConfigMap
from univention.testing.helm.client.provisioning_api import Connection


class SettingsTestProvisioningApiSecret:
    secret_name = "release-name-portal-consumer-provisioning-api"
    prefix_mapping = {"provisioningApi.auth": "auth"}

    # for tests around AuthPasswordUsageViaEnv
    sub_path_env_password = "env[?@name=='PROVISIONING_API_PASSWORD']"
    workload_name = "release-name-portal-consumer"
    workload_kind = "StatefulSet"

    # for tests around AuthUsernameViaConfigMap and AuthUsername
    default_username = "portal-consumer"


class TestChartCreatesProvisioningApiSecretAsOwner(SettingsTestProvisioningApiSecret, AuthSecretGenerationOwner):
    derived_password = "910b4f47319c3e0221029f8778998ed9e2fa8c37"

    # The Secret also holds the subscription spec, so it is rendered with an existing secret too, without "password".
    def test_auth_existing_secret_does_not_generate_a_secret(self, chart):
        values = self.load_and_map(
            """
            auth:
              existingSecret:
                name: "stub-secret-name"
            """
        )
        secret = chart.helm_template(values).get_resource(kind="Secret", name=self.secret_name)
        assert "password" not in secret["stringData"]

    def test_auth_existing_secret_has_precedence_no_secret_generated(self, chart):
        values = self.load_and_map(
            """
            auth:
              password: "stub-password"
              existingSecret:
                name: "stub-secret-name"
                keyMapping:
                  password: "stub_password_key"
            """
        )
        secret = chart.helm_template(values).get_resource(kind="Secret", name=self.secret_name)
        assert "password" not in secret["stringData"]
        assert "stub-password" not in secret["stringData"]["registration"]


class TestInitContainerUsesProvisioningApiByEnv_WaitForProvisioningApi(SettingsTestProvisioningApiSecret, AuthPasswordUsageViaEnv):
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-provisioning-api']"


class TestInitContainerUsesProvisioningApiByEnv_UniventionCompatibility(SettingsTestProvisioningApiSecret, AuthPasswordUsageViaEnv):
    path_container = "..spec.template.spec.initContainers[?@.name=='univention-compatibility']"


class TestPortalConsumerUsesProvisioningApiByEnv(SettingsTestProvisioningApiSecret, AuthPasswordUsageViaEnv):
    pass


class TestConsumerUsesUsernameViaConfigMap(SettingsTestProvisioningApiSecret, AuthUsernameViaConfigMap):
    config_map_name = "release-name-portal-consumer"
    path_username = "data.PROVISIONING_API_USERNAME"
    default_username = "portal-consumer"


class TestRegistrationEmbedsUsername(SettingsTestProvisioningApiSecret, AuthUsername):
    path_username = "stringData.registration"

    def get_username(self, result):
        secret = result.get_resource(kind="Secret", name=self.secret_name)
        registration_json = secret.findone(self.path_username)
        registration = json.loads(registration_json)
        return registration["name"]


class TestConnection(Connection):
    config_map_name = "release-name-portal-consumer"

    path_provisioning_api_url = "data.PROVISIONING_API_BASE_URL"
