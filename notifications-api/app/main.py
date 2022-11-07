from fastapi import FastAPI

from app.core.config import get_settings
from .api import router as api_router

settings = get_settings()
description = f"""
"""
app = FastAPI(
    root_path=settings.root_path,
    title=settings.project_name,
    version=settings.api_version,
    debug=settings.debug,
    description=description,
)
app.include_router(api_router)
