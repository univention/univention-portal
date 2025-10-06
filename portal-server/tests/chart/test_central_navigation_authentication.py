# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaVolume
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationOwner


class SettingsTestCentralNavigationSecret:
    secret_name = "release-name-portal-server-central-navigation"
    prefix_mapping = {
        "auth.sharedSecret": "auth.password",
        "portalServer.centralNavigation.auth": "auth",
    }
    path_password = "stringData.shared_secret"

    # for tests around AuthPasswordUsageViaVolume
    volume_name = "secret-central-navigation"
    workload_name = "release-name-portal-server"
    secret_default_key = "shared_secret"

    # for tests around AuthUsernameViaConfigMap and AuthUsername
    default_username = "portal-server"


class TestChartCreatesCentralNavigationSecretAsOwner(SettingsTestCentralNavigationSecret, AuthSecretGenerationOwner):
    derived_password = "3673639502cc2be94504d5ca75cf786837418ceb"


class TestPortalServerUsesCentralNavigationSecretByVolume(SettingsTestCentralNavigationSecret, AuthPasswordUsageViaVolume):
    pass
