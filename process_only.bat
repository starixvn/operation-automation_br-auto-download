@echo off
chcp 65001 >nul
echo ========================================
echo Betradar Data Processing
echo ========================================
echo.

echo Processing data and generating Excel files...
echo ----------------------------------------
call node process_data.js

if %errorlevel% neq 0 (
    echo.
    echo [Error] Data processing failed! Please check if CSV file exists.
    echo.
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================
echo [Complete] Data processing successful!
echo ========================================
echo.
echo Processed files location: processed_data\
echo.
pause
