from dataclasses import dataclass


@dataclass
class AirportD:
    """Сущность аэропорта"""

    icao: str
    name: str