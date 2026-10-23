# Step 1: Build React/Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve via Nginx + Python Telemetry
FROM nginx:alpine

# Install Python & Pip
RUN apk add --no-cache python3 py3-pip

# Install psutil, flask, flask-cors via pip
RUN python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir flask flask-cors psutil

WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY stats.py /app/stats.py

# Jalankan backend Python via virtualenv & Nginx
CMD /venv/bin/python3 /app/stats.py & nginx -g "daemon off;"