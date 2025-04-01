from fastapi import APIRouter, HTTPException, status, Response, Depends
from starlette.requests import Request
from starlette.responses import RedirectResponse

from src.adapters.entrypoints.webapps.auth import get_password_hash, create_access_token, authenticate_user
from src.infrastructure.db.dao.users import UsersDAO, AirDAO
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi import FastAPI, Form
from typing import List
from fastapi.templating import Jinja2Templates
from src.infrastructure.db.database import User
from src.domain.schemas.users import UserRegister, UserAuth, UserChangeRole
from src.adapters.entrypoints.webapps.dependensies import get_current_user, get_current_admin_user
from pydantic import BaseModel
import requests
from datetime import datetime
from dataclasses import dataclass

secret_key_api = '6a4c745a-8968-455d-8801-aef21ebfa91b'
rout = APIRouter()
templates = Jinja2Templates(directory="src/adapters/entrypoints/templates")



@rout.get('/ICAO/{input_data}')
async def find_node(input_data: str):
    check = await AirDAO.find_by_icao(data=input_data)
    if check in None:
        return
    else:
        print(check)
        return check

@rout.get("/ICAO", response_class=HTMLResponse)
async def return_page():
    print('[200]')
    with open("src/adapters/entrypoints/templates/form.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    print('[200]')
    return HTMLResponse(content=html_content)

@rout.get('/map',response_class=HTMLResponse)
async def f():
    with open("src/adapters/entrypoints/templates/map.html", "r", encoding="utf-8") as file:
        html_content = file.read()
    return HTMLResponse(content=html_content)


class FormData(BaseModel):
    point: str
    date_to: str
    date_out: str
    gost: str
    air: str
    icao: str
    convertedRate: str # переведенная валюта в USD
    cost: str   # значение и валюта которую ввели

def booking_url(param: str):
    return f'https://www.booking.com/searchresults.html?ss={param}'


def calculate_date_difference(date1_str, date2_str):
    date1 = datetime.strptime(date1_str, "%Y-%m-%d")
    date2 = datetime.strptime(date2_str, "%Y-%m-%d")
    difference = (date2 - date1).days
    if difference < 0: return 'Ошибка при вводе'
    else:
        return f'Расчёт дней: {difference}'





@rout.post("/submit")
async def submit_data(request: Request, forms: List[FormData]):
    print(forms)
    req = [i.point for i in forms]
    print(req)
    req = {
        'total_score': str(sum([float(i.convertedRate.replace('-USD','')) for i in forms])),
        'loc': [i.point for i in forms if i.point != ''],
        'date_to': [i.date_to for i in forms],
        'date_out': [i.date_out for i in forms],
        'gost': [i.gost for i in forms],
        'cost': [i.cost for i in forms],
        'rec':[booking_url(i.point) for i in forms],
        'wait':[calculate_date_difference(i.date_to,i.date_out) for i in forms]
    }
    return templates.TemplateResponse("map.html", {"request": request, "data": req})
