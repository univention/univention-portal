# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2026 Univention GmbH

import json
import subprocess

import pytest


SECRET_NAME = "release-name-portal-consumer-provisioning-api"
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


def test_spec_references_the_chart_secret(helm, chart_path):
    result = helm.helm_template(chart_path, {})

    spec = registration(result)
    assert spec["password"] == {"kubernetesSecret": {"name": SECRET_NAME, "key": "password"}}
    assert spec["name"] == "portal-consumer"
    assert {"realm": "udm", "topic": "portals/portal"} in spec["realms_topics"]
    assert spec["request_prefill"] is False


def test_spec_carries_no_password(helm, chart_path):
    result = helm.helm_template(chart_path, {"provisioningApi": {"auth": {"password": "stub-password"}}}, TEMPLATE)

    secret = result.get_resource(kind="Secret", name=SECRET_NAME)
    assert secret["stringData"]["password"] == "stub-password"
    assert "stub-password" not in secret["stringData"]["registration"]


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
