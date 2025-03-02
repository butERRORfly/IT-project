from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from src import main

router = APIRouter()


@router.get("/", response_class=HTMLResponse, summary="Домашняя страница")
async def index(request: Request):
    return main.templates.TemplateResponse(
        request=request, name="base.html", context={"title": "Adventures"}
    )