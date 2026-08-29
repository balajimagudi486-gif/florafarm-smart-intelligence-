@echo off
title FloraFarm - Smart Intelligence for Healthier Crops
color 0A

echo.
echo  ============================================
echo    FloraFarm - Smart Intelligence for Healthier Crops
echo    Detect. Understand. Nourish.
echo  ============================================
echo.

:: Set Node.js path
set "PATH=C:\nodejs;%PATH%"

echo  [1/2] Starting FloraFarm Backend (FastAPI - Port 8000)...
start "FloraFarm Backend" cmd /k "cd /d %~dp0backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload && pause"

:: Wait 3 seconds for backend to initialize
timeout /t 3 /nobreak >nul

echo  [2/2] Starting FloraFarm Frontend (Vite - Port 5173)...
start "FloraFarm Frontend" cmd /k "cd /d %~dp0frontend && npm run dev && pause"

:: Wait for frontend to start
timeout /t 4 /nobreak >nul

echo.
echo  ============================================
echo    FloraFarm is now running!
echo.
echo    Frontend:  http://localhost:5173
echo    Backend:   http://localhost:8000
echo    API Docs:  http://localhost:8000/docs
echo  ============================================
echo.
echo  Opening FloraFarm in your browser...
timeout /t 2 /nobreak >nul
start http://localhost:5173

echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop FloraFarm.
echo.
pause
