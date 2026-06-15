# PowerShell script to start backend and frontend
Write-Host "Starting backend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; mvn spring-boot:run"

Write-Host "Starting frontend..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npx expo start"

Write-Host "Both servers started in separate PowerShell windows."
