from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings


@lru_cache
def get_engine() -> Engine:
    # pool_pre_ping drops dead connections instead of failing the request.
    return create_engine(get_settings().database_url, pool_pre_ping=True)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: one database session per request."""
    session = sessionmaker(bind=get_engine(), autoflush=False)()
    try:
        yield session
    finally:
        session.close()