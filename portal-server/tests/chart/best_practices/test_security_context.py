# SPDX-FileCopyrightText: 2024 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

# Ruff has problems with multiline f-strings
# ruff: noqa: F541

from yaml import safe_load

from utils import get_containers_of_deployment


def test_pod_security_context_can_be_disabled(helm, chart_path):
    values = safe_load(
        """
        podSecurityContext:
          enabled: false
          fsGroup: 1000
          fsGroupChangePolicy: "Always"
        """,
    )
    result = helm.helm_template(chart_path, values)
    manifest = helm.get_resource(result, kind="Deployment")
    pod_security_context = manifest["spec"]["template"]["spec"].get(
        "securityContext",
        {},
    )
    expected_security_context = {}
    assert pod_security_context == expected_security_context


def test_pod_security_context_is_applied(helm, chart_path):
    values = safe_load(
        """
        podSecurityContext:
          enabled: true
          fsGroup: 1000
          fsGroupChangePolicy: "Always"
          sysctls: null
        """,
    )
    result = helm.helm_template(chart_path, values)
    manifest = helm.get_resource(result, kind="Deployment")
    pod_security_context = manifest["spec"]["template"]["spec"]["securityContext"]
    expected_security_context = {
        "fsGroup": 1000,
        "fsGroupChangePolicy": "Always",
    }
    assert pod_security_context == expected_security_context


def test_container_security_context_can_be_disabled(helm, chart_path):
    values = safe_load(
        """
        containerSecurityContext:
          enabled: false
          capabilities:
            drop: []
          runAsUser: 9876
        """,
    )
    expected_security_context = {}
    result = helm.helm_template(chart_path, values)
    containers = get_containers_of_deployment(helm, result)
    _assert_all_have_security_context(containers, expected_security_context)


def test_container_security_context_is_applied(helm, chart_path):
    values = safe_load(
        """
        containerSecurityContext:
          enabled: true
          capabilities:
            drop: []
          runAsUser: 9876
        """,
    )
    expected_security_context = {
        "capabilities": {
            "drop": [],
        },
        "runAsUser": 9876,
    }

    result = helm.helm_template(chart_path, values)
    containers = get_containers_of_deployment(helm, result)
    _assert_all_have_security_context(containers, expected_security_context)


def _assert_all_have_security_context(containers, expected_security_context):
    for container in containers:
        security_context = container.get("securityContext", {})
        name = container["name"]
        assert (
            security_context.items() >= expected_security_context.items()
        ), f'Wrong securityContext in container "{name}"'
