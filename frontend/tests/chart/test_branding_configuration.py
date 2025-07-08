# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest
from pytest_helm.utils import load_yaml


pytestmark = pytest.mark.parametrize("values_key,filename", [
    ("favicon", "favicon.ico"),
    ("faviconSvg", "favicon.svg"),
    ("appleTouchIcon", "apple-touch-icon.png"),
    ("favicon96Png", "favicon-96x96.png"),
    ("webManifestIcon192", "web-app-manifest-192x192.png"),
    ("webManifestIcon512", "web-app-manifest-512x512.png"),
])


def test_file_not_added_by_default(values_key, filename, chart):
    values = {}
    result = chart.helm_template(values, template_file="templates/branding-configmap.yaml")
    config_map = result.get_resource(kind="ConfigMap")
    assert filename not in config_map["binaryData"]


def test_file_is_not_mounted_by_default(values_key, filename, chart):
    values = {}
    result = chart.helm_template(values)
    deployment = result.get_resource(kind="Deployment")
    volume_mounts = deployment.findone(
        "spec.template.spec.containers[?@.name=='portal-frontend'].volumeMounts")
    file_mount = [mount for mount in volume_mounts if mount.get("subPath") == filename]
    assert not file_mount


def test_file_is_added_when_configured(values_key, filename, chart):
    values = load_yaml(f"""
        portalFrontend:
          branding:
            {values_key}: stub_value
        """)
    result = chart.helm_template(values, template_file="templates/branding-configmap.yaml")
    config_map = result.get_resource(kind="ConfigMap")
    assert config_map["binaryData"][filename] == "stub_value"


def test_file_is_mounted_when_configured(values_key, filename, chart):
    values = load_yaml(f"""
        portalFrontend:
          branding:
            {values_key}: stub_value
        """)
    result = chart.helm_template(values)
    deployment = result.get_resource(kind="Deployment")
    volume_mounts = deployment.findone(
        "spec.template.spec.containers[?@.name=='portal-frontend'].volumeMounts")
    file_mount = [mount for mount in volume_mounts if mount.get("subPath") == filename]
    assert file_mount
