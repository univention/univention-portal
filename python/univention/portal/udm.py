# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
from urllib.parse import urlencode, urljoin

from tornado.httpclient import AsyncHTTPClient


class AsyncUdmClient:
    """Minimal utility to request a user from the UDM Rest API."""

    def __init__(self, udm_api_url: str, username: str, password: str):
        self._udm_api_url = udm_api_url
        self._username = username
        self._password = password

    async def get_user(self, username: str):
        # TODO: utility to construct search URL
        # TODO: Be strict about the username requirements, e.g. not None, length > 0
        query_string = urlencode({"filter": f"(username={username})"})
        udm_query = f"users/user/?{query_string}"
        data = await self._fetch_from_udm(udm_query)
        if data["results"] != 1:
            raise RuntimeError("Fetching the user's data failed")
        user_data = data["_embedded"]["udm:object"][0]
        return user_data

    async def _fetch_from_udm(self, udm_query: str):
        url = urljoin(self._udm_api_url, udm_query)
        http_client = AsyncHTTPClient()
        response = await http_client.fetch(
            url,
            auth_username=self._username,
            auth_password=self._password,
            headers={"accept": "application/json"},
        )
        data = json.loads(response.body)
        return data
