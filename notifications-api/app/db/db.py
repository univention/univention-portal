from typing import Iterator

from sqlmodel import create_engine, Session

from app.core.config import get_settings


engine = create_engine(
    get_settings().database_url, echo=True, connect_args=dict(check_same_thread=False),
)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
