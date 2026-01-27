#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

from unittest import mock

import pytest
import tornado.web

from univention.portal.main import build_routes


class TestTrailingSlashRedirectHandler:
    @pytest.fixture
    def app(self) -> tornado.web.Application:
        return tornado.web.Application(build_routes({}, mock.Mock()))

    @pytest.mark.gen_test
    async def test_redirect_without_trailing_slash(self, http_client, base_url):
        """Test that /univention/portal redirects to /univention/portal/"""
        response = await http_client.fetch(
            f"{base_url}/univention/portal",
            follow_redirects=False,
            raise_error=False,
        )
        assert response.code == 301
        assert response.headers["Location"] == "/univention/portal/"

    @pytest.mark.gen_test
    async def test_redirect_preserves_query_string(self, http_client, base_url):
        """Test that query parameters are preserved in the redirect."""
        response = await http_client.fetch(
            f"{base_url}/univention/portal?foo=bar&baz=qux",
            follow_redirects=False,
            raise_error=False,
        )
        assert response.code == 301
        assert response.headers["Location"] == "/univention/portal/?foo=bar&baz=qux"

    @pytest.mark.gen_test
    async def test_redirect_single_path_segment(self, http_client, base_url):
        """Test redirect for a single path segment without trailing slash."""
        response = await http_client.fetch(
            f"{base_url}/selfservice",
            follow_redirects=False,
            raise_error=False,
        )
        assert response.code == 301
        assert response.headers["Location"] == "/selfservice/"

    @pytest.mark.gen_test
    async def test_no_redirect_with_trailing_slash(self, http_client, base_url):
        """Test that URLs with trailing slash are not redirected."""
        response = await http_client.fetch(
            f"{base_url}/univention/portal/",
            follow_redirects=False,
            raise_error=False,
        )
        # The index handler returns 200 (or the route exists)
        assert response.code != 301
