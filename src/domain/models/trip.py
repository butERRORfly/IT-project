import typing
import uuid
from dataclasses import dataclass

from src.domain.models.trip_point import TripPoint


@dataclass
class TripPoint:
    """Сущность Путешествия"""

    id: uuid.UUID
    name: str
    user_id: uuid.UUID
    trip_points: typing.List[TripPoint]