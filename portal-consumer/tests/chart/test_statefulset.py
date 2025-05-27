# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import pytest
from pytest_helm.utils import add_jsonpath_prefix, findall, findone
from yaml import safe_load

from univention.testing.helm.base import Base
from univention.testing.helm.deployment import Deployment, DeploymentTlsVolumeSecret


class TestStatefulSet(Deployment):
    template_file = "templates/statefulset.yaml"


@pytest.mark.parametrize(
    "key, volume_item",
    [
        ("ldap.tls", "ca.crt"),
        ("ldap.tls", "tls.crt"),
        ("ldap.tls", "tls.key"),
    ],
)
class TestLdapTlsExistingSecAsVolume(DeploymentTlsVolumeSecret):
    template_file = "templates/statefulset.yaml"
    volume_name = "release-name-portal-consumer-tls-volume"
    chart_name = "portal-consumer"


class AuthExistingSecAsVolume(Base):
    """
    Maybe a future test harness class to validate the `volumes` section of a kubernetes manifest
    focussing on templating of passwords mounted as volumes.
    The pod manifest must be embedded in a Deployment, StatefulSet or Job manifes.
    Supporting:
    - Injected passwords via helm values
    - Passwords via configured existingSecretsSecret
    - (optional) Generated passwords
    """

    template_file = ""
    volume_name = ""
    chart_name = ""
    auth_root = ""
    init_containers = []
    containers = []

    def test_auth_existing_secret_custom_name(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  existingSecret:
                    name: "stub-secret-name"
            """,
            ),
        )

        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        volume = findone(
            deployment,
            f"spec.template.spec.volumes[?@.name=='{self.volume_name}']",
        )
        assert volume["secret"]["secretName"] == "stub-secret-name"

        self._volume_mount_subpaths_match("password", self.init_containers, deployment, test_init_containers=True)
        self._volume_mount_subpaths_match("password", self.containers, deployment, test_init_containers=False)

    def test_auth_disabling_existing_secret(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  existingSecret: null
            """,
            ),
        )

        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        volume = findone(
            deployment,
            f"spec.template.spec.volumes[?@.name=='{self.volume_name}']",
        )
        assert volume["secret"]["secretName"].startswith(
            f"release-name-{self.chart_name}",
        ), f"Secret name: {volume['secret']['secretName']} does not start with release-name-{self.chart_name}"

        self._volume_mount_subpaths_match("password", self.init_containers, deployment, test_init_containers=True)
        self._volume_mount_subpaths_match("password", self.containers, deployment, test_init_containers=False)

    def test_auth_existing_secret_has_precedence(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  password: stub-plain-password
                  existingSecret:
                    name: "stub-secret-name"
                    keyMapping:
                      password: "stub_password_key"
            """,
            ),
        )
        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        volume = findone(
            deployment,
            f"spec.template.spec.volumes[?@.name=='{self.volume_name}']",
        )
        assert volume["secret"]["secretName"] == "stub-secret-name"

        self._volume_mount_subpaths_match("stub_password_key", self.init_containers, deployment, test_init_containers=True)
        self._volume_mount_subpaths_match("stub_password_key", self.containers, deployment, test_init_containers=False)

    def _volume_mount_subpaths_match(self, subpath, containers, deployment, test_init_containers=True):
        container_type = "initContainers" if test_init_containers else "containers"
        for container in containers:
            volume_mounts = findall(
                deployment,
                f"spec.template.spec.{container_type}[?@.name=='{container}'].volumeMounts[?@.name=='{self.volume_name}']",
            )
            for volume_mount in volume_mounts:
                assert volume_mount["subPath"] == subpath


class AuthExistingSecAsEnvVariable(Base):
    """
    Maybe a future test harness class to validate the `containers` and `initContainers` section
    of a kubernetes Pod manifest focussing on templating of paswords mounted as env values.
    The pod manifest must be embedded in a Deployment, StatefulSet or Job manifes.
    Supporting:
    - Injected passwords via helm values
    - Passwords via configured existingSecretsSecret
    - (optional) Generated passwords
    """

    chart_name = ""
    container_is_init = False
    auth_root = ""
    init_containers = []
    containers = []
    env_vars = []

    def _env_var_match(self, matchFunc, containers, deployment, test_init_containers=True):
        container_type = "initContainers" if test_init_containers else "containers"
        for container in containers:
            for env_var in self.env_vars:
                env = findone(
                    deployment,
                    f"spec.template.spec.{container_type}[?@.name=='{container}'].env[?@.name=='{env_var}']",
                )
                matchFunc(env)

    def match_full_credentials(self, name, password):
        def match_func(env):
            assert env["valueFrom"]["secretKeyRef"]["name"] == name
            assert env["valueFrom"]["secretKeyRef"]["key"] == password
        return match_func

    def test_auth_existing_secret_custom_name(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  existingSecret:
                    name: "stub-secret-name"
            """,
            ),
        )
        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        match_func = self.match_full_credentials("stub-secret-name", "password")
        self._env_var_match(match_func, self.init_containers, deployment, test_init_containers=True)
        self._env_var_match(match_func, self.containers, deployment, test_init_containers=False)

    def test_auth_disabling_existing_secret(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  existingSecret: null
            """,
            ),
        )
        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)

        def match_func(env):
            assert env["valueFrom"]["secretKeyRef"]["name"].startswith(
                f"release-name-{self.chart_name}",
            ), f"Secret name: {env['valueFrom']['secretKeyRef']['name']} does not start with release-name-{self.chart_name}"
            assert env["valueFrom"]["secretKeyRef"]["key"] == "password"
        self._env_var_match(match_func, self.init_containers, deployment, test_init_containers=True)
        self._env_var_match(match_func, self.containers, deployment, test_init_containers=False)

    def test_auth_existing_secret_custom_key(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  existingSecret:
                    name: "stub-secret-name"
                    keyMapping:
                      password: "stub_password_key"
            """,
            ),
        )
        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        match_func = self.match_full_credentials("stub-secret-name", "stub_password_key")
        self._env_var_match(match_func, self.init_containers, deployment, test_init_containers=True)
        self._env_var_match(match_func, self.containers, deployment, test_init_containers=False)

    def test_auth_existing_secret_has_precedence(
        self,
        helm,
        chart_path,
    ):
        values = add_jsonpath_prefix(
            self.auth_root,
            safe_load(
                """
                auth:
                  password: stub-plain-password
                  existingSecret:
                    name: "stub-secret-name"
                    keyMapping:
                      password: "stub_password_key"
            """,
            ),
        )
        deployment = self.helm_template_file(helm, chart_path, values, self.template_file)
        match_func = self.match_full_credentials("stub-secret-name", "stub_password_key")
        self._env_var_match(match_func, self.init_containers, deployment, test_init_containers=True)
        self._env_var_match(match_func, self.containers, deployment, test_init_containers=False)


class TestLdapAuthExistingSecAsVolume(AuthExistingSecAsVolume):
    template_file = "templates/statefulset.yaml"
    volume_name = "secret-ldap"
    chart_name = "portal-consumer"
    auth_root = "ldap"
    init_containers = ["wait-for-ldap", "wait-for-udm", "univention-compatibility"]
    containers = ["portal-consumer"]


class TestProvisioningApiExistingSecAsEnvVariable(AuthExistingSecAsEnvVariable):
    template_file = "templates/statefulset.yaml"
    chart_name = "portal-consumer"
    auth_root = "provisioningApi"
    init_containers = ["wait-for-provisioning-api", "univention-compatibility"]
    containers = ["portal-consumer"]
    env_vars = ["PROVISIONING_API_PASSWORD"]
