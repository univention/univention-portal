# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


from contextlib import nullcontext as does_not_raise

import pytest
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
    secret = result.get_resource(kind="Secret", name="release-name-portal-server-object-storage")
    assert secret.findone("stringData.accessKey") == "stub-access-key"
    assert secret.findone("stringData.secretKey") == "stub-secret-key"


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
    secret = result.get_resource(kind="Secret", name="release-name-portal-server-object-storage")
    assert secret.findone("stringData.accessKey") == "{{ value }}"
    assert secret.findone("stringData.secretKey") == "{{ value }}"


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
        result.get_resource(kind="Secret", name="release-name-portal-server-object-storage")


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


def test_udm_auth_existing_secret_env_password(helm, chart_path):
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
    deployment = result.get_resource(kind="Deployment")
    secret_object_storage_secret_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_SECRET_ACCESS_KEY']")
    assert secret_object_storage_secret_key_env.findone("valueFrom.secretKeyRef.name") == "stub-secret-name"
    secret_object_storage_access_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_ACCESS_KEY_ID']")
    assert secret_object_storage_access_key_env.findone("valueFrom.secretKeyRef.name") == "stub-secret-name"


def test_object_storage_auth_existing_secret_mounts_correct_custom_key(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          auth:
            existingSecret:
              name: "stub-secret-name"
              keyMapping:
                accessKey: "stub_access_key_key"
                secretKey: "stub_secret_key_key"
    """)
    result = helm.helm_template(chart_path, values)
    deployment = result.get_resource(kind="Deployment")
    secret_object_storage_secret_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_ACCESS_KEY_ID']")
    assert secret_object_storage_secret_key_env.findone("valueFrom.secretKeyRef.key") == "stub_access_key_key"
    secret_object_storage_access_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_SECRET_ACCESS_KEY']")
    assert secret_object_storage_access_key_env.findone("valueFrom.secretKeyRef.key") == "stub_secret_key_key"


def test_object_storage_auth_existing_secret_has_precedence(helm, chart_path):
    values = safe_load(
        """
        objectStorage:
          auth:
            accessKeyId: stub-access-key
            secretAccessKey: stub-secret-key
            existingSecret:
              name: "stub-secret-name"
              keyMapping:
                accessKey: "stub_access_key_key"
                secretKey: "stub_secret_key_key"
    """)
    result = helm.helm_template(chart_path, values)
    with pytest.raises(LookupError):
        result.get_resource(kind="Secret", name="release-name-portal-server-object-storage")

    deployment = result.get_resource(kind="Deployment")
    secret_object_storage_secret_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_ACCESS_KEY_ID']")
    assert secret_object_storage_secret_key_env.findone("valueFrom.secretKeyRef.name") == "stub-secret-name"
    secret_object_storage_access_key_env = deployment.findone("spec.template.spec.containers[0].env[?@.name=='OBJECT_STORAGE_SECRET_ACCESS_KEY']")
    assert secret_object_storage_access_key_env.findone("valueFrom.secretKeyRef.name") == "stub-secret-name"
