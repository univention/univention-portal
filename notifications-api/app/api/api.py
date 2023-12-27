# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

from importlib import import_module

from fastapi import APIRouter

from app.core.config import settings


API_VERSION = settings.api_version
api = import_module(f".{API_VERSION}", package="app.api")
router = APIRouter()

router.include_router(api.router, prefix=f"/{API_VERSION}")
