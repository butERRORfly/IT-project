from fastapi import APIRouter
from backend.src.adapters.entrypoints.api.v1.index import index_router
from backend.src.adapters.entrypoints.api.v1.auth import auth_router
from backend.src.adapters.entrypoints.api.v1.users import users_router
from backend.src.adapters.entrypoints.api.v1.icao import icao_router

api_router = APIRouter()

api_router.include_router(index_router.router,  tags=["Домашняя страница"])
api_router.include_router(auth_router.router, prefix='/api/v1/auth', tags=["Аутентификация"])
api_router.include_router(users_router.router, prefix='/api/v1/users', tags=["Пользователи"])
api_router.include_router(icao_router.rout, prefix='/api/v1/app', tags=["Приложение"])