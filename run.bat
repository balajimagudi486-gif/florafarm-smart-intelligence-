@echo off
title FloraFarm - AI Crop Disease & Agricultural Assistant
color 0A

echo.
echo  =============================================================
echo    FloraFarm - Smart Intelligence for Healthier Crops
echo    Detect. Understand. Nourish.
echo  =============================================================
echo.

:: Add Node.js and Python to PATH if not already present
set "PATH=C:\nodejs;C:\Users\DELL\AppData\Local\Microsoft\WindowsApps;C:\Users\DELL\AppData\Local\Python\pythoncore-3.14-64;%PATH%"

echo  [1/3] Starting FloraFarm Backend (FastAPI - Port 8000)...
start "FloraFarm Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo  [2/3] Starting FloraFarm Frontend (Vite - Port 5173)...
start "FloraFarm Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo  [3/3] Waiting for servers to initialize...
timeout /t 5 /nobreak >nul

echo.
echo  =============================================================
echo    FloraFarm is now running!
echo.
echo    - Frontend UI:   http://localhost:5173
echo    - Backend API:   http://localhost:8000
echo    - Swagger Docs:  http://localhost:8000/docs
echo  =============================================================
echo.
echo  Opening http://localhost:5173 in your default browser...
start http://localhost:5173

echo.
echo  Both servers are running in separate terminal windows.
echo  Close those windows or press Ctrl+C inside them to stop.
echo.
pause
