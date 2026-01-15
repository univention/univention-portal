#!/usr/bin/env python3
#
# NATS KV Asset Loader
#
# Syncs assets from a NATS KV bucket to a local directory.
# Designed to run as a sidecar container alongside nginx.
#
# SPDX-FileCopyrightText: 2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import asyncio
import logging
import os
import tempfile
from contextlib import asynccontextmanager
from pathlib import Path
from typing import NamedTuple

import nats
from nats.js.api import KeyValueConfig


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


class Config(NamedTuple):
    nats_server: str
    nats_kv_bucket: str
    nats_user: str
    nats_password: str
    output_dir: Path


def load_config() -> Config:
    return Config(
        nats_server=os.environ["NATS_SERVER"],
        nats_kv_bucket=os.environ["NATS_KV_BUCKET"],
        nats_user=os.environ["NATS_USER"],
        nats_password=os.environ["NATS_PASSWORD"],
        output_dir=Path(os.environ["OUTPUT_DIR"]),
    )


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


async def delete_asset(output_dir: Path, key: str):
    """Delete an asset from the output directory."""
    file_path = output_dir / key
    try:
        file_path.unlink(missing_ok=True)
        logger.debug("Deleted %s", key)
    except Exception as e:
        logger.error("Failed to delete %s: %s", key, e)


async def handle_entry(entry, output_dir: Path):
    """Handle a KV entry update."""
    if entry is None:
        return

    if entry.operation in ("DEL", "PURGE"):
        logger.info("DELETE %s", entry.key)
        await delete_asset(output_dir, entry.key)
    elif entry.value:
        logger.info("PUT %s (revision %d)", entry.key, entry.revision)
        write_asset(output_dir, entry.key, entry.value)


async def initial_sync(kv, output_dir: Path):
    """Sync all keys from the bucket to the output directory."""
    logger.info("Starting initial sync to %s", output_dir)

    keys = await kv.keys()
    logger.info("Found %d keys in bucket", len(keys))

    for key in keys:
        try:
            entry = await kv.get(key)
            await handle_entry(entry, output_dir)
        except Exception as e:
            logger.error("Failed to sync key %s: %s", key, e)

    logger.info("Initial sync complete")


async def watch(kv, output_dir: Path):
    """Watch for changes and update local files."""
    logger.info("Starting watch on bucket")

    watcher = await kv.watchall()

    try:
        while True:
            entry = await watcher.updates(timeout=None)
            await handle_entry(entry, output_dir)
    finally:
        await watcher.stop()


@asynccontextmanager
async def connect_nats(config: Config):
    """Connect to NATS and yield KV bucket, closing connection on exit."""
    logger.info("Connecting to NATS at %s", config.nats_server)

    connect_opts = {"servers": [config.nats_server]}
    if config.nats_user:
        connect_opts["user"] = config.nats_user
        connect_opts["password"] = config.nats_password

    nc = await nats.connect(**connect_opts)
    js = nc.jetstream()

    try:
        kv = await js.key_value(bucket=config.nats_kv_bucket)
        logger.info("Connected to existing bucket: %s", config.nats_kv_bucket)
    except Exception:
        kv = await js.create_key_value(config=KeyValueConfig(bucket=config.nats_kv_bucket))
        logger.info("Created new bucket: %s", config.nats_kv_bucket)

    try:
        yield kv
    finally:
        await nc.close()
        logger.info("Disconnected from NATS")


async def main():
    config = load_config()
    config.output_dir.mkdir(parents=True, exist_ok=True)

    async with connect_nats(config) as kv:
        await initial_sync(kv, config.output_dir)
        await watch(kv, config.output_dir)


if __name__ == "__main__":
    asyncio.run(main())
