from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from backend.src.adapters.entrypoints.api.routers import api_router
from backend.src.configurator.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.include_router(api_router, prefix='/api/v1')
app.mount("/backend/src/adapters/entrypoints/static", StaticFiles(directory="backend/src/adapters/entrypoints/static"), name="static")
app.mount("/frontend/static", StaticFiles(directory="frontend/static"), name="static_front")  # Важно!

templates = Jinja2Templates(directory="backend/src/adapters/entrypoints/templates")
