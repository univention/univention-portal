# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import tornado.web

from univention.portal.handlers.portal_resource import PortalResource
from univention.portal.log import get_logger


logger = get_logger("handlers.api_me")


class ApiMeHandler(PortalResource):
    """
    API endpoint to return details about the "current" user.

    The data is retrieved from the UDM Rest API and then returned to the
    frontend so that all details about the current user are accessible.
    """

    async def get(self, portal_name):

        portal = self.find_portal()
        if not portal:
            raise tornado.web.HTTPError(404)

        answer = {}
        user = await portal.get_user(self)

        if user.is_logged_in():
            raise NotImplementedError

        self.write(answer)
