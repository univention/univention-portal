# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json


class PortalContentFetcherBase:

    def fetch(self):
        result = self._fetch()
        return json.dumps(result, sort_keys=True, indent=4)

    def _validate_assets_base_url(self, url: str) -> str:
        if url and not url.endswith("/"):
            url += "/"
        return url
