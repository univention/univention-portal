from pathlib import Path
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles

from .api import router as api_router
from .core.config import (
    API_VERSION,
    DEBUG,
    PROJECT_NAME,
    ROOT_PATH,
)

FRONTEND_PATH = Path("/portal-frontend")
FRONTEND_MOUNT = "/portal"

description = f"""
<a href="{FRONTEND_MOUNT}">&lt;-Portal</a>
"""
app = FastAPI(
    root_path=ROOT_PATH,
    title=PROJECT_NAME,
    version=API_VERSION,
    debug=DEBUG,
    description=description,
)
app.include_router(api_router, prefix=f"/api")
app.mount(
    FRONTEND_MOUNT, StaticFiles(directory=FRONTEND_PATH, html=True), name="frontend"
)


@app.get("/", include_in_schema=False)
async def homepage():
    return RedirectResponse(FRONTEND_MOUNT)
