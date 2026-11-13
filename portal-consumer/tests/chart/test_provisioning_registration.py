# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH

import json
import subprocess

import pytest


SECRET_NAME = "release-name-portal-consumer-provisioning-api"
PASSWORD_SECRET_NAME = "release-name-portal-consumer-provisioning-api-password"
WORKLOAD_NAME = "release-name-portal-consumer"
TEMPLATE = "templates/secret-provisioning-api.yaml"


def registration(result) -> dict:
    secret = result.get_resource(kind="Secret", name=SECRET_NAME)
    return json.loads(secret["stringData"]["registration"])


def workload_password_ref(result) -> dict:
    deployment = result.get_resource(kind="StatefulSet", name=WORKLOAD_NAME)
    [main] = [c for c in deployment["spec"]["template"]["spec"]["containers"] if c["name"] == "main"]
    [password] = [e for e in main["env"] if e["name"] == "PROVISIONING_API_PASSWORD"]
    return dict(password["valueFrom"]["secretKeyRef"])


def test_spec_references_the_password_secret(helm, chart_path):
    result = helm.helm_template(chart_path, {})

    spec = registration(result)
    assert spec["password"] == {"kubernetesSecret": {"name": PASSWORD_SECRET_NAME, "key": "password"}}
    assert spec["name"] == "portal-consumer"
    assert {"realm": "udm", "topic": "portals/portal"} in spec["realms_topics"]
    assert spec["request_prefill"] is False


def test_password_lives_in_its_own_secret(helm, chart_path):
    values = {"provisioningApi": {"auth": {"password": "stub-password"}}}

    result = helm.helm_template(chart_path, values)

    spec_secret = result.get_resource(kind="Secret", name=SECRET_NAME)
    password_secret = result.get_resource(kind="Secret", name=PASSWORD_SECRET_NAME)
    assert "password" not in spec_secret["stringData"]
    assert "stub-password" not in spec_secret["stringData"]["registration"]
    assert dict(password_secret["stringData"]) == {"password": "stub-password"}


def test_existing_secret_renders_no_password_secret(helm, chart_path):
    values = {"provisioningApi": {"auth": {"password": None, "existingSecret": {"name": "external"}}}}

    result = helm.helm_template(chart_path, values)

    names = [r["metadata"]["name"] for r in result if r and r.get("kind") == "Secret"]
    assert SECRET_NAME in names
    assert PASSWORD_SECRET_NAME not in names


@pytest.mark.parametrize(
    "existing_secret,expected",
    [
        ({"name": "external"}, {"name": "external", "key": "password"}),
        ({"name": "external", "keyMapping": {"password": "pw"}}, {"name": "external", "key": "pw"}),
    ],
)
def test_existing_secret_changes_only_the_reference(helm, chart_path, existing_secret, expected):
    values = {"provisioningApi": {"auth": {"password": None, "existingSecret": existing_secret}}}

    result = helm.helm_template(chart_path, values)

    assert registration(result)["password"] == {"kubernetesSecret": expected}
    assert workload_password_ref(result) == expected


def test_reference_matches_the_workload_without_existing_secret(helm, chart_path):
    result = helm.helm_template(chart_path, {})

    assert registration(result)["password"]["kubernetesSecret"] == workload_password_ref(result)


def test_existing_secret_with_the_spec_secret_name_fails(helm, chart_path):
    values = {"provisioningApi": {"auth": {"existingSecret": {"name": SECRET_NAME}}}}

    with pytest.raises(subprocess.CalledProcessError) as error:
        helm.helm_template(chart_path, values, TEMPLATE)
    assert "must not be" in error.value.stderr
