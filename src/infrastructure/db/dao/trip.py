from typing import List

from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.future import select

from src.domain.ports.trip_repository import TripRepository
from src.infrastructure.db.database import async_session_maker, Way, WayParameter


class TripDao(TripRepository):   # Абстрактный класс - написать
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