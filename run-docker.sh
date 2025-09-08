#!/bin/bash

echo "Starting DesignSight with Docker..."

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file from example..."
    cp backend/env.example backend/.env
    echo "Please edit backend/.env with your API keys before running again"
    exit 1
fi

# Start all services
docker-compose up --build

echo "DesignSight is running at:"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:5000"
echo "MongoDB Express: http://localhost:8081 (admin/admin123)"
