from fastapi import APIRouter, Depends, Response
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.db import get_db

router = APIRouter()


@router.get("/health")
def health(response: Response, db: Session = Depends(get_db)) -> dict[str, str]:
    """Reports whether the API is up and can reach the database."""
    try:
        db.execute(text("SELECT 1"))
    except SQLAlchemyError:
        # Do not leak connection details or stack traces to the client.
        response.status_code = 503
        return {"status": "ok", "database": "unavailable"}
    return {"status": "ok", "database": "ok"}