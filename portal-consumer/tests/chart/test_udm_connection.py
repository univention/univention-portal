# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.udm import Connection


class TestConnection(Connection):
    config_map_name = "release-name-portal-consumer"

    path_url = "data.PORTAL_UDM_API_URL"
