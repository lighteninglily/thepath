#!/usr/bin/env pwsh

Write-Host "Cleaning previous builds..." -ForegroundColor Cyan
Remove-Item -Path "release" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Setting code signing environment variables..." -ForegroundColor Cyan
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:CSC_LINK = ""

Write-Host "Building application..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "Creating Windows installer..." -ForegroundColor Cyan
electron-builder --win --config.win.sign=./no-sign.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Build complete! Check the release folder." -ForegroundColor Green
    Write-Host ""
    
    # List created files
    $exeFiles = Get-ChildItem release -Filter *.exe -ErrorAction SilentlyContinue
    if ($exeFiles) {
        foreach ($file in $exeFiles) {
            $sizeMB = [math]::Round($file.Length / 1048576, 2)
            Write-Host "  $($file.Name) - $sizeMB MB" -ForegroundColor White
        }
    }
} else {
    Write-Host ""
    Write-Host "ERROR: Build failed!" -ForegroundColor Red
    exit 1
}

