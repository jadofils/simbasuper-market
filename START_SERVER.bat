@echo off
echo ========================================
echo   Simba Supermarket - Local Server
echo ========================================
echo.
echo Starting server on http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

python -m http.server 8000

pause
