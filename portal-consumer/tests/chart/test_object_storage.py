# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

from univention.testing.helm.client.object_storage import ObjectStorage


class TestObjectStorageClient(ObjectStorage):

    secret_name = "release-name-portal-consumer-object-storage"
    workload_resource_kind = "StatefulSet"

    path_main_container = "spec.template.spec.containers[?@.name=='portal-consumer']"
