# PowerShell script to create clean copies of template assets
# This duplicates files with URL-safe names for Vite imports

$sourceDir = "C:\Users\rsbiz\Documents\Church Slides\src\assets"
$targetDir = "C:\Users\rsbiz\Documents\Church Slides\src\assets\templates"

# Create target directory if it doesn't exist
if (!(Test-Path -Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
    Write-Host "Created directory: $targetDir"
}

# BB Series (Modern Worship) - Use LiteralPath to handle special characters
Write-Host "`nCopying BB Series..."
Copy-Item -LiteralPath "$sourceDir\bb (1).jpg" -Destination "$targetDir\bb-1.jpg" -Force
Copy-Item -LiteralPath "$sourceDir\bb (2).jpg" -Destination "$targetDir\bb-2.jpg" -Force
Copy-Item -LiteralPath "$sourceDir\bb (3).jpg" -Destination "$targetDir\bb-3.jpg" -Force
Copy-Item -LiteralPath "$sourceDir\bb (4).jpg" -Destination "$targetDir\bb-4.jpg" -Force
Copy-Item -LiteralPath "$sourceDir\bb (5).jpg" -Destination "$targetDir\bb-5.jpg" -Force
Write-Host "Copied 5 BB images"

# B&W Series (Dramatic Black & White)
Write-Host "`nCopying B&W Series..."
Copy-Item "$sourceDir\11 -bw `(1`).jpg" "$targetDir\bw-1.jpg" -Force
Copy-Item "$sourceDir\11 -bw `(2`).jpg" "$targetDir\bw-2.jpg" -Force
Copy-Item "$sourceDir\11 -bw `(3`).jpg" "$targetDir\bw-3.jpg" -Force
Write-Host "Copied 3 B&W images"

# RP Series (Nature/Worship Scenes)
Write-Host "`nCopying RP Series..."
Copy-Item "$sourceDir\Rp `(1`).jpg" "$targetDir\rp-1.jpg" -Force
Copy-Item "$sourceDir\Rp `(2`).jpg" "$targetDir\rp-2.jpg" -Force
Copy-Item "$sourceDir\Rp `(3`).jpg" "$targetDir\rp-3.jpg" -Force
Write-Host "Copied 3 RP images"

Write-Host "`n✅ All template assets prepared!"
Write-Host "Total files created: 11"
Write-Host "Location: $targetDir"
