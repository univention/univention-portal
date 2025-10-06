# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaVolume
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationUser
from univention.testing.helm.auth_flavors.username import AuthUsernameViaConfigMap


class SettingsTestUdmSecret:
    secret_name = "release-name-portal-consumer-udm"
    prefix_mapping = {"udm.auth": "auth"}

    # for tests around AuthPasswordUsageViaVolume
    volume_name = "secret-udm"
    workload_name = "release-name-portal-consumer"
    workload_kind = "StatefulSet"


class TestChartCreatesUdmSecretAsUser(SettingsTestUdmSecret, AuthSecretGenerationUser):
    pass


class TestPortalConsumerUsesUdmCredentialsByVolume(SettingsTestUdmSecret, AuthPasswordUsageViaVolume):
    pass


class TestInitContainerUsesUdmSecretVolume_WaitForLdap(SettingsTestUdmSecret, AuthPasswordUsageViaVolume):
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-ldap']"


class TestInitContainerUsesUdmSecretVolume_WaitForUdm(SettingsTestUdmSecret, AuthPasswordUsageViaVolume):
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-udm']"


class TestPortalConsumerUsesUdmUsernameViaConfigMap(SettingsTestUdmSecret, AuthUsernameViaConfigMap):
    config_map_name = "release-name-portal-consumer"
    path_username = "data.PORTAL_UDM_API_USERNAME"
    default_username = "cn=admin"
