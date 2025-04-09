from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from src.infrastructure.db.dao.users import UsersDAO
from src.infrastructure.db.database import User
from src.adapters.entrypoints.webapps.dependencies import get_current_user, get_current_admin_user
from fastapi import Query
from typing import Optional

router = APIRouter()
templates = Jinja2Templates(directory="src/adapters/entrypoints/templates")


@router.get("/profile/", response_class=HTMLResponse, summary="Профиль пользователя")
async def profile_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse("profile.html", {"request": request, "user": user})


@router.get("/", response_class=HTMLResponse, summary="Получить всех пользователей")
async def get_all_users_html(
        request: Request,
        role: Optional[int] = Query(None, description="Фильтр по роли (0-пользователь, 1-админ, 2-суперадмин)"),
        admin_user: User = Depends(get_current_admin_user)
):
    filter_params = {"role": role} if role is not None else {}

    users = await UsersDAO.find_all(**filter_params)

    return templates.TemplateResponse(
        "all_users.html",
        {
            "request": request,
            "users": users,
            "admin": admin_user,
            "current_role_filter": role
        }
    )


@router.get("/{id_user}/", summary="Получить пользователя по id")
async def get_user_by_id(
        id_user: int,
        request: Request,
        user_data: User = Depends(get_current_admin_user)
):
    user = await UsersDAO.find_one_or_none_by_id(id_user)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь с указанным id не найден"
        )

    return templates.TemplateResponse(
        "current_user.html",
        {
            "request": request,
            "user": user,
        }
    )


@router.delete("/{id_user}/", summary="Удалить пользователя по id")
async def delete_user_by_id(
        id_user: int,
        admin: User = Depends(get_current_admin_user)
):
    user = await UsersDAO.find_one_or_none_by_id(id_user)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="Пользователь с указанным id не найден"
        )

    delete = await UsersDAO.delete_by_id(user.id)
    return delete


@router.patch("/{id_user}/role/{id_role}/", summary="Смена роли пользователя")
async def change_user_role(
        id_user: int,
        id_role: int,
        admin: User = Depends(get_current_admin_user)
):
    user = await UsersDAO.find_one_or_none_by_id(id_user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )

    if user.id == admin.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Нельзя изменить свою собственную роль"
        )

    valid_roles = [0, 1, 2]
    if id_role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Недопустимый идентификатор роли. Допустимые значения: {valid_roles}"
        )

    updated_user = await UsersDAO.update_role(user.id, id_role)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Не удалось обновить роль пользователя"
        )

    return updated_user
