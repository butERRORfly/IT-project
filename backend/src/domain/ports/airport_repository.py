from abc import ABC, abstractmethod
from typing import List

from backend.src.domain.models.airport import AirportD
from backend.src.infrastructure.db.database import Airport


class AirportRepository(ABC):
    model = None

    @abstractmethod
    def search_airports(self, query: str) -> List[AirportD] | None:
        pass

    @abstractmethod
    def to_domain(cls, airport: Airport) -> AirportD:
        pass