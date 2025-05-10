FROM node:18 as builder

WORKDIR /app/frontend

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install vite

COPY ./frontend /app/frontend
RUN npm run build