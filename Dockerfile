 FROM node:18

  WORKDIR /app

  # Install build dependencies for better-sqlite3
  RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

  # Copy package files
  COPY package.json ./
  COPY backend/package*.json ./backend/
  COPY frontend/package*.json ./frontend/

  # Install all dependencies
  RUN cd backend && npm install
  RUN cd frontend && npm install

  # Copy source code
  COPY backend ./backend
  COPY frontend ./frontend

  # Build frontend
  RUN cd frontend && npm run build

  # Set working directory to backend
  WORKDIR /app/backend

  # Start server directly
  CMD ["node", "server.js"]
