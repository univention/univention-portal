# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client_udm import UdmClient


class TestUdmClientConfiguration(UdmClient):

    default_username = "svc-portal-server"
    path_udm_api_url = "data.PORTAL_UDM_API_URL"
    path_udm_api_username = "data.PORTAL_UDM_API_USERNAME"
    path_main_container = "spec.template.spec.containers[?@.name=='portal-server']"
    secret_name = "release-name-portal-server-udm"
