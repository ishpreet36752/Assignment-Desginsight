@echo off
echo Starting DesignSight with Docker...

REM Check if .env file exists
if not exist "backend\.env" (
    echo Creating .env file from example...
    copy "backend\env.example" "backend\.env"
    echo Please edit backend\.env with your API keys before running again
    pause
    exit /b 1
)

REM Start all services
docker-compose up --build

echo DesignSight is running at:
echo Frontend: http://localhost:5173
echo Backend: http://localhost:5000
echo MongoDB Express: http://localhost:8081 (admin/admin123)
pause
