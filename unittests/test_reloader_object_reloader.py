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

from unittest import mock

import boto3
import pytest
from botocore.stub import Stubber

from univention.portal.extensions import reloader, reloader_object_storage
from univention.portal.extensions.reloader_content import PortalContentFetcherUDMREST
from univention.portal.extensions.reloader_udm import PortalContentFetcherUDM


stub_json_path = "portal-data/portal"
stub_assets_root_path = "portal-assets"
stub_assets_base_url = "https://external.store.example/stub_bucket/"
stub_object_storage_endpoint = "http://stub_endpoint"
stub_bucket = "ums"
stub_access_key_id = "some_user"
stub_secret_access_key = "some_pass"
stub_asset_path = f"${stub_assets_root_path}/stub_file.svg"
stub_portal_dn = "cn=domain,cn=portal,cn=test"


@pytest.fixture(autouse=True)
def mock_s3_client(mocker):
    mocker.patch(
        "univention.portal.extensions.reloader_object_storage.get_object_storage_client",
        mock.Mock(return_value=boto3.client("s3")))


@pytest.fixture()
def object_storage_reloader():
    """An instance of ObjectStorageReloader."""
    instance = reloader_object_storage.ObjectStorageReloader(
        stub_json_path,
        stub_assets_root_path,
        stub_object_storage_endpoint,
        stub_bucket,
        stub_access_key_id,
        stub_secret_access_key,
    )
    content_fetcher_mock = mock.Mock()
    content_fetcher_mock.assets = []
    instance._object_storage_client = mock.Mock()
    instance._create_content_fetcher = mock.Mock(return_value=content_fetcher_mock)
    return instance


@pytest.fixture()
def object_storage_portal_reloader(mocker, mock_portal_config):
    """An instance of ObjectStoragePortalReloader."""
    mock_portal_config(
        {
            "assets_root_path": stub_assets_root_path,
            "portal_cache_path": stub_json_path,
            "ucs_internal_path": "portal-data",
            "use-udm-rest-api": True,
        },
    )
    instance = reloader_object_storage.ObjectStoragePortalReloader(
        stub_json_path,
        stub_assets_root_path,
        stub_portal_dn,
        stub_object_storage_endpoint,
        stub_bucket,
        stub_access_key_id,
        stub_secret_access_key,
    )
    instance._object_storage_client = mock.Mock(return_value=boto3.client("s3"))
    return instance


@pytest.mark.parametrize(
    "object_storage_endpoint",
    ["http://minio:9000", "https://some.domain.test"],
)
def test_object_storage_reloader_accepts_endpoints(object_storage_endpoint):
    object_storage_reloader = reloader_object_storage.ObjectStorageReloader(
        stub_json_path,
        stub_assets_root_path,
        object_storage_endpoint,
        stub_bucket,
        stub_access_key_id,
        stub_secret_access_key,
    )
    assert object_storage_reloader._object_storage_endpoint == object_storage_endpoint


@pytest.mark.parametrize(
    "object_storage_endpoint",
    [
        "file:///stub-path/file",
        "ftp://stub-host.test/stub-path/file",
        "/stub-path/file",
    ],
)
def test_object_storage_reloader_raises_value_error_on_unsupported_urls(
    object_storage_endpoint,
):
    with pytest.raises(ValueError):
        reloader_object_storage.ObjectStorageReloader(
            stub_json_path,
            stub_assets_root_path,
            object_storage_endpoint,
            stub_bucket,
            stub_access_key_id,
            stub_secret_access_key,
        )


def test_cache_calls_object_storage_reloader(object_storage_reloader, mocker):
    from univention.portal.extensions.cache import Cache

    cache = Cache(cache_file=stub_json_path, reloader=object_storage_reloader)
    write_content_mock = mocker.patch.object(object_storage_reloader, "_write_content")
    cache.refresh()
    write_content_mock.assert_not_called()


def test_object_storage_reloader_puts_content_to_url(object_storage_reloader):
    stub_content = (b"stub_content", [])
    response = {
        "ResponseMetadata": {
            "HTTPStatusCode": 200,
            "HTTPHeaders": {
                "accept-ranges": "bytes",
            },
            "RetryAttempts": 0,
        },
    }
    object_storage_reloader._object_storage_client = boto3.client("s3")
    stubber = Stubber(object_storage_reloader._object_storage_client)
    object_storage_reloader._generate_content = mock.Mock(return_value=stub_content)
    stubber.activate()
    stubber.add_response(
        "put_object",
        response,
        {
            "Body": b"stub_content",
            "Bucket": "ums",
            "ContentType": "application/json",
            "Key": "portal-data/portal",
        },
    )
    result = object_storage_reloader.refresh(reason="force")
    assert result


def test_object_storage_portal_reloader_checks_reason(
    object_storage_portal_reloader,
    mocker,
):
    check_reason_mock = mocker.patch.object(reloader, "check_portal_reason")
    object_storage_portal_reloader._check_reason("stub_reason")
    check_reason_mock.assert_called_once_with("stub_reason")


def test_object_storage_portal_reloader_refresh_uses_content_fetcher_udm_rest(
        object_storage_portal_reloader, mock_portal_config):
    mock_portal_config({"use-udm-rest-api": True})
    content_fetcher = object_storage_portal_reloader._create_content_fetcher()
    assert isinstance(content_fetcher, PortalContentFetcherUDMREST)


def test_object_storage_portal_reloader_refresh_uses_content_fetcher_udm(
        object_storage_portal_reloader, mocker, mock_portal_config):
    mock_portal_config({"use-udm-rest-api": False})
    content_fetcher = object_storage_portal_reloader._create_content_fetcher()
    assert isinstance(content_fetcher, PortalContentFetcherUDM)


def test_object_storage_portal_reloader_passes_assets_base_url(mock_portal_config, mocker):
    mock_portal_config({"use-udm-rest-api": True})
    assets_base_url = "https://external.store.example/stub_bucket/"
    reloader_instance = reloader_object_storage.ObjectStoragePortalReloader(
        stub_json_path,
        stub_assets_root_path,
        stub_portal_dn,
        stub_object_storage_endpoint,
        stub_bucket,
        stub_access_key_id,
        stub_secret_access_key,
        assets_base_url=assets_base_url,
    )
    content_fetcher = reloader_instance._create_content_fetcher()
    assert content_fetcher._assets_base_url == assets_base_url


def test_object_storage_groups_reloader_uses_groups_content_fetcher():
    groups_reloader = reloader_object_storage.ObjectStorageGroupsReloader(
        stub_json_path,
        stub_assets_root_path,
        stub_object_storage_endpoint,
        stub_bucket,
        stub_access_key_id,
        stub_secret_access_key,
    )
    content_fetcher = groups_reloader._create_content_fetcher()
    assert isinstance(content_fetcher, reloader.GroupsContentFetcher)
