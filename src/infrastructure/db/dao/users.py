from src.domain.ports.trip_repository import UserRepository
from src.domain.models.user import UserD, RoleD
from src.infrastructure.db.database import async_session_maker, User, Role
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy import delete, update
from src.domain.ports.user_repository import UserRepository
from src.infrastructure.db.database import async_session_maker
from typing import Optional, List
from sqlalchemy.orm import joinedload


class UsersDAO(UserRepository):
    model = User

    @classmethod
    async def find_all(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()

    @classmethod
    async def find_all_by_role(cls, role_id: Optional[int] = None) -> List[UserD]:
        async with async_session_maker() as session:
            query = select(cls.model).options(joinedload(cls.model.role_rel))

            if role_id is not None:
                query = query.where(cls.model.role_id == role_id)

            result = await session.execute(query)
            users = result.unique().scalars().all()
            return [cls.map_to_domain(user) for user in users]

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
    async def update_role(cls, user_id: int, new_role_id: int) -> Optional[UserD]:
        async with async_session_maker() as session:
            async with session.begin():
                stmt = (
                    update(cls.model)
                    .where(cls.model.id == user_id)
                    .values(role_id=new_role_id)
                    .returning(cls.model)
                )
                result = await session.execute(stmt)
                user = result.scalar_one_or_none()
                if user:
                    await session.refresh(user, ['role_rel'])
                    return cls.map_to_domain(user)
                return None

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

    @classmethod
    async def get_role_by_id(cls, role_id: int) -> Optional[RoleD]:
        async with async_session_maker() as session:
            query = select(Role).filter_by(id=role_id)
            result = await session.execute(query)
            role = result.scalar_one_or_none()
            return cls.map_role_to_domain(role) if role else None

    @classmethod
    async def get_all_roles(cls) -> List[RoleD]:
        async with async_session_maker() as session:
            query = select(Role)
            result = await session.execute(query)
            roles = result.scalars().all()
            return [cls.map_role_to_domain(role) for role in roles]

    @classmethod
    def map_to_domain(cls, user: User) -> UserD:
        return UserD(
            id=user.id,
            phone_number=user.phone_number,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=user.password,
            role=cls.map_role_to_domain(user.role_rel)
        )

    @staticmethod
    def map_role_to_domain(role: Role) -> RoleD:
        return RoleD(
            id=role.id,
            name=role.name,
            description=role.description,
        )
