from fastapi import APIRouter
from backend.src.domain.models import index

api_router = APIRouter()
api_router.include_router(index.router, tags=["index"])