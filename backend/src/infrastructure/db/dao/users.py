from typing import Optional, List
from sqlalchemy import or_, update
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload

from backend.src.domain.models.user import UserD, RoleD
from backend.src.domain.ports.user_repository import UserRepository
from backend.src.infrastructure.db.database import User, Role, Session


class UsersDAO(UserRepository):
    model = User

    @classmethod
    async def find_all(cls, **filter_by):
        session = Session()
        try:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalars().all()
        finally:
            await Session.remove()

    @classmethod
    async def find_all_by_role(cls, role_id: Optional[int] = None) -> List[UserD]:
        session = Session()
        try:
            query = select(cls.model).options(joinedload(cls.model.role_rel))

            if role_id is not None:
                query = query.where(cls.model.role_id == role_id)

            result = await session.execute(query)
            users = result.unique().scalars().all()
            return [cls.map_to_domain(user) for user in users]
        finally:
            await Session.remove()

    @classmethod
    async def find_one_or_none_by_id(cls, data_id: int):
        session = Session()
        try:
            query = select(cls.model).filter_by(id=data_id)
            result = await session.execute(query)
            return result.scalar_one_or_none()
        finally:
            await Session.remove()

    @classmethod
    async def find_one_or_none(cls, **filter_by):
        session = Session()
        try:
            query = select(cls.model).filter_by(**filter_by)
            result = await session.execute(query)
            return result.scalar_one_or_none()
        finally:
            await Session.remove()

    @classmethod
    async def add(cls, **values):
        session = Session()
        try:
            new_instance = cls.model(**values)
            session.add(new_instance)
            await session.commit()
            return new_instance
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await Session.remove()

    @classmethod
    async def update_role(cls, user_id: int, new_role_id: int) -> Optional[UserD]:
        session = Session()
        try:
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
                await session.commit()
                return cls.map_to_domain(user)
            return None
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await Session.remove()

    @classmethod
    async def delete_by_id(cls, user_id: int):
        session = Session()
        try:
            user = await cls.find_one_or_none_by_id(user_id)
            if not user:
                return False

            await session.delete(user)
            await session.commit()
            return True
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await Session.remove()

    @classmethod
    async def get_role_by_id(cls, role_id: int) -> Optional[RoleD]:
        session = Session()
        try:
            query = select(Role).filter_by(id=role_id)
            result = await session.execute(query)
            role = result.scalar_one_or_none()
            return cls.map_role_to_domain(role) if role else None
        finally:
            await Session.remove()

    @classmethod
    async def get_all_roles(cls) -> List[int]:
        session = Session()
        try:
            query = select(Role.id)
            result = await session.execute(query)
            return result.scalars().all()
        finally:
            await Session.remove()

    @classmethod
    async def search_users(cls, search_term: str, limit: int = 5):
        session = Session()
        try:
            query = select(cls.model).where(
                or_(
                    cls.model.first_name.ilike(f"%{search_term}%"),
                    cls.model.last_name.ilike(f"%{search_term}%")
                )
            ).order_by(cls.model.first_name).limit(limit)

            result = await session.execute(query)
            return result.scalars().all()
        finally:
            await Session.remove()

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