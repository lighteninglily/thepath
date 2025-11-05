# PowerShell script to download all background images locally
# This ensures instant loading with no network dependency

Write-Host "Downloading background images..." -ForegroundColor Cyan

# Create backgrounds directory
$backgroundsDir = "public\backgrounds"
if (-not (Test-Path $backgroundsDir)) {
    New-Item -ItemType Directory -Path $backgroundsDir -Force | Out-Null
    Write-Host "Created directory: $backgroundsDir" -ForegroundColor Green
}

# Background image URLs from backgrounds.ts - ALL 26 IMAGES
$images = @(
    # Mountains (3)
    @{id="mountain-1"; url="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80"},
    @{id="mountain-3"; url="https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80"},
    @{id="mountain-5"; url="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80"},
    
    # Forest (3)
    @{id="forest-1"; url="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80"},
    @{id="forest-3"; url="https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80"},
    @{id="forest-8"; url="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"},
    
    # Waves (3)
    @{id="waves-1"; url="https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80"},
    @{id="waves-2"; url="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80"},
    @{id="waves-3"; url="https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80"},
    
    # Water (2)
    @{id="water-1"; url="https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80"},
    @{id="water-2"; url="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80"},
    
    # Clouds (3)
    @{id="clouds-1"; url="https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80"},
    @{id="clouds-3"; url="https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=1920&q=80"},
    @{id="clouds-4"; url="https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1920&q=80"},
    
    # Sky (1)
    @{id="sky-1"; url="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80"},
    
    # Abstract (4)
    @{id="abstract-1"; url="https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80"},
    @{id="abstract-2"; url="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80"},
    @{id="abstract-3"; url="https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80"},
    @{id="abstract-4"; url="https://images.unsplash.com/photo-1561212044-bac5ef688a07?w=1920&q=80"},
    
    # Light (4)
    @{id="light-1"; url="https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80"},
    @{id="light-2"; url="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80"},
    @{id="light-3"; url="https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80"},
    @{id="light-4"; url="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80"},
    
    # Cross (3)
    @{id="cross-1"; url="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80"},
    @{id="cross-2"; url="https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80"},
    @{id="cross-3"; url="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80"}
)

$downloaded = 0
$skipped = 0
$failed = 0

foreach ($image in $images) {
    $filename = "$($image.id).jpg"
    $filepath = Join-Path $backgroundsDir $filename
    
    # Check if already downloaded
    if (Test-Path $filepath) {
        Write-Host "Skipped: $filename (already exists)" -ForegroundColor Yellow
        $skipped++
        continue
    }
    
    try {
        Write-Host "Downloading: $filename..." -ForegroundColor Cyan
        Invoke-WebRequest -Uri $image.url -OutFile $filepath -UseBasicParsing
        
        # Verify download
        if ((Get-Item $filepath).Length -gt 10KB) {
            Write-Host "Downloaded: $filename" -ForegroundColor Green
            $downloaded++
        } else {
            Write-Host "Failed: $filename (file too small)" -ForegroundColor Red
            Remove-Item $filepath
            $failed++
        }
    }
    catch {
        Write-Host "Error downloading $filename : $_" -ForegroundColor Red
        $failed++
    }
    
    # Small delay to be nice to Unsplash servers
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "Download Summary:" -ForegroundColor Cyan
Write-Host "  Downloaded: $downloaded" -ForegroundColor Green
Write-Host "  Skipped: $skipped" -ForegroundColor Yellow
Write-Host "  Failed: $failed" -ForegroundColor Red
Write-Host ""
Write-Host "Background images are now stored locally for instant loading!" -ForegroundColor Green
