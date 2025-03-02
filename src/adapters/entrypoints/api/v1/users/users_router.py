from fastapi import APIRouter, HTTPException, status, Response, Depends
from src.adapters.entrypoints.webapps.auth import get_password_hash, create_access_token, authenticate_user
from src.infrastructure.db.dao.users import UsersDAO
from src.infrastructure.db.database import User
from src.domain.schemas.users import UserRegister, UserAuth, UserChangeRole
from src.adapters.entrypoints.webapps.dependensies import get_current_user, get_current_admin_user

router = APIRouter()


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


@router.post("/login/", summary="Вход в систему")
async def auth_user(response: Response, user_data: UserAuth):
    check = await authenticate_user(email=user_data.email, password=user_data.password)
    if check is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Неверная почта или пароль')
    access_token = create_access_token({"sub": str(check.id)})
    response.set_cookie(key="users_access_token", value=access_token, httponly=True)
    return {'access_token': access_token, 'refresh_token': None}


@router.get("/profile/", summary="Профиль пользователя")
async def get_me(user_data: User = Depends(get_current_user)):
    return user_data


@router.post("/logout/", summary="Выход")
async def logout_user(response: Response):
    response.delete_cookie(key="users_access_token")
    return {'message': 'Пользователь успешно вышел из системы'}


@router.get("/all_users/", summary="Список пользователей")
async def get_all_users(user_data: User = Depends(get_current_admin_user)):
    return await UsersDAO.find_all()


@router.post("/set_role/", summary="Выдать роль")
async def set_admin_role(response: Response, user_data: UserChangeRole):
    ...