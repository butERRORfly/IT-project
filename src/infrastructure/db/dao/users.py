from src.domain.ports.trip_repository import UserRepository
from src.infrastructure.db.dao.base import BaseDAO
from src.infrastructure.db.database import async_session_maker, User
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy import delete
from src.domain.ports.user_repository import UserRepository
from src.infrastructure.db.database import async_session_maker


class UsersDAO(UserRepository):
    model = User

    @classmethod
    async def find_all(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def find_one_or_none_by_id(cls, data_id: int):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(id=data_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalar_one_or_none()

    @classmethod
    async def add(cls, **values):
        async with async_session_maker() as session:
            async with session.begin():
                new_instance = cls.model(**values)
                session.add(new_instance)
                try:
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return new_instance

    @classmethod
    async def update_role(cls, user_id: int, new_role: int):
        async with async_session_maker() as session:
            user = await cls.find_one_or_none_by_id(user_id)
            if not user:
                return None

            user.role = new_role
            session.add(user)
            await session.commit()
            await session.refresh(user)
            return user

    @classmethod
    async def delete_by_id(cls, user_id: int):
        async with async_session_maker() as session:
            async with session.begin():
                user = await cls.find_one_or_none_by_id(user_id)
                if not user:
                    return False
                await session.delete(user)

            try:
                await session.commit()
                return True
            except SQLAlchemyError as e:
                await session.rollback()
                raise e