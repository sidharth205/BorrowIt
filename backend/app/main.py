from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import health
from app.core.config import get_settings

app = FastAPI(title="BorrowBuddy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().cors_origin_list,
    allow_methods=["GET", "POST", "PATCH", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(health.router, prefix="/api/v1")