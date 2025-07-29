#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2019-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

from __future__ import annotations

import subprocess
from typing import Dict, List

import listener
import univention.debug as ud
from univention.portal.util import get_portal_update_call


description = 'Tell portal server to refresh when something important changed'
filter = '(|(univentionObjectType=portals/portal)(univentionObjectType=portals/category)(univentionObjectType=portals/entry)(univentionObjectType=portals/folder)(univentionObjectType=portals/announcement))'


def handler(dn: str, new: Dict[str, List[bytes]], old: Dict[str, List[bytes]]) -> None:
    listener.setuid(0)
    try:
        attrs = new if new else old
        object_type = attrs.get('univentionObjectType', [])
        if object_type:
            module = object_type[0].decode('utf-8').split('/')[-1]
        else:
            module = 'unknown'
        reason = f'ldap:{module}:{dn}'
        ud.debug(ud.LISTENER, ud.PROCESS, "Updating portal. Reason: %s" % reason)
        subprocess.call(get_portal_update_call(reason))
    finally:
        listener.unsetuid()
