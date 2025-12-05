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
import os.path
from unittest import mock

import pytest

from univention.portal.extensions import reloader


stub_assets_root = "/stub_root"
stub_portal_dn = "cn=domain,cn=portal,cn=test"


@pytest.fixture
def portal_reloader_udm(mocker, mock_portal_config):
    """Provides an instance of PortalReloaderUDM with mocked dependencies."""
    mocker.patch.object(reloader.PortalReloaderUDM, "_get_mtime", return_value=2.2)
    mocker.patch("json.dumps")
    mocker.patch("tempfile.NamedTemporaryFile")
    mock_portal_config({"assets_root": stub_assets_root})
    return reloader.PortalReloaderUDM(stub_portal_dn, "cache_file_stub")


@pytest.mark.parametrize("class_name", [
    "Reloader",
    "MtimeBasedLazyFileReloader",
    "PortalReloaderUDM",
    "GroupsReloaderLDAP",
])
def test_imports(class_name, dynamic_class):
    assert dynamic_class(class_name)


class TestMtimeBasedLazyFileReloader:
    _cache_file = "path/to/cache/file"
    _mtime = 2.3
    _rtime = 4.2
    _reason = "force"

    _os = None
    _shutil = None

    def patch_reloader_modules(self, reloader_class, patch_func):
        # Patch modules imported in Reloader class
        mocked_os = patch_func(reloader_class, "os")
        mocked_os.stat.return_value.st_mtime = self._mtime
        mocked_shutil = patch_func(reloader_class, "shutil")
        # Reference mocks for test access in class properties
        self._os = mocked_os
        self._shutil = mocked_shutil

    @pytest.fixture
    def mocked_reloader(self, dynamic_class, patch_object_module, mock_portal_config):
        mock_portal_config({"assets_root": "/stub_assets_root"})
        Reloader = dynamic_class("MtimeBasedLazyFileReloader")
        self.patch_reloader_modules(Reloader, patch_object_module)
        reloader = Reloader(self._cache_file)
        return reloader

    def test_init_error(self, dynamic_class, patch_object_module, mock_portal_config):
        mock_portal_config({"assets_root": "/stub_assets_root"})
        Reloader = dynamic_class("MtimeBasedLazyFileReloader")
        mocked_os = patch_object_module(Reloader, "os")
        mocked_os.stat.side_effect = IOError
        reloader = Reloader(self._cache_file)
        assert reloader._cache_file == self._cache_file
        assert reloader._mtime == 0

    def test_init_success(self, mocked_reloader):
        self._os.stat.assert_called_once()
        assert mocked_reloader._cache_file == self._cache_file
        assert mocked_reloader._mtime == self._mtime

    def test_refresh_default(self, mocked_reloader):
        refreshed = mocked_reloader.refresh()
        assert not refreshed
        self._os.stat.return_value.st_mtime = self._rtime
        refreshed = mocked_reloader.refresh()
        assert refreshed

    def test_refresh_with_reason(self, mocked_reloader, mocker):
        # Set up
        mocked_reloader._refresh = mocker.Mock()  # Mock _refresh because not implemented in base class
        mocked_reloader._refresh.return_value = ("{}", [])
        mocked_reloader._get_mtime = mocker.Mock(return_value=self._rtime)
        fd_mock = mock.Mock()
        fd_mock.name = "fd"
        mocker.patch.object(mocked_reloader, "_write_to_tmp_file", return_value=fd_mock)
        # Execute
        mocked_reloader.refresh("unknown_reason")
        mocked_reloader._refresh.assert_not_called()
        mocked_reloader.refresh(reason=self._reason)
        mocked_reloader._refresh.assert_called_once()
        self._os.makedirs.assert_called_once_with(self._os.path.dirname())
        self._shutil.move.assert_called_once_with("fd", self._cache_file)


@pytest.mark.parametrize("content,expected_mode", [
    ("str_content", "w"),
    (b"bytes_content", "wb"),
])
def test_write_to_tmp_file_sets_correct_mode(mocker, content, expected_mode, mock_portal_config):
    mock_portal_config({"assets_root": stub_assets_root})
    tempfile_mock = mocker.patch("tempfile.NamedTemporaryFile")
    mtime_based_reloader = reloader.MtimeBasedLazyFileReloader("/stub_path/stub_file")

    mtime_based_reloader._write_to_tmp_file(content)
    tempfile_mock.assert_called_with(mode=expected_mode, delete=mock.ANY)


class TestPortalReloaderUDM(TestMtimeBasedLazyFileReloader):
    _portal_dn = "cn=domain,cn=portal,cn=univention"

    @pytest.fixture
    def mocked_portal_reloader(
            self, dynamic_class, patch_object_module, mocker, mock_portal_config):
        mock_portal_config({"assets_root": "/stub_directory"})
        Reloader = dynamic_class("PortalReloaderUDM")
        self.patch_reloader_modules(Reloader, patch_object_module)
        reloader = Reloader(self._portal_dn, self._cache_file)
        reloader.udm_udm = mocker.Mock()
        reloader.udm_modules = mocker.Mock()
        return reloader

    def generate_mocked_portal(self, mocker):
        # TODO: Generate sample portal object for reloader
        return mocker.Mock()

    def test_default_init(self, mocked_portal_reloader):
        self._os.stat.assert_called_once()
        assert mocked_portal_reloader._cache_file == self._cache_file
        assert mocked_portal_reloader._mtime == self._mtime
        assert mocked_portal_reloader._portal_dn == self._portal_dn


def test_portal_reloader_refresh_uses_content_fetcher_udm_rest(
        portal_reloader_udm, mocker, mock_portal_config):
    mock_portal_config({"use-udm-rest-api": True})
    mocked_fetch = mocker.patch(
        'univention.portal.extensions.reloader_content.PortalContentFetcherUDMREST.fetch')
    portal_reloader_udm._refresh()
    mocked_fetch.assert_called_once()


def test_portal_reloader_refresh_uses_content_fetcher_udm(
        portal_reloader_udm, mocker, mock_portal_config):
    mock_portal_config({"use-udm-rest-api": False})
    mocked_fetch = mocker.patch(
        'univention.portal.extensions.reloader_udm.PortalContentFetcherUDM.fetch')
    portal_reloader_udm._refresh()
    mocked_fetch.assert_called_once()


def test_portal_reloader_writes_content_to_file(portal_reloader_udm, mocker):
    stub_content = (b"stub_content", [])
    portal_reloader_udm._refresh = mock.Mock(return_value=stub_content)
    write_mock = mocker.patch.object(portal_reloader_udm, "_write")

    portal_reloader_udm.refresh(reason="force")
    write_mock.assert_called_once_with("cache_file_stub", b"stub_content")


def test_portal_reloader_writes_assets_first(portal_reloader_udm, mocker):
    stub_content = (b"stub_content", [
        ("stub_path/stub_directory/stub_asset.stub_ext", b"stub_asset_content"),
    ])
    portal_reloader_udm._refresh = mock.Mock(return_value=stub_content)
    write_mock = mocker.patch.object(portal_reloader_udm, "_write")

    portal_reloader_udm.refresh(reason="force")
    expected_path = os.path.join(stub_assets_root, "stub_path/stub_directory/stub_asset.stub_ext")
    assert write_mock.call_args_list[0] == mock.call(expected_path, b"stub_asset_content")


@pytest.mark.parametrize(
    "reason,expected", [
        ("stub_reason", False),
        (None, False),
        ("stub:reason", False),
        ("ldap:entry", True),
    ])
def test_check_reason_returns_expected_value(reason, expected, portal_reloader_udm):
    result = portal_reloader_udm._check_reason(reason)
    assert result == expected


class TestGroupsReloaderLDAP(TestMtimeBasedLazyFileReloader):
    _ldap_uri = "ldap://ucs:7369"
    _ldap_base = "dc=base,dc=com"
    _bind_dn = "cn=ucs,cn=computers"
    _password_file = "path/to/password/file.secret"

    @pytest.fixture
    def mocked_portal_reloader(self, dynamic_class, patch_object_module, mock_portal_config):
        mock_portal_config({"assets_root": "/stub_assets_root"})
        Reloader = dynamic_class("GroupsReloaderLDAP")
        self.patch_reloader_modules(Reloader, patch_object_module)
        reloader = Reloader(self._ldap_uri, self._bind_dn, self._password_file, self._ldap_base, self._cache_file)
        return reloader

    def test_default_init(self, mocked_portal_reloader):
        self._os.stat.assert_called_once()
        assert mocked_portal_reloader._cache_file == self._cache_file
        assert mocked_portal_reloader._mtime == self._mtime

    def test_refresh(self, mocked_portal_reloader):
        refreshed = mocked_portal_reloader.refresh()
        assert not refreshed
        self._os.stat.return_value.st_mtime = self._rtime
        refreshed = mocked_portal_reloader.refresh(reason=self._reason)
        assert refreshed

    def test_refresh_returns_correct_data(self, mocked_portal_reloader, mocker):
        stub_user_data = [{"username": "stub_value"}]
        users_groups_mock = mocker.patch("univention.ldap_cache.frontend.users_groups")
        users_groups_mock.return_value = stub_user_data

        content, assets = mocked_portal_reloader._refresh()

        assert json.loads(content) == stub_user_data
        assert list(assets) == []
        users_groups_mock.assert_called_once()


@pytest.mark.parametrize("reason,expected", [
    ("force", True),
    ("stub_reason", False),
    (None, False),
    ("stub:reason", False),
    ("ldap:entry", True),
    ("ldap:group", False),
])
def test_check_portal_reason_returns_expected_value(reason, expected):
    result = reloader.check_portal_reason(reason)
    assert result == expected


@pytest.mark.parametrize("reason,expected", [
    ("force", True),
    ("stub_reason", False),
    (None, False),
    ("stub:reason", False),
    ("ldap:entry", False),
    ("ldap:group", True),
])
def testcheck_groups_reason_returns_expected_value(reason, expected):
    result = reloader.check_groups_reason(reason)
    assert result == expected
