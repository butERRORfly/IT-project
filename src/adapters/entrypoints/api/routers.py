from fastapi import APIRouter
from src.adapters.entrypoints.api.v1 import index

api_router = APIRouter()
api_router.include_router(index.router, tags=["index"])