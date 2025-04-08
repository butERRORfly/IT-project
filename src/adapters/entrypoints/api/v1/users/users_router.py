from fastapi import APIRouter, HTTPException, status, Response, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from src.adapters.entrypoints.webapps.auth import get_password_hash, create_access_token, authenticate_user
from src.infrastructure.db.dao.users import UsersDAO
from src.infrastructure.db.database import User
from src.domain.schemas.users import UserRegister, UserAuth, UserChangeRole
from src.adapters.entrypoints.webapps.dependencies import get_current_user, get_current_admin_user
from typing import Optional

router = APIRouter()
templates = Jinja2Templates(directory="src/adapters/entrypoints/templates")


@router.get("/profile/", response_class=HTMLResponse, summary="Профиль пользователя")
async def profile_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse("profile.html", {"request": request, "user": user})


# @router.get("/", summary="Получить всех пользователей")
# async def get_all_users(user_data: User = Depends(get_current_admin_user)):
#     return await UsersDAO.find_all()


@router.get("/", response_class=HTMLResponse, summary="Получить всех пользователей")
async def get_all_users_html(
        request: Request,
        admin_user: User = Depends(get_current_admin_user)
):
    users = await UsersDAO.find_all()

    return templates.TemplateResponse(
        "all_users.html",
        {
            "request": request,
            "users": users,
            "admin": admin_user
        }
    )


@router.get("/{id_user}/", summary="Получить пользователя по id")
async def get_user_by_id(id_user: int, user_data: User = Depends(get_current_admin_user)):
    user = await UsersDAO.find_one_or_none_by_id(id_user)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь с указанным id не найден"
        )
    return user

# @router.post("/set_role/", summary="Выдать роль")
# async def set_admin_role(
#         role_data: UserChangeRole,
#         current_user: User = Depends(get_current_admin_user)
# ):
#     if not current_user.is_admin:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN,
#             detail="Только администратор может изменять роли"
#         )
#
#     user = await UsersDAO.find_one_or_none(email=role_data.email)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Пользователь с указанным email не найден"
#         )
#
#     await UsersDAO.update(
#         user.id,
#         is_admin=role_data.is_admin,
#         is_super_admin=role_data.is_super_admin
#     )
#
#     return {"message": f"Роль пользователя {role_data.email} успешно обновлена"}
