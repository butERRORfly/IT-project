# backend/tests/conftest.py
import asyncio
import os
from typing import AsyncGenerator, Generator

import pytest
# Убираем импорт async_fixture, так как будем использовать @pytest.fixture
# и полагаться на встроенную магию pytest-asyncio для async def фикстур
from fastapi.testclient import TestClient
from sqlalchemy import insert, text
from sqlalchemy.ext.asyncio import (
    create_async_engine,
    AsyncSession,
    async_sessionmaker,
    AsyncEngine
)

# --- НАСТРОЙКИ ---
TEST_POSTGRES_USER = os.getenv('TEST_POSTGRES_USER', '')
# ... (остальные переменные)
TEST_POSTGRES_PASSWORD = os.getenv('TEST_POSTGRES_PASSWORD', '')
TEST_POSTGRES_HOST = os.getenv('TEST_POSTGRES_HOST', '')
TEST_POSTGRES_PORT = os.getenv('TEST_POSTGRES_PORT', '')
TEST_POSTGRES_DB = os.getenv('TEST_POSTGRES_DB', '')
TEST_SECRET_KEY = os.getenv('TEST_SECRET_KEY', '')
TEST_ALGORITHM = os.getenv('TEST_ALGORITHM', '')

os.environ["POSTGRES_HOST"] = TEST_POSTGRES_HOST
# ... (остальные os.environ)
os.environ["POSTGRES_PORT"] = str(TEST_POSTGRES_PORT)
os.environ["POSTGRES_DB"] = TEST_POSTGRES_DB
os.environ["POSTGRES_USER"] = TEST_POSTGRES_USER
os.environ["POSTGRES_PASSWORD"] = TEST_POSTGRES_PASSWORD
os.environ["SECRET_KEY"] = TEST_SECRET_KEY
os.environ["ALGORITHM"] = TEST_ALGORITHM

from backend.src.main import app
from backend.src.infrastructure.db.database import Base, Role as RoleModel
import backend.src.infrastructure.db.database as app_db_module

_engine_test_global: AsyncEngine | None = None
_async_session_maker_test_global: async_sessionmaker[AsyncSession] | None = None
_active_test_session_for_dao: AsyncSession | None = None


# --- КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: Явное определение event_loop с scope="session" ---
# Это переопределит стандартную event_loop фикстуру (которая function-scoped)
# для тех фикстур, которые сами имеют scope="session" и запрашивают event_loop.
@pytest.fixture(scope="session")
def event_loop(request) -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create an instance of the default event loop for the session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    asyncio.set_event_loop(loop)
    yield loop
    loop.close()


# -------------------------------------------------------------------------

@pytest.fixture(scope="session", autouse=True)
async def prepare_database(event_loop: asyncio.AbstractEventLoop) -> AsyncGenerator[None, None]:
    # Теперь эта сессионная фикстура должна получить сессионный event_loop
    global _engine_test_global, _async_session_maker_test_global, _active_test_session_for_dao

    print(f"[CONftest PREPARE_DATABASE] Using event loop: {id(event_loop)}")

    TEST_DATABASE_URL = f"postgresql+asyncpg://{TEST_POSTGRES_USER}:{TEST_POSTGRES_PASSWORD}@{TEST_POSTGRES_HOST}:{TEST_POSTGRES_PORT}/{TEST_POSTGRES_DB}"
    print(f"\n[CONftest PREPARE_DATABASE] Initializing test database: {TEST_DATABASE_URL}")

    # echo=True может помочь если ошибки останутся
    engine = create_async_engine(TEST_DATABASE_URL, echo=False)
    session_maker = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

    _engine_test_global = engine
    _async_session_maker_test_global = session_maker

    app_db_module.engine = _engine_test_global
    app_db_module.async_session_maker = _async_session_maker_test_global

    original_app_db_session_provider = app_db_module.Session

    class SessionContextManager:
        def __init__(self, session_to_use: AsyncSession):
            self.session_to_use = session_to_use

        async def __aenter__(self) -> AsyncSession:
            # print(f"[CONftest DAO_SESSION_PROVIDER] DAO entering context with session {id(self.session_to_use)} in loop {id(asyncio.get_running_loop())}")
            return self.session_to_use

        async def __aexit__(self, exc_type, exc_val, exc_tb):
            # print(f"[CONftest DAO_SESSION_PROVIDER] DAO exiting context for session {id(self.session_to_use)} in loop {id(asyncio.get_running_loop())}")
            pass

    def dao_session_provider_wrapper():
        if _active_test_session_for_dao is None:
            print(
                "[CRITICAL ERROR CONftest] DAO requested a session, but no test session is active (_active_test_session_for_dao is None)!")
            if _async_session_maker_test_global is None:
                raise RuntimeError("Session maker not initialized for DAO fallback.")
            # print(f"[CONftest WARNING] DAO creating an unmanaged session as fallback via session_maker in loop {id(asyncio.get_running_loop())}.")
            return _async_session_maker_test_global()

            # print(f"[CONftest DAO_SESSION_PROVIDER] Providing DAO with context manager for active session {id(_active_test_session_for_dao)} in loop {id(asyncio.get_running_loop())}")
        return SessionContextManager(_active_test_session_for_dao)

    app_db_module.Session = dao_session_provider_wrapper
    print(f"[CONftest PREPARE_DATABASE] app_db_module.Session patched.")

    try:
        async with _engine_test_global.connect() as conn_check:
            await conn_check.execute(text("SELECT 1"))
        print("[CONftest PREPARE_DATABASE] Database connection successful.")
    except Exception as e:
        pytest.exit(f"Failed to connect to test database: {e}")

    async with _engine_test_global.begin() as conn:
        print("[CONftest PREPARE_DATABASE] Dropping/Creating tables...")
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
        await conn.execute(insert(RoleModel), [{"id": 1, "name": "user", "description": "Regular user"},
                                               {"id": 2, "name": "admin", "description": "Administrator"}])
    print("[CONftest PREPARE_DATABASE] Tables and roles created.")

    yield

    print("[CONftest PREPARE_DATABASE] Cleaning up...")
    if _engine_test_global:
        async with _engine_test_global.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        await _engine_test_global.dispose()
    print("[CONftest PREPARE_DATABASE] Cleanup finished.")
    app_db_module.Session = original_app_db_session_provider
    _active_test_session_for_dao = None


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[
    AsyncSession, None]:  # Эта фикстура будет использовать function-scoped event_loop от pytest-asyncio
    global _active_test_session_for_dao, _async_session_maker_test_global

    if _async_session_maker_test_global is None:
        pytest.fail("Test database session maker not initialized.", pytrace=False)

    # current_loop = asyncio.get_running_loop() # Для отладки
    # print(f"[CONftest DB_SESSION] Creating session for test function in loop {id(current_loop)}.")

    async with _async_session_maker_test_global() as session:
        _active_test_session_for_dao = session
        # print(f"[CONftest DB_SESSION] Activated session {id(session)} for current test in loop {id(asyncio.get_running_loop())}.")

        await session.begin_nested()
        try:
            yield session
        finally:
            await session.rollback()
            _active_test_session_for_dao = None
            # print(f"[CONftest DB_SESSION] Rolled back and deactivated session {id(session)} in loop {id(asyncio.get_running_loop())}.")


@pytest.fixture(scope="function")
def client(db_session) -> Generator[TestClient, None, None]:
    with TestClient(app) as c:
        yield c