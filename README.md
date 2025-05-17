<div align = center>

<h1>(MVP) Adventures</h1>

<br>

Adventures - REST API для планирования этапов вашего путешествия.

<br>

![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?logo=fastapi)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?logo=SQLAlchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?logo=Pydantic&logoColor=white)
![Poetry](https://img.shields.io/badge/Poetry-60A5FA?logo=Poetry&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)
<br>
![License: MIT](https://img.shields.io/badge/License-MIT-blue)
</div>

<br>

<h1>Возможности</h1>
<ul>
    <li>Регистрация и аутентификация пользователей (JWT/Куки)</li>
    <li>Администрирование пользователей сквозь призму системы прав разграничений уровня доступа (гранулярный доступ - роли)</li>
    <li>Создание путешествий c возможностью выбора транспорта (самолет/машина), произвольного количества точек, отображения графического представления на карте (Yandex API), поиска аэропорта по базе ICAO-кодов, сохранения созданного путешествия и дальнейшего его просмотра, суммарный подсчет стоимости путешествия (с возможностью конвертации в различных валютах согласно актуальному курсу), а также отображение корректного часового пояса в выбранном пункте назначения (TimeZoneDB)</li>
    <li>Просмотр небольшой статистики (наиболее популярное место отдыха, время года путешествий, самая релевантная гостиница и предпочитаемый вид транспорта)</li>
</ul>

<br>

<div align = center>

<h1>API endpoints</h1>

</div>

<h3>Домашняя странциа</h3>

`[GET] /api/v1` - Главная страница

<h3>Аутентификация</h3>

`[GET] /api/v1/auth/register/` - Страница регистрации<br>
`[POST] /api/v1/auth/register/` - Регистрация<br>
`[GET] /api/v1/auth/login/` - Страница входа в систему<br>
`[POST] /api/v1/auth/login/` - Вход в систему<br>
`[POST] /api/v1/auth/logout/` - Выход из системы<br>

<h3>Пользователи</h3>

`[GET] /api/v1/users/profile/` - Профиль пользователя<br>
`[GET] /api/v1/users/` - Получить всех пользователей<br>
`[GET] /api/v1/users/filter` - Поиск пользователя по Имени/Фамилии<br>
`[GET] /api/v1/users/statistics/` - Получить статистику<br>
`[GET] /api/v1/users/{id_user}/` - Получить пользователя по id<br>
`[DELETE] /api/v1/users/{id_user}/` - Удалить пользователя по id<br>
`[PATCH] - /api/v1/users/{id_user}/role/{id_role}/` - Смена роли пользователя<br>

<h3>Приложение</h3>

`[GET] /api/v1/app/new_trip/` - Страница создания нового путешествия<br>
`[GET] /api/v1/app/new_trip/airport` - Поиск аэропорта/ICAO кода<br>
`[GET] /api/v1/app/map/` - Отображения Yandex Map<br>
`[GET] /api/v1/app/saved_trips/` - Страница сохраненных путешествий пользователя<br>
`[GET] /api/v1/app/saved_trips/{id_trip}` - Получить сохраненное путешествие по id<br>
`[POST] /api/v1/app/submit/` - Подтверждение к отправке созданного путешествия на сервер<br>
`[POST] /api/v1/app/send/` - Отправка созданного путешествия в БД<br>
`[POST] /api/v1/app/location/` - Получить местоположение для определения часового пояса<br>

<div align = center>
<h1>Документация</h1>
</div>

Swagger: `http://localhost:8000/docs`
<br>
ReDoc: `http://localhost:8000/redoc`

<div align = center>
<h1>Структура проекта</h1>
</div>


```bash
├── LICENSE
├── README.md
├── backend
   ├── Dockerfile
   ├── __init__.py
   ├── __pycache__
   ├── alembic.ini
   ├── poetry.lock
   ├── pyproject.toml
   ├── requirements.txt
   └── src
        ├── __init__.py
        ├── adapters
        │   ├── __init__.py
        │   └── entrypoints
        │       ├── __init__.py
        │       ├── api
        │       │   ├── __init__.py
        │       │   ├── routers.py
        │       │   └── v1
        │       │       ├── __init__.py
        │       │       ├── auth
        │       │       │   ├── __init__.py
        │       │       │   └── auth_router.py
        │       │       ├── icao
        │       │       │   ├── __init__.py
        │       │       │   └── icao_router.py
        │       │       ├── index
        │       │       │   ├── __init__.py
        │       │       │   └── index_router.py
        │       │       └── users
        │       │           ├── __init__.py
        │       │           └── users_router.py
        │       ├── static
        │       │   ├── base.css
        │       │   ├── icao
        │       │   │   ├── 0_fMz62Ks_u0QvVQ1E.png
        │       │   │   ├── autocomplete.js
        │       │   │   ├── map.css
        │       │   │   ├── rate.js
        │       │   │   ├── test.js
        │       │   │   ├── timer.js
        │       │   │   └── trips.css
        │       │   └── users
        │       │       ├── assets
        │       │       │   ├── airplane_icon.png
        │       │       │   ├── roles_icon.png
        │       │       │   └── user_icon.png
        │       │       └── users.css
        │       ├── templates
        │       │   ├── auth
        │       │   │   ├── login.html
        │       │   │   └── register.html
        │       │   ├── base.html
        │       │   ├── trips
        │       │   │   ├── form.html
        │       │   │   ├── map-old.html
        │       │   │   ├── map-other.html
        │       │   │   ├── map.html
        │       │   │   ├── my_trips.html
        │       │   │   └── saved.html
        │       │   └── users
        │       │       ├── all_users.html
        │       │       ├── current_user.html
        │       │       ├── profile.html
        │       │       └── statistics.html
        │       └── utilities
        │           ├── __init__.py
        │           ├── auth.py
        │           └── dependencies.py
        ├── configurator
        │   ├── __init__.py
        │   └── config.py
        ├── domain
        │   ├── __init__.py
        │   ├── models
        │   │   ├── __init__.py
        │   │   ├── airport.py
        │   │   ├── trip.py
        │   │   ├── trip_point.py
        │   │   └── user.py
        │   ├── ports
        │   │   ├── __init__.py
        │   │   ├── airport_repository.py
        │   │   ├── trip_repository.py
        │   │   └── user_repository.py
        │   └── schemas
        │       ├── __init__.py
        │       └── users.py
        ├── infrastructure
        │   ├── __init__.py
        │   └── db
        │       ├── __init__.py
        │       ├── dao
        │       │   ├── __init__.py
        │       │   ├── airport.py
        │       │   ├── trip.py
        │       │   └── users.py
        │       ├── database.py
        │       └── migration
        │           ├── README
        │           ├── __init__.py
        │           ├── data
        │           │   └── icao.csv
        │           ├── env.py
        │           ├── script.py.mako
        │           └── versions
        │               ├── 09458a9f8bba_create_users_table.py
        │               ├── 4cdd72cd7989_create_save_trips.py
        │               ├── 5e897b6b8061_create_icao_table.py
        │               ├── 88bbee1de683_create_roles_table.py
        │               ├── 950f5c02cfc9_updated_users_table.py
        │               ├── __init__.py
        │                   
        └── main.py
── docker-compose.yml
── frontend
   ├── Dockerfile
   ├── node_modules
   ├── package-lock.json
   ├── package.json
   ├── react-apps
   ├── static
   └── vite.config.js
── venv
    ├── bin
    ├── include
    ├── lib
    └── pyvenv.cfg
```

<div align = center>
<h1>Галерея</h1>
</div>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/login.png" alt="Вход">
  <br>
  <em>Вход в систему</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/register.png" alt="Вход">
  <br>
  <em>Регистрация</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/admin_panel.png" alt="Вход">
  <br>
  <em>Админ панель</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/statistics.png" alt="Вход">
  <br>
  <em>Статистика</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/map.png" alt="Вход">
  <br>
  <em>Создание путешествия</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/trip_submit.png" alt="Вход">
  <br>
  <em>Подтверждение путешествия</em>
</p>

<br>

<p align="center">
  <img src="https://github.com/butERRORfly/IT-project/blob/main/assets/saved_trips.png" alt="Вход">
  <br>
  <em>Сохраненные путешествия</em>
</p>


