@echo off
REM setup.bat - Local development environment setup for Windows

echo.
echo ===== Carbon Footprint System Setup =====
echo.

REM Check .NET SDK
dotnet --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] .NET SDK not found. Install from https://dotnet.microsoft.com/download
    exit /b 1
)
for /f "tokens=*" %%i in ('dotnet --version') do set DOTNET_VERSION=%%i
echo [OK] .NET SDK %DOTNET_VERSION% found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found

REM Setup Backend
echo.
echo Setting up backend...
cd Backend
dotnet restore
if errorlevel 1 (
    echo [ERROR] Failed to restore backend dependencies
    exit /b 1
)
echo [OK] Backend dependencies restored
cd ..

REM Setup Frontend
echo.
echo Setting up frontend...
cd Frontend
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    exit /b 1
)
echo [OK] Frontend dependencies installed
cd ..

echo.
echo ===== Setup Complete =====
echo.
echo Next steps:
echo 1. Update Backend/appsettings.json with Azure credentials
echo 2. Run: cd Backend ^&^& dotnet run
echo 3. In a new terminal, run: cd Frontend ^&^& npm start
echo.
echo Frontend: http://localhost:3000
echo Backend: http://localhost:5000
echo.
pause
