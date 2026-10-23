# Step 1: Build React/Vite app
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve via Nginx + Python Telemetry
FROM nginx:alpine
RUN apk add --no-python3 python3 py3-pip py3-psutil py3-flask py3-flask-cors
WORKDIR /app
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY stats.py /app/stats.py

# Script runner paralel (Nginx + Python)
CMD python3 /app/stats.py & nginx -g "daemon off;"