from fastapi import Request, HTTPException, status, Depends
from jose import jwt, JWTError
from datetime import datetime, timezone
from src.configurator.config import get_auth_data
from src.infrastructure.db.dao.users import UsersDAO
from src.infrastructure.db.database import User


async def user_is_auth(request: Request):
    """
    Проверяет, авторизован ли пользователь.
    Возвращает объект пользователя если авторизован, None если нет
    """
    try:
        token = request.cookies.get('users_access_token')
        if not token:
            return None

        auth_data = get_auth_data()
        payload = jwt.decode(token, auth_data['secret_key'], algorithms=[auth_data['algorithm']])

        # Проверка срока действия токена
        expire = payload.get('exp')
        if not expire or datetime.fromtimestamp(int(expire), tz=timezone.utc) < datetime.now(timezone.utc):
            return None

        user_id = payload.get('sub')
        if not user_id:
            return None

        return await UsersDAO.find_one_or_none_by_id(int(user_id))

    except (JWTError, ValueError):
        return None


def get_token(request: Request):
    """
    Достает JWT-токе из cookie-файлов
    :param request:
    :return:
    """
    token = request.cookies.get('users_access_token')
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Token not found')
    return token


async def get_current_user(token: str = Depends(get_token)):
    """
    Возвращает информацию о текущем пользователе
    :param token:
    :return:
    """
    try:
        auth_data = get_auth_data()
        payload = jwt.decode(token, auth_data['secret_key'], algorithms=[auth_data['algorithm']])
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Токен не валидный!')

    expire = payload.get('exp')
    expire_time = datetime.fromtimestamp(int(expire), tz=timezone.utc)
    if (not expire) or (expire_time < datetime.now(timezone.utc)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Токен истек')

    user_id = payload.get('sub')
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Не найден ID пользователя')

    user = await UsersDAO.find_one_or_none_by_id(int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User not found')

    return user


async def get_current_admin_user(current_user: User = Depends(get_current_user)):
    """
    Является ли текущий пользователь администратором
    :param current_user:
    :return:
    """
    if current_user.role == 2:
        return current_user
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Недостаточно прав!')
