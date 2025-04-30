Write-Host "Starting Math AI Calculator..." -ForegroundColor Cyan

# Setting environment variables
$env:MODEL_PATH = "C:/Users/ericd/AI Folder/Qwen2.5-Math-main"

# Start backend
Write-Host "Starting backend service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; python app.py"

# Wait for backend to start
Write-Host "Waiting for backend service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start frontend
Write-Host "Starting frontend service..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"

# Wait for frontend to start
Write-Host "Waiting for frontend service to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Open browser
Write-Host "Opening browser..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host "Math AI Calculator has been started!" -ForegroundColor Cyan
Write-Host "If the browser doesn't open automatically, please visit: http://localhost:5173" -ForegroundColor Cyan 