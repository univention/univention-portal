# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

from pydantic import BaseSettings
from starlette.datastructures import CommaSeparatedStrings


class Settings(BaseSettings):
    project_name: str = "Notifications API"
    log_level: str = "INFO"
    sql_echo: bool = True
    debug: bool = True
    dev_mode: bool = False
    root_path: str = ""
    database_url: str = "sqlite:///./notifications.db"
    allowed_hosts: CommaSeparatedStrings = CommaSeparatedStrings("*")
    api_version: str = "v1"


settings = Settings()
