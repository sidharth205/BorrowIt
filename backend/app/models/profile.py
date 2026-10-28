import uuid
from datetime import datetime

from sqlalchemy import Boolean, CheckConstraint, DateTime, String, func, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class Profile(Base):
    """One row per user. The id is the Supabase Auth user id."""

    __tablename__ = "profiles"
    __table_args__ = (
        CheckConstraint(
            "char_length(display_name) BETWEEN 1 AND 80", name="display_name_length"
        ),
    )

    # Same value as the user's id in Supabase Auth. We do not generate it here.
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    display_name: Mapped[str] = mapped_column(String(80))
    # Public area only (e.g. "Salt Lake"), never an exact address.
    area: Mapped[str | None] = mapped_column(String(120))
    # Private. Must be hidden by the API until a booking is paid (see rules.md).
    phone: Mapped[str | None] = mapped_column(String(20))
    is_admin: Mapped[bool] = mapped_column(
        Boolean, server_default=text("false"), default=False
    )
    is_suspended: Mapped[bool] = mapped_column(
        Boolean, server_default=text("false"), default=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )