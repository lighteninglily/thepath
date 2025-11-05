# 🎨 How to Replace the App Icon with The Path "S" Logo

## Current Icon Location

The app icon is located at:
```
build/icon.png
```

---

## To Replace with Your Logo:

### Option 1: Replace Existing File
1. Create a **256x256 PNG** of the "S" from The Path logo
2. Save it as `build/icon.png` (overwrite existing)
3. Rebuild: `npm run dist:win`

### Option 2: Use Existing Logo
If your logo is already in `src/assets/logo.png`:
1. **Copy** `src/assets/logo.png` to `build/icon.png`
2. Or create a PowerShell script:
   ```powershell
   Copy-Item "src/assets/logo.png" "build/icon.png" -Force
   ```
3. Rebuild: `npm run dist:win`

---

## Icon Requirements

### For Best Results:
- **Format**: PNG (will be converted to ICO automatically)
- **Size**: 256x256 pixels minimum
- **Recommended**: 512x512 or 1024x1024 for high-DPI displays
- **Background**: Transparent or solid color
- **Square**: Equal width and height

### What Electron Builder Does:
- Automatically converts PNG → ICO for Windows
- Creates multiple sizes (16x16, 32x32, 48x48, 256x256)
- Applies to:
  - Taskbar icon
  - Window title bar
  - Alt+Tab switcher
  - Installer icon
  - Desktop shortcut

---

## Quick Copy Command

If your logo is ready:
```powershell
# From project root
Copy-Item "path/to/your/logo.png" "build/icon.png" -Force
npm run dist:win
```

---

## Current Status

✅ **App now loads correctly** (protocol handler fixed)  
🎨 **Icon**: Currently using `build/icon.png`  
📝 **Next**: Replace with your "S" logo and rebuild

---

## After Replacing Icon

1. Delete old builds:
   ```powershell
   Remove-Item release/* -Force
   ```

2. Rebuild:
   ```powershell
   npm run dist:win
   ```

3. New icon will appear in:
   - Window title bar
   - Taskbar
   - Desktop shortcut
   - Installer

---

## Note

The icon in the **web interface** (library page, etc.) is separate and loaded from:
- `src/assets/logo.png` - Used in React components
- `public/icon.svg` - Used in index.html

The `build/icon.png` is **only** for the Windows executable/installer.
