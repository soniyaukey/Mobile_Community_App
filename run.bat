@echo off
echo Starting backend...
start "Backend" cmd /k "cd backend && mvn spring-boot:run"

echo Starting frontend...
start "Frontend" cmd /k "cd frontend && npx expo start"

echo Both servers are starting in separate windows.
