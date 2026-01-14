#!/usr/bin/env python3
#
# LDAP Asset Loader
#
# Polls LDAP for changes (via entryCSN) and fetches portal assets via UDM REST API.
# Designed to run as a sidecar container alongside nginx.
#
# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import logging
import os
import tempfile
import time
from binascii import a2b_base64
from pathlib import Path
from typing import NamedTuple
from urllib.parse import quote

import ldap3

import univention.admin.rest.client as udm_client


def detect_image_type(data: bytes) -> str:
    """
    Detect image type from binary data.
    Replacement for deprecated imghdr module.
    """
    # Check common image signatures
    if data.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'png'
    elif data.startswith(b'\xff\xd8\xff'):
        return 'jpeg'
    elif data.startswith(b'GIF87a') or data.startswith(b'GIF89a'):
        return 'gif'
    elif data.startswith(b'<svg') or b'<svg' in data[:100]:
        return 'svg'
    # Default to svg for unknown types (most portal assets are SVG)
    return 'svg'


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class Config(NamedTuple):
    ldap_uri: str
    ldap_bind_dn: str
    ldap_bind_pw: str
    ldap_base_dn: str
    udm_api_url: str
    udm_api_user: str
    udm_api_password: str
    portal_dn: str
    output_dir: Path
    poll_interval: int


def load_config() -> Config:
    return Config(
        ldap_uri=os.environ["LDAP_URI"],
        ldap_bind_dn=os.environ["LDAP_BIND_DN"],
        ldap_bind_pw=os.environ["LDAP_BIND_PW"],
        ldap_base_dn=os.environ["LDAP_BASE_DN"],
        udm_api_url=os.environ["UDM_API_URL"],
        udm_api_user=os.environ["UDM_API_USER"],
        udm_api_password=os.environ["UDM_API_PASSWORD"],
        portal_dn=os.environ["PORTAL_DN"],
        output_dir=Path(os.environ["OUTPUT_DIR"]),
        poll_interval=int(os.environ.get("POLL_INTERVAL", "60")),
    )


def get_entry_csn(config: Config) -> str | None:
    """
    Poll LDAP for portal subtree entryCSN.
    Returns the maximum entryCSN value from all entries in the subtree, or None on error.

    Note: We must query the entire subtree because entryCSN only changes for the
    specific entry that was modified, not for parent containers.
    """
    try:
        server = ldap3.Server(config.ldap_uri)
        conn = ldap3.Connection(
            server,
            user=config.ldap_bind_dn,
            password=config.ldap_bind_pw,
            auto_bind=True,
        )

        # Search for all entryCSN values in the portal subtree
        conn.search(
            search_base=config.ldap_base_dn,
            search_filter="(objectClass=*)",
            search_scope=ldap3.SUBTREE,
            attributes=["entryCSN"],
        )

        if not conn.entries:
            return None

        # Extract all entryCSN values and find the maximum
        # entryCSN format: timestamp#counter#sid#mod (e.g., 20260114151327.857093Z#000000#001#000000)
        # Lexicographic sorting works because timestamp is first
        csn_values = []
        for entry in conn.entries:
            if hasattr(entry, 'entryCSN') and entry.entryCSN.value:
                csn_values.append(str(entry.entryCSN.value))

        if csn_values:
            return max(csn_values)
        return None
    except Exception as e:
        logger.error("Failed to query LDAP entryCSN: %s", e)
        return None


def fetch_assets_from_udm(config: Config) -> list[tuple[str, bytes]]:
    """
    Fetch portal assets via UDM REST API.
    Returns list of (path, content) tuples.
    Raises exception on authentication or connection errors.
    """
    assets = []

    # Connect to UDM - let authentication errors propagate
    udm = udm_client.UDM.http(
        config.udm_api_url,
        config.udm_api_user,
        config.udm_api_password,
    )

    # Fetch portal entries (icons)
    entry_module = udm.get("portals/entry")
    if entry_module:
        for entry in entry_module.search(opened=True):
            icon_data = entry.properties.get("icon")
            if icon_data:
                try:
                    binary_content = a2b_base64(icon_data)
                    extension = detect_image_type(binary_content) or "svg"
                    name = entry.properties["name"].replace("/", "-")
                    path = f"icons/entries/{quote(name)}.{quote(extension)}"
                    assets.append((path, binary_content))
                except Exception as e:
                    logger.warning("Failed to process icon for entry %s: %s", entry.dn, e)

    # Fetch portal logo and background
    portal_module = udm.get("portals/portal")
    if portal_module:
        try:
            portal = portal_module.get(config.portal_dn)
            portal_name = portal.properties["name"]

            # Logo
            logo_data = portal.properties.get("logo")
            if logo_data:
                try:
                    binary_content = a2b_base64(logo_data)
                    extension = detect_image_type(binary_content) or "svg"
                    path = f"icons/logos/{quote(portal_name)}.{quote(extension)}"
                    assets.append((path, binary_content))
                except Exception as e:
                    logger.warning("Failed to process portal logo: %s", e)

            # Background
            bg_data = portal.properties.get("background")
            if bg_data:
                try:
                    binary_content = a2b_base64(bg_data)
                    extension = detect_image_type(binary_content) or "svg"
                    path = f"icons/backgrounds/{quote(portal_name)}.{quote(extension)}"
                    assets.append((path, binary_content))
                except Exception as e:
                    logger.warning("Failed to process portal background: %s", e)

        except udm_client.NotFound:
            logger.warning("Portal %s not found", config.portal_dn)

    return assets


def write_asset(output_dir: Path, key: str, value: bytes):
    """Write an asset to the output directory atomically."""
    file_path = output_dir / key
    file_path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.NamedTemporaryFile(dir=file_path.parent, delete=False) as f:
        f.write(value)
        tmp_path = Path(f.name)

    tmp_path.chmod(0o644)
    tmp_path.rename(file_path)
    logger.debug("Wrote %s (%d bytes)", key, len(value))


def sync_assets(config: Config):
    """
    Fetch and write all assets to the output directory.
    Raises exception on authentication or connection errors.
    """
    logger.info("Fetching assets from UDM REST API")
    assets = fetch_assets_from_udm(config)

    if not assets:
        logger.warning("No assets fetched (portal may have no entries with icons)")

    for path, content in assets:
        write_asset(config.output_dir, path, content)
        logger.info("Wrote %s (%d bytes)", path, len(content))

    logger.info("Synced %d assets", len(assets))


def main():
    config = load_config()
    config.output_dir.mkdir(parents=True, exist_ok=True)

    logger.info("Starting LDAP asset loader")
    logger.info("LDAP URI: %s", config.ldap_uri)
    logger.info("LDAP Base DN: %s", config.ldap_base_dn)
    logger.info("UDM API URL: %s", config.udm_api_url)
    logger.info("Portal DN: %s", config.portal_dn)
    logger.info("Output directory: %s", config.output_dir)
    logger.info("Poll interval: %d seconds", config.poll_interval)

    # Initial sync - fail fast on errors
    try:
        sync_assets(config)
    except Exception:
        logger.exception("FATAL: Initial asset sync failed")
        raise SystemExit(1)

    # Mark as ready
    ready_file = config.output_dir / ".ready"
    ready_file.touch()
    logger.info("Initial sync complete, ready for polling")

    last_csn = get_entry_csn(config)

    # Polling loop
    while True:
        time.sleep(config.poll_interval)

        try:
            current_csn = get_entry_csn(config)

            if current_csn is None:
                logger.warning("Failed to query entryCSN, skipping sync")
                continue

            if current_csn != last_csn:
                logger.info("Change detected (entryCSN: %s), syncing assets", current_csn)
                sync_assets(config)
                last_csn = current_csn
            else:
                logger.debug("No changes detected (entryCSN: %s)", current_csn)

        except KeyboardInterrupt:
            logger.info("Received interrupt, shutting down")
            break
        except Exception:
            logger.exception("Error during polling, will retry on next interval")


if __name__ == "__main__":
    main()
