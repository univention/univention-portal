# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from pytest_helm import utils
from yaml import safe_load


def test_favicon_not_added_by_default(helm, chart_path):
    values = {}
    result = helm.helm_template(chart_path, values, template_file="templates/branding-configmap.yaml")
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert "favicon.ico" not in config_map["binaryData"]


def test_favicon_is_not_mounted_by_default(helm, chart_path):
    values = {}
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    volume_mounts = utils.findone(
        deployment, "spec.template.spec.containers[?@.name=='portal-frontend'].volumeMounts")
    favicon_mount = [mount for mount in volume_mounts if mount.get("subPath") == "favicon.ico"]
    assert not favicon_mount


def test_favicon_is_added_when_configured(helm, chart_path):
    values = safe_load("""
        portalFrontend:
          branding:
            favicon: stub_value
        """)
    result = helm.helm_template(chart_path, values, template_file="templates/branding-configmap.yaml")
    config_map = helm.get_resource(result, kind="ConfigMap")
    assert config_map["binaryData"]["favicon.ico"] == "stub_value"


def test_favicon_is_mounted_when_configured(helm, chart_path):
    values = safe_load("""
        portalFrontend:
          branding:
            favicon: stub_value
        """)
    result = helm.helm_template(chart_path, values)
    deployment = helm.get_resource(result, kind="Deployment")
    volume_mounts = utils.findone(
        deployment, "spec.template.spec.containers[?@.name=='portal-frontend'].volumeMounts")
    favicon_mount = [mount for mount in volume_mounts if mount.get("subPath") == "favicon.ico"]
    assert favicon_mount
