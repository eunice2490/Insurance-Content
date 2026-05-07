@echo off
title AI Insurance Content Generator

echo.
echo  ========================================
echo   AI Insurance Content Generator
echo   Powered by Claude AI + ChatGPT Image 2
echo  ========================================
echo.

:: Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  [ERROR] Node.js is not installed.
    echo  Please download it from https://nodejs.org
    echo.
    pause
    exit /b 1
)

:: Install dependencies if missing
if not exist "node_modules" (
    echo  Installing dependencies, please wait...
    echo.
    npm install
    echo.
)

:: Check for .env.local
if not exist ".env.local" (
    echo  [SETUP] Creating .env.local from example...
    copy .env.local.example .env.local >nul
    echo.
    echo  !! ACTION REQUIRED !!
    echo  Open .env.local in Notepad and add your ANTHROPIC_API_KEY
    echo  Then close this window and run start.bat again.
    echo.
    start notepad .env.local
    pause
    exit /b 0
)

:: Start the app
echo  Starting app at http://localhost:3000
echo  Press Ctrl+C to stop the server.
echo.

:: Open browser after 4 seconds
start /b cmd /c "timeout /t 4 >nul && start http://localhost:3000"

npm run dev
pause
