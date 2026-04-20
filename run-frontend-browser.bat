@echo off
echo.
echo ======================================
echo  Carbon Footprint Detection System
echo ======================================
echo.
echo Starting Frontend (React)...
echo.
echo Opening browser at http://localhost:3000
echo.
cd /d c:\xampp\htdocs\project1.0\Frontend
timeout /t 2 /nobreak
start http://localhost:3000
npm start
