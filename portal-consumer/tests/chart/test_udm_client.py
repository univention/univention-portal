# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.udm import Auth, Connection, SecretViaVolume


class TestAuth(SecretViaVolume, Auth):
    config_map_name = "release-name-portal-consumer"
    secret_name = "release-name-portal-consumer-udm"
    workload_kind = "StatefulSet"

    default_username = "cn=admin"

    path_username = "data.PORTAL_UDM_API_USERNAME"
    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"


class TestConnection(Connection):
    config_map_name = "release-name-portal-consumer"

    path_url = "data.PORTAL_UDM_API_URL"
