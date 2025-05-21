# backend/tests/api/v1/test_auth_router.py
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import AsyncSession

from backend.src.infrastructure.db.dao.users import UsersDAO  # Для проверки создания пользователя в БД
from backend.src.adapters.entrypoints.utilities.auth import get_password_hash  # Для создания хеша пароля

# Помечаем все тесты в этом модуле как асинхронные
pytestmark = pytest.mark.asyncio


async def test_register_user_success(client: TestClient, db_session: AsyncSession):
    """
    Тест успешной регистрации пользователя.
    """
    user_data = {
        "email": "testuser@example.com",
        "password": "testpassword123",
        "phone_number": "+12345678901",
        "first_name": "Test",
        "last_name": "User"
        # role_id по умолчанию 1
    }
    response = client.post("/api/v1/auth/register/", json=user_data)
    assert response.status_code == status.HTTP_200_OK  # В вашем коде успешная регистрация возвращает 200
    assert response.json() == {'message': 'Вы успешно зарегистрированы!'}

    # Проверяем, что пользователь действительно создан в БД
    # Используем db_session, которую мы переопределили в conftest
    # Здесь UsersDAO будет использовать тестовую сессию
    # Важно: UsersDAO.find_one_or_none должен быть адаптирован для работы с сессией,
    # либо мы должны использовать сессию напрямую.
    # Судя по вашему DAO, он сам управляет сессиями через Session.get_session() или аналогично.
    # Поскольку мы подменили глобальный Session в database.py, это должно сработать.

    # Чтобы проверить, нужно передать UsersDAO сессию или убедиться, что он ее правильно получает
    # Если UsersDAO.find_one_or_none и другие методы не принимают сессию явно,
    # а используют глобальный Session, то наша подмена в conftest должна работать.

    # Ожидаем, что UsersDAO.find_one_or_none использует Session из database.py, который мы подменили
    # Для прямого использования сессии в тесте:
    # from backend.src.infrastructure.db.database import User as UserModel
    # from sqlalchemy import select
    # query = select(UserModel).where(UserModel.email == user_data["email"])
    # result = await db_session.execute(query)
    # db_user = result.scalar_one_or_none()

    # Используя ваш DAO:
    db_user = await UsersDAO.find_one_or_none(email=user_data["email"])

    assert db_user is not None
    assert db_user.email == user_data["email"]
    assert db_user.first_name == user_data["first_name"]
    # Пароль в БД должен быть хеширован
    assert db_user.password != user_data["password"]


async def test_register_user_conflict(client: TestClient, db_session: AsyncSession):
    """
    Тест регистрации пользователя с уже существующим email.
    """
    # Сначала создадим пользователя
    existing_user_data = {
        "email": "existing@example.com",
        "password": get_password_hash("oldpassword123"),  # Хешируем пароль перед добавлением в DAO
        "phone_number": "+09876543210",
        "first_name": "Existing",
        "last_name": "User",
        "role_id": 1
    }
    await UsersDAO.add(**existing_user_data)  # Добавляем через DAO, который использует тестовую БД

    # Пытаемся зарегистрировать с тем же email
    new_user_data = {
        "email": "existing@example.com",
        "password": "newpassword123",
        "phone_number": "+11223344556",
        "first_name": "New",
        "last_name": "Attempt"
    }
    response = client.post("/api/v1/auth/register/", json=new_user_data)
    assert response.status_code == status.HTTP_409_CONFLICT
    assert response.json() == {'detail': 'Пользователь уже существует'}


async def test_register_user_invalid_payload(client: TestClient):
    """
    Тест регистрации с невалидными данными (например, короткий пароль).
    FastAPI должен вернуть ошибку 422.
    """
    invalid_user_data = {
        "email": "valid@example.com",
        "password": "123",  # Слишком короткий
        "phone_number": "+12345678901",
        "first_name": "Test",
        "last_name": "User"
    }
    response = client.post("/api/v1/auth/register/", json=invalid_user_data)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    # Проверим одно из полей ошибки (может быть несколько)
    assert any(err["loc"] == ["body", "password"] for err in response.json()["detail"])


async def test_login_user_success(client: TestClient, db_session: AsyncSession):
    """
    Тест успешного входа пользователя.
    """
    raw_password = "testpassword123"
    user_to_create = {
        "email": "loginuser@example.com",
        "password": get_password_hash(raw_password),
        "phone_number": "+23456789012",
        "first_name": "Login",
        "last_name": "User",
        "role_id": 1
    }
    await UsersDAO.add(**user_to_create)

    login_data = {
        "email": "loginuser@example.com",
        "password": raw_password
    }
    response = client.post("/api/v1/auth/login/", json=login_data)

    assert response.status_code == status.HTTP_200_OK
    response_data = response.json()
    assert "access_token" in response_data
    assert response_data["refresh_token"] is None  # Как в вашем коде
    assert "users_access_token" in response.cookies
    assert response.cookies["users_access_token"] == response_data["access_token"]


async def test_login_user_wrong_password(client: TestClient, db_session: AsyncSession):
    """
    Тест входа с неверным паролем.
    """
    raw_password = "correctpassword"
    user_to_create = {
        "email": "wrongpass@example.com",
        "password": get_password_hash(raw_password),
        "phone_number": "+34567890123",
        "first_name": "Wrong",
        "last_name": "Pass",
        "role_id": 1
    }
    await UsersDAO.add(**user_to_create)

    login_data = {
        "email": "wrongpass@example.com",
        "password": "incorrectpassword"
    }
    response = client.post("/api/v1/auth/login/", json=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Неверная почта или пароль'}


async def test_login_user_not_exists(client: TestClient):
    """
    Тест входа несуществующего пользователя.
    """
    login_data = {
        "email": "nonexistent@example.com",
        "password": "anypassword"
    }
    response = client.post("/api/v1/auth/login/", json=login_data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {'detail': 'Неверная почта или пароль'}


async def test_logout_user(client: TestClient, db_session: AsyncSession):
    """
    Тест выхода пользователя.
    Сначала логинимся, чтобы получить cookie.
    """
    # 1. Создаем и логиним пользователя, чтобы установить cookie
    raw_password = "logoutpassword"
    user_email = "logout@example.com"
    user_to_create = {
        "email": user_email,
        "password": get_password_hash(raw_password),
        "phone_number": "+45678901234",
        "first_name": "Logout",
        "last_name": "Test",
        "role_id": 1
    }
    await UsersDAO.add(**user_to_create)

    login_data = {"email": user_email, "password": raw_password}
    login_response = client.post("/api/v1/auth/login/", json=login_data)
    assert login_response.status_code == status.HTTP_200_OK
    assert "users_access_token" in login_response.cookies

    # 2. Выполняем logout
    # Важно: TestClient сохраняет cookies между запросами в рамках одного экземпляра.
    logout_response = client.post("/api/v1/auth/logout/")

    # Проверяем редирект
    # TestClient автоматически не следует редиректам, так что мы проверяем статус и заголовки
    assert logout_response.status_code == status.HTTP_303_SEE_OTHER
    assert logout_response.headers["location"] == "/api/v1/auth/login/"  # URL из вашего RedirectResponse

    # Проверяем, что cookie удалена
    # Cookie удаляется путем установки истекшего срока действия и/или пустого значения.
    # TestClient.cookies может не отражать это напрямую как "удаленный".
    # Более надежно проверить, что в cookies ответа на logout есть set-cookie с истекшим/пустым значением.
    # Или что последующий запрос к защищенному эндпоинту не пройдет (если такой есть).

    # Проверим, что cookie 'users_access_token' была изменена (обычно устанавливается Max-Age=0)
    cookie_deleted = False
    for cookie in logout_response.cookies.jar:  # Доступ к http.cookiejar.CookieJar
        if cookie.name == "users_access_token":
            # Проверяем, что кука либо истекла, либо ее значение пустое
            if cookie.expires is not None and cookie.expires <= 0:  # Max-Age=0 устанавливает expires в прошлое
                cookie_deleted = True
                break
            if cookie.value == "":  # Иногда сервер просто очищает значение
                cookie_deleted = True
                break

    # Альтернативно, FastAPI TestClient может не выставлять `expires` так, как браузер.
    # Более простой способ - убедиться, что значение cookie теперь пустое
    # или что она просто отсутствует в последующих запросах, если TestClient ее удаляет из своего jar.
    # Однако, `delete_cookie` обычно означает установку `max-age=0`.
    # В данном случае, FastAPI RedirectResponse().delete_cookie() должен правильно установить заголовки.

    # Попробуем просто проверить, что она не та, что была, или пустая
    final_cookies = client.cookies  # Cookies после logout
    assert final_cookies.get("users_access_token") is None or final_cookies.get("users_access_token") == ""

    # Если бы мы хотели быть на 100% уверены, мы бы проверили заголовок `set-cookie`
    # set_cookie_header = logout_response.headers.get("set-cookie")
    # assert set_cookie_header is not None
    # assert "users_access_token=;" in set_cookie_header or "Max-Age=0" in set_cookie_header