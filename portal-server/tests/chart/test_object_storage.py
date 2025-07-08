# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH


from univention.testing.helm.client.object_storage import ObjectStorage


class TestObjectStorageClient(ObjectStorage):

    path_main_container = "spec.template.spec.containers[?@.name=='portal-server']"
    secret_name = "release-name-portal-server-object-storage"
