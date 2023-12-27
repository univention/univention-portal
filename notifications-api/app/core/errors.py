# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023 Univention GmbH

from collections.abc import Iterable

from fastapi.openapi.constants import REF_PREFIX
from fastapi.openapi.utils import validation_error_definition, validation_error_response_definition
from starlette.exceptions import HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY


async def http_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    return JSONResponse({"errors": [exc.detail]}, status_code=exc.status_code)


async def http_422_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Handler for 422 error to transform default pydantic error object to gothinkster format"""
    errors = {"body": []}

    if _is_pydantic_model_error(exc):
        for error in exc.detail:
            error_name = _remove_body_from_path_to_invalid_element(error)
            errors["body"].append({error_name: error["msg"]})
    else:
        errors["body"].append(exc.detail)

    return JSONResponse({"errors": errors}, status_code=HTTP_422_UNPROCESSABLE_ENTITY)


def _is_pydantic_model_error(exc):
    return (
        isinstance(exc.detail, Iterable)
        and not isinstance(exc.detail, str))


def _remove_body_from_path_to_invalid_element(error):
    error_name = ".".join(error["loc"][1:])
    return error_name


validation_error_definition["properties"] = {
    "body": {"title": "Body", "type": "array", "items": {"type": "string"}},
}

validation_error_response_definition["properties"] = {
    "errors": {
        "title": "Errors",
        "type": "array",
        "items": {"$ref": REF_PREFIX + "ValidationError"},
    },
}
