# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024 Univention GmbH

import asyncio
import logging
import os
import subprocess

from group_membership_cache import GroupMembershipCache

from univention.portal.util import get_portal_update_call
from univention.provisioning.consumer import MessageHandler, ProvisioningConsumerClient
from univention.provisioning.models import Message


class PortalConsumer:
    def __init__(self):
        logging.basicConfig(level=os.getenv("LOG_LEVEL"))
        self.logger = logging.getLogger(__name__)
        self._group_cache = GroupMembershipCache()
        self._topics = (
            "groups/group",
            "portals/portal",
            "portals/category",
            "portals/entry",
            "portals/folder",
            "portals/announcement",
        )

    async def start_listening_for_changes(self) -> None:

        self.logger.info("Listening for changes in the portal and groups")
        async with ProvisioningConsumerClient() as client:
            await MessageHandler(
                client, [self.handle_message],
            ).run()

    async def handle_message(self, message: Message):
        topic = message.topic
        if topic not in self._topics:
            self.logger.warning("Detected a message with the wrong topic in the queue: %s", topic)
            return

        body = message.body
        self.logger.debug("Received the message with the body: %s", body)

        if topic == "groups/group":
            self._group_cache.update_cache(body)
            reason = "ldap:group"
        else:
            obj = body.get("new") or body.get("old")
            dn = obj.get("dn")
            module = topic.split('/')[-1]
            reason = f"ldap:{module}:{dn}"

        self.logger.info("Updating portal. Reason: %s", reason)
        subprocess.call(get_portal_update_call(reason=reason))


def run() -> None:
    consumer = PortalConsumer()
    asyncio.run(consumer.start_listening_for_changes())


if __name__ == "__main__":
    run()
