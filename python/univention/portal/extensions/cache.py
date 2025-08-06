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
import os
from abc import ABC, abstractmethod
from copy import deepcopy

from univention.portal import PluginWithAbcBase
from univention.portal.log import get_logger


class CacheAbc(ABC):
    """
    A cache implementation for the portal has to follow this protocol.

    The protocol is defined in this abstract base class because we have
    multiple cache implementations which do not share a common base class and a
    portal specific caching API which is depending on this protocol.
    """

    @abstractmethod
    def get(self):
        """Return the complete cache content."""

    @abstractmethod
    def get_id(self) -> str:
        """
        Return an ID for the state of the cache content.

        The ID has to change on every update so that an updated state can be
        distinguished from an old state based on this value.
        """

    @abstractmethod
    def refresh(self, reason=None):
        """
        Refreshes the cache.

        Gets a "reason" to decide if this is really needed. The value "force"
        should be handled as if it is really needed.
        """


class Cache(CacheAbc, metaclass=PluginWithAbcBase):
    """
    Base class for file based caching.

    Constructor parameters:

    cache_file:
            Filename where the content is stored
    reloader:
            Class that handles the actual refresh
    """

    def __init__(self, cache_file, reloader=None):
        self._cache_file = cache_file
        self._reloader = reloader
        self._cache = {}
        self._loaded = False

    def get_id(self):
        try:
            stat = os.stat(self._cache_file)
            return str(stat.st_mtime)
        except (EnvironmentError):
            return ""

    def _load(self):
        get_logger("cache").info(f"loading cache file {self._cache_file}")
        try:
            with open(self._cache_file) as fd:
                self._cache = json.load(fd)
        except (EnvironmentError, ValueError):
            get_logger("cache").exception(f"Error loading {self._cache_file}")
        else:
            self._loaded = True

    def get(self):
        if not self._loaded or self.refresh():
            self._load()
        return self._cache

    def refresh(self, reason=None):
        if self._reloader:
            return self._reloader.refresh(reason=reason, content=self._cache)


class PortalCacheMixin:
    """
    API provided by the Portal cache implementations.

    It depends on the API of `CacheAbc` to be implemented in the target class.
    """

    def get_entries(self):
        return deepcopy(self.get()["entries"])

    def get_folders(self):
        return deepcopy(self.get()["folders"])

    def get_portal(self):
        return deepcopy(self.get()["portal"])

    def get_categories(self):
        return deepcopy(self.get()["categories"])

    def get_corner_links(self):
        return deepcopy(self.get()["corner_links"])

    def get_menu_links(self):
        return deepcopy(self.get()["menu_links"])

    def get_quick_links(self):
        return deepcopy(self.get()["quick_links"])

    def get_central_navigation(self):
        return deepcopy(self.get().get("central_navigation"))

    def get_user_links(self):
        return deepcopy(self.get()["user_links"])

    def get_announcements(self):
        announcements = {}
        if "announcements" in self.get().keys():
            announcements = deepcopy(self.get()["announcements"])
        return announcements

    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        assert issubclass(cls, CacheAbc), "This mixin depends on CacheAbc to be implemented."


class PortalFileCache(PortalCacheMixin, Cache):
    """
    Specialized cache for portal data. The implementation does not differ
    from that of a base cache, but it provides more specialized cache
    access methods that it needs in order to work with the Portal class.
    """


class GroupFileCache(Cache):
    """
    Caching class for groups.
    In fact it is just the same as the normal Cache and just here in case
    we want to get smarter at some point.
    """
