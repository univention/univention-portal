import logging

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .api import router as api_router
from .expiry_pruning import startup_expiry_pruning
from .logs import configure_logging
from .messaging import startup_messaging
from app.core.config import settings


description = """


## Overview

The Notifications API is part of the Univention Portal (Portal) and allows other
services to integrate their user facing notifications with the Portal so that
the user has a holistic view when using the Portal.


### Intended usage scenario

- The delivery of notifications from other services to the API goes backend to
  backend – the API then delivers the notifications to the Portal.

- The notification API service is always available for services to publish
  notifications or to remove their published notifications.

- Notifications are pushed to the user if the user is online in the Portal.

- If the user is offline the API will cache the notifications and deliver them
  as soon as the user is again online in the Portal.


### API structure

The API endpoints can be grouped as follows:

- *Notification Sender API* -- This subset of endpoints is intended to be used
  by services who want to send a notification for a given user.

- *Notification Receiver API* -- This subset shall fulfill the needs of the
  Univention Portal, so that it can show the notifications to the user.

The groups may slightly overlap where appropriate.


### API stability and backwards compatibility

A decision about the commitments regarding stability and backwards
compatibility has not yet been made.

As a rule of thumb, the Sender part of the API is expected to have such a
commitment once it stabilizes and reaches closer to the point of its first
release.

A scenario to have also other *Receivers* besides the Portal has not
been taken into account yet. Currently the Receiver section of the API is
considered private to the Univention Portal and is not accompanied by any
stability commitments.

"""


tags_metadata = [
    {
        "name": "sender",
        "description": "Notification Sender API",
    },
    {
        "name": "receiver",
        "description": "Notification Receiver API",
    },
]

configure_logging()

app = FastAPI(
    root_path=settings.root_path,
    title=settings.project_name,
    version=settings.api_version,
    debug=settings.debug,
    description=description,
    openapi_tags=tags_metadata,
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


@app.on_event("startup")
def startup_tasks():
    startup_messaging()
    startup_expiry_pruning()


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')
    logging.error(f"{request}: {exc_str}")
    content = {'status_code': 10422, 'message': exc_str, 'data': None}
    return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)
