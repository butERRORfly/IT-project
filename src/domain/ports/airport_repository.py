from abc import ABC, abstractmethod

from src.domain.models.airportd import AirportD
from src.infrastructure.db.database import Airport


class AirportRepository(ABC):
    @abstractmethod
    def find_airports(self, query: str) -> list[AirportD]:
        pass

    @abstractmethod
    def map_to_domain(self, airport: Airport) -> AirportD:
        pass