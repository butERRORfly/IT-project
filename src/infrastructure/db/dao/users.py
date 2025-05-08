from src.domain.ports.trip_repository import UserRepository
from src.domain.models.user import UserD, RoleD
from src.infrastructure.db.database import async_session_maker, User, Role, Way, WayParameter
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
    async def get_all_roles(cls) -> List[int]:
        async with async_session_maker() as session:
            query = select(Role.id)
            result = await session.execute(query)
            roles = result.scalars().all()
            return roles

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

class TripDao():   # Абстрактный класс - написать
    model = Way
    model_2 = WayParameter

    @staticmethod
    async def add_way(user_id: int):
        async with async_session_maker() as session:
            async with session.begin():
                way = Way(user_id = user_id)
                session.add(way)
                try:
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return way

    @staticmethod
    async def add_point_way(way_id: int, data: list ):
        async with async_session_maker() as session:
            async with session.begin():
                for params in data:
                    new_parameter = WayParameter(
                        way_id=way_id,
                        place=params.get('place'),
                        to=params.get('to'),
                        out=params.get('out'),
                        airto=params.get('airto'),
                        airout=params.get('airout'),
                        icao=params.get('icao'),
                        icao1=params.get('icao1'),
                        hotel=params.get('hotel'),
                        price=params.get('price'),
                        type=params.get('type')
                    )
                    session.add(new_parameter)
                try:
                    await session.commit()
                except SQLAlchemyError as e:
                    await session.rollback()
                    raise e
                return new_parameter

    @staticmethod
    async def find_all_way_id(user_id: int) -> list:
        async with async_session_maker() as session:
            query = select(Way.id).where(Way.user_id == user_id)
            result = await session.execute(query)
            return result.scalars().all()

    @staticmethod
    async def find_parameters_by_way_id(way_id: int) -> List[WayParameter]:
        async with async_session_maker() as session:
            query = select(WayParameter).where(WayParameter.way_id == way_id)
            result = await session.execute(query)
            parameters = result.scalars().all()
            return parameters

    @classmethod
    async def find_all(cls, **filter_by):
        async with async_session_maker() as session:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()