from typing import List

from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select

from backend.src.domain.ports.trip_repository import TripRepository
from backend.src.infrastructure.db.database import Way, WayParameter, Session


class TripDao(TripRepository):
    model = Way
    model_2 = WayParameter

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
    async def add_way(cls, user_id: int):
        session = Session()
        try:
            way = Way(user_id=user_id)
            session.add(way)
            await session.commit()
            return way
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await Session.remove()

    @classmethod
    async def add_point_way(cls, way_id: int, data: list):
        session = Session()
        try:
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
            await session.commit()
            return new_parameter
        except SQLAlchemyError as e:
            await session.rollback()
            raise e
        finally:
            await Session.remove()

    @classmethod
    async def find_all_way_id(cls, user_id: int) -> list:
        session = Session()
        try:
            query = select(Way.id).where(Way.user_id == user_id)
            result = await session.execute(query)
            return result.scalars().all()
        finally:
            await Session.remove()

    @classmethod
    async def find_parameters_by_way_id(cls, way_id: int) -> List[WayParameter]:
        session = Session()
        try:
            query = select(WayParameter).where(WayParameter.way_id == way_id)
            result = await session.execute(query)
            return result.scalars().all()
        finally:
            await Session.remove()

    @classmethod
    async def find_max_count(cls, column_name):
        session = Session()
        try:
            column = getattr(WayParameter, column_name)
            query = select(
                func.mode().within_group(column.asc())
            )
            result = await session.execute(query)
            return result.scalar()
        finally:
            await Session.remove()