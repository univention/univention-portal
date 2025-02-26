# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import tornado.web

from univention.portal.handlers.portal_resource import PortalResource
from univention.portal.log import get_logger
from univention.portal.udm import AsyncUdmClient


logger = get_logger("handlers.api_me")


class ApiMeHandler(PortalResource):
    """
    API endpoint to return details about the "current" user.

    The data is retrieved from the UDM Rest API and then returned to the
    frontend so that all details about the current user are accessible.
    """

    def initialize(self, portals, udm_client: AsyncUdmClient):
        super().initialize(portals)
        self.udm_client = udm_client

    async def get(self, portal_name):

        portal = self.find_portal()
        if not portal:
            raise tornado.web.HTTPError(404)

        answer = {}
        user = await portal.get_user(self)

        if user.is_logged_in():
            udm_user_data = await self.udm_client.get_user(user.username)
            answer.update(_map_from_udm_model(udm_user_data))

        self.write(answer)


def _map_from_udm_model(udm_user_data):
    result = {
        "dn": udm_user_data["dn"],
        "id": udm_user_data["id"],
        "uuid": udm_user_data["uuid"],
        "user": udm_user_data["properties"],
    }
    return result
