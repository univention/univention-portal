# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2025 Univention GmbH

import json
import logging


logger = logging.getLogger(__name__)


class PortalContentFetcherBase:
    def fetch(self):
        result = self._fetch()
        return json.dumps(result, sort_keys=True, indent=4)

    def _validate_assets_base_url(self, url: str) -> str:
        if url and not url.endswith("/"):
            url += "/"
        return url

    def _fetch_edition_notice(self, udm) -> bool:
        """
        Determine if the Core Edition notice has to be shown in the portal.

        The notice is hidden only if UDM confirms a valid enterprise
        (subscription) license. Any other result, including errors and UDM
        versions that cannot answer the question, shows the notice. This is
        intentional: the notice must not be suppressible by configuration,
        missing permissions or an unreachable endpoint.
        """
        try:
            is_enterprise = self._is_enterprise(udm)
        except Exception:
            logger.exception("Could not determine the license status, showing the Core Edition notice.")
            return True
        logger.debug("License status: is_enterprise=%r", is_enterprise)
        return is_enterprise is not True

    def _is_enterprise(self, udm) -> bool:
        raise NotImplementedError()
