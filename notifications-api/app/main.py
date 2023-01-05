import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings

from .api import router as api_router


description = """
The Notifications API is intended to be used so that
applications can send notifications so that they are visible within the
Univention Portal.

The API endpoints can be grouped as follows:

- *Notification Sender API* -- This subset of endpoints is intended to be used
  by applications who want to send a notification for a given user.

- *Notification Client API* -- This subset shall fulfill the needs of the
  Univention Portal, so that it can show the notifications to the user.

Note: The groups are not necessarily disjoint.
"""

app = FastAPI(
    root_path=settings.root_path,
    title=settings.project_name,
    version=settings.api_version,
    debug=settings.debug,
    description=description,
)


if settings.dev_mode:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
