# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

import importlib.util
import os
from copy import deepcopy
from datetime import datetime
from unittest.mock import MagicMock, patch

import pytest
from mock import AsyncMock

from univention.provisioning.consumer import MessageHandler, ProvisioningConsumerClient
from univention.provisioning.models import Message, PublisherName


ENV_DEFAULTS = {
    "PROVISIONING_API_USERNAME": "portal-consumer",
    "PROVISIONING_API_PASSWORD": "portalconsumerpassword",
    "PROVISIONING_API_BASE_URL": "localhost",
    "log_level": "DEBUG",
    "max_acknowledgement_retries": "3",
}


def set_test_env_vars():
    for var, default in ENV_DEFAULTS.items():
        if var.lower() in (key.lower() for key in os.environ):
            continue
        os.environ[var] = default
        print(f"{var} was not explicitly set, setting the following default: {default}")


set_test_env_vars()


class AsyncContextManagerMock(MagicMock):

    async def __aenter__(self):
        return self.aenter()

    async def __aexit__(self, *args):
        pass


def load_consumer(name):
    module_name = os.path.splitext(name)[0]
    spec = importlib.util.spec_from_file_location(module_name, os.path.join(CONSUMER_PATH, name))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


USERNAME = "testuser"
DN = "cn=users,dc=ldap,dc=domain,dc=com"
MESSAGE_GROUP = Message(
    publisher_name=PublisherName.udm_listener,
    ts=datetime(2023, 11, 9, 11, 15, 52, 616061),
    realm="udm",
    topic="groups/group",
    body={
        "new": {"dn": DN},
        "old": {},
    },
)

MESSAGE_PORTAL = deepcopy(MESSAGE_GROUP)
MESSAGE_PORTAL.topic = "portals/portal"
CONSUMER_PATH = "./portal_consumer"


@pytest.fixture()
def async_client():
    return patch("univention.provisioning.consumer.ProvisioningConsumerClient",
                 new_callable=AsyncContextManagerMock).start()


@pytest.fixture()
def message_handler():
    return patch("univention.provisioning.consumer.MessageHandler").start().return_value


@pytest.fixture()
def mock_subprocess_call():
    return patch("subprocess.call").start()


@pytest.fixture()
def mock_get_portal_update_call():
    return patch("univention.portal.util.get_portal_update_call").start()


@pytest.fixture()
def group_cache():
    return patch("group_membership_cache.GroupMembershipCache").start().return_value


@pytest.fixture()
def consumer(group_cache):
    consumer_file = load_consumer("consumer.py")
    return consumer_file.PortalConsumer()


@pytest.mark.asyncio()
class TestPortalConsumer:
    async def test_portal_call_update_with_groups_change(
            self,
            async_client: ProvisioningConsumerClient,
            message_handler: MessageHandler,
            mock_get_portal_update_call,
            mock_subprocess_call,
            consumer,
            group_cache,
    ):
        async def run():
            await consumer.handle_message(MESSAGE_GROUP)

        message_handler.run = AsyncMock(side_effect=run)

        await consumer.listen_for_changes()

        async_client.assert_called_once_with()
        message_handler.run.assert_called_once_with()
        mock_get_portal_update_call.assert_called_once_with(reason="ldap:group")
        mock_subprocess_call.assert_called_once_with(mock_get_portal_update_call())
        group_cache.update_cache.assert_called_once_with(MESSAGE_GROUP.body)

    async def test_portal_call_update_with_portal_change(
            self,
            async_client: ProvisioningConsumerClient,
            message_handler: MessageHandler,
            mock_get_portal_update_call,
            mock_subprocess_call,
            consumer,
    ):
        async def run():
            await consumer.handle_message(MESSAGE_PORTAL)

        message_handler.run = AsyncMock(side_effect=run)

        await consumer.listen_for_changes()

        async_client.assert_called_once_with()
        message_handler.run.assert_called_once_with()
        mock_get_portal_update_call.assert_called_once_with(reason=f"ldap:portal:{DN}")
        mock_subprocess_call.assert_called_once_with(mock_get_portal_update_call())
