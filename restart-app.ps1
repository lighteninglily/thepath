# Restart Electron App Script
Write-Host "🔄 Restarting Church Slides..." -ForegroundColor Cyan

# Kill any running Electron processes
Get-Process | Where-Object {$_.ProcessName -like "*electron*" -or $_.ProcessName -like "*church*"} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "✅ Stopped running app" -ForegroundColor Green

# Wait a moment
Start-Sleep -Seconds 1

# Rebuild
Write-Host "🔨 Rebuilding..." -ForegroundColor Yellow
npm run build:electron

# Start dev server
Write-Host "🚀 Starting app..." -ForegroundColor Green
npm run dev:electron
