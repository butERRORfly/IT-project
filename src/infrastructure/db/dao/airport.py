from typing import List, Any, Coroutine

from src.domain.models.airportd import AirportD
from src.domain.ports.airport_repository import AirportRepository
from sqlalchemy import select, or_
from src.infrastructure.db.database import async_session_maker, Airport


class AirportDAO(AirportRepository):
    model = Airport

    @classmethod
    async def find_airports(cls, query: str) -> list[Coroutine[Any, Any, AirportD]]:
        async with async_session_maker() as session:
            # print(1)
            # stmt = select(Airport).where(
            #     or_(
            #         Airport.name.ilike(f"{query}%"),
            #         Airport.icao.ilike(f"{query}%")
            #     )
            # ).limit(10)
            # print(2)
            # result = await session.execute(stmt)
            # airports = result.scalars().all()
            # return [cls.map_to_domain(airport) for airport in airports]
            stmt = select(Airport).limit(10)
            result = await session.execute(stmt)
            airports = result.scalars().all()
            return [cls.map_to_domain(airport) for airport in airports]


    @classmethod
    async def map_to_domain(cls, airport: Airport) -> AirportD:
        return AirportD(
            name=airport.name,
            icao=airport.icao,
        )

