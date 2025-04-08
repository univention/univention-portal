# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest
from pytest_helm.utils import findone
from yaml import safe_load


def env_var_matches(env_var, secret_name, secret_key, container_name, deployment, is_init_container=False):
    container_type = "initContainers" if is_init_container else "containers"
    env = findone(deployment, f"spec.template.spec.{container_type}[?@.name=='{container_name}'].env[?@.name=='{env_var}']")
    assert findone(env, "valueFrom.secretKeyRef.name") == secret_name
    assert findone(env, "valueFrom.secretKeyRef.key") == secret_key


def env_vars_match(secret_name, secret_key1, secret_key2, container_name, deployment, is_init_container=False):
    env_var_matches("OBJECT_STORAGE_ACCESS_KEY_ID", secret_name, secret_key1, container_name, deployment, is_init_container)
    env_var_matches("OBJECT_STORAGE_SECRET_ACCESS_KEY", secret_name, secret_key2, container_name, deployment, is_init_container)


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
    deployment = helm.get_resource(result, kind="StatefulSet")
    env_vars_match("stub-secret-name", "accessKey", "secretKey", "portal-consumer", deployment)
    for container in ["univention-compatibility", "wait-for-object-storage"]:
        env_vars_match("stub-secret-name", "accessKey", "secretKey", container, deployment, True)


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
    deployment = helm.get_resource(result, kind="StatefulSet")
    env_vars_match("stub-secret-name", "stub_access_key_key", "stub_secret_key_key", "portal-consumer", deployment)
    for container in ["univention-compatibility", "wait-for-object-storage"]:
        env_vars_match("stub-secret-name", "stub_access_key_key", "stub_secret_key_key", container, deployment, True)


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
    # TODO: Fix upstream, always return a list
    result = list(helm.helm_template(chart_path, values))
    with pytest.raises(LookupError):
        helm.get_resource(result, kind="Secret", name="release-name-portal-consumer-object-storage")

    deployment = helm.get_resource(result, kind="StatefulSet")
    env_vars_match("stub-secret-name", "stub_access_key_key", "stub_secret_key_key", "portal-consumer", deployment)
    for container in ["univention-compatibility", "wait-for-object-storage"]:
        env_vars_match("stub-secret-name", "stub_access_key_key", "stub_secret_key_key", container, deployment, True)
