# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


from contextlib import nullcontext as does_not_raise
from subprocess import CalledProcessError

import pytest
from pytest_helm.utils import findone
from yaml import safe_load


def test_generate_prov_api_secret_if_only_password_is_provided(helm, chart_path):
    values = safe_load(
        """
        provisioningApi:
          auth:
            password: "local_stub"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-provisioning-api-credentials")
    assert findone(secret, "stringData.password") == "local_stub"


def test_generated_prov_api_secret_is_not_templated(helm, chart_path):
    values = safe_load(
        """
        provisioningApi:
          auth:
            password: "{{ value }}"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-provisioning-api-credentials")
    assert findone(secret, "stringData.password") == "{{ value }}"


def test_password_is_required_to_create_prov_api_secret(helm, chart_path):
    values = safe_load(
        """
        provisioningApi:
          auth:
            password: null
    """)
    with pytest.raises(CalledProcessError):
        helm.helm_template(chart_path, values)


def test_prov_api_secret_is_not_generated_if_existing_secret_is_provided(helm, chart_path):
    values = safe_load(
        """
        provisioningApi:
          auth:
            password: "stub-password"
            existingSecret:
              name: "stub-secret-name"
    """)
    result = helm.helm_template(chart_path, values)
    with pytest.raises(LookupError):
        helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-provisioning-api-credentials")


def test_password_is_not_required_to_create_prov_api_secret_if_existing_secret_is_provided(helm, chart_path):
    values = safe_load(
        """
        provisioningApi:
          auth:
            password: null
            existingSecret:
              name: "stub-secret-name"
    """)
    with does_not_raise():
        helm.helm_template(chart_path, values)
