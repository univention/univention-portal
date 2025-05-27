# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.provisioning_api import ProvisioningApi


class TestProvisioningApiClientConfiguration(ProvisioningApi):

    # TODO: Check what's needed
    config_map_name = "release-name-portal-consumer"
    secret_name = "release-name-portal-consumer-provisioning-api"
    workload_resource_kind = "StatefulSet"

    default_username = "portal-consumer"

    path_provisioning_api_url = "data.PROVISIONING_API_BASE_URL"
    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"
