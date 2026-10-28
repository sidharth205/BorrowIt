import os

# Settings need a database URL at import time; tests override the DB dependency anyway.
os.environ.setdefault("DATABASE_URL", "sqlite://")

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine  # noqa: E402
from sqlalchemy.orm import sessionmaker  # noqa: E402
from sqlalchemy.pool import StaticPool  # noqa: E402

from app.core.db import get_db  # noqa: E402
from app.main import app  # noqa: E402


def _override_with_working_db():
    engine = create_engine("sqlite://", poolclass=StaticPool)
    session = sessionmaker(bind=engine)()
    try:
        yield session
    finally:
        session.close()


def _override_with_broken_db():
    engine = create_engine("sqlite:////nonexistent-dir/nope.db")
    session = sessionmaker(bind=engine)()
    try:
        yield session
    finally:
        session.close()


def test_health_ok():
    app.dependency_overrides[get_db] = _override_with_working_db
    response = TestClient(app).get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "database": "ok"}


def test_health_reports_database_down_without_leaking_details():
    app.dependency_overrides[get_db] = _override_with_broken_db
    response = TestClient(app).get("/api/v1/health")
    assert response.status_code == 503
    assert response.json() == {"status": "ok", "database": "unavailable"}


def test_cors_allows_only_configured_origin():
    app.dependency_overrides[get_db] = _override_with_working_db
    client = TestClient(app)
    allowed = client.get("/api/v1/health", headers={"Origin": "http://localhost:5173"})
    denied = client.get("/api/v1/health", headers={"Origin": "http://evil.example"})
    assert allowed.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "access-control-allow-origin" not in denied.headers