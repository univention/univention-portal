# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.auth_flavors.password_usage import AuthPasswordUsageViaEnv
from univention.testing.helm.auth_flavors.secret_generation import AuthSecretGenerationUser


class SettingsTestObjectStorageSecret:
    secret_name = "release-name-portal-consumer-object-storage"
    prefix_mapping = {
        "auth.accessKeyId": "auth.password",
        "objectStorage.auth": "auth",
    }

    # for tests around AuthPasswordUsageViaEnv
    workload_kind = "StatefulSet"
    workload_name = "release-name-portal-consumer"


class TestChartCreatesObjectStorageAccessKeyIdSecretAsUser(SettingsTestObjectStorageSecret, AuthSecretGenerationUser):
    path_password = "stringData.access_key_id"

    def test_auth_plain_values_password_is_not_templated(self, chart):
        pass


class TestChartCreatesObjectStorageSecretAccessKeyAsUser(SettingsTestObjectStorageSecret, AuthSecretGenerationUser):
    path_password = "stringData.secret_access_key"
    prefix_mapping = {
        "auth.secretAccessKey": "auth.password",
        "objectStorage.auth": "auth",
    }


class TestInitContainerUsesObjectStorageAccessKeyViaEnv_WaitForObjectStorage(SettingsTestObjectStorageSecret, AuthPasswordUsageViaEnv):
    sub_path_env_password = "env[?@name=='OBJECT_STORAGE_ACCESS_KEY_ID']"
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-object-storage']"
    secret_default_key = "access_key_id"


class TestInitContainerUsesObjectStorageSecretAccessKeyViaEnv_WaitForObjectStorage(SettingsTestObjectStorageSecret, AuthPasswordUsageViaEnv):
    sub_path_env_password = "env[?@name=='OBJECT_STORAGE_SECRET_ACCESS_KEY']"
    path_container = "..spec.template.spec.initContainers[?@.name=='wait-for-object-storage']"
    secret_default_key = "secret_access_key"


class TestPortalConsumerUsesObjectStorageAccessKeyViaEnv(SettingsTestObjectStorageSecret, AuthPasswordUsageViaEnv):
    sub_path_env_password = "env[?@name=='OBJECT_STORAGE_ACCESS_KEY_ID']"
    secret_default_key = "access_key_id"


class TestPortalConsumerUsesObjectStorageSecretAccessKeyViaEnv(SettingsTestObjectStorageSecret, AuthPasswordUsageViaEnv):
    sub_path_env_password = "env[?@name=='OBJECT_STORAGE_SECRET_ACCESS_KEY']"
    secret_default_key = "secret_access_key"
