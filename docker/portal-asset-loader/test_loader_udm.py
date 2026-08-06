# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only

from pathlib import Path
from unittest import mock

import loader_udm
import requests


UDM_API_URL = "https://example.com/univention/udm"


def make_config(**overrides) -> loader_udm.Config:
    defaults = {
        "udm_api_url": UDM_API_URL,
        "udm_api_username": "user",
        "udm_api_password": "secret",
        "output_dir": Path("/tmp/assets"),
        "poll_interval": 10,
        "request_timeout": 120,
        "initial_sync_max_backoff": 60,
        "log_level": "INFO",
        "health_check_port": 8080,
    }
    defaults.update(overrides)
    return loader_udm.Config(**defaults)


def test_list_objects_passes_timeout():
    """The configured request timeout is forwarded to the HTTP call."""
    session = mock.Mock()
    resp = mock.Mock(status_code=200)
    resp.headers = {"ETag": "etag"}
    resp.json.return_value = {"_embedded": {"udm:object": []}}
    session.get.return_value = resp

    loader_udm.list_objects(session, f"{UDM_API_URL}/portals/portal/", [], 240)

    assert session.get.call_args.kwargs["timeout"] == 240


def test_initial_sync_retries_until_success():
    """The initial sync retries with backoff and returns once a sync succeeds."""
    config = make_config()
    session = mock.Mock()

    with mock.patch.object(loader_udm, "sync_portals") as sync_portals, \
            mock.patch.object(loader_udm, "sync_entries", return_value="entry-etag"), \
            mock.patch.object(loader_udm.time, "sleep") as sleep:
        sync_portals.side_effect = [
            requests.exceptions.ReadTimeout(),
            requests.exceptions.ReadTimeout(),
            "portal-etag",
        ]

        portal_etag, entry_etag = loader_udm.initial_sync(session, config)

    assert (portal_etag, entry_etag) == ("portal-etag", "entry-etag")
    assert sync_portals.call_count == 3
    assert [c.args[0] for c in sleep.call_args_list] == [1, 2]
