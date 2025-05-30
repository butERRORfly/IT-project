from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta, timezone
from pydantic import EmailStr
from backend.src.infrastructure.db.dao.users import UsersDAO
from backend.src.configurator.config import get_auth_data
from fastapi import APIRouter, HTTPException, status, Response, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from backend.src.infrastructure.db.dao.users import UsersDAO
from backend.src.domain.schemas.users import UserRegister, UserAuth


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Создание хэша пароля
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Проверка пароля
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Генерация JWT токена
def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode.update({"exp": expire})
    auth_data = get_auth_data()
    encode_jwt = jwt.encode(to_encode, auth_data['secret_key'], algorithm=auth_data['algorithm'])
    return encode_jwt


async def authenticate_user(email: EmailStr, password: str):
    user = await UsersDAO.find_one_or_none(email=email)
    if not user or verify_password(plain_password=password, hashed_password=user.password) is False:
        return None
    return user


class AuthRegister:
    @staticmethod
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

class AuthLogin:
    @staticmethod
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


class AuthLogout:
    @staticmethod
    async def logout_user():
        redirect_response = RedirectResponse(
            url="/api/v1/auth/login/",
            status_code=status.HTTP_303_SEE_OTHER
        )
        redirect_response.delete_cookie(key="users_access_token")
        return redirect_response