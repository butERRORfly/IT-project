from dataclasses import dataclass
from typing import Optional

@dataclass
class RoleD:
    id: int
    name: str
    description: Optional[str] = None

@dataclass
class UserD:
    id: int
    phone_number: str
    first_name: str
    last_name: str
    email: str
    password: str
    role: RoleD