# Build Portable Windows App (no installer, no signing needed)

Write-Host "Building The Path Portable App..." -ForegroundColor Cyan
Write-Host ""

# Clear the problematic cache
$cachePath = "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign"
if (Test-Path $cachePath) {
    Write-Host "Clearing winCodeSign cache..." -ForegroundColor Yellow
    Remove-Item -Path $cachePath -Recurse -Force -ErrorAction SilentlyContinue
}

# Disable ALL code signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:CSC_LINK = ""

# Build only portable exe (no installer needed)
Write-Host "Building portable executable..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

# Run electron-builder with portable target only
electron-builder --win portable --config.win.sign=null

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Build Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Portable app location: release\" -ForegroundColor Cyan
    Write-Host ""
    
    # List created files
    Get-ChildItem release -Filter *.exe -ErrorAction SilentlyContinue | ForEach-Object {
        $sizeMB = [math]::Round($_.Length / 1048576, 2)
        Write-Host "  $($_.Name) - $sizeMB MB" -ForegroundColor White
    }
    
    Write-Host ""
    Write-Host "The portable .exe can be run directly without installation!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}
