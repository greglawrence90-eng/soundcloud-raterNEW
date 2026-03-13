FROM node:18-slim

  WORKDIR /app

  # Copy package files
  COPY package.json ./
  COPY backend/package*.json ./backend/
  COPY frontend/package*.json ./frontend/

  # Copy source code
  COPY backend ./backend
  COPY frontend ./frontend

  # Install dependencies
  RUN cd backend && npm install
  RUN cd frontend && npm install

  # Build frontend
  RUN cd frontend && npm run build

  WORKDIR /app/backend

  CMD ["node", "server.js"]
