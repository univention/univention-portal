import logging
import os
import subprocess
from univention.portal.util import get_portal_update_call
from client import AsyncClient, MessageHandler, Settings
from shared.models import Message
from aiohttp import ClientResponseError


class PortalConsumer:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.provisioning_admin_username = os.environ.get("PROVISIONING_ADMIN_USERNAME")
        self.provisioning_admin_password = os.environ.get("PROVISIONING_ADMIN_PASSWORD")
        self.provisioning_api_username = os.environ.get("PROVISIONING_API_USERNAME")
        self.provisioning_api_password = os.environ.get("PROVISIONING_API_PASSWORD")
        self.provisioning_api_base_url = os.environ.get("PROVISIONING_API_BASE_URL")
        self.provisioning_realm_topic = [
            ["udm", "groups/group"],
            ["udm", "portals/portal"],
            ["udm", "portals/category"],
            ["udm", "portals/entry"],
            ["udm", "portals/folder"],
            ["udm", "portals/announcement"],
        ]

    async def start_listening_for_changes(self) -> None:
        self.logger.info("Creating a consumer to listen for changes")
        admin_settings = Settings(
            provisioning_api_username=self.provisioning_admin_username,
            provisioning_api_password=self.provisioning_admin_password,
            provisioning_api_base_url=self.provisioning_api_base_url,
        )
        settings = Settings(
            provisioning_api_username=self.provisioning_api_username,
            provisioning_api_password=self.provisioning_api_password,
            provisioning_api_base_url=self.provisioning_api_base_url,
        )
        async with AsyncClient(admin_settings) as admin_client:
            try:
                await admin_client.create_subscription(
                    settings.provisioning_api_username,
                    settings.provisioning_api_password,
                    [self.provisioning_realm_topic],
                    False,
                )
                self.logger.info("A consumer was created")
            except ClientResponseError as e:
                self.logger.info("%s, Consumer already exists", e)

        self.logger.info("Listening for changes in the portal and groups")
        async with AsyncClient(settings) as client:
            await MessageHandler(
                client, settings.provisioning_api_username, [self.handle_message]
            ).run()

    @staticmethod
    async def handle_message(message: Message):
        topic = message.topic
        if topic == "groups/group":
            reason = "ldap:group"
        else:
            obj = message.body.get("new") or message.body.get("old")
            dn = obj.get("dn")
            reason = f'ldap:{topic}:{dn}'

        subprocess.call(get_portal_update_call(reason=reason))
