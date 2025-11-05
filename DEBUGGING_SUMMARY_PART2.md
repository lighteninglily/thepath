# 🔍 AUDIENCE WINDOW BLACK SCREEN - DEBUGGING SUMMARY PART 2

**Continued from PART 1**

---

## 🏗️ CODE ARCHITECTURE

### How It Should Work

```
1. User clicks "Present" button
   ↓
2. ServiceEditorModal calls window.electron.presentation.start()
   ↓
3. IPC → electron/main.ts → createPresentationWindow()
   ↓
4. Load dist/index.html in new window
   ↓
5. React app initializes with HashRouter
   ↓
6. executeJavaScript sets window.location.hash = '/audience'
   ↓
7. HashRouter routes to AudienceViewPage component
   ↓
8. AudienceViewPage.useEffect() subscribes to IPC updates
   ↓
9. Presenter sends state via window.electron.presentation.syncState()
   ↓
10. IPC → electron/main.ts → presentationWindow.webContents.send()
    ↓
11. AudienceViewPage receives state and renders slide
```

### Where It Actually Breaks

```
1. User clicks "Present" ✅
   ↓
2. IPC call succeeds ✅
   ↓
3. createPresentationWindow() called ✅
   ↓
4. presentationWindow.loadFile(indexPath) ❌ FAILS HERE
   ↓
   ERROR: chrome-error://chromewebdata/
   ↓
   Page never loads
   ↓
   React never initializes
   ↓
   Black screen forever
```

---

## 📊 COMPARISON: Main vs Audience Window

### Main Window (WORKS)
```typescript
// Config
mainWindow = new BrowserWindow({
  width: 1400,
  height: 900,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
});

// Loading
mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

// Result: ✅ WORKS
```

### Audience Window (FAILS)
```typescript
// Config
presentationWindow = new BrowserWindow({
  x, y, width, height,
  frame: false,              // ← Different
  fullscreen: false,         // ← Different
  show: false,               // ← Different
  alwaysOnTop: true,         // ← Different
  backgroundColor: '#000000',// ← Different
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),  // Same
    contextIsolation: true,                        // Same
    nodeIntegration: false,                        // Same
  },
});

// Loading
presentationWindow.loadFile(path.join(__dirname, '../dist/index.html'));

// Result: ❌ chrome-error://chromewebdata/
```

**Key Observation**: Same `loadFile()` method, same path, same webPreferences... but different window config causes it to fail.

---

## 💡 THEORIES

### Theory 1: BrowserWindow Config Issue 🎯 MOST LIKELY
**Hypothesis**: One of the audience window settings prevents file loading.

**Suspects**:
- `frame: false` - Frameless window
- `show: false` - Hidden until ready
- `alwaysOnTop: true` - Z-order forcing
- `backgroundColor: '#000000'` - Might interfere

**Why This Theory**:
- Main window with default config works
- Audience window with custom config fails
- Same file, same method, different result

**Test**: Create audience window with EXACT same config as main window

### Theory 2: Timing Issue ⚠️
**Hypothesis**: Window shown before file loads, causing error.

**Why This Theory**:
- `show: false` should prevent this
- But `did-finish-load` never fires
- Maybe order matters

**Test**: Remove `show: false`, let window show naturally

### Theory 3: CORB Security Policy 🤔
**Hypothesis**: Chromium blocking file load due to security.

**Why This Theory**:
- Error specifically says "CORB"
- "Quirks Mode" warning
- Cross-origin error

**But**: Main window loads same file fine, so unlikely

### Theory 4: Hash Routing Interference ⚠️
**Hypothesis**: Trying to set hash before page loads breaks it.

**Why This Theory**:
- Error mentions "audience" as blocked resource
- Maybe Chromium interprets #/audience as file request

**Test**: Load without hash, wait longer before setting it

### Theory 5: Electron Bug 🎯 POSSIBLE
**Hypothesis**: Electron has bug with certain window configs + loadFile.

**Why This Theory**:
- Works in dev (loadURL)
- Fails in prod (loadFile)
- Same path works for main window
- Multiple attempts all failed

**Test**: Use loadURL with file:// protocol instead

---

## 🚀 RECOMMENDED NEXT STEPS

### PRIORITY 1: Test with Minimal Config ⭐⭐⭐
**Most likely to work**

```typescript
// Try creating audience window with SAME config as main window
presentationWindow = new BrowserWindow({
  width: 1920,  // Just set size
  height: 1080,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
  // Remove ALL custom settings:
  // NO frame: false
  // NO show: false  
  // NO alwaysOnTop: true
  // NO backgroundColor
});

// Load exactly like main window
presentationWindow.loadFile(path.join(__dirname, '../dist/index.html'));

// Show window
presentationWindow.show();

// Set hash AFTER window shown and loaded
presentationWindow.webContents.once('did-finish-load', () => {
  setTimeout(() => {
    presentationWindow.webContents.executeJavaScript(`
      window.location.hash = '/audience';
    `);
  }, 1000);
});
```

If this works, add settings back one at a time to find the culprit.

---

### PRIORITY 2: Use loadURL Instead of loadFile ⭐⭐
**Alternative approach**

```typescript
const indexPath = path.join(__dirname, '../dist/index.html');
const fileUrl = `file:///${indexPath.replace(/\\/g, '/')}`;

console.log('Loading from URL:', fileUrl);

presentationWindow.loadURL(fileUrl)
  .then(() => {
    console.log('URL loaded successfully');
    setTimeout(() => {
      presentationWindow.webContents.executeJavaScript(`
        window.location.hash = '/audience';
      `);
    }, 1000);
  })
  .catch(err => {
    console.error('Failed to load URL:', err);
  });
```

---

### PRIORITY 3: Create Separate Audience HTML File ⭐
**Bypass hash routing entirely**

1. **Copy** `dist/index.html` to `dist/audience.html`
2. **Modify** `src/App.tsx`:
   ```typescript
   // Check for audience.html
   const isAudience = window.location.pathname.includes('audience.html');
   
   return (
     <div className="App">
       {isAudience ? <AudienceViewPage /> : (
         <HashRouter>
           {/* Normal routes */}
         </HashRouter>
       )}
     </div>
   );
   ```
3. **Load directly**:
   ```typescript
   presentationWindow.loadFile(path.join(__dirname, '../dist/audience.html'));
   ```

---

### PRIORITY 4: Add File Logging ⭐⭐⭐
**Critical for debugging**

```typescript
import fs from 'fs';

const logPath = path.join(app.getPath('userData'), 'electron.log');

function log(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  fs.appendFileSync(logPath, logMessage);
  console.log(message);
}

// Use everywhere
log('📺 Creating presentation window');
log('📺 App packaged: ' + app.isPackaged);
log('📺 __dirname: ' + __dirname);
log('📺 Index path: ' + indexPath);
log('📺 File exists: ' + fs.existsSync(indexPath));

// After attempting load
presentationWindow.loadFile(indexPath)
  .then(() => log('✅ loadFile succeeded'))
  .catch(err => log('❌ loadFile failed: ' + err.message));
```

**Check logs at**: `C:\Users\rsbiz\AppData\Roaming\The Path\electron.log`

---

### PRIORITY 5: Test on Different Machine ⭐
**Rule out local environment issues**

Copy `release/The Path 3.1.2.exe` to another Windows computer and test.

---

## 📝 FILES TO PROVIDE TO ANOTHER DEVELOPER

If seeking second opinion, provide:

1. **This document** (PART 1 & PART 2)
2. **electron/main.ts** (full file)
3. **src/pages/AudienceViewPage.tsx** (full file)
4. **package.json** (build config section)
5. **Screenshot** of DevTools error
6. **Description**: "Main window loads fine, audience window gets chrome-error with same loadFile method"

---

## 🔍 QUESTIONS FOR INVESTIGATION

1. **Does `frame: false` prevent file loading in Electron?**
   - Need to test
   - Could be Electron bug

2. **Why does dev mode work but production fails?**
   - Dev: loadURL with HTTP server
   - Prod: loadFile with local files
   - Maybe loadFile is broken?

3. **Why does main window work but audience fails?**
   - Only difference is BrowserWindow config
   - Same file, same method
   - Must be config-related

4. **Is this an Electron version bug?**
   - Using Electron 28.1.0
   - Maybe try different version?

5. **Can we bypass the problem entirely?**
   - Use separate HTML file?
   - Use query parameters instead of hash?
   - Run audience view in main window?

---

## 💭 FINAL THOUGHTS

### What We Know FOR SURE
1. ✅ Files are packaged correctly
2. ✅ IPC communication works
3. ✅ State sync works
4. ✅ React app works (in main window)
5. ✅ Dev mode works perfectly
6. ❌ Production audience window doesn't load HTML

### The Core Mystery
**Why does `presentationWindow.loadFile(path)` fail when `mainWindow.loadFile(path)` succeeds?**

**Only difference**: BrowserWindow configuration

### Most Likely Solution
Test with minimal BrowserWindow config (PRIORITY 1). If that works, we know it's a config issue and can isolate which setting causes it.

### Alternative Solution
Switch to loadURL with file:// protocol (PRIORITY 2) or create separate HTML file (PRIORITY 3).

### Nuclear Option
Completely redesign audience view:
- Don't use separate window
- Use `<webview>` tag in main window
- Or use same window with full-screen mode toggle

---

## 📞 READY FOR SECOND OPINION

This document contains everything needed for another developer to:
1. Understand the problem
2. See what's been tried
3. Suggest new approaches
4. Reproduce the issue

**Key files to review**:
- `electron/main.ts` (window creation)
- `src/pages/AudienceViewPage.tsx` (what should load)
- `package.json` (build config)

**Key question**: Why does `loadFile()` work for main window but fail for audience window with different BrowserWindow config?

---

END OF DEBUGGING SUMMARY
