@echo off
cd /d "%~dp0"
echo Starting AutoHealAI v2 Backend on http://localhost:8000 ...
echo API Docs: http://localhost:8000/docs
echo.
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
