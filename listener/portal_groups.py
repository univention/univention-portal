#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2019-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only


import subprocess

from univention.listener import ListenerModuleConfiguration, ListenerModuleHandler
from univention.portal.util import get_portal_update_call


GROUP_CACHE = '/var/cache/univention-portal/groups.json'


class PortalGroups(ListenerModuleHandler):
    def post_run(self):
        with self.as_root():
            subprocess.call(get_portal_update_call(reason="ldap:group"))

    class Configuration(ListenerModuleConfiguration):
        description = 'Maintain groups cache for Univention Portal'
        ldap_filter = '(univentionObjectType=groups/group)'
