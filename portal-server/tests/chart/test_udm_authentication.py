# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaVolume
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationUser
from univention.testing.helm.auth_flavors.username import AuthUsernameViaConfigMap


class SettingsTestUdmSecret:
    secret_name = "release-name-portal-server-udm"
    prefix_mapping = {"udm.auth": "auth"}

    # for tests around AuthPasswordUsageViaVolume
    volume_name = "secret-udm"
    workload_name = "release-name-portal-server"


class TestChartCreatesUdmSecretAsUser(SettingsTestUdmSecret, AuthSecretGenerationUser):
    pass


class TestPortalServerUsesUdmCredentialsByVolume(SettingsTestUdmSecret, AuthPasswordUsageViaVolume):
    pass


class TestPortalServerUsesUdmUsernameViaConfigMap(SettingsTestUdmSecret, AuthUsernameViaConfigMap):
    config_map_name = "release-name-portal-server"
    path_username = "data.PORTAL_UDM_API_USERNAME"
    default_username = "svc-portal-server"
