#!/usr/bin/python3
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2021-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

import logging
import time
from typing import Any, Dict

from univention.ldap_cache.cache import get_cache
from univention.ldap_cache.frontend import _extract_id_from_dn


logger = logging.getLogger(__name__)


class GroupMembershipCache:
    def __init__(self):
        self._counter = 0
        self._filter = "(univentionObjectType=groups/group)"

    def _cleanup_cache_if_needed(self) -> None:
        self._counter += 1
        if self._counter % 1000 == 0:
            for _name, db in get_cache():
                db.cleanup()

    @staticmethod
    def _map_udm_into_ldap(obj: Dict[str, Any] | None) -> Dict[str, Any] | None:
        """Partial mapping of a UDM object into an LDAP object for the univention-group-membership-member cache."""
        if not obj:
            return None

        properties = obj.get("properties", {})
        users = properties.get("users", [])
        hosts = properties.get("hosts", [])
        nested_groups = properties.get("nestedGroup", [])

        ldap_obj = {
            "dn": obj["dn"],
            "uniqueMember": users + hosts + nested_groups,
            "memberUid": [_extract_id_from_dn(user_dn) for user_dn in users],
        }
        return ldap_obj

    def update_cache(self, new: Dict[str, Any], old: Dict[str, Any]) -> None:
        logger.info("Updating the group membership cache")
        t0 = time.perf_counter()

        new_obj = self._map_udm_into_ldap(new)
        old_obj = self._map_udm_into_ldap(old)

        if old_obj and new_obj:
            if new_obj.get("uniqueMember") == old_obj.get("uniqueMember"):
                logger.info("No need to update the cache")
                return
            self.modify(old_obj, new_obj)
        elif old_obj:
            self.remove(old_obj)
        else:
            self.create(new_obj)
        self._cleanup_cache_if_needed()
        logger.info("Updated group cache in %.1f ms.", (time.perf_counter() - t0) * 1000)

    def create(self, new: Dict[str, Any]) -> None:
        for shard in get_cache().get_shards_for_query(self._filter):
            shard.add_object((new["dn"], new))

    def modify(self, old: Dict[str, Any], new: Dict[str, Any]) -> None:
        for shard in get_cache().get_shards_for_query(self._filter):
            shard.rm_object((old["dn"], old))
            shard.add_object((new["dn"], new))

    def remove(self, old: Dict[str, Any]) -> None:
        for shard in get_cache().get_shards_for_query(self._filter):
            shard.rm_object((old["dn"], old))
