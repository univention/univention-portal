# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from yaml import safe_load

from utils import findone


def test_add_another_label(helm, chart_path):
    values = safe_load(
        """
        additionalLabels:
          local.test/name: "value"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")
    labels = findone(secret, "metadata.labels")

    assert labels["local.test/name"] == "value"


def test_modify_a_common_label(helm, chart_path):
    values = safe_load(
        """
        additionalLabels:
          app.kubernetes.io/name: "replaced value"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")
    labels = findone(secret, "metadata.labels")

    assert labels["app.kubernetes.io/name"] == "replaced value"


def test_value_is_templated(helm, chart_path):
    values = safe_load(
        """
        global:
          test: "stub-value"
        additionalLabels:
          local.test/name: "{{ .Values.global.test }}"
    """)
    result = helm.helm_template(chart_path, values)
    secret = helm.get_resource(result, kind="Secret", name="release-name-portal-server-udm")
    labels = findone(secret, "metadata.labels")

    assert labels["local.test/name"] == "stub-value"
