# Step 1: Build React/Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve via Nginx + Python Telemetry
FROM nginx:alpine

# Install Python, Pip, dan Virtual Environment
RUN apk add --no-cache python3 py3-pip

# Install backend dependencies untuk telemetry
RUN python3 -m venv /venv && \
    /venv/bin/pip install --no-cache-dir flask flask-cors psutil

WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY stats.py /app/stats.py

EXPOSE 80
CMD /venv/bin/python3 /app/stats.py & nginx -g "daemon off;"