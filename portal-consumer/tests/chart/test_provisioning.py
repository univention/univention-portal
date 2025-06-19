# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json

from univention.testing.helm.client.provisioning_api import Auth, AuthPasswordOwner, AuthPasswordSecret, AuthUsername, Connection, SecretViaEnv


class TestAuth(SecretViaEnv, AuthPasswordOwner, Auth):
    config_map_name = "release-name-portal-consumer"
    secret_name = "release-name-portal-consumer-provisioning-api"
    workload_kind = "StatefulSet"

    default_username = "portal-consumer"
    derived_password = "fe3b23688cf102b8936a82bcbcd4c4abf8d43d80"

    path_container = "spec.template.spec.containers[?@.name=='portal-consumer']"


class TestAuthRegistration(AuthPasswordSecret):
    """Verify that the password value is correctly embedded within the key "registration"."""

    secret_name = "release-name-portal-consumer-provisioning-api"
    path_password = "stringData.registration"

    is_secret_owner = True

    def get_password(self, result):
        secret = result.get_resource(kind="Secret", name=self.secret_name)
        registration_json = secret.findone(self.path_password)
        registration = json.loads(registration_json)
        return registration["password"]


class TestAuthRegistrationUsername(AuthUsername):
    """Verify that the username is correctly embedded within the key "registration"."""

    secret_name = "release-name-portal-consumer-provisioning-api"
    path_username = "stringData.registration"
    default_username = "portal-consumer"

    is_secret_owner = True

    def get_username(self, result):
        secret = result.get_resource(kind="Secret", name=self.secret_name)
        registration_json = secret.findone(self.path_username)
        registration = json.loads(registration_json)
        return registration["name"]


class TestConnection(Connection):

    config_map_name = "release-name-portal-consumer"

    path_provisioning_api_url = "data.PROVISIONING_API_BASE_URL"
