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

"""
Integration tests for NatsKVClient.

These tests require a running NATS server with JetStream enabled at localhost:4222.
Start one with: docker run -p 4222:4222 nats:latest -js
"""

import uuid

import pytest

from univention.portal.nats_client import NatsKVClient, get_nats_kv_client


NATS_SERVER = "nats://localhost:4222"


@pytest.fixture()
def unique_bucket():
    """Generate a unique bucket name for test isolation."""
    return f"test-{uuid.uuid4().hex[:8]}"


@pytest.fixture()
def client(unique_bucket):
    """Create a client with a unique bucket, cleanup after test."""
    client = NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket)
    yield client
    client.close()


class TestNatsKVClientConnection:
    """Tests for connection handling."""

    def test_connect_to_nats(self, unique_bucket):
        """Test that we can connect to NATS."""
        client = NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket)
        assert client._nc is not None
        assert client._nc.is_connected
        client.close()

    def test_context_manager(self, unique_bucket):
        """Test that context manager works."""
        with NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket) as client:
            assert client._nc.is_connected

    def test_factory_function(self, unique_bucket):
        """Test the factory function."""
        client = get_nats_kv_client(nats_server=NATS_SERVER, bucket=unique_bucket)
        assert client._nc.is_connected
        client.close()


class TestNatsKVClientOperations:
    """Tests for KV operations."""

    def test_put_and_get(self, client):
        """Test basic put and get."""
        key = "test-key"
        value = b"test-value"

        revision = client.put(key, value)
        assert revision >= 1

        result = client.get(key)
        assert result == value

    def test_put_overwrites(self, client):
        """Test that put overwrites existing values."""
        key = "overwrite-key"

        rev1 = client.put(key, b"value1")
        rev2 = client.put(key, b"value2")

        assert rev2 > rev1
        assert client.get(key) == b"value2"

    def test_get_nonexistent_key(self, client):
        """Test that getting a nonexistent key returns None."""
        result = client.get("nonexistent-key")
        assert result is None

    def test_delete(self, client):
        """Test delete operation."""
        key = "delete-key"
        client.put(key, b"to-be-deleted")

        assert client.get(key) == b"to-be-deleted"

        client.delete(key)

        # After delete, get should return None
        assert client.get(key) is None

    def test_binary_data(self, client):
        """Test storing binary data."""
        key = "binary-key"
        value = bytes(range(256))  # All byte values 0-255

        client.put(key, value)
        result = client.get(key)

        assert result == value

    def test_large_value(self, client):
        """Test storing a larger value."""
        key = "large-key"
        value = b"x" * 100_000  # 100KB

        client.put(key, value)
        result = client.get(key)

        assert result == value
        assert len(result) == 100_000

    def test_hierarchical_keys(self, client):
        """Test that hierarchical keys work."""
        keys_values = [
            ("portal/icons/app1.svg", b"<svg>app1</svg>"),
            ("portal/icons/app2.svg", b"<svg>app2</svg>"),
            ("portal/data/portal.json", b'{"name": "test"}'),
        ]

        for key, value in keys_values:
            client.put(key, value)

        for key, expected_value in keys_values:
            assert client.get(key) == expected_value


class TestNatsKVClientClosed:
    """Tests for closed client behavior."""

    def test_put_after_close_raises(self, unique_bucket):
        """Test that put raises after close."""
        client = NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket)
        client.close()

        with pytest.raises(RuntimeError, match="Client is closed"):
            client.put("key", b"value")

    def test_get_after_close_raises(self, unique_bucket):
        """Test that get raises after close."""
        client = NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket)
        client.close()

        with pytest.raises(RuntimeError, match="Client is closed"):
            client.get("key")

    def test_double_close_is_safe(self, unique_bucket):
        """Test that closing twice doesn't raise."""
        client = NatsKVClient(nats_server=NATS_SERVER, bucket=unique_bucket)
        client.close()
        client.close()  # Should not raise


class TestNatsKVClientMultipleOperations:
    """Tests for multiple sequential operations."""

    def test_many_puts(self, client):
        """Test many sequential put operations."""
        for i in range(100):
            client.put(f"key-{i}", f"value-{i}".encode())

        for i in range(100):
            assert client.get(f"key-{i}") == f"value-{i}".encode()

    def test_rapid_put_get(self, client):
        """Test rapid alternating put/get."""
        for i in range(50):
            key = f"rapid-{i}"
            value = f"value-{i}".encode()
            client.put(key, value)
            assert client.get(key) == value
