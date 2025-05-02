# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import logging
from pathlib import Path

from univention.portal import config
from univention.portal.udm import AsyncUdmClient
from univention.portal.user import User


logger = logging.getLogger(__name__)


# TODO: we need to have the url for the auth engine
url_auth_eng = "https://portal.jtorres-nubus.univention.dev/guardian/authorization/permissions"
headers = {
    "Authorization": "Bearer TOKEN",
    "Content-Type": "application/json",
}
check_cap_body = {
    "namespaces": [
        {
            "app_name": "univention-portal",
            "name": "portal",
        },
    ],
    "actor": {
        "id": "",
        "roles": [],
        "attributes": {},
    },
    "targets": [],
    "include_general_permissions": True,
    "extra_request_data": {},
}


class GuardianHelper:
    """Minimal utility to communicate with Guardian."""

    def __init__(self):
        self._udm_client = AsyncUdmClient(
            udm_api_url=config.fetch('udm_api_url'),
            username=config.fetch('udm_api_username'),
            password=Path(config.fetch("udm_api_password_file")).read_text().strip(),
        )

    async def guardian_allow(self, user: User, entry_name: str):

        udm_user = {}
        if user.is_logged_in():
            logger.debug("User is logged in, fetching user details from UDM Rest API.")
            udm_user_data = await self._udm_client.get_user(user.username)
            udm_user.update(udm_user_data)
        else:
            logger.debug("Anonymous user, no roles for guardian.")
            return False

        user_roles = []
        # TODO: what about guardianInheritedRoles ????
        if udm_user["properties"]["guardianRoles"]:
            # TODO: Filter only portal roles or send all roles?
            # Currently sending all roles.
            for role in udm_user_data["properties"]["guardianRoles"]:
                role_split = role.split(':')
                user_roles.append({"app_name": role_split[0], "namespace_name": role_split[1], "name": role_split[2]})
        # else:
        #     return False

        # REQUEST TO GUARDIAN
        # FIXME: we need to configure the guardian connection, keycloak token, KC client for the portal, ETC

        # Get token from kc, HOW ??
        # token_response = requests.post(kcURL, etc)
        #
        # req_headers = _create_headers(token_response["access_token"])
        # body = _create_body(udm_user["properties"]["username"], user_roles)
        #
        # response = requests.post(url_auth_eng, headers=req_headers, json=body)
        # permissions = response["general_permissions"]

        permissions = [{"app_name": "univention-portal", "namespace_name": "portal", "name": "view-keycloak-tile"}]

        # TODO: Tile per tile support, can be use as generic `view-tile` capability
        return _check_capabilities(permissions_list=permissions, capability=f'view-{entry_name}-tile')


def _check_capabilities(permissions_list, capability):
    return any(permission["name"] == capability for permission in permissions_list)


def _create_body(username, roles):
    body = {}
    body.update(check_cap_body)
    body["actor"]["id"] = username
    body["actor"]["roles"] = roles
    return body


def _create_headers(token):
    req_headers = {}
    req_headers.update(headers)
    req_headers["Authorization"] = "Bearer " + token
    return req_headers


class UnexpectedResult(Exception):
    pass
