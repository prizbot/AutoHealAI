@echo off
echo.
echo ==========================================
echo   AutoHealAI v2 -- Windows Setup
echo ==========================================
echo.

cd /d "%~dp0"

echo [1/4] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 ( echo ERROR: pip install failed & pause & exit /b 1 )
echo       Done.

echo [2/4] Generating synthetic training dataset...
python simulation\data_generator.py
if %errorlevel% neq 0 ( echo ERROR: data_generator failed & pause & exit /b 1 )
echo       Done.

echo [3/4] Training ML ensemble model...
python ml_models\train.py
if %errorlevel% neq 0 ( echo ERROR: train.py failed & pause & exit /b 1 )
echo       Done.

echo [4/4] Installing frontend Node.js dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 ( echo ERROR: npm install failed & pause & exit /b 1 )
cd ..
echo       Done.

echo.
echo ==========================================
echo   Setup complete!
echo   Run start_backend.bat  in Terminal 1
echo   Run start_frontend.bat in Terminal 2
echo ==========================================
pause
