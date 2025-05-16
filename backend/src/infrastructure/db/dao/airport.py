from typing import List
from sqlalchemy import or_, func
from sqlalchemy.future import select

from backend.src.domain.models.airport import AirportD
from backend.src.domain.ports.airport_repository import AirportRepository
from backend.src.infrastructure.db.database import Airport, Session


class AirportDAO(AirportRepository):
    model = Airport

    @classmethod
    async def search_airports(cls, search_term: str, limit: int = 5) -> List[AirportD]:
        session = Session()
        try:
            query = select(cls.model).where(
                or_(
                    cls.model.icao.ilike(f"%{search_term}%"),
                    cls.model.name.ilike(f"%{search_term}%")
                )
            ).order_by(cls.model.name).limit(limit)

            result = await session.execute(query)
            airports = result.scalars().all()
            return cls.to_domain(airports)
        finally:
            await Session.remove()

    @classmethod
    def to_domain(cls, list_airports: List[Airport]) -> List[AirportD]:
        return [AirportD(icao=airport.icao, name=airport.name) for airport in list_airports]