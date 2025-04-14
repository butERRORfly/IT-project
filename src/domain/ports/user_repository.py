from abc import ABC, abstractmethod
from typing import List

from src.domain.models.user import UserD

class UserRepository(ABC):
    model = None

    @abstractmethod
    def find_all(self, **kwargs) -> List[UserD]:
        pass

    @abstractmethod
    def add(self, **kwargs) -> UserD:
        pass

    @abstractmethod
    def find_one_or_none(self, **kwargs) -> UserD | None:
        pass

    @abstractmethod
    def find_one_or_none_by_id(self, user_id: int):
        pass

    @abstractmethod
    def update_role(self, user_id: int, new_role: int) -> UserD:
        pass

    @abstractmethod
    def delet_by_id(self, user_id) -> bool:
        pass