# SPDX-License-Identifier: AGPL-3.0-only
# SPDX-FileCopyrightText: 2023-2024 Univention GmbH

from typing import Iterator

from sqlmodel import Session, create_engine

from app.core.config import settings


engine = create_engine(settings.database_url, echo=settings.sql_echo)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
