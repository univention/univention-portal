#!/usr/bin/env python3
#
# UDM REST API Asset Loader
#
# Polls UDM REST API for changes (via ETag) and fetches portal assets.
# Designed to run as a sidecar container alongside nginx.
#
# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import logging
import os
import tempfile
import threading
import time
from binascii import a2b_base64
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from typing import NamedTuple
from urllib.parse import quote

import requests


logger = logging.getLogger(__name__)


class HealthCheckServer(HTTPServer):
    ready: bool = False


class HealthCheckHandler(BaseHTTPRequestHandler):
    server: HealthCheckServer

    def do_GET(self):
        if self.path != "/healthz":
            self.send_response(404)
        elif self.server.ready:
            self.send_response(200)
        else:
            self.send_response(503)
        self.end_headers()

    def log_message(self, *args):
        pass


def start_health_check_server(port: int) -> HealthCheckServer:
    server = HealthCheckServer(("", port), HealthCheckHandler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    logger.info("Health server listening on port %d", port)
    return server


def setup_logging(level: str):
    logging.basicConfig(
        level=getattr(logging, level.upper(), logging.INFO),
        format="%(asctime)s - %(levelname)s - %(message)s",
    )


def detect_image_type(data: bytes) -> str:
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'png'
    elif data.startswith(b'\xff\xd8\xff'):
        return 'jpeg'
    elif data.startswith(b'GIF87a') or data.startswith(b'GIF89a'):
        return 'gif'
    elif data.startswith(b'<svg') or b'<svg' in data[:100]:
        return 'svg'
    return 'svg'


class Config(NamedTuple):
    udm_api_url: str
    udm_api_username: str
    udm_api_password: str
    output_dir: Path
    poll_interval: int
    log_level: str
    health_check_port: int


def load_config() -> Config:
    return Config(
        udm_api_url=os.environ["UDM_API_URL"].rstrip("/"),
        udm_api_username=os.environ["UDM_API_USERNAME"],
        udm_api_password=os.environ["UDM_API_PASSWORD"],
        output_dir=Path(os.environ["OUTPUT_DIR"]),
        poll_interval=int(os.environ.get("POLL_INTERVAL", "10")),
        log_level=os.environ.get("LOG_LEVEL", "INFO"),
        health_check_port=int(os.environ.get("HEALTH_PORT", "8080")),
    )


def create_session(config: Config) -> requests.Session:
    session = requests.Session()
    session.auth = (config.udm_api_username, config.udm_api_password)
    session.headers.update({"Accept": "application/json"})
    return session


def write_asset(output_dir: Path, path_prefix: str, name: str, base64_data: str):
    binary_content = a2b_base64(base64_data)
    extension = detect_image_type(binary_content)
    safe_name = name.replace("/", "-")
    path = f"{path_prefix}/{quote(safe_name)}.{extension}"

    file_path = output_dir / path
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(dir=file_path.parent, delete=False) as f:
        f.write(binary_content)
        tmp_path = Path(f.name)

    tmp_path.chmod(0o644)
    tmp_path.rename(file_path)
    logger.info("Wrote asset: %s", path)


def list_objects(
    session: requests.Session,
    url: str,
    properties: list[str],
    etag: str | None = None,
) -> tuple[list[dict] | None, str | None]:
    headers = {"If-None-Match": etag} if etag else {}
    params = [("opened", "true")] + [("properties", p) for p in properties]
    resp = session.get(url, headers=headers, params=params, timeout=10)

    if resp.status_code == 304:
        return None, etag

    resp.raise_for_status()
    new_etag = resp.headers.get("ETag")
    objects = resp.json()["_embedded"]["udm:object"]

    return objects, new_etag


def sync_portals(
    session: requests.Session,
    config: Config,
    etag: str | None = None,
) -> str | None:
    url = f"{config.udm_api_url}/portals/portal/"
    objects, new_etag = list_objects(session, url, [], etag)

    if objects is None:
        logger.debug("Portals unchanged")
        return new_etag

    logger.info("Syncing %d portals", len(objects))
    for obj in objects:
        name = obj["properties"]["name"]
        if logo_data := obj["properties"].get("logo"):
            write_asset(config.output_dir, "icons/logos", name, logo_data)
        if bg_data := obj["properties"].get("background"):
            write_asset(config.output_dir, "icons/backgrounds", name, bg_data)

    return new_etag


def sync_entries(
    session: requests.Session,
    config: Config,
    etag: str | None = None,
) -> str | None:
    url = f"{config.udm_api_url}/portals/entry/"
    objects, new_etag = list_objects(session, url, ["name", "icon"], etag)

    if objects is None:
        logger.debug("Entries unchanged")
        return new_etag

    logger.info("Syncing %d entries", len(objects))
    for obj in objects:
        name = obj["properties"]["name"]
        if icon_data := obj["properties"].get("icon"):
            write_asset(config.output_dir, "icons/entries", name, icon_data)

    return new_etag


def main():
    config = load_config()
    setup_logging(config.log_level)
    config.output_dir.mkdir(parents=True, exist_ok=True)
    health_server = start_health_check_server(config.health_check_port)

    logger.info("Starting UDM REST API asset loader")
    logger.info("UDM API URL: %s", config.udm_api_url)
    logger.info("Output directory: %s", config.output_dir)
    logger.info("Poll interval: %d seconds", config.poll_interval)

    session = create_session(config)

    # Initial sync - fail fast on errors
    try:
        portal_etag = sync_portals(session, config)
        entry_etag = sync_entries(session, config)
        logger.info("Initial sync complete")
    except Exception:
        logger.exception("FATAL: Initial asset sync failed")
        raise

    health_server.ready = True

    # Polling loop
    logger.info("Polling for changes every %d seconds", config.poll_interval)
    while True:
        time.sleep(config.poll_interval)

        try:
            portal_etag = sync_portals(session, config, portal_etag)
            entry_etag = sync_entries(session, config, entry_etag)
            health_server.ready = True
        except KeyboardInterrupt:
            logger.info("Received interrupt, shutting down")
            break
        except Exception:
            logger.exception("Error during polling, will retry on next interval")
            health_server.ready = False


if __name__ == "__main__":
    main()
