from importlib import import_module

from fastapi import (
    APIRouter,
    Depends,
)

# from app.api.auth import authenticated
from app.core.config import API_VERSION

api = import_module(f".{API_VERSION}", package="app.api")
router = APIRouter()
router.include_router(api.router, prefix=f"/{API_VERSION}")
