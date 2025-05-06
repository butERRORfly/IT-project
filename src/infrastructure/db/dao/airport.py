from src.domain.models.airportd import AirportD
from src.domain.ports.airport_repository import AirportRepository
from sqlalchemy import select, or_
from src.infrastructure.db.database import async_session_maker, Airport


class AirportDAO(AirportRepository):
    @classmethod
    async def find_airports(cls, query: str) -> list[AirportD]:
        async with async_session_maker() as session:
            stmt = select(Airport).where(
                or_(
                    Airport.name.ilike(f"{query}%"),
                    Airport.icao.ilike(f"{query}%")
                )
            ).limit(10)
            result = await session.execute(stmt)
            airports = result.scalars().all()
            return [cls.map_to_domain(airport) for airport in airports]

    @classmethod
    def map_to_domain(cls, airport: Airport) -> AirportD:
        return AirportD(
            icao=airport.icao,
            name=airport.name
        )