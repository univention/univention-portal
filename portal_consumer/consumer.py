# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024 Univention GmbH

import asyncio
import logging
import subprocess
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
            await self.handle_first_message(client)
            await MessageHandler(client, [self.handle_message]).run()
        logger.info("Shutting down.")

    async def handle_message(self, message: ProvisioningMessage) -> None:
        realm = message.realm
        topic = message.topic
        if realm != "udm" or topic not in self.topics:
            logger.warning("Ignoring a message in the queue with the wrong topic: %r", topic)
            return

        body = message.body
        dn = body.new.get("dn") or body.old.get("dn")
        logger.info(
            "UDM %r object %r changed (sequence_number: %d, num_delivered: %d).",
            topic, dn, message.sequence_number, message.num_delivered,
        )
        logger.debug("Message body: %r", body)

        if topic == "groups/group":
            self._group_cache.update_cache(body.new, body.old)
            reason = "ldap:group"
        else:
            module = topic.split("/")[-1]
            reason = f"ldap:{module}:{dn}"

        logger.info("Updating portal. Reason: %r", reason)
        t0 = time.perf_counter()
        portal_update(names=[], reason=reason)
        logger.info("Updated portal in %.1f ms.", (time.perf_counter() - t0) * 1000)

    async def handle_first_message(self, client: ProvisioningConsumerClient) -> None:
        """
        Try getting the first message to ensure that the subscription is active.

        Load initial data to the group-membership cache.
        Force-update all portal artifacts managed by the portal-listener (resync)

        by doing the initial loading after ensuring that the subscription is active,
        a possible gap in LDAP updates is avoided and a race-condition is much less likely.
        """
        message = await client.get_subscription_message(client.settings.provisioning_api_username, timeout=1)
        logger.info("First provisioning message received. Loading initial data before processing it.")

        # Ensure that the group membership cache is filled
        subprocess.run(
            ["/usr/share/univention-group-membership-cache/univention-ldap-cache", "rebuild"],
            check=True,
            text=True,
        )
        logger.info("Finished loading initial data to the group membership cache")

        # Ensure that groups and portal data including assets are in the store
        portal_update(names=[], reason="force")
        logger.info("Finished updating all existing portal-consumer artifacts (resync) and starting to listen for new updates.")

        if message:
            await self.handle_message(message)


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
