FROM python:3.13-slim

WORKDIR ./backend

RUN mkdir -p /app/backend

COPY ./backend/pyproject.toml ./backend/poetry.lock /app/backend/

WORKDIR /app/backend

RUN pip install --upgrade pip && \
    pip install --no-cache-dir poetry==2.0.1 && \
    poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root && \
    rm -rf $(poetry config cache-dir)/{cache,artifacts}

COPY ./backend /app/backend

RUN mkdir -p /app/backend/src/adapters/entrypoints/static

ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.src.main:app", "--host", "0.0.0.0", "--port", "8000"]