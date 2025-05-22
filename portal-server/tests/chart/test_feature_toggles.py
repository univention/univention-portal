# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

import pytest
from yaml import safe_load


@pytest.mark.parametrize("value", ["", "null"])
def test_disabling_all_feature_toggles(chart, value):
    values = safe_load(
        f"""
        portalServer:
          featureToggles: {value}
    """,
    )
    result = chart.helm_template(values)
    configmap = result.get_resource(kind="ConfigMap")
    feature_toggles = json.loads(configmap.findone("data.PORTAL_SERVER_FEATURE_TOGGLES"))
    assert feature_toggles == {}


def test_allows_to_add_arbitrary_feature_toggles(chart):
    values = safe_load(
        """
        portalServer:
          featureToggles:
            test_feature_a: true
            test_feature_b: false
    """,
    )
    result = chart.helm_template(values)
    configmap = result.get_resource(kind="ConfigMap")
    feature_toggles = json.loads(configmap.findone("data.PORTAL_SERVER_FEATURE_TOGGLES"))
    assert feature_toggles["test_feature_a"] is True
    assert feature_toggles["test_feature_b"] is False
