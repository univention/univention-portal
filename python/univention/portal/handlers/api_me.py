# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import logging

import tornado.web

from univention.portal.handlers.portal_resource import PortalResource
from univention.portal.udm import AsyncUdmClient


logger = logging.getLogger(__name__)


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
            logger.error("Portal for current request not found.")
            raise tornado.web.HTTPError(404)

        answer = {}
        user = await portal.get_user(self)

        if user.is_logged_in():
            logger.debug("User is logged in, fetching user details from UDM Rest API.")
            udm_user_data = await self.udm_client.get_user(user.username)
            answer.update(_map_from_udm_model(udm_user_data))
        else:
            logger.debug("Anonymous user, returning an empty object.")

        self.write(answer)


def _map_from_udm_model(udm_user_data):
    result = {
        "dn": udm_user_data["dn"],
        "id": udm_user_data["id"],
        "uuid": udm_user_data["uuid"],
        "user": udm_user_data["properties"],
    }
    return result
