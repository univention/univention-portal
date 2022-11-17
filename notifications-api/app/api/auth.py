from fastapi import Security
from fastapi.security.api_key import APIKeyHeader
from starlette.exceptions import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

from app.core.config import get_settings

api_key_header_auth = APIKeyHeader(name=get_settings().api_key_name, auto_error=True)


async def authenticated(api_key_header: str = Security(api_key_header_auth)):
    if api_key_header != get_settings().api_key:
        raise HTTPException(
            status_code=HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
