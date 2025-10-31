# Build Windows Desktop App without Code Signing
# This avoids the symbolic link permission errors

Write-Host "Building The Path Desktop App..." -ForegroundColor Cyan
Write-Host ""

# Disable code signing
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"

# Run the build
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Running electron-builder..." -ForegroundColor Cyan
electron-builder --win

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: Build Complete!" -ForegroundColor Green
    Write-Host "Installer location: release\" -ForegroundColor Cyan
    Write-Host ""
    
    # List the created files
    $exeFiles = Get-ChildItem release -Filter *.exe
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
