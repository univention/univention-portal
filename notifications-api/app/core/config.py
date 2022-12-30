from pydantic import BaseSettings
from starlette.datastructures import CommaSeparatedStrings


class Settings(BaseSettings):
    project_name: str = "Notifications"
    log_level: str = ""
    debug: bool = True
    dev_mode: bool = False
    root_path: str = ""
    database_url: str = "sqlite:///./notifications.db"
    allowed_hosts: CommaSeparatedStrings = CommaSeparatedStrings("*")
    api_version: str = "v1"
    api_key_name: str = "X-API-KEY"
    api_key: str = ""


settings = Settings()
