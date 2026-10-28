# Import every model here so Alembic can see it when comparing against the database.
from app.models.base import Base
from app.models.profile import Profile

__all__ = ["Base", "Profile"]