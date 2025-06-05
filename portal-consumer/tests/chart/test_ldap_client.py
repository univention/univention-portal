# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.ldap import Ldap


class TestLdapClient(Ldap):

    config_map_name = "release-name-portal-consumer"
    secret_name = "release-name-portal-consumer-ldap"
    workload_resource_kind = "StatefulSet"

    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"
