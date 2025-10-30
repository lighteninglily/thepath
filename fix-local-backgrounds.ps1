# Delete and recreate localBackgrounds.ts with empty exports

$filePath = "src\assets\localBackgrounds.ts"

# Remove old file
if (Test-Path $filePath) {
    Remove-Item $filePath
    Write-Host "Deleted old file"
}

# Create new file with correct content
$content = @'
/**
 * Local background images from assets folder
 * 
 * NOTE: Currently disabled - local image files don't exist
 * Using Unsplash URLs from backgroundConfig.ts instead
 */

import type { BackgroundImage } from './backgrounds';

// Return empty array - local images not available
export const LOCAL_BACKGROUNDS: BackgroundImage[] = [];

export function getAllBackgrounds(): BackgroundImage[] {
  return LOCAL_BACKGROUNDS;
}
'@

Set-Content -Path $filePath -Value $content
Write-Host "✅ Created new localBackgrounds.ts"
