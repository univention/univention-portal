#!/usr/bin/python3
#
# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2020-2025 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
#

import asyncio
import threading

import nats
from nats.js.kv import KeyValue


class NatsKVClient:
    """Synchronous wrapper for NATS KV operations."""

    def __init__(
        self,
        nats_server: str = "nats://localhost:4222",
        bucket: str = "default",
        user: str = "",
        password: str = "",
        connect_timeout: float = 10.0,
    ):
        self._nc: nats.NATS | None = None
        self._kv: KeyValue | None = None
        self._closed = False

        # Start background thread with event loop
        self._loop = asyncio.new_event_loop()
        self._thread = threading.Thread(target=self._run_loop, daemon=True)
        self._thread.start()

        # Connect synchronously (blocks until connected)
        self._run_async(self._connect(nats_server, bucket, user, password), connect_timeout)

    def _run_loop(self):
        """Run the event loop in the background thread."""
        asyncio.set_event_loop(self._loop)
        self._loop.run_forever()

    def _run_async(self, coro, timeout: float):
        """Run a coroutine on the background loop and wait for the result."""
        future = asyncio.run_coroutine_threadsafe(coro, self._loop)
        return future.result(timeout=timeout)

    async def _connect(self, nats_server: str, bucket: str, user: str, password: str):
        """Async connect to NATS and set up JetStream KV."""
        self._nc = await nats.connect(servers=[nats_server], user=user, password=password)
        js = self._nc.jetstream()

        # Try to get existing bucket, create if not exists
        try:
            self._kv = await js.key_value(bucket=bucket)
        except Exception:
            self._kv = await js.create_key_value(bucket=bucket)

    def put(self, key: str, value: bytes, timeout: float = 5.0) -> int:
        if self._closed:
            raise RuntimeError("Client is closed")
        return self._run_async(self._kv.put(key, value), timeout)

    def get(self, key: str, timeout: float = 5.0) -> bytes | None:
        if self._closed:
            raise RuntimeError("Client is closed")
        return self._run_async(self._get_value(key), timeout)

    async def _get_value(self, key: str) -> bytes | None:
        try:
            entry = await self._kv.get(key)
            return entry.value if entry else None
        except Exception:
            return None

    def delete(self, key: str, timeout: float = 5.0) -> None:
        if self._closed:
            raise RuntimeError("Client is closed")
        self._run_async(self._kv.delete(key), timeout)

    def close(self, timeout: float = 5.0):
        """Close the NATS connection and stop the background loop."""
        if self._closed:
            return

        self._closed = True

        if self._nc:
            try:
                self._run_async(self._nc.close(), timeout)
            except Exception:
                pass

        self._loop.call_soon_threadsafe(self._loop.stop)
        self._thread.join(timeout=timeout)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.close()


def get_nats_kv_client(
    nats_server: str = "nats://localhost:4222",
    bucket: str = "default",
    user: str = "",
    password: str = "",
    connect_timeout: float = 10.0,
) -> NatsKVClient:
    """Factory function for NatsKVClient."""
    return NatsKVClient(
        nats_server=nats_server,
        bucket=bucket,
        user=user,
        password=password,
        connect_timeout=connect_timeout,
    )
