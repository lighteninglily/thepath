# 🚨 DESKTOP APP DEPLOYMENT ISSUES

**Project**: The Path - Church Presentation Software  
**Version**: 3.1.0  
**Date**: October 30, 2025  
**Goal**: Build Windows desktop installer using electron-builder

---

## ✅ WHAT WORKED

### 1. TypeScript Compilation - SUCCESS
- **Result**: All 40 TypeScript errors fixed ✅
- **Changes Made**:
  - Removed unused imports in `announcementTemplates.ts` (bb6-11, bw4-10, rp4-10)
  - Fixed `ElectronAPI` interface - added missing `updateService`, `deleteService`
  - Fixed type error in `useServices.ts` - date field handling (null → string)
  - Prefixed unused parameters with underscore (`_textColor`, `_fontSize`)
  - Disabled `localBackgrounds.ts` - files don't exist, replaced with empty exports
  - Fixed function name error in `AdvancedSlidePreview.tsx`
- **Command**: `npm run build:electron` - Compiles successfully
- **Status**: ✅ **WORKING**

### 2. React/Vite Build - SUCCESS
- **Result**: Vite builds the React app successfully ✅
- **Output**: 
  - `dist/index.html`
  - `dist/assets/*.js` and `*.css` files
  - Main bundle: 557 KB (warning about size, but builds)
- **Command**: `vite build` - Works perfectly
- **Status**: ✅ **WORKING**

### 3. Electron Packaging (Unpacked) - PARTIAL SUCCESS
- **Result**: Creates unpacked application ⚠️
- **Location**: `release/win-unpacked/` folder
- **Contains**: All application files, can be zipped and distributed
- **Issue**: Not an installer, just raw files
- **Status**: ⚠️ **WORKS BUT NOT IDEAL**

---

## ❌ WHAT DIDN'T WORK

### **MAIN ISSUE: Code Signing / winCodeSign Tool**

electron-builder keeps trying to download and extract `winCodeSign-2.6.0.7z` which fails with:

```
ERROR: Cannot create symbolic link : A required privilege is not held by the client.
ERROR: Cannot create symbolic link : C:\Users\rsbiz\AppData\Local\electron-builder\Cache\winCodeSign\<random>\darwin\10.12\lib\libcrypto.dylib
ERROR: Cannot create symbolic link: C:\Users\rsbiz\AppData\Local\electron-builder\Cache\winCodeSign\<random>\darwin\10.12\lib\libssl.dylib
```

**Root Cause**: Windows requires Administrator privileges to create symbolic links. The winCodeSign tool includes macOS files with symlinks that 7-Zip can't extract without elevation.

---

## 🔧 ATTEMPTED FIXES (ALL FAILED)

### Attempt 1: Disable Code Signing in Config
**File**: `package.json`  
**Changes**:
```json
"win": {
  "sign": null,
  "verifyUpdateCodeSignature": false
}
```
**Result**: ❌ electron-builder **IGNORED** this setting, still tried to download winCodeSign

---

### Attempt 2: Environment Variable (Inline)
**File**: `package.json`
```json
"dist:win": "npm run build && set CSC_IDENTITY_AUTO_DISCOVERY=false && electron-builder --win"
```
**Result**: ❌ Environment variable **NOT SET** properly in inline command

---

### Attempt 3: PowerShell Script (build-windows.ps1)
**File**: `build-windows.ps1`
```powershell
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
electron-builder --win
```
**Result**: ❌ electron-builder **IGNORED** the environment variable

---

### Attempt 4: Additional Signing Flags
**File**: `package.json`
```json
"win": {
  "signAndEditExecutable": false,
  "signDlls": false
}
```
**Result**: ❌ Still tried to download winCodeSign

---

### Attempt 5: Portable Build + Cache Clear
**File**: `build-portable.ps1`
```powershell
# Clear cache
Remove-Item "$env:LOCALAPPDATA\electron-builder\Cache\winCodeSign" -Recurse -Force

# Set multiple env vars
$env:CSC_IDENTITY_AUTO_DISCOVERY = "false"
$env:WIN_CSC_LINK = ""
$env:CSC_LINK = ""

# Build portable only
electron-builder --win portable --config.win.sign=null
```
**Result**: ❌ **NOT YET TESTED** (Current attempt)

---

## 📊 BUILD PROCESS FLOW

```
npm run dist:win
  ↓
npm run build (SUCCESS ✅)
  ↓
tsc (TypeScript compilation - SUCCESS ✅)
  ↓
vite build (React build - SUCCESS ✅)
  ↓
tsc -p tsconfig.electron.json (Electron TS - SUCCESS ✅)
  ↓
electron-builder --win
  ↓
electron-builder downloads winCodeSign-2.6.0.7z ⬅️ PROBLEM HERE
  ↓
7-Zip tries to extract with symlinks ⬅️ FAILS HERE
  ↓
❌ BUILD FAILS
```

---

## 🔍 ELECTRON-BUILDER BEHAVIOR

### What It Does:
1. Detects we're building for Windows
2. **Assumes** we want code signing (even though we don't)
3. Downloads `winCodeSign-2.6.0.7z` from GitHub
4. Tries to extract it using 7-Zip
5. Fails because the archive contains macOS symlinks
6. Retries 4 times (fails each time)
7. Exits with error

### Why It Ignores Our Settings:
- `"sign": null` - Documented but doesn't work
- `CSC_IDENTITY_AUTO_DISCOVERY=false` - Should work but doesn't
- electron-builder appears to have a bug or our syntax is wrong

---

## 💻 SYSTEM INFORMATION

**OS**: Windows 10/11 (Build 10.0.26100)  
**Node.js**: 18+ (assumed, not specified)  
**npm**: Latest  
**electron**: 28.3.3  
**electron-builder**: 24.13.3  
**7-Zip**: 21.07 (bundled with electron-builder)

**User Account**: **NOT** Administrator  
**Issue**: Cannot create symbolic links without elevation

---

## 📦 WHAT WE ACTUALLY HAVE

### Working Files:
- ✅ `release/win-unpacked/` - Full application, can run directly
- ✅ `dist/` - Built React app
- ✅ `dist-electron/` - Compiled Electron main process

### Missing:
- ❌ `The-Path-Setup-3.1.0.exe` - NSIS installer
- ❌ `The-Path-3.1.0.exe` - Portable executable

---

## 🎯 WHAT WE NEED

### Option 1: Installer (Preferred)
- NSIS installer (`The-Path-Setup-3.1.0.exe`)
- Creates Start Menu shortcuts
- Installs to Program Files
- **Requires fixing code signing issue**

### Option 2: Portable Executable (Acceptable)
- Single .exe file
- No installation needed
- Run directly
- **Might avoid code signing issue**

### Option 3: Unpacked (Current Workaround)
- Zip the `release/win-unpacked/` folder
- Users extract and run `The Path.exe`
- Works but not professional

---

## ❓ QUESTIONS FOR HELP

1. **How do we completely disable code signing in electron-builder?**
   - We don't have a certificate
   - We don't need signing for internal use
   - Current methods aren't working

2. **Can we build NSIS installer without code signing tools?**
   - Is winCodeSign required even without signing?
   - Can we use a different NSIS target?

3. **Why does electron-builder ignore our config?**
   - `"sign": null` does nothing
   - Environment variables are ignored
   - Is there a syntax issue?

4. **Can we build on a system with Administrator privileges?**
   - Would this solve the symlink issue?
   - Or would it just mask the real problem?

5. **Alternative build tools?**
   - Should we use electron-forge instead?
   - electron-packager?
   - Different approach entirely?

---

## 🛠️ POSSIBLE SOLUTIONS TO TRY

### Solution 1: Run as Administrator
```powershell
# Right-click PowerShell → Run as Administrator
npm run dist:win
```
**Pros**: Might fix symlink issue  
**Cons**: Not sustainable, requires elevation every time

---

### Solution 2: Manually Extract winCodeSign
```powershell
# Extract the 7z manually with --skip-symlinks or similar
# Place in cache before building
```
**Pros**: Might bypass extraction issue  
**Cons**: Complex, manual process

---

### Solution 3: Use electron-forge
```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make
```
**Pros**: Different tool, might not have same issue  
**Cons**: Requires reconfiguration

---

### Solution 4: Build on Different Machine
- Use GitHub Actions (cloud build)
- Use different Windows machine with admin access
- Use macOS or Linux (cross-compile might avoid winCodeSign)

**Pros**: Might work around local permission issues  
**Cons**: More complex setup

---

### Solution 5: Portable-Only Build
```json
"win": {
  "target": ["portable"]
}
```
**Pros**: Single exe, might skip code signing  
**Cons**: Currently also fails (untested if it avoids winCodeSign)

---

## 📝 CURRENT FILES

### Configuration Files:
- `package.json` - electron-builder config
- `build-windows.ps1` - Failed build script
- `build-portable.ps1` - Current attempt (untested)

### Build Output:
- `release/win-unpacked/` - ✅ Works
- `release/builder-effective-config.yaml` - Shows electron-builder settings
- `release/builder-debug.yml` - Debug info

---

## 🚀 NEXT STEPS

1. **Test current portable build** (`build-portable.ps1`)
2. **If fails**: Try running PowerShell as Administrator
3. **If still fails**: Consider electron-forge or GitHub Actions
4. **Workaround**: Distribute the `win-unpacked` folder as a zip

---

## 📚 USEFUL RESOURCES

- **electron-builder docs**: https://www.electron.build/
- **Code Signing Config**: https://www.electron.build/code-signing
- **Windows Target**: https://www.electron.build/configuration/win
- **Portable Target**: https://www.electron.build/configuration/nsis#portable

---

## ✅ SUMMARY

**PROBLEM**: electron-builder tries to download code signing tools even though we don't want/need code signing, and fails due to Windows permissions with symbolic links.

**WHAT WORKS**: Everything compiles. We can create the unpacked application.

**WHAT DOESN'T WORK**: Creating an installer or portable executable because electron-builder fails during the code signing tool download/extraction.

**BLOCKER**: Cannot disable code signing in electron-builder despite multiple attempts.

---

**Last Updated**: October 30, 2025 - 2:54 PM  
**Status**: 🔴 **BLOCKED** - Need help bypassing code signing requirement
