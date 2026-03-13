FROM node:18-alpine

  WORKDIR /app

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

  # EXPOSE 8080

  # Start backend server
  CMD ["npm", "start"]
