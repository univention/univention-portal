# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

import tornado.web


class TrailingSlashRedirectHandler(tornado.web.RequestHandler):
    """Redirects requests without trailing slash to the same URL with trailing slash."""

    def get(self, path):
        # Preserve query string if present
        query = self.request.query
        url = f"/{path}/"
        if query:
            url = f"{url}?{query}"
        self.redirect(url, permanent=True)
