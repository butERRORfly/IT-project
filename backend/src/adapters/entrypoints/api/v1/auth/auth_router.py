from fastapi import APIRouter, HTTPException, status, Response, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from backend.src.adapters.entrypoints.utilities.auth import get_password_hash, create_access_token, authenticate_user
from backend.src.infrastructure.db.dao.users import UsersDAO
from backend.src.domain.schemas.users import UserRegister, UserAuth

router = APIRouter()
templates = Jinja2Templates(directory="/app/backend/src/adapters/entrypoints/templates")


@router.post("/register/", summary="Регистрация")
async def register_user(user_data: UserRegister) -> dict:
    user = await UsersDAO.find_one_or_none(email=user_data.email)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail='Пользователь уже существует'
        )
    user_dict = user_data.model_dump()
    user_dict['password'] = get_password_hash(user_data.password)
    await UsersDAO.add(**user_dict)
    return {'message': 'Вы успешно зарегистрированы!'}


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
    check = await authenticate_user(email=user_data.email, password=user_data.password)
    if check is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Неверная почта или пароль')
    access_token = create_access_token({"sub": str(check.id)})
    response.set_cookie(key="users_access_token", value=access_token, httponly=True)
    return {
        'access_token': access_token,
        'refresh_token': None,
    }


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
    redirect_response = RedirectResponse(
        url="/api/v1/auth/login/",
        status_code=status.HTTP_303_SEE_OTHER
    )
    redirect_response.delete_cookie(key="users_access_token")
    return redirect_response
