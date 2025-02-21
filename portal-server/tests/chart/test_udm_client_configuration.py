# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


import pytest
from yaml import safe_load


def test_udm_connection_url_is_required(helm, chart_path):
    values = safe_load(
        """
        udm:
          connection:
            url: null
    """)
    with pytest.raises(RuntimeError):
        helm.helm_template(chart_path, values)


def test_udm_connection_url_is_templated(helm, chart_path):
    values = safe_load(
        """
        global:
          test: "stub_value"
        udm:
          connection:
            url: "{{ .Values.global.test }}"
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert config_map["data"]["PORTAL_UDM_API_URL"] == "stub_value"


def test_udm_connection_url_supports_global_default(helm, chart_path):
    values = safe_load(
        """
        global:
          udm:
            connection:
              url: "global_stub"
        udm:
          connection:
            url: ""
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert config_map["data"]["PORTAL_UDM_API_URL"] == "global_stub"


def test_udm_connection_url_local_overrides_global(helm, chart_path):
    values = safe_load(
        """
        global:
          udm:
            connection:
              url: "global_stub"
        udm:
          connection:
            url: "local_stub"
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert config_map["data"]["PORTAL_UDM_API_URL"] == "local_stub"
