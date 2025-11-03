@echo off
chcp 65001 >nul
echo ========================================
echo Betradar Data Download
echo ========================================
echo.

echo Downloading Betradar event data...
echo ----------------------------------------
call npx playwright test Download.spec.js

if %errorlevel% neq 0 (
    echo.
    echo [Error] Download failed! Please check network connection or login credentials.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo [Complete] Data download successful!
echo ========================================
echo.
echo Downloaded files location: downloads\
echo.
pause
