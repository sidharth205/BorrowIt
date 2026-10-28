from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Reads values from environment variables or backend/.env (never committed)."""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # SQLAlchemy URL, e.g. postgresql+psycopg://user:password@host:5432/dbname
    database_url: str
    # Comma-separated list of browser origins allowed to call this API.
    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


def get_settings() -> Settings:
    return Settings()