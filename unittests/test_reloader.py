#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2020-2022 Univention GmbH
#
# https://www.univention.de/
#
# All rights reserved.
#
# The source code of this program is made available
# under the terms of the GNU Affero General Public License version 3
# (GNU AGPL V3) as published by the Free Software Foundation.
#
# Binary versions of this program provided by Univention to you as
# well as other copyrighted, protected or trademarked materials like
# Logos, graphics, fonts, specific documentations and configurations,
# cryptographic keys etc. are subject to a license agreement between
# you and Univention and not subject to the GNU AGPL V3.
#
# In the case you use this program under the terms of the GNU AGPL V3,
# the program is provided in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public
# License with the Debian GNU/Linux or Univention distribution in file
# /usr/share/common-licenses/AGPL-3; if not, see
# <https://www.gnu.org/licenses/>.
#

import binascii
import json
from unittest import mock

from univention.portal.extensions import reloader

import pytest
import stub_udm_client


@pytest.fixture()
def portal_reloader_udm(mocker, mock_portal_config):
    """Provides an instance of PortalReloaderUDM with mocked dependencies."""
    mocker.patch.object(
        reloader.PortalReloaderUDM, "_create_udm_client", return_value=stub_udm_client.StubUDMClient())
    mocker.patch.object(reloader.PortalReloaderUDM, "_get_mtime", return_value=2.2)
    mocker.patch.object(reloader, "_write_image_to_file")
    mocker.patch.object(reloader, "_write_image_to_http")
    mocker.patch("json.dump")
    mocker.patch("tempfile.NamedTemporaryFile")
    mock_portal_config({"assets_root": "/stub_root"})
    return reloader.PortalReloaderUDM("cn=portal,dc=stub,dc=test", "cache_file_stub")


@pytest.fixture()
def stub_image():
    return b"stub_image_content"


@pytest.fixture()
def stub_image_base64(stub_image):
    return binascii.b2a_base64(stub_image)


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

    @pytest.fixture()
    def mocked_reloader(self, dynamic_class, patch_object_module):
        Reloader = dynamic_class("MtimeBasedLazyFileReloader")
        self.patch_reloader_modules(Reloader, patch_object_module)
        reloader = Reloader(self._cache_file)
        return reloader

    def test_init_error(self, dynamic_class, patch_object_module):
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

    def test_refresh_with_reason(self, mocked_reloader, patch_object_module, mocker):
        # Set up
        mocked_reloader._refresh = mocker.Mock()  # Mock _refresh because not implemented in base class
        mocked_reloader._refresh.return_value.name = "fd"
        mocked_reloader._get_mtime = mocker.Mock(return_value=self._rtime)
        # Execute
        mocked_reloader.refresh("unknown_reason")
        mocked_reloader._refresh.assert_not_called()
        mocked_reloader.refresh(reason=self._reason)
        mocked_reloader._refresh.assert_called_once()
        self._os.makedirs.assert_called_once_with(self._os.path.dirname())
        self._shutil.move.assert_called_once_with("fd", self._cache_file)


class TestPortalReloaderUDM(TestMtimeBasedLazyFileReloader):
    _portal_dn = "cn=domain,cn=portal,cn=univention"

    @pytest.fixture()
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


def test_check_reason_returns_true_from_super(mocker, portal_reloader_udm):
    super_check_reason_mock = mocker.patch(
        'univention.portal.extensions.reloader.MtimeBasedLazyFileReloader._check_reason',
        return_value=True)
    result = portal_reloader_udm._check_reason("stub_reason")
    assert result
    super_check_reason_mock.assert_called_with("stub_reason", None)


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


def test_refresh_calls_json_dump(portal_reloader_udm):
    portal_reloader_udm._refresh()
    json.dump.assert_called_once()


def test_write_image_writes_image_to_file(portal_reloader_udm):
    portal_reloader_udm._write_image(b"<svg />", "stub_name", "stub_dirname")
    reloader._write_image_to_file.assert_called_once()


def test_write_image_returns_relative_image_url(portal_reloader_udm):
    image_url = portal_reloader_udm._write_image(b"<svg />", "stub_name", "stub_dirname")
    assert image_url == "./icons/stub_dirname/stub_name.svg"


def test_write_image_writes_image_to_http(portal_reloader_udm, stub_image, stub_image_base64):
    portal_reloader_udm._assets_root = "http://user:pass@stub-host/stub-path/"
    portal_reloader_udm._write_image(stub_image_base64, "stub_name", "stub_dirname")
    reloader._write_image_to_http.assert_called_once_with(
        "http://user:pass@stub-host/stub-path/", "stub_name", "stub_dirname",
        "svg", stub_image)


def test_write_image_to_file(mocker):
    write_bytes_mock = mocker.patch("pathlib.Path.write_bytes")

    reloader._write_image_to_file(
        "/stub_assets_root", "stub_name", "stub_dirname", "stub_ext", b"stub_content")
    write_bytes_mock.assert_called_with(b"stub_content")


def test_write_image_to_http_puts_image(mocker):
    # TODO: integration test
    # reloader._write_image_to_http(
    #     "http://portal-listener:univention@store-dav/portal-assets/", "stub_name", "stub_dirname", "ext", b"stub_content")
    result_mock = mock.Mock()
    result_mock.status_code = 201
    put_mock = mocker.patch('requests.put', return_value=result_mock)
    reloader._write_image_to_http(
        "http://user:pass@stub-host/stub-path/", "stub_name", "stub_dirname", "ext", b"stub_content")
    put_mock.assert_called_once_with(
        url="http://user:pass@stub-host/stub-path/icons/stub_dirname/stub_name.ext",
        data=b"stub_content")


def test_write_image_to_http_ensures_url_prefix(mocker):
    mocker.patch('requests.put')
    with pytest.raises(ValueError):
        reloader._write_image_to_http(
            "http://user:pass@stub-host/stub-path/", "stub_name", "../../stub_dirname", "ext", b"stub_content")


def test_write_image_to_http_logs_failed_requests(mocker):
    result_mock = mock.Mock()
    result_mock.status_code = 401
    put_mock = mocker.patch('requests.put', return_value=result_mock)
    logger_mock = mocker.patch.object(reloader, "logger")

    reloader._write_image_to_http(
        "http://user:pass@stub-host/stub-path/", "stub_name", "stub_dirname", "ext", b"stub_content")
    logger_mock.error.assert_called()


class TestGroupsReloaderLDAP(TestMtimeBasedLazyFileReloader):
    _ldap_uri = "ldap://ucs:7369"
    _ldap_base = "dc=base,dc=com"
    _bind_dn = "cn=ucs,cn=computers"
    _password_file = "path/to/password/file.secret"

    @pytest.fixture()
    def mocked_portal_reloader(self, dynamic_class, patch_object_module):
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
