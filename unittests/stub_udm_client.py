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

import binascii
import copy
import enum


portal_properties = {
    "showUmc": True,
    "logo": binascii.b2a_base64(b'<svg id="stub_logo" />'),
    "background": binascii.b2a_base64(b'<svg id="stub_background" />'),
    "name": "stub_name",
    "displayName": "stub_displayName",
    "defaultLinkTarget": "stub_defaultLinkTarget",
    "ensureLogin": "stub_ensureLogin",
    "categories": ["cn=category,dc=test"],
    "cornerLinks": ["cn=entry-for-link-list,dc=test"],
    "menuLinks": ["cn=entry-for-link-list,dc=test"],
    "quickLinks": ["cn=entry-for-link-list,dc=test"],
    "userLinks": ["cn=entry-for-link-list,dc=test"],
    "centralNavigation": [],
}

category_properties = {
    "displayName": "stub_displayName",
    "entries": ["cn=folder,dc=test"],
}

folder_properties = {
    "displayName": "stub_displayName",
    "entries": ["stub_entry"],
}

entry_properties = {
    "displayName": "stub_displayName",
    "name": "stub_name",
    "icon": binascii.b2a_base64(b'<svg id="stub_logo" />'),
    "description": "stub_description",
    "keywords": "stub_keywords",
    "activated": "stub_activated",
    "anonymous": "stub_anonymous",
    "allowedGroups": "stub_allowedGroups",
    "guardianPermissionView": "stub_guardianPermissionView",
    "link": [["stub_locale", "stub_link"]],
    "linkTarget": "stub_linkTarget",
    "target": "stub_target",
    "backgroundColor": "stub_backgroundColor",
}

announcement_properties = {
    "allowedGroups": "stub_allowedGroups",
    "name": "stub_name",
    "message": "stub_message",
    "title": "stub_title",
    "visibleFrom": "stub_visibleFrom",
    "visibleUntil": "stub_visibleeUntil",
    "isSticky": "stub_isSticky",
    "needsConfirmation": "stub_needsConfirmation",
    "severity": "stub_severity",
}


class StubFlavor(enum.Enum):
    UDM_REST = "udmrest"
    UDM = "udm"


stub_flavor_registry = {
    "PortalContentFetcherUDMREST": StubFlavor.UDM_REST,
    "PortalContentFetcherUDM": StubFlavor.UDM,
}


class StubUDMClient:
    def __init__(self, data=None, flavor="PortalContentFetcherUDMREST"):
        self._flavor = stub_flavor_registry[flavor]
        if data:
            self._data = data
        else:
            self._init_default_data()

    def _init_default_data(self):
        self._data = {
            "portals/portal": StubUDMModule(
                "portals/portal",
                parent=self,
                objects=[StubUDMObject("cn=portal,dc=test", self, copy.deepcopy(portal_properties))],
            ),
            "portals/category": StubUDMModule(
                "portals/category",
                parent=self,
                objects=[StubUDMObject("cn=category,dc=test", self, copy.deepcopy(category_properties))],
            ),
            "portals/folder": StubUDMModule(
                "portals/folder",
                parent=self,
                objects=[StubUDMObject("cn=folder,dc=test", self, copy.deepcopy(folder_properties))],
            ),
            "portals/entry": StubUDMModule(
                "portals/entry",
                parent=self,
                objects=[
                    StubUDMObject("cn=entry,dc=test", self, copy.deepcopy(entry_properties)),
                    StubUDMObject("cn=entry-for-link-list,dc=test", self, copy.deepcopy(entry_properties)),
                ],
            ),
            "portals/announcement": StubUDMModule(
                "portals/announcement",
                parent=self,
                objects=[StubUDMObject("cn=announcement,dc=test", self, copy.deepcopy(announcement_properties))],
            ),
        }

    def get(self, name):
        return self._data[name]


class StubUDMModule:
    def __init__(self, name, parent: StubUDMClient, objects):
        self._stub_objects = {o.dn: o for o in objects}
        self._name = name
        self._parent = parent

    def get(self, dn):
        return self._stub_objects[dn]

    def search(self, opened=False):
        return list(self._stub_objects.values())

    def stub_add_object(self, stub_object):
        self._stub_objects[stub_object.dn] = stub_object


class StubUDMObject:
    def __init__(self, dn, parent: StubUDMClient, properties):
        self.dn = dn
        self._parent = parent
        self._properties = properties

    @property
    def properties(self):
        if self._parent._flavor != StubFlavor.UDM_REST:
            raise AttributeError("Attribute 'properties' only supported in flavor UDM_REST")
        return self._properties

    @property
    def props(self):
        if self._parent._flavor != StubFlavor.UDM:
            raise AttributeError("Attribute 'props' only supported in flavor UDM")
        return PropsAdapter(self._properties)

    @property
    def stub_properties(self):
        return self._properties


class PropsAdapter:
    """Emulates plain UDM client objects "props" attribute."""

    def __init__(self, original):
        self._original = original

    def __getattr__(self, attr):
        value = self._original[attr]
        # TODO: Workaround for the "link" attribute in PortalEntry returning
        # different structures in UDM and UDM Rest.
        if attr == "link":
            return [{"locale": _[0], "value": _[1]} for _ in self._original["link"]]
        if isinstance(value, bytes):
            return B64BytesAdapter(value)
        else:
            return value


class B64BytesAdapter:
    """Wraps a base64 encoded value so that it has a "raw" property."""

    def __init__(self, b64_value):
        self._value = binascii.a2b_base64(b64_value)

    @property
    def raw(self):
        return self._value
