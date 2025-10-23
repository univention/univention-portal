# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
from urllib.parse import urljoin

from tornado.httpclient import AsyncHTTPClient, HTTPClientError


class AsyncUdmClient:
    """Minimal utility to request a user from the UDM Rest API."""

    def __init__(self, udm_api_url: str, username: str, password: str):
        self._udm_api_url = _ensure_trailing_slash(udm_api_url)
        self._username = username
        self._password = password

    async def get_user(self, user_dn: str):
        if not user_dn:
            raise ValueError("The user dn cannot be empty.")
        udm_query = f"users/user/{user_dn}"
        try:
            data = await self._fetch_from_udm(udm_query)
        except HTTPClientError:
            raise UnexpectedResult("Fetching the user's data failed")
        return data

    async def _fetch_from_udm(self, udm_query: str):
        url = self._build_full_url(udm_query)
        http_client = AsyncHTTPClient()
        response = await http_client.fetch(
            url,
            auth_username=self._username,
            auth_password=self._password,
            headers={"accept": "application/json"},
        )
        data = json.loads(response.body)
        return data

    def _build_full_url(self, sub_path):
        url = urljoin(self._udm_api_url, sub_path)
        return url


def _ensure_trailing_slash(value: str):
    return value.rstrip("/") + "/"


class UnexpectedResult(Exception):
    pass
