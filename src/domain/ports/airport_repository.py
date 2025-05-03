from abc import ABC, abstractmethod

from src.domain.models.airportd import AirportD


class AirportRepository(ABC):
    @abstractmethod
    def find_by_name(self, name_start: str) -> list[AirportD]:
        pass

    @abstractmethod
    def find_by_icao(self, icao_start: int) -> list[AirportD]:
        pass