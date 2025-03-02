from fastapi import APIRouter
from src.adapters.entrypoints.api.v1 import index
from src.adapters.entrypoints.api.v1.users import users_router

api_router = APIRouter()
api_router.include_router(index.router, tags=["Домашняя страница"])
api_router.include_router(users_router.router, prefix='/auth', tags=["Авторизация"])