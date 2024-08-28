# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024 Univention GmbH

import asyncio
import logging
import sys
import time
from importlib.metadata import version

from univention.portal.cli import silence_click, update as portal_update
from univention.provisioning.consumer import (
    MessageHandler,
    ProvisioningConsumerClient,
    ProvisioningConsumerClientSettings,
)
from univention.provisioning.models import ProvisioningMessage

from .group_membership_cache import GroupMembershipCache


LOG_FORMAT = "%(asctime)s %(levelname)-5s [%(module)s.%(funcName)s:%(lineno)d] %(message)s"

logger = logging.getLogger(__name__)


class PortalConsumer:
    topics = {
        "groups/group",
        "portals/announcement",
        "portals/category",
        "portals/entry",
        "portals/folder",
        "portals/portal",
    }

    def __init__(self):
        self._group_cache = GroupMembershipCache()

    async def listen_for_changes(self) -> None:
        logger.info("Listening for changes in topics: %r", self.topics)
        async with ProvisioningConsumerClient() as client:
            await MessageHandler(client, [self.handle_message]).run()
        logger.info("Shutting down.")

    async def handle_message(self, message: ProvisioningMessage):
        topic = message.topic
        if topic not in self.topics:
            logger.warning("Ignoring a message in the queue with the wrong topic: %r", topic)
            return

        body = message.body
        logger.info(
            "Received message with topic: %s, sequence_number: %d, num_delivered: %d",
            topic, message.sequence_number, message.num_delivered,
        )
        logger.debug("Message body: %r", body)

        if topic == "groups/group":
            self._group_cache.update_cache(body.new, body.old)
            reason = "ldap:group"
        else:
            obj = body.new or body.old
            dn = obj.get("dn")
            module = topic.split("/")[-1]
            reason = f"ldap:{module}:{dn}"

        logger.info("Updating portal. Reason: %r", reason)
        t0 = time.perf_counter()
        portal_update(names=[], reason=reason)
        logger.info("Updated portal in %.1f ms.", (time.perf_counter() - t0) * 1000)


if __name__ == "__main__":
    settings = ProvisioningConsumerClientSettings()
    logging.basicConfig(format=LOG_FORMAT, level=settings.log_level, stream=sys.stdout)
    logger.info(
        "Using 'nubus-provisioning-consumer' library version %r.",
        version("nubus-provisioning-consumer"),
    )
    silence_click()
    consumer = PortalConsumer()
    asyncio.run(consumer.listen_for_changes())
