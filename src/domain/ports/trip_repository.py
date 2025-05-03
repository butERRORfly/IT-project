from abc import ABC, abstractmethod
from typing import List

from src.domain.models.trip import Trip


class TripRepository(ABC):
    @abstractmethod
    def find_all(self, **kwargs) -> List[Trip]:
        pass

    @abstractmethod
    def add(self, **kwargs) -> Trip:
        pass

    @abstractmethod
    def find_one_or_none(self, **kwargs) -> Trip | None:
        pass

    @abstractmethod
    def find_one_or_none_by_id(self, trip_id: int) -> Trip | None:
        pass

    @abstractmethod
    def delet_by_id(self, trip_id) -> bool:
        pass
