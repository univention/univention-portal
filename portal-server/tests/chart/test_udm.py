# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.udm import Auth, Connection, SecretViaVolume


class TestAuth(SecretViaVolume, Auth):
    config_map_name = "release-name-portal-server"
    secret_name = "release-name-portal-server-udm"

    default_username = "svc-portal-server"

    path_username = "data.PORTAL_UDM_API_USERNAME"


class TestConnection(Connection):
    config_map_name = "release-name-portal-server"

    path_url = "data.PORTAL_UDM_API_URL"
