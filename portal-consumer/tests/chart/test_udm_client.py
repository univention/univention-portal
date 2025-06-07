# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.udm import UdmClient


class TestUdmClientConfiguration(UdmClient):

    config_map_name = "release-name-portal-consumer"
    secret_name = "release-name-portal-consumer-udm"
    workload_kind = "StatefulSet"

    default_username = "cn=admin"

    path_udm_api_url = "data.PORTAL_UDM_API_URL"
    path_udm_api_username = "data.PORTAL_UDM_API_USERNAME"
    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"
