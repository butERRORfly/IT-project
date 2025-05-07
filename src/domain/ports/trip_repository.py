from abc import ABC, abstractmethod

from src.domain.models.trip import Trip

class TripRepository(ABC):
    model = None
    model_2 = None

    @abstractmethod
    def add_way(self, user_id: int):
        pass

    @abstractmethod
    def add_point_way(self, way_id: int, data: list):
        pass

    @abstractmethod
    def find_all_way_id(self, user_id: int) -> list:
        pass

    @abstractmethod
    def find_parameters_by_way_id(self, way_id: int) -> list:
        pass