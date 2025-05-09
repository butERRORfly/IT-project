from abc import ABC, abstractmethod
from typing import List, Optional

from backend.src.domain.models.user import UserD, RoleD

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
    def delete_by_id(self, user_id) -> bool:
        pass

    @abstractmethod
    def get_role_by_id(self, role_id: int) -> Optional[RoleD]:
        pass

    @abstractmethod
    def get_all_roles(self) -> List[RoleD]:
        pass