# Save The Path logo as desktop icon
# This script will prompt you to save the logo image

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Desktop Icon Setup for The Path" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please save your logo image as:" -ForegroundColor Yellow
Write-Host "  build/icon.png" -ForegroundColor Green
Write-Host ""
Write-Host "Requirements:" -ForegroundColor Yellow
Write-Host "  - PNG format" -ForegroundColor White
Write-Host "  - Minimum 512x512 pixels (1024x1024 recommended)" -ForegroundColor White
Write-Host "  - Square aspect ratio" -ForegroundColor White
Write-Host ""
Write-Host "Opening the build folder for you..." -ForegroundColor Cyan

# Open the build folder in Explorer
Start-Process explorer.exe -ArgumentList "build"

Write-Host ""
Write-Host "After saving the logo:" -ForegroundColor Yellow
Write-Host "  1. Save your logo as 'icon.png' in the build folder" -ForegroundColor White
Write-Host "  2. Run: npm run dist:win" -ForegroundColor Green
Write-Host ""
Write-Host "The installer will then use your logo!" -ForegroundColor Cyan
