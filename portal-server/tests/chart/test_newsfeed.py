# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

from yaml import safe_load

from utils import findone


def test_no_newsfeed_configuration_by_default(helm, chart_path):
    result = helm.helm_template(chart_path)
    configmap = helm.get_resource(result, kind="ConfigMap")
    newsfeed_config = json.loads(findone(configmap, "data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config == {}


def test_no_newsfeed_configuration_when_feature_is_deactivated(helm, chart_path):
    values = safe_load("""
        portalServer:
          featureToggles:
            newsfeed: false
          newsfeed:
            feedUrl:
              en_EN: "https://blog.example/feed"
    """)
    result = helm.helm_template(chart_path, values)
    configmap = helm.get_resource(result, kind="ConfigMap")
    newsfeed_config = json.loads(findone(configmap, "data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config == {}


def test_renders_newsfeed_configuration_when_feature_is_enabled(helm, chart_path):
    values = safe_load("""
        portalServer:
          featureToggles:
            newsfeed: true
          newsfeed:
            feedUrl:
              en_EN: "https://blog.example/feed"
    """)
    result = helm.helm_template(chart_path, values)
    configmap = helm.get_resource(result, kind="ConfigMap")
    newsfeed_config = json.loads(findone(configmap, "data.PORTAL_SERVER_NEWSFEED_CONFIG"))
    assert newsfeed_config["feedUrl"]["en_EN"] == "https://blog.example/feed"
