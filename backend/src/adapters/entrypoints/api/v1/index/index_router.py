from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse

from backend.src import main
from backend.src.adapters.entrypoints.utilities.dependencies import user_is_auth
from backend.src.infrastructure.db.database import User

router = APIRouter()


@router.get("/", response_class=HTMLResponse, summary="Домашняя страница")
async def index(request: Request, user: User = Depends(user_is_auth)):
    return main.templates.TemplateResponse("base.html", {
        "request": request,
        "title": "Главная",
        "user": user
    })
