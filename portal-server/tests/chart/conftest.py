# SPDX-FileCopyrightText: 2024 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

from pathlib import Path

import pytest


base_dir = (Path(__file__).parent / "../../../").resolve()


@pytest.fixture()
def helm_values(request):
    """By default use "helm/portal-server/linter_values.yaml"."""
    default_values = [
        base_dir / "helm/portal-server/linter_values.yaml",
    ]
    return request.config.option.values or default_values


@pytest.fixture()
def chart_default_path():
    chart_path = base_dir / "helm/portal-server"
    return chart_path
