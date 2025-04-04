# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import sys
from copy import deepcopy
from pathlib import Path

import pytest

from univention.testing.helm.deployment import Deployment


def get_absolute_path(path: Path):
    base_path = Path(__file__).parent.parent.parent.parent
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

    def setup_class(cls):
        # Override helm-test-harness Deployment _compare_dict function for special handling of root container "univention-compatibility"
        cls.module = sys.modules['univention.testing.helm.deployment']
        cls.orig_compare_dict = cls.module._compare_dict

        def _compare_dict_override(actual: dict, expected: dict, container: str, invalid_keys: set = ['enabled']):
            if container == "univention-compatibility":
                expected = deepcopy(expected)
                expected.update({
                    "runAsUser": None,
                    "runAsGroup": None,
                    "readOnlyRootFilesystem": None,
                    "runAsNonRoot": None,
                })

            cls.orig_compare_dict(actual, expected, container, invalid_keys)

        cls.module._compare_dict = _compare_dict_override

    def teardown_class(cls):
        cls.module._compare_dict = cls.orig_compare_dict
