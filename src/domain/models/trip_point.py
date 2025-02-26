import datetime
import uuid
from dataclasses import dataclass


@dataclass
class TripPoint:
    """Сущность Точки Путешествия"""

    id : uuid.UUID
    trip_id : uuid.UUID
    country : str
    city : str
    arrival_time : datetime
    departure_time : datetime
    cost : float
    airport : str
