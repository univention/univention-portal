# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from subprocess import CalledProcessError

import pytest
from yaml import safe_load

from univention.testing.helm.client.base import ClientTestBase
from univention.testing.helm.client.central_navigation import CentralNavigationClient


class TestCentralNavigationClient(CentralNavigationClient):

    prefix_mapping = {
        "portalServer.centralNavigation": "centralNavigation",
    }

    config_map_name = "release-name-portal-server"
    secret_name = "release-name-portal-server-central-navigation"

    path_main_container = "spec.template.spec.containers[?@.name=='portal-server']"

    # Local tests support
    path_env_enabled = "data.PORTAL_SERVER_CENTRAL_NAVIGATION_ENABLED"

    @pytest.mark.skip(reason="Server role")
    def test_auth_plain_values_shared_secret_is_required(): pass

    @pytest.mark.parametrize("value, expected", [
        ("true", "true"),
        ("false", "false"),
    ])
    def test_enabled_is_provided_to_portal_server_via_config_map(self, value, expected, chart):
        values = safe_load(
            f"""
            portalServer:
              centralNavigation:
                enabled: {value}
            """)
        result = chart.helm_template(values)
        config_map = result.get_resource(kind="ConfigMap", name=self.config_map_name)
        env_value = config_map.findone(self.path_env_enabled)
        assert env_value == expected

    @pytest.mark.parametrize("value, expected", [
        ("", "false"),
        ("null", "false"),
    ])
    def test_enabled_accepts_only_boolean_values(self, value, expected, chart):
        values = safe_load(
            f"""
            portalServer:
              centralNavigation:
                enabled: {value}
            """)
        with pytest.raises(CalledProcessError):
            chart.helm_template(values)


class TestCentralNavigationServerRole(ClientTestBase):

    prefix_mapping = {
        "portalServer.centralNavigation": "centralNavigation",
    }

    secret_name = "release-name-portal-server-central-navigation"
    path_shared_secret = "stringData.shared_secret"

    def test_auth_shared_secret_has_random_value(self, chart):
        values = self.load_and_map(
            """
            centralNavigation:
              auth:
                sharedSecret: null
            """)
        result = chart.helm_template(values, template_file="templates/secret-central-navigation.yaml")
        secret = result.get_resource(kind="Secret", name=self.secret_name)
        secret_value = secret.findone(self.path_shared_secret)
        assert secret_value

    def test_auth_shared_secret_is_derived_from_master_password(self, chart):
        values = self.load_and_map(
            """
            global:
              secrets:
                masterPassword: "stub-master-password"

            centralNavigation:
              auth:
                sharedSecret: null
            """)
        result = chart.helm_template(values, template_file="templates/secret-central-navigation.yaml")
        secret = result.get_resource(kind="Secret", name=self.secret_name)
        secret_value = secret.findone(self.path_shared_secret)
        assert secret_value == "86075010802d028f417ff11774c136829be3c0a0"
