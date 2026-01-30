# Univention Portal
#
# Like what you see? Join us!
# https://www.univention.com/about-us/careers/vacancies/
#
# SPDX-FileCopyrightText: 2019-2026 Univention GmbH
# SPDX-License-Identifier: AGPL-3.0-only
import tornado.web

from univention.portal.extensions.cache_object_storage import PortalFileCacheObjectStorage
from univention.portal.handlers.portal_resource import PortalResource
from univention.portal.log import get_logger


class PortalEntriesHandler(PortalResource):
    async def get(self, portal_name):
        portal = self.find_portal()
        if not portal:
            raise tornado.web.HTTPError(404)

        if isinstance(portal.portal_cache, PortalFileCacheObjectStorage):
            portal.refresh()

        user = await portal.get_user(self)

        admin_mode = False
        if self.request.headers.get("X-Univention-Portal-Admin-Mode", "no") == "yes":
            get_logger("admin").info("Admin mode requested")
            admin_mode = user.is_admin()
            if admin_mode:
                get_logger("admin").info("Admin mode granted")
            else:
                get_logger("admin").info("Admin mode rejected")

        portal_meta = portal.portal_cache.get_portal() if portal.portal_cache else None
        if portal_meta and not admin_mode and user.is_anonymous() and portal_meta.get("ensureLogin"):
            portal_meta["categories"] = []
            portal_meta["content"] = []
            self.write({
                "cache_id": portal.get_cache_id(),
                "corner_links": [],
                "menu_links": [],
                "quick_links": [],
                "user_links": [],
                "entries": [],
                "folders": [],
                "categories": [],
                "portal": portal_meta,
                "filtered": True,
                "username": user.username,
                "auth_mode": portal.auth_mode(self),
                "may_edit_portal": portal.may_be_edited(user),
                "announcements": [],
                "feature_toggles": portal.get_feature_toggles(),
                "newsfeed_config": portal.get_newsfeed_config(),
            })
            return

        answer = {}
        answer["cache_id"] = portal.get_cache_id()
        visible_content = await portal.get_visible_content(user, admin_mode)

        answer["corner_links"] = portal.get_corner_links(visible_content)
        answer["menu_links"] = portal.get_menu_links(visible_content)
        answer["quick_links"] = portal.get_quick_links(visible_content)
        answer["user_links"] = portal.get_user_links(visible_content)

        answer["entries"] = portal.get_entries(visible_content)
        answer["folders"] = portal.get_folders(visible_content)
        answer["categories"] = portal.get_categories(visible_content)
        answer["portal"] = portal.get_meta(visible_content, answer["categories"])
        if (
            not user.is_anonymous()
            and not admin_mode
            and answer["portal"].get("showUmc")
        ):
            # this is not how the portal-server is supposed to be working
            # but we need it like that...
            umc_portal = portal._get_umc_portal()
            umc_content = await umc_portal.get_visible_content(user, admin_mode)
            answer["entries"].extend(umc_portal.get_entries(umc_content))
            answer["folders"].extend(umc_portal.get_folders(umc_content))
            answer["categories"].extend(umc_portal.get_categories(umc_content))
            umc_meta = umc_portal.get_meta(umc_content, answer["categories"])
            answer["portal"]["content"].extend(umc_meta["content"])
        answer["filtered"] = not admin_mode
        answer["username"] = user.username
        answer["auth_mode"] = portal.auth_mode(self)
        answer["may_edit_portal"] = portal.may_be_edited(user)
        answer["announcements"] = portal.get_announcements(visible_content)
        answer["feature_toggles"] = portal.get_feature_toggles()
        answer["newsfeed_config"] = portal.get_newsfeed_config()

        self.write(answer)
