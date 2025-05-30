from fastapi import APIRouter, Response, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from backend.src.adapters.entrypoints.utilities.auth import AuthRegister, \
    AuthLogin, AuthLogout
from backend.src.domain.schemas.users import UserRegister, UserAuth

router = APIRouter()
templates = Jinja2Templates(directory="/app/backend/src/adapters/entrypoints/templates")


@router.post("/register/", summary="Регистрация")
async def register_user(user_data: UserRegister) -> dict:
    return await AuthRegister.register_user(user_data)


@router.get("/register/", response_class=HTMLResponse, summary="Страница регистрации")
async def register_page(request: Request):
    return templates.TemplateResponse(
        "auth/register.html", {
            "request": request,
            "title": "Страница регистрации"
        }
    )


@router.post("/login/", summary="Вход в систему")
async def auth_user(response: Response, user_data: UserAuth):
    return await AuthLogin.auth_user(response, user_data)


@router.get("/login/", response_class=HTMLResponse, summary="Страница вход в систему")
async def login_page(request: Request):
    return templates.TemplateResponse(
        "auth/login.html", {
            "request": request,
            "title": "Страница вход в систему"
        }
    )


@router.post("/logout/", summary="Выход")
async def logout_user():
    return await AuthLogout.logout_user()
