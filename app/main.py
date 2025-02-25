from fastapi import FastAPI
from app.api.core.config import settings
from app.api.v1.routers import api_router

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_version)
app.include_router(api_router)
