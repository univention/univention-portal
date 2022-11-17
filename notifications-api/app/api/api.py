from importlib import import_module

from fastapi import (
    APIRouter,
)

from app.core.config import get_settings

API_VERSION = get_settings().api_version
api = import_module(f".{API_VERSION}", package="app.api")
router = APIRouter()

router.include_router(api.router, prefix=f"/{API_VERSION}")
