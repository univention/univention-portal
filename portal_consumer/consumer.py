# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2024 Univention GmbH

import asyncio
import logging
import os
import subprocess

from univention.portal.util import get_portal_update_call
from univention.provisioning.consumer import AsyncClient, MessageHandler, Settings
from univention.provisioning.models import Message


class PortalConsumer:
    def __init__(self):
        logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
        self.logger = logging.getLogger(__name__)

    async def start_listening_for_changes(self) -> None:
        settings = Settings()

        self.logger.info("Listening for changes in the portal and groups")
        async with AsyncClient() as client:
            await MessageHandler(
                client, settings.provisioning_api_username, [self.handle_message],
            ).run()

    async def handle_message(self, message: Message):
        topic = message.topic
        if topic == "groups/group":
            reason = "ldap:group"
        else:
            obj = message.body.get("new") or message.body.get("old")
            dn = obj.get("dn")
            reason = f"ldap:{topic}:{dn}"

        self.logger.info("Updating portal. Reason: %s", reason)
        subprocess.call(get_portal_update_call(reason=reason))


def run() -> None:
    consumer = PortalConsumer()
    asyncio.run(consumer.start_listening_for_changes())


if __name__ == "__main__":
    run()
