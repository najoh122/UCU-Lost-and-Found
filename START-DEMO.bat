@echo off
cd /d "%~dp0"
echo ===== UCU Lost and Found - starting demo =====
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install the LTS version from https://nodejs.org then double-click this file again.
  pause
  exit /b 1
)
echo Installing libraries. This can take 1 to 3 minutes the first time...
call npm install --legacy-peer-deps
if errorlevel 1 (
  echo.
  echo INSTALL FAILED. Take a photo of the red text above and send it for help.
  pause
  exit /b 1
)
echo.
echo Starting the app. Your browser will open. Keep this window open. Press Ctrl+C to stop.
call npm run demo -- --open
pause
