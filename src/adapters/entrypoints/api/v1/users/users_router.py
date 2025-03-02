from fastapi import APIRouter, HTTPException, status
from src.adapters.entrypoints.api.v1.users.auth import get_password_hash
from src.adapters.db.dao.users import UsersDAO
from src.domain.schemas.users import UserRegister


router = APIRouter()


@router.post("/register/")
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