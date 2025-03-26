# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from pathlib import Path

import pytest

from univention.testing.helm.deployment import Deployment


def get_absolute_path(path: Path):
    base_path = Path(__file__).parent.parent
    return str(base_path / path)


@pytest.fixture()
def helm_values():
    """Use "helm/directory-consumer/linter_values.yaml" as default values."""
    return [get_absolute_path("helm/portal-consumer/linter_values.yaml")]


@pytest.fixture()
def chart_path():
    """Path to the Helm chart which shall be tested."""
    return get_absolute_path("helm/portal-consumer")


class TestDeployment(Deployment):
    template_file = "templates/statefulset.yaml"
