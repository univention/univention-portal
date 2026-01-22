# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

from importlib import import_module

from fastapi import APIRouter

from app.core.config import settings


API_VERSION = settings.api_version
api = import_module(f".{API_VERSION}", package="app.api")
router = APIRouter()

# Build the full prefix including root_path (e.g., "/univention/portal/notifications-api")
# and the API version (e.g., "/v1")
prefix = f"{settings.root_path.rstrip('/')}/{API_VERSION}"
router.include_router(api.router, prefix=prefix)
