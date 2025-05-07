from typing import List

from sqlalchemy import or_, func

from src.domain.models.airport import AirportD
from src.infrastructure.db.database import Airport
from src.infrastructure.db.database import async_session_maker
from sqlalchemy.future import select
from src.domain.ports.airport_repository import AirportRepository


class AirportDAO(AirportRepository):
    model = Airport

    @classmethod
    async def search_airports(cls, search_term: str, limit: int = 5) -> List[AirportD]:
        async with async_session_maker() as session:
            query = select(cls.model).where(
                or_(
                    cls.model.icao.ilike(f"%{search_term}%"),
                    cls.model.name.ilike(f"%{search_term}%")
                )
            ).order_by(cls.model.name).limit(limit)

            result = await session.execute(query)
            return cls.to_domain(result.scalars().all())

    @classmethod
    def to_domain(cls, list_airports: List[Airport]) -> list[AirportD]:
        return [AirportD(icao=airport.icao, name=airport.name) for airport in list_airports]

