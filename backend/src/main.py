from fastapi import FastAPI
from backend.src.adapters.http.routers.routers import api_router
from backend.src.config.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.include_router(api_router)