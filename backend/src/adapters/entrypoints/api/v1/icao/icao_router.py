from fastapi import APIRouter, HTTPException, status, Response, Depends
from starlette.requests import Request
from typing import List, Optional
from fastapi.responses import HTMLResponse
from typing import List
from fastapi.templating import Jinja2Templates
from backend.src.adapters.entrypoints.utilities.dependencies import get_current_user, get_current_admin_user, legal_way_for_user
from pydantic import BaseModel
from datetime import datetime
from backend.src.infrastructure.db.dao.trip import TripDao
from backend.src.infrastructure.db.dao.airport import AirportDAO
from backend.src.infrastructure.db.database import User
import requests
from fastapi import Query

rout = APIRouter()
templates = Jinja2Templates(directory="/app/backend/src/adapters/entrypoints/templates")


@rout.get("/new_trip/", response_class=HTMLResponse, summary="Страница создания нового путешествия")
async def return_page(
    request: Request,
    user: User = Depends(get_current_user),
) -> HTMLResponse:

    return templates.TemplateResponse(
        "trips/form.html",
        {
            "request": request,
            "user": user,
        }
    )

@rout.get("/new_trip/airport", response_model=List[dict], summary="Поиск аэропорта/ICAO кода")
async def search_airports(
        name: Optional[str] = Query(None, min_length=2, description="Search term for airport name or ICAO code"),
        limit: int = Query(5, ge=1, le=20, description="Maximum number of results to return"),
        user: User = Depends(get_current_user)
):
    if len(name) < 2:
        return []

    airports = await AirportDAO.search_airports(search_term=name, limit=limit)
    return [{"icao": airport.icao, "name": airport.name} for airport in airports]


@rout.get('/map/', response_class=HTMLResponse, summary="Отображение Yandex Map")
async def f(request: Request, user: User = Depends(get_current_user)) -> HTMLResponse:
    return templates.TemplateResponse("trips/map.html", {"request": request, "user": user})


@rout.get('/saved_trips/', response_class=HTMLResponse, name="trips", summary="Сохраненные путешествия пользователя")
async def show_trips_page(request: Request, user: User = Depends(get_current_user)) -> HTMLResponse:
    current = await TripDao.find_all_way_id(user_id=user.id)
    return templates.TemplateResponse("trips/my_trips.html", {"request": request, "user": user, "current": current})


@rout.get('/saved_trips/{id_trip:int}', response_class=HTMLResponse, summary="Получить сохраненное путешествие по id")
async def show_way(request: Request, id_trip: int, possible: list = Depends(legal_way_for_user),
                   user: User = Depends(get_current_user)):
    parametrs = {
        'loc': [],
        'date_to': [],
        'date_out': [],
        'hotel': [],
        'price': [],
        'wait': [],
        'typic': [],
        'air': [],
        'air2': [],
        'icao': [],
        'icao2': []
    }
    if id_trip in possible:
        data = await TripDao.find_parameters_by_way_id(way_id=id_trip)
        if data:
            for i in data:
                parametrs['loc'].append(i.place)
                parametrs['date_to'].append(i.to)
                parametrs['date_out'].append(i.out)
                parametrs['hotel'].append(i.hotel)
                parametrs['price'].append(i.price)
                parametrs['typic'].append(i.type.split()[0])
                parametrs['air'].append(i.airto)
                parametrs['air2'].append(i.airout)
                parametrs['icao'].append(i.icao)
                parametrs['icao2'].append(i.icao1)
        print(parametrs)
        return templates.TemplateResponse("trips/saved.html", {"request": request, "data": parametrs, "user": user})
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your request has been blocked"
        )


class FormData(BaseModel):
    point: str
    date_to: str
    date_out: str
    gost: str
    air: str
    icao: str
    air2: str
    icao2: str
    convertedRate: str
    cost: str
    typic: str


class RouteData(BaseModel):
    place: Optional[str]
    to: Optional[str] = None
    out: Optional[str] = None
    airto: Optional[str] = None
    airout: Optional[str] = None
    icao: Optional[str] = None
    icao1: Optional[str] = None
    hotel: Optional[str] = None
    price: Optional[str] = None
    type: Optional[str] = None


class CoordinatesPayload(BaseModel):
    latitude: float
    longitude: float


def calculate_date_difference(date1_str, date2_str) -> str:
    try:
        date1 = datetime.strptime(date1_str, "%Y-%m-%d")
        date2 = datetime.strptime(date2_str, "%Y-%m-%d")
        difference = (date2 - date1).days
        if difference < 0:
            return 'Ошибка при вводе'
        else:
            return f'Расчёт дней: {difference}'
    except:
        return 'Uncorected data'


@rout.post("/submit/", summary="Подтверждение к отправке созданного путешествия на сервер")
async def submit_data(request: Request, forms: List[FormData], user: User = Depends(get_current_user)) -> HTMLResponse:
    req = [i.point for i in forms]
    req = {
        'total_score': str(sum([float(i.convertedRate.replace('-USD', '')) for i in forms])),
        'loc': [i.point for i in forms],
        'date_to': [i.date_to for i in forms],
        'date_out': [i.date_out for i in forms],
        'gost': [i.gost for i in forms],
        'cost': [i.cost for i in forms],
        'wait': [calculate_date_difference(i.date_to, i.date_out) for i in forms],
        'typic': [i.typic for i in forms],
        'air': [i.air for i in forms],
        'air2': [i.air2 for i in forms],
        'icao': [i.icao for i in forms],
        'icao2': [i.icao2 for i in forms]
    }
    return templates.TemplateResponse("trips/map.html", {"request": request, "data": req, "user": user})


@rout.post("/send/", summary="Отправка созданного путешествия в Базу Данных")
async def save_users_route(request: Request, forms: List[RouteData], user: User = Depends(get_current_user)) -> dict:
    personal_way = await TripDao.add_way(user_id=user.id)
    if personal_way is not None:
        trip = await TripDao.add_point_way(way_id=personal_way.id, data=[route.dict() for route in forms])
        if trip is not None:
            print('way was saved')
            return {'message': 'Was was sucesseful saved!'}


@rout.post("/location/", summary="Получение местоположения для определения часового пояса")
async def receive_coordinates(payload: CoordinatesPayload) -> dict:
    latitude = payload.latitude
    longitude = payload.longitude
    API_KEY = '17EMDDSCAKIF'
    url = f"http://api.timezonedb.com/v2.1/get-time-zone?key={API_KEY}&format=json&by=position&lat={latitude}&lng={longitude}";
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        print(data)
        return data
    except requests.exceptions.RequestException as e:
        print(f"Ошибка при запросе к TimezoneDB API: {e}")
        return {'status': "ERROR"}
