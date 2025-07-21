#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#


import json
from io import StringIO
from unittest.mock import Mock, patch

import boto3
import pytest
from botocore.response import StreamingBody
from botocore.stub import Stubber


UCS_INTERNAL_PATH = "portal-data"
PORTAL_DATA_KEYS = [
    "portal",
    "entries",
    "folders",
    "categories",
    "corner_links",
    "menu_links",
    "quick_links",
    "user_links",
]
PORTAL_DATA = {key: key for key in PORTAL_DATA_KEYS}
GROUPS_DATA = {"username": ["list", "of", "groups"]}


@pytest.mark.parametrize(
    "class_name",
    [
        "CacheObjectStorage",
        "PortalFileCacheObjectStorage",
        "GroupFileCacheObjectStorage",
    ],
)
def test_import(class_name, dynamic_class):
    assert dynamic_class(class_name)


@pytest.mark.parametrize(
    "class_name,path,data,data_keys",
    [
        (
            "PortalFileCacheObjectStorage",
            f"{UCS_INTERNAL_PATH}/portal",
            PORTAL_DATA,
            PORTAL_DATA_KEYS,
        ),
        ("GroupFileCacheObjectStorage", f"{UCS_INTERNAL_PATH}/groups", GROUPS_DATA, []),
    ],
)
@patch(
    "univention.portal.extensions.cache_object_storage.get_object_storage_client",
    Mock(return_value=boto3.client("s3")),
)
def test_portal_file_cache_object_storage(
    dynamic_class,
    class_name,
    path,
    data,
    data_keys,
):
    file_cache_object_storage = dynamic_class(
        class_name,
    )(
        path,
        "http://stub_endpoint",
        "stub_bucket",
        "stub_user",
        "stub_pass",
    )

    body_encoded = json.dumps(data)

    body = StreamingBody(StringIO(body_encoded), len(body_encoded))
    response = {
        "ResponseMetadata": {
            "HTTPStatusCode": 200,
            "HTTPHeaders": {
                "accept-ranges": "bytes",
                "content-length": len(body_encoded),
                "content-type": "application/json",
            },
            "RetryAttempts": 0,
        },
        "AcceptRanges": "bytes",
        "ContentLength": len(body_encoded),
        "ContentType": "application/json",
        "Body": body,
    }

    with Stubber(file_cache_object_storage._object_storage_client) as stubber:
        stubber.add_response(
            "get_object",
            response,
            {"Bucket": file_cache_object_storage._bucket, "Key": path},
        )
        file_cache_object_storage.refresh()

    assert file_cache_object_storage.get() == data
    for item in data_keys:
        assert item == getattr(file_cache_object_storage, f"get_{item}")()
