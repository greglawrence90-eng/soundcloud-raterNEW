FROM node:18

  WORKDIR /app

  # Install build dependencies for better-sqlite3
  RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

  # Copy package files
  COPY package.json ./
  COPY backend/package*.json ./backend/
  COPY frontend/package*.json ./frontend/

  # Copy source code first
  COPY backend ./backend
  COPY frontend ./frontend

  # Install and build dependencies
  RUN cd backend && npm install --build-from-source
  RUN cd frontend && npm install

  # Build frontend
  RUN cd frontend && npm run build

  # Set working directory to backend
  WORKDIR /app/backend

  # Start server
  CMD ["node", "server.js"]
