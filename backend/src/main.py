from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from backend.src.adapters.entrypoints.api.routers import api_router
from backend.src.configurator.config import settings
from pathlib import Path

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
static_path = Path(__file__).parent / "adapters" / "entrypoints" / "static"
frontend_static = Path(__file__).parent.parent.parent / "frontend" / "static"
app.include_router(api_router)
app.mount("/static", StaticFiles(directory=str(static_path)), name="static")
app.mount("/frontend/static", StaticFiles(directory=str(frontend_static)), name="static_front")

templates = Jinja2Templates(directory="/app/backend/src/adapters/entrypoints/templates")
