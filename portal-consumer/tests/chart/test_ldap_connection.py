# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.ldap import ConnectionHostAndPort


class TestLdapConnection(ConnectionHostAndPort):

    config_map_name = "release-name-portal-consumer"
