#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# Copyright 2019-2022 Univention GmbH
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

from __future__ import absolute_import, annotations

import os
import subprocess
from typing import Dict, List

import univention.debug as ud

import listener

name = 'portal_server'
description = 'Tell portal server to refresh when something important changed'
filter = '(|(univentionObjectType=portals/portal)(univentionObjectType=portals/category)(univentionObjectType=portals/entry)(univentionObjectType=portals/folder)(univentionObjectType=portals/announcement))'


def handler(dn: str, new: Dict[str, List[bytes]], old: Dict[str, List[bytes]]) -> None:
    listener.setuid(0)
    try:
        if not new:
            attrs = old
        else:
            attrs = new
        object_type = attrs.get('univentionObjectType', [])
        if object_type:
            module = object_type[0].decode('utf-8').split('/')[-1]
        else:
            module = 'unknown'
        reason = f'ldap:{module}:{dn}'
        ud.debug(ud.LISTENER, ud.PROCESS, "Updating portal. Reason: %s" % reason)
        subprocess.call(
            _get_portal_call(reason),
            # TODO: Find out why pipe is required here. Without it I can see
            # the output of the subprocess in the listener logs.
            # stdout=subprocess.PIPE
        )
    finally:
        listener.unsetuid()


def _get_portal_call(reason):
    call_args = ['/usr/sbin/univention-portal']
    if os.environ.get("PORTAL_LISTENER_LOG_STREAM") == "true":
        call_args.append("--log-stream")
    call_args.extend(['update', '--reason', reason])
    return call_args
