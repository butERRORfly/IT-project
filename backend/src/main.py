from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from backend.src.adapters.http.routers.routers import api_router
from backend.src.config.config import settings

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)
app.include_router(api_router)
app.mount("/frontend/src/static", StaticFiles(directory="frontend/src/static"), name="static")

templates = Jinja2Templates(directory="frontend/src/templates")
