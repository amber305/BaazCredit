@echo off
echo Starting BaazCredit Services...

echo Starting ML Microservice...
start "Python ML Service" cmd /k "cd ml_service && ..\base_env\Scripts\activate && uvicorn app.main:app --reload --port 8000"

echo Starting Node Backend...
start "Node Backend" cmd /k "cd backend && npm run dev"

echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo All services are starting up! 
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:5000
echo ML Service API: http://127.0.0.1:8000
