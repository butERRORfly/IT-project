from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from src.adapters.entrypoints.api.routers import api_router
from src.configurator.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.include_router(api_router, prefix='/api/v1')
app.mount("/src/adapters/entrypoints/static", StaticFiles(directory="src/adapters/entrypoints/static"), name="static")
app.mount("/static", StaticFiles(directory="static"), name="static")  # Важно!

templates = Jinja2Templates(directory="src/adapters/entrypoints/templates")
