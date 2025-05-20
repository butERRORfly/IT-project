from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from backend.src.domain.schemas import users
from backend.src.infrastructure.db.dao.users import UsersDAO
from backend.src.infrastructure.db.dao.trip import TripDao
from backend.src.infrastructure.db.database import User
from backend.src.adapters.entrypoints.utilities.dependencies import get_current_user, get_current_admin_user, user_is_auth
from fastapi import Query
from typing import Optional
from math import ceil
from typing import List

router = APIRouter()
templates = Jinja2Templates(directory="/app/backend/src/adapters/entrypoints/templates")


@router.get("/profile/", response_class=HTMLResponse, summary="Профиль пользователя")
async def profile_page(request: Request, user: User = Depends(get_current_user)):
    return templates.TemplateResponse(
        "users/profile.html", {
            "request": request,
            "user": user,
            "title": 'Профиль пользователя',
        }
    )


@router.get("/", response_class=HTMLResponse, summary="Получить всех пользователей")
async def get_all_users_html(
        request: Request,
        role_id: Optional[int] = Query(None),
        page: int = Query(1, ge=1),
        admin_user: User = Depends(get_current_admin_user),
        user: User = Depends(user_is_auth)
):
    PER_PAGE = 5

    all_users = await UsersDAO.find_all_by_role(role_id if role_id != 0 else None)
    total_users = len(all_users)
    total_pages = ceil(total_users / PER_PAGE) if total_users > 0 else 1

    page = min(page, total_pages)

    start = (page - 1) * PER_PAGE
    end = start + PER_PAGE
    users = all_users[start:end]

    total_trips = await TripDao.find_all()
    total_roles = await UsersDAO.get_all_roles()

    return templates.TemplateResponse(
        "users/all_users.html",
        {
            "request": request,
            "users": users,
            "user": user,
            "admin": admin_user,
            "title": "Админ панель",
            "current_role_filter": role_id if role_id is not None else "",
            "page": page,
            "total_pages": total_pages,
            "total_users": total_users,
            "total_trips": len(total_trips),
            "total_roles": len(total_roles),
        }
    )


@router.get("/filter", response_model=List[users.User], summary="Поиск пользователя по Имени/Фамилии")
async def search_user(
        name: Optional[str] = Query(None, min_length=2, description="Search term user"),
        limit: int = Query(5, ge=1, le=20, description="Maximum number of results to return"),
):
    if len(name) < 2:
        return []

    users = await UsersDAO.search_users(search_term=name, limit=limit)
    return users


@router.get("/statistics/", response_class=HTMLResponse, summary="Получить статистику")
async def get_statistics(
        request: Request,
        user: User = Depends(user_is_auth),
        admin_user: User = Depends(get_current_admin_user),
):
    max_count_of_trips = await TripDao.find_max_count('place')
    max_count_of_hotels = await TripDao.find_max_count('hotel')
    max_count_of_transport_type = await TripDao.find_max_count('type')
    max_count_of_date = await TripDao.find_max_count('out')

    seasons = {
        'Зима': ['01', '02', '03'],
        'Весна': ['04', '05', '06'],
        'Лето': ['07', '08', '09'],
        'Осень': ['10', '11', '12'],
    }

    season = ''
    for i in seasons.keys():
        if max_count_of_date[5:7] in seasons[i]:
            season = i

    return templates.TemplateResponse(
        "users/statistics.html",
        {
            "request": request,
            "user": user,
            "admin": admin_user,
            "total_trips": max_count_of_trips,
            "max_count_of_hotels": max_count_of_hotels,
            "max_count_of_transport_type": max_count_of_transport_type,
            "max_count_of_date": season,
            "title": "Статистика",
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
        "users/current_user.html",
        {
            "request": request,
            "user": user,
            "title": f"Профиль пользователя id={user.id}",
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

    valid_roles = await UsersDAO.get_all_roles()
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
