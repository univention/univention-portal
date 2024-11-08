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

import pytest


def test_imports(dynamic_class):
    assert dynamic_class("Reloader")
    assert dynamic_class("MtimeBasedLazyFileReloader")
    assert dynamic_class("PortalReloaderUDM")
    assert dynamic_class("GroupsReloaderLDAP")


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
    def mocked_portal_reloader(self, dynamic_class, patch_object_module, mocker):
        Reloader = dynamic_class("PortalReloaderUDM")
        self.patch_reloader_modules(Reloader, patch_object_module)
        reloader = Reloader(self._portal_dn, self._cache_file)
        reloader.udm_udm = mocker.Mock()
        reloader.udm_modules = mocker.Mock()
        return reloader

    def generate_mocked_portal(self, mocker):
        # ToDo Generate sample portal object for reloader
        return mocker.Mock()

    def test_default_init(self, mocked_portal_reloader):
        self._os.stat.assert_called_once()
        assert mocked_portal_reloader._cache_file == self._cache_file
        assert mocked_portal_reloader._mtime == self._mtime
        assert mocked_portal_reloader._portal_dn == self._portal_dn

    @pytest.mark.xfail()
    def test_refresh(self, mocked_portal_reloader, mocker):
        mocked_udm = mocked_portal_reloader.udm_udm.UDM.machine.return_value.version.return_value
        mocked_udm.get.return_value.get.return_value = self.generate_mocked_portal(mocker)
        refreshed = mocked_portal_reloader.refresh(reason=self._reason)
        mocked_udm.get.return_value.get.assert_called_once_with(self._portal_dn)
        assert not refreshed


def test_write_image_writes_image_to_file(mocker, mock_portal_config):
    from univention.portal.extensions.reloader import PortalReloaderUDM

    mocker.patch.object(PortalReloaderUDM, "_get_mtime", return_value=2.2)
    write_mock = mocker.patch.object(PortalReloaderUDM, "_write_image_to_file")
    mock_portal_config({"assets_root": "/stub_root"})

    reloader = PortalReloaderUDM("portal_dn_stub", "cache_file_stub")
    reloader._write_image(b"<svg />", "stub_name", "stub_dirname")
    write_mock.assert_called_once()


def test_write_image_returns_relative_image_url(mocker, mock_portal_config):
    from univention.portal.extensions.reloader import PortalReloaderUDM

    mocker.patch.object(PortalReloaderUDM, "_get_mtime", return_value=2.2)
    mocker.patch('pathlib.Path.write_bytes')
    mock_portal_config({"assets_root": "/stub_root"})

    reloader = PortalReloaderUDM("portal_dn_stub", "cache_file_stub")
    image_url = reloader._write_image(b"<svg />", "stub_name", "stub_dirname")
    assert image_url == "./icons/stub_dirname/stub_name.svg"


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
