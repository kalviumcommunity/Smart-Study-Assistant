@echo off
echo 🚀 Starting Smart Study Assistant Development Environment
echo.

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo.
echo 🧪 Testing API connection...
call node test-api.js

echo.
echo 🖥️ Starting backend server...
start "Backend Server" cmd /k "npm start"

echo.
echo ⏳ Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install

echo.
echo 🌐 Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo ✅ Development environment started!
echo 📍 Backend: http://localhost:3000
echo 📍 Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul