from importlib import import_module

from fastapi import (
    APIRouter,
    Depends,
)
from sqlmodel import (
    # select,
    Session,
)
from sqlalchemy.sql import text

# from app.api.auth import authenticated
from app.db import get_session
from app.core.config import get_settings

# from .util import (
#     materials_filter_params,
#     PaginationParams,
#     pagination_params,
# )

API_VERSION = get_settings().api_version
api = import_module(f".{API_VERSION}", package="app.api")
router = APIRouter()


# @router.get(
#     "/db-version",
#     response_model=dict,
#     # dependencies=[Security(authenticated)],
#     # tags=["Healthcheck", "Authenticated"],
#     tags=["Healthcheck"],
# )
# async def db_version(session: Session = Depends(get_session)):
#     version = session.execute(text("select sqlite_version()")).one()
#
#     return {"version": version}


router.include_router(api.router, prefix=f"/{API_VERSION}")
