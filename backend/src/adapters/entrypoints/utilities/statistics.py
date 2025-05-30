from typing import Dict, Tuple
from backend.src.infrastructure.db.dao.trip import TripDao


class StatisticsService:
    SEASONS = {
        'Зима': ['01', '02', '03'],
        'Весна': ['04', '05', '06'],
        'Лето': ['07', '08', '09'],
        'Осень': ['10', '11', '12'],
    }

    @classmethod
    async def get_trip_statistics(cls) -> Dict[str, Tuple[str, int]]:
        """Получает основную статистику по путешествиям"""
        return {
            'most_popular_place': await TripDao.find_max_count('place'),
            'most_popular_hotel': await TripDao.find_max_count('hotel'),
            'most_popular_transport': await TripDao.find_max_count('type'),
            'season': await cls._get_season_statistics()
        }

    @classmethod
    async def _get_season_statistics(cls) -> str:
        """Определяет самый популярный сезон"""
        max_date = await TripDao.find_max_count('out')
        if not max_date or len(max_date) < 7:
            return "Не определено"

        month = max_date[5:7]
        for season, months in cls.SEASONS.items():
            if month in months:
                return season
        return "Не определено"