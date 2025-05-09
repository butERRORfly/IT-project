from sqlalchemy import or_, func
from backend.src.infrastructure.db.database import Airport
from backend.src.infrastructure.db.database import async_session_maker
from sqlalchemy.future import select
from backend.src.domain.ports.airport_repository import AirportRepository


class AirportDAO(AirportRepository):
    model = Airport

    @classmethod
    async def search_airports(cls, search_term: str, limit: int = 5):
        async with async_session_maker() as session:
            query = select(cls.model).where(
                or_(
                    cls.model.icao.ilike(f"%{search_term}%"),
                    cls.model.name.ilike(f"%{search_term}%")
                )
            ).order_by(cls.model.name).limit(limit)

            result = await session.execute(query)
            return result.scalars().all()


