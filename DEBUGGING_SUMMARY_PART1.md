# 🔍 AUDIENCE WINDOW BLACK SCREEN - DEBUGGING SUMMARY PART 1

**Date**: November 5, 2025  
**Issue**: Audience window completely black in production  
**Status**: 🔴 UNRESOLVED after 10+ attempts  

---

## 📋 PROBLEM STATEMENT

### The Issue
Production build (`.\release\The Path 3.1.2.exe`) shows **completely black audience window** when presenting. No content, no diagnostic overlay, nothing.

### Environment
- ✅ **Dev mode works perfectly**: `npm run dev:electron`
- ❌ **Production fails**: Audience window black screen
- ✅ **Main window works** in both dev and production
- ✅ **Presenter window works** in both

---

## 🔍 KEY DIAGNOSTIC FINDINGS

### From DevTools (Audience Window)
When DevTools opens on audience window, it shows:

```
URL: chrome-error://chromewebdata/
HTML: <html><head></head><body></body></html>
ERROR: Response was blocked by CORB (Cross-Origin Read Blocking)
AFFECTED RESOURCE: "audience"
```

**Translation**: The HTML file is NOT loading. The page is completely empty.

### From Main Window Console
State sync IS working:
```javascript
🚀 INITIAL PRESENTATION SYNC - Sending first state to audience
✅ Initial state sent successfully to audience window
✅ ALL 26 IMAGES PRELOADED!
✅ Audience window opened
```

**Translation**: Presenter side works fine. IPC works. But audience page never loads to receive it.

---

## ✅ WHAT WORKS

1. **Main window** loads in production using:
   ```typescript
   mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
   ```

2. **Dev mode audience** window loads using:
   ```typescript
   presentationWindow.loadURL('http://localhost:5173/#/audience');
   ```

3. **IPC communication** works (logs confirm)

4. **File structure** correct:
   - `dist/index.html` exists
   - `dist/backgrounds/` has 27 images
   - `app.asar` contains all files

---

## ❌ WHAT DOESN'T WORK

1. **Loading index.html** in audience window (production)
2. **Hash routing** to `#/audience`
3. **React app initialization** in audience window
4. **Any JavaScript execution** in audience window

---

## 🔧 ALL ATTEMPTED FIXES

### Fix 1: Change Background Paths (Relative)
**File**: `src/assets/backgrounds.ts`
```typescript
// Changed from '/backgrounds/mountain-1.jpg' to:
url: './backgrounds/mountain-1.jpg'
```
**Result**: ❌ No change - page not loading anyway

### Fix 2: Background Resolver Path Support
**File**: `src/utils/backgroundResolver.ts`
```typescript
// Added support for relative paths
if (bgRef.startsWith('./') || bgRef.startsWith('../') || bgRef.startsWith('/')) {
  return bgRef;
}
```
**Result**: ❌ No change - correct fix, but page not loading

### Fix 3: Force Initial State Sync
**File**: `src/components/modals/ServiceEditorModal.tsx`
```typescript
// Added dedicated useEffect for initial sync
useEffect(() => {
  if (isPresentationMode && presentationService) {
    const initialState = { service, currentItemIndex, currentSlideIndex, currentSongData };
    window.electron.presentation.syncState(initialState);
  }
}, [isPresentationMode]); // Only depends on isPresentationMode
```
**Result**: ✅ State IS being sent BUT ❌ Audience not loading to receive it

### Fix 4: Fix Service Persistence
**File**: `src/components/modals/ServiceEditorModal.tsx`  
**Result**: ✅ **THIS WORKED** - Items now persist correctly

### Fix 5: Add Diagnostic Overlay
**File**: `src/pages/AudienceViewPage.tsx`  
Added comprehensive status display.  
**Result**: ❌ Never appears - React not running

### Fix 6: Enable DevTools
**File**: `electron/main.ts`
```typescript
presentationWindow.webContents.openDevTools({ mode: 'detach' });
```
**Result**: ✅ DevTools opens, **revealing the chrome-error**

### Fix 7-10: Various Path/Loading Attempts
- Tried `loadURL` with `file://`
- Tried `loadFile` then `executeJavaScript`
- Tried manual path construction
- Tried `__dirname` (current approach)

**Result**: ❌ All failed with same error

---

## 📝 CURRENT CODE

### Audience Window Creation
**File**: `electron/main.ts`
```typescript
function createPresentationWindow() {
  presentationWindow = new BrowserWindow({
    x, y, width, height,
    frame: false,
    fullscreen: false,
    show: false,
    alwaysOnTop: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startURL = process.env.ELECTRON_START_URL || 'http://localhost:5173';
  
  if (startURL.startsWith('http')) {
    // Dev mode - WORKS
    presentationWindow.loadURL(`${startURL}/#/audience`);
  } else {
    // Production mode - FAILS
    const indexPath = path.join(__dirname, '../dist/index.html');
    
    presentationWindow.loadFile(indexPath).then(() => {
      setTimeout(() => {
        presentationWindow.webContents.executeJavaScript(`
          window.location.hash = '/audience';
        `);
      }, 500);
    }).catch((err) => {
      console.error('❌ Failed to load index.html:', err);
    });
  }
}
```

### Main Window Creation (For Comparison)
**File**: `electron/main.ts`
```typescript
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  try {
    const response = await fetch('http://localhost:5173');
    if (response.ok) {
      mainWindow.loadURL('http://localhost:5173'); // Dev mode
    }
  } catch (error) {
    // Production mode - WORKS!
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}
```

**Key Difference**: Main window uses exact same `loadFile()` method and it WORKS. Audience window with same method FAILS.

---

See PART 2 for code architecture, theories, and next steps.
