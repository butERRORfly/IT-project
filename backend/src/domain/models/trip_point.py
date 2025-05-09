import datetime
from dataclasses import dataclass


@dataclass
class TripPoint:
    """Сущность точки путешествия"""
    point: str
    date_to: datetime.date
    date_out: datetime.date
    hotel: str
    air: str
    icao: str
    converted_rate: str  # переведенная валюта в USD
    cost: str  # значение и валюта которую ввели
    type: str  # Метод передвижения