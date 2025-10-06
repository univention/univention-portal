# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from subprocess import CalledProcessError

import pytest
from pytest_helm.utils import load_yaml

from univention.testing.helm.client.central_navigation import CentralNavigationOwner


class TestCentralNavigation(CentralNavigationOwner):

    prefix_mapping = {
        "portalServer.centralNavigation": "centralNavigation",
    }

    config_map_name = "release-name-portal-server"
    secret_name = "release-name-portal-server-central-navigation"

    derived_shared_secret = "3673639502cc2be94504d5ca75cf786837418ceb"

    # Local tests support
    path_env_enabled = "data.PORTAL_SERVER_CENTRAL_NAVIGATION_ENABLED"

    @pytest.mark.parametrize("value, expected", [
        ("true", "true"),
        ("false", "false"),
    ])
    def test_enabled_is_provided_to_portal_server_via_config_map(self, value, expected, chart):
        values = load_yaml(
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
        values = load_yaml(
            f"""
            portalServer:
              centralNavigation:
                enabled: {value}
            """)
        with pytest.raises(CalledProcessError):
            chart.helm_template(values)
