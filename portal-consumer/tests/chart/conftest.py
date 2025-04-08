# SPDX-FileCopyrightText: 2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

import os

import pytest
import yaml


def pytest_addoption(parser):
    parser.addoption("--chart-path", help="Path of the Helm chart to test")


@pytest.fixture()
def helm_values(request):
    """Use a custom values file for unit tests."""
    base_path = "helm/portal-consumer"
    default_file = os.path.join(base_path, "linter_values.yaml")
    test_file = os.path.join(base_path, "linter_values_unit_tests.yaml")

    if not os.path.exists(test_file):
        with open(default_file) as f:
            values = yaml.safe_load(f)

        values["ldap"]["tls"]["enabled"] = True

        with open(test_file, "w") as f:
            yaml.safe_dump(values, f)

    return request.config.option.values or [test_file]


@pytest.fixture()
def chart_path(pytestconfig):
    """Path to the Helm chart which shall be tested."""
    chart_path = pytestconfig.option.chart_path
    if not chart_path:
        tests_path = os.path.dirname(os.path.abspath(__file__))
        chart_path = os.path.normpath(
            os.path.join(tests_path, "../../../helm/portal-consumer"),
        )
    return chart_path
