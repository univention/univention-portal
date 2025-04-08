# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


from contextlib import nullcontext as does_not_raise

import pytest
from pytest_helm.utils import findone
from yaml import safe_load


def test_object_storage_auth_plain_values_generate_secret(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            accessKeyId: "stub-access-key"
            secretAccessKey: "stub-secret-key"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-object-storage")
    assert findone(secret, "stringData.accessKey") == "stub-access-key"
    assert findone(secret, "stringData.secretKey") == "stub-secret-key"


def test_object_storage_auth_plain_values_secret_key_is_not_templated(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            accessKeyId: "{{ value }}"
            secretAccessKey: "{{ value }}"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-object-storage")
    assert findone(secret, "stringData.accessKey") == "{{ value }}"
    assert findone(secret, "stringData.secretKey") == "{{ value }}"


def test_object_storage_auth_plain_values_secret_key_is_required(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            accessKeyId: "stub-access-key"
            secretAccessKey: null
    """)
    with pytest.raises(RuntimeError):
        helm.helm_template(chart_path, values)


def test_object_storage_auth_plain_values_access_key_is_required(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            accessKeyId: null
            secretAccessKey: "stub-secret-key"
    """)
    with pytest.raises(RuntimeError):
        helm.helm_template(chart_path, values)


def test_object_storage_auth_existing_secret_does_not_generate_a_secret(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            existingSecret:
              name: "stub-secret-name"
    """)
    result = helm.helm_template(chart_path, values)
    with pytest.raises(LookupError):
        helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-object-storage")


def test_object_storage_auth_existing_secret_does_not_require_plain_password(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          endpoint: "local_stub"
          bucketName: "local_stub"
          auth:
            secretAccessKey: null
            existingSecret:
              name: "stub-secret-name"
    """)
    with does_not_raise():
        helm.helm_template(chart_path, values)
