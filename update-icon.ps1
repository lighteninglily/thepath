# Update App Icon Script
# Copies your logo to the build folder and rebuilds the app

Write-Host "Updating app icon..." -ForegroundColor Cyan
Write-Host ""

# Check if logo exists
if (Test-Path "src\assets\logo.png") {
    Write-Host "✓ Found logo at src\assets\logo.png" -ForegroundColor Green
    
    # Copy to build folder
    Copy-Item "src\assets\logo.png" "build\icon.png" -Force
    Write-Host "✓ Copied logo to build\icon.png" -ForegroundColor Green
    Write-Host ""
    
    # Ask to rebuild
    $rebuild = Read-Host "Rebuild app with new icon? (y/n)"
    
    if ($rebuild -eq 'y') {
        Write-Host ""
        Write-Host "Rebuilding app..." -ForegroundColor Cyan
        npm run dist:win
    } else {
        Write-Host ""
        Write-Host "Icon updated. Run 'npm run dist:win' when ready to rebuild." -ForegroundColor Yellow
    }
} else {
    Write-Host "✗ Logo not found at src\assets\logo.png" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please either:" -ForegroundColor Yellow
    Write-Host "  1. Place your logo at src\assets\logo.png" -ForegroundColor Yellow
    Write-Host "  2. Or manually copy it to build\icon.png" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Done!" -ForegroundColor Green
