# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from contextlib import nullcontext as does_not_raise

import pytest
from yaml import safe_load

from utils import findone


def test_udm_connection_url_is_required(helm, chart_path):
    # TODO: Ensure that "udm.connection.url" is removed from linter values
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
            url: null
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


def test_udm_auth_plain_values_generate_secret(helm, chart_path):
    values = safe_load(
        """
        udm:
          connection:
            url: "local_stub"
          auth:
            username: "stub-username"
            password: "stub-password"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")
    assert findone(secret, "stringData.password") == "stub-password"


def test_udm_auth_plain_values_provide_username_via_config_map(helm, chart_path):
    values = safe_load(
        """
        udm:
          connection:
            url: "local_stub"
          auth:
            username: "stub-username"
            password: "stub-password"
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert findone(config_map, "data.PORTAL_UDM_API_USERNAME") == "stub-username"


def test_udm_auth_plain_values_username_is_templated(helm, chart_path):
    values = safe_load(
        """
        global:
          test: "stub-value"
        udm:
          connection:
            url: "local_stub"
          auth:
            username: "{{ .Values.global.test }}"
            password: "stub-password"
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert findone(config_map, "data.PORTAL_UDM_API_USERNAME") == "stub-value"


def test_udm_auth_plain_values_password_is_not_templated(helm, chart_path):
    values = safe_load(
        """
        udm:
          connection:
            url: "local_stub"
          auth:
            username: "stub-username"
            password: "{{ value }}"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")
    assert findone(secret, "stringData.password") == "{{ value }}"


def test_udm_auth_plain_values_password_is_required(helm, chart_path):
    values = safe_load(
        """
        udm:
          connection:
            url: "local_stub"
          auth:
            username: "stub-username"
            password: null
    """)
    with pytest.raises(RuntimeError):
        helm.helm_template(chart_path, values)


def test_udm_auth_username_is_required(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            username: null
    """)
    with pytest.raises(RuntimeError):
        helm.helm_template(chart_path, values)


def test_udm_auth_username_has_default(helm, chart_path):
    # TODO: Ensure that "udm.auth.username" is removed from linter-values before applying
    values = safe_load(
        """
        udm:
          connection:
            url: "local_stub"
          auth:
            password: "stub-password"
    """)
    result = helm.helm_template(chart_path, values)
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert findone(config_map, "data.PORTAL_UDM_API_USERNAME") == "svc-portal-server"


def test_udm_auth_existing_secret_does_not_generate_a_secret(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            existingSecret:
              name: "stub-secret-name"
    """)
    result = helm.helm_template(chart_path, values)
    with pytest.raises(LookupError):
        helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")


def test_udm_auth_existing_secret_does_not_require_plain_password(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            password: null
            existingSecret:
              name: "stub-secret-name"
    """)
    with does_not_raise():
        helm.helm_template(chart_path, values)


def test_udm_auth_existing_secret_mounts_password(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            existingSecret:
              name: "stub-secret-name"
    """)
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    secret_udm_volume = findone(deployment, "spec.template.spec.volumes[?@.name=='secret-udm']")
    assert findone(secret_udm_volume, "secret.secretName") == "stub-secret-name"


def test_udm_auth_existing_secret_mounts_correct_default_key(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            existingSecret:
              name: "stub-secret-name"
    """)
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    main_container = findone(deployment, "spec.template.spec.containers[?@.name=='portal-server']")
    secret_udm_volume_mount = findone(main_container, "volumeMounts[?@.name=='secret-udm']")

    assert secret_udm_volume_mount["subPath"] == "password"


def test_udm_auth_disabling_existing_secret_by_setting_it_to_null(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            existingSecret: null
    """)
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    secret_udm_volume = findone(deployment, "spec.template.spec.volumes[?@.name=='secret-udm']")
    main_container = findone(deployment, "spec.template.spec.containers[?@.name=='portal-server']")
    secret_udm_volume_mount = findone(main_container, "volumeMounts[?@.name=='secret-udm']")

    assert secret_udm_volume_mount["subPath"] == "password"
    assert findone(secret_udm_volume, "secret.secretName") == "release-name-portal-server-udm"


def test_udm_auth_existing_secret_mounts_correct_custom_key(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            existingSecret:
              name: "stub-secret-name"
              keyMapping:
                password: "stub_password_key"
    """)
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    main_container = findone(deployment, "spec.template.spec.containers[?@.name=='portal-server']")
    secret_udm_volume_mount = findone(main_container, "volumeMounts[?@.name=='secret-udm']")

    assert secret_udm_volume_mount["subPath"] == "stub_password_key"


def test_udm_auth_existing_secret_has_precedence(helm, chart_path):
    values = safe_load(
        """
        udm:
          auth:
            password: stub-plain-password
            existingSecret:
              name: "stub-secret-name"
              keyMapping:
                password: "stub_password_key"
    """)
    # TODO: Fix upstream, always return a list
    result = list(helm.helm_template(chart_path, values))
    with pytest.raises(LookupError):
        helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")

    deployment = helm.get_resource(result, kind="Deployment")
    secret_udm_volume = findone(deployment, "spec.template.spec.volumes[?@.name=='secret-udm']")
    main_container = findone(deployment, "spec.template.spec.containers[?@.name=='portal-server']")
    secret_udm_volume_mount = findone(main_container, "volumeMounts[?@.name=='secret-udm']")

    assert secret_udm_volume_mount["subPath"] == "stub_password_key"
    assert findone(secret_udm_volume, "secret.secretName") == "stub-secret-name"
