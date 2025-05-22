# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

from yaml import safe_load


def test_no_newsfeed_configuration_by_default(chart):
    result = chart.helm_template()
    configmap = result.get_resource(kind="ConfigMap")
    newsfeed_config = json.loads(configmap.findone("data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config == {}


def test_no_newsfeed_configuration_when_feature_is_deactivated(chart):
    values = safe_load("""
        portalServer:
          featureToggles:
            newsfeed: false
          newsfeed:
            feedUrl:
              en_EN: "https://blog.example/feed"
    """)
    result = chart.helm_template(values)
    configmap = result.get_resource(kind="ConfigMap")
    newsfeed_config = json.loads(configmap.findone("data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config == {}


def test_renders_newsfeed_configuration_when_feature_is_enabled(chart):
    values = safe_load("""
        portalServer:
          featureToggles:
            newsfeed: true
          newsfeed:
            feedUrl:
              en_EN: "https://blog.example/feed"
    """)
    result = chart.helm_template(values)
    configmap = result.get_resource(kind="ConfigMap")
    newsfeed_config = json.loads(configmap.findone("data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config["feedUrl"]["en_EN"] == "https://blog.example/feed"
