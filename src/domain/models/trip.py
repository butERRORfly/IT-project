import datetime
import typing
import uuid
from dataclasses import dataclass

from src.domain.models.trip_point import TripPoint


@dataclass
class Trip:
    """Сущность Путешествия"""

    id: uuid.UUID
    user_id: uuid.UUID
    total_score: str
    location: str
    date_to: datetime.date
    date_out: datetime.date
    hotel: str
    cost: int
    url: str
    wait: int
    type: str
    trip_points: typing.List[TripPoint]