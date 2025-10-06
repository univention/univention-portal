# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaVolume
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationUser


class SettingsTestLdapSecret:
    secret_name = "release-name-portal-consumer-ldap"
    prefix_mapping = {"ldap.auth": "auth"}

    # for tests around AuthPasswordUsageViaVolume
    volume_name = "secret-ldap"
    workload_name = "release-name-portal-consumer"
    workload_kind = "StatefulSet"


class TestChartCreatesLdapSecretAsUser(SettingsTestLdapSecret, AuthSecretGenerationUser):
    pass


class TestPortalConsumerUsesLdapCredentialsByVolume(SettingsTestLdapSecret, AuthPasswordUsageViaVolume):
    pass


class TestInitContainerUsesLdapSecretVolume_WaitForLdap(SettingsTestLdapSecret, AuthPasswordUsageViaVolume):
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-ldap']"


class TestInitContainerUsesLdapSecretVolume_WaitForUdm(SettingsTestLdapSecret, AuthPasswordUsageViaVolume):
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-udm']"
