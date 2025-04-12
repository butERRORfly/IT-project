from fastapi import APIRouter, HTTPException, status, Response, Depends
from starlette.requests import Request
from starlette.responses import RedirectResponse

from src.adapters.entrypoints.webapps.auth import get_password_hash, create_access_token, authenticate_user
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi import FastAPI, Form
from typing import List
from fastapi.templating import Jinja2Templates
from src.infrastructure.db.database import UserDB
from src.domain.schemas.users import UserRegister, UserAuth, UserChangeRole
from src.adapters.entrypoints.webapps.dependencies import get_current_user, get_current_admin_user
from pydantic import BaseModel
import requests
from datetime import datetime
from dataclasses import dataclass

secret_key_api = ''
rout = APIRouter()
templates = Jinja2Templates(directory="src/adapters/entrypoints/templates")


@rout.get('/icao/{input_data}/')
async def find_node(input_data: str):
    check = await AirDAO.find_by_icao(data=input_data)
    if check in None:
        return
    else:
        print(check)
        return check


@rout.get("/icao/", response_class=HTMLResponse)
async def return_page(request: Request, user: UserDB = Depends(get_current_user)):
    return templates.TemplateResponse("form.html", {"request": request, "user": user})


@rout.get('/map/', response_class=HTMLResponse)
async def f(request: Request, user: UserDB = Depends(get_current_user)):
    return templates.TemplateResponse("map.html", {"request": request, "user": user})


class FormData(BaseModel):
    point: str
    date_to: str
    date_out: str
    gost: str
    air: str
    icao: str
    convertedRate: str  # переведенная валюта в USD
    cost: str  # значение и валюта которую ввели
    typic: str  # Метод передвижения


def booking_url(param: str):
    return f'https://www.booking.com/searchresults.html?ss={param}'


def calculate_date_difference(date1_str, date2_str):
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


@rout.post("/submit/")
async def submit_data(request: Request, forms: List[FormData], user: UserDB = Depends(get_current_user)):
    print(forms)
    req = [i.point for i in forms]
    print(req)
    req = {
        'total_score': str(sum([float(i.convertedRate.replace('-USD', '')) for i in forms])),
        'loc': [i.point for i in forms if i.point != ''],
        'date_to': [i.date_to for i in forms],
        'date_out': [i.date_out for i in forms],
        'gost': [i.gost for i in forms],
        'cost': [i.cost for i in forms],
        'rec': [booking_url(i.point) for i in forms],
        'wait': [calculate_date_difference(i.date_to, i.date_out) for i in forms],
        'typic': [i.typic for i in forms]
    }
    return templates.TemplateResponse("map.html", {"request": request, "data": req, "user": user})
