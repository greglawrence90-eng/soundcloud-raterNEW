#!/bin/bash

echo "🎵 Starting SoundCloud Rater..."
echo ""

# Start backend in background
echo "Starting backend server on http://localhost:3001..."
cd backend && npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd ../frontend && npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
