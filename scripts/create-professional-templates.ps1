# Script to create professional template file
$templatePath = Join-Path $PSScriptRoot ".." "src" "config" "slideTemplatesFixed.ts"
$backupPath = Join-Path $PSScriptRoot ".." "src" "config" "slideTemplatesFixed.backup.ts"

# Backup existing file
if (Test-Path $templatePath) {
    Copy-Item -LiteralPath $templatePath -Destination $backupPath -Force
    Write-Host "✅ Backed up existing template file"
}

# The new professional template content will be written by Node.js script
Write-Host "✅ Ready for template generation"
Write-Host "Run: node scripts/generate-professional-templates.js"
