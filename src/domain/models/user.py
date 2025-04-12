from dataclasses import dataclass


@dataclass
class User:
    id: int
    phone_number: str
    first_name: str
    last_name: str
    email: str
    password: str
    role: int