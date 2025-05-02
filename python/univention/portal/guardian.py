# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
from urllib.parse import urlencode, urljoin

from univention.portal import config
from univention.portal.user import User
from univention.portal.udm import AsyncUdmClient


class GuardianHelper:
    """Minimal utility to communicate with Guardian."""

    def __init__(self):
        self._udm_client = AsyncUdmClient(
            udm_api_url=config.fetch('udm_api_url'),
            username=config.fetch('udm_api_username'),
            password=Path(config.fetch("udm_api_password_file")).read_text().strip(),
        )

    async def guardian_allow(self, user: User, entry_name: str):

        if user.is_logged_in():
            logger.debug("User is logged in, fetching user details from UDM Rest API.")
            udm_user_data = await self._udm_client.get_user(user.username)
        else:
            logger.debug("Anonymous user, no roles for guardian.")
            return false

        # REQUEST TO GUARDIAN ???
        # udm_user_data["properties"]["guardianRoles"]
        # FIXME: we get permissions from guardian, this is a dirty hardcoded permissions
        permissions = [{"app_name":"univention-portal","namespace_name":"portal","name":"view-keycloak-tile"}]

        # TODO: Tile per tile support, can be use as generic `view-tile` capability
        return _check_capabilities(permissions_list=permissions, capability=f'view-{entry_name}-tile')

def _check_capabilities(permissions_list, capability):
    return any(permission["name"] == capability for permission in permissions_list)

class UnexpectedResult(Exception):
    pass
