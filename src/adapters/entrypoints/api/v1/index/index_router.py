from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from src.infrastructure.db.database import User
from src.adapters.entrypoints.utilities.dependencies import get_current_user, user_is_auth
from src import main

router = APIRouter()


@router.get("/", response_class=HTMLResponse, summary="Домашняя страница")
async def index(request: Request, user: User = Depends(user_is_auth)):
    return main.templates.TemplateResponse("base.html", {
        "request": request,
        "title": "Главная",
        "user": user
    })