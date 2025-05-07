from abc import ABC, abstractmethod
from typing import List, Optional


class AirportRepository(ABC):
    model = None

    @abstractmethod
    def search_airports(self, search_term: str, limit: int = 5):
        pass
