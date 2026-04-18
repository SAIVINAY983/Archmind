@echo off
echo Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Starting ArchMind Backend...
start /B cmd /c "cd backend && npm start"

echo Starting ArchMind Frontend on port 5566...
start /B cmd /c "cd frontend && npm run dev"

echo.
echo ArchMind is starting! 
echo Please wait a few seconds, then open: http://localhost:5566
echo.
pause
