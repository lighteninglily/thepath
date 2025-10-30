# Git Setup and Initial Push Script

Write-Host "Setting up Git configuration..."
git config user.email "lighteninglily@users.noreply.github.com"
git config user.name "lighteninglily"

Write-Host "Creating initial commit..."
git commit -m "Initial commit - Church Presentation Software with dual-screen system"

Write-Host "Setting default branch to main..."
git branch -M main

Write-Host "Pushing to GitHub..."
git push -u origin main

Write-Host ""
Write-Host "✅ Successfully pushed to GitHub!" -ForegroundColor Green
Write-Host "Repository: https://github.com/lighteninglily/thepath" -ForegroundColor Cyan
