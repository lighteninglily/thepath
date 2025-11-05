# 🔧 QUICK FIXES TO TRY - Copy & Paste Ready

These are ready-to-test fixes. Just copy the code and replace in the file.

---

## FIX 1: Minimal Window Config (MOST LIKELY TO WORK)

**File**: `electron/main.ts`  
**Line**: ~173 (in `createPresentationWindow()`)

**Replace this**:
```typescript
presentationWindow = new BrowserWindow({
  x,
  y,
  width,
  height,
  frame: false,
  fullscreen: false,
  show: false,
  alwaysOnTop: true,
  backgroundColor: '#000000',
  title: 'Audience View',
  skipTaskbar: true,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
});
```

**With this**:
```typescript
presentationWindow = new BrowserWindow({
  width: 1920,
  height: 1080,
  webPreferences: {
    preload: path.join(__dirname, 'preload.js'),
    contextIsolation: true,
    nodeIntegration: false,
  },
});
```

**Then rebuild**: `npm run dist:win`

**If this works**: Add back settings one at a time to find which one breaks it.

---

## FIX 2: Use loadURL Instead of loadFile

**File**: `electron/main.ts`  
**Line**: ~192 (in the `else` block)

**Replace the entire else block with**:
```typescript
} else {
  // Production mode - use loadURL with file:// protocol
  const indexPath = path.join(__dirname, '../dist/index.html');
  const normalizedPath = indexPath.replace(/\\/g, '/');
  const fileUrl = `file:///${normalizedPath}`;
  
  console.log('📺 Loading audience from URL:', fileUrl);
  
  presentationWindow.loadURL(fileUrl).then(() => {
    console.log('✅ Audience URL loaded');
    if (presentationWindow && !presentationWindow.isDestroyed()) {
      setTimeout(() => {
        if (presentationWindow && !presentationWindow.isDestroyed()) {
          presentationWindow.webContents.executeJavaScript(`
            console.log('🔧 Setting hash to /audience');
            window.location.hash = '/audience';
            console.log('✅ Hash set:', window.location.hash);
          `).catch(err => console.error('Hash set failed:', err));
        }
      }, 1000); // Longer delay
    }
  }).catch((err) => {
    console.error('❌ Failed to load URL:', err);
  });
}
```

---

## FIX 3: Show Window Immediately

**File**: `electron/main.ts`  
**Line**: ~225 (in `did-finish-load` handler)

**Replace**:
```typescript
presentationWindow.webContents.once('did-finish-load', () => {
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.openDevTools({ mode: 'detach' });
    presentationWindow.setFullScreen(true);
    presentationWindow.show();
  }
});
```

**With**:
```typescript
// Remove the did-finish-load handler entirely
// Show window immediately after creation
presentationWindow.show();

// Add error handler
presentationWindow.webContents.on('did-fail-load', (_event, errorCode, errorDescription) => {
  console.error('❌ Audience load failed:', errorCode, errorDescription);
});

// Open DevTools immediately
presentationWindow.webContents.openDevTools({ mode: 'detach' });
```

---

## FIX 4: Add File Logging

**File**: `electron/main.ts`  
**At the top, after imports**:

```typescript
import { writeFileSync, appendFileSync, existsSync } from 'fs';

const logPath = path.join(app.getPath('userData'), 'electron-debug.log');

function debugLog(message: string) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}\n`;
  try {
    appendFileSync(logPath, logMessage);
  } catch (err) {
    // Ignore
  }
  console.log(message);
}
```

**Then in createPresentationWindow(), add logs**:
```typescript
debugLog('📺 Creating presentation window');
debugLog('📺 App packaged: ' + app.isPackaged);
debugLog('📺 App path: ' + app.getAppPath());
debugLog('📺 __dirname: ' + __dirname);
debugLog('📺 process.resourcesPath: ' + process.resourcesPath);

const indexPath = path.join(__dirname, '../dist/index.html');
debugLog('📺 Index path: ' + indexPath);
debugLog('📺 File exists: ' + existsSync(indexPath));

presentationWindow.loadFile(indexPath)
  .then(() => debugLog('✅ loadFile promise resolved'))
  .catch(err => debugLog('❌ loadFile promise rejected: ' + err.message));
```

**Check logs at**: `C:\Users\rsbiz\AppData\Roaming\The Path\electron-debug.log`

---

## FIX 5: Load Without Hash, Set Hash Later

**File**: `electron/main.ts`

**Replace**:
```typescript
presentationWindow.loadFile(indexPath).then(() => {
  setTimeout(() => {
    presentationWindow.webContents.executeJavaScript(`
      window.location.hash = '/audience';
    `);
  }, 500);
});
```

**With**:
```typescript
// Load file with NO hash manipulation
presentationWindow.loadFile(indexPath);

// Wait for React to fully initialize
presentationWindow.webContents.once('did-finish-load', () => {
  console.log('✅ File loaded');
  
  // Wait 2 full seconds
  setTimeout(() => {
    if (presentationWindow && !presentationWindow.isDestroyed()) {
      console.log('Setting hash now...');
      presentationWindow.webContents.executeJavaScript(`
        console.log('Current URL:', window.location.href);
        console.log('Setting hash to /audience');
        window.location.hash = '/audience';
        console.log('New URL:', window.location.href);
      `).then(() => {
        console.log('✅ Hash set successfully');
      }).catch(err => {
        console.error('❌ Failed to set hash:', err);
      });
    }
  }, 2000); // 2 seconds
});
```

---

## FIX 6: Copy Main Window Exactly

**File**: `electron/main.ts`

**Replace entire `createPresentationWindow()` function with**:
```typescript
function createPresentationWindow() {
  console.log('📺 Creating presentation window');
  
  // Create with EXACT same config as main window
  presentationWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load EXACTLY like main window
  const indexPath = path.join(__dirname, '../dist/index.html');
  console.log('📺 Loading from:', indexPath);
  
  presentationWindow.loadFile(indexPath);
  
  // Open DevTools
  presentationWindow.webContents.openDevTools({ mode: 'detach' });
  
  // Show window
  presentationWindow.show();
  
  // Set hash after page loads
  presentationWindow.webContents.once('did-finish-load', () => {
    console.log('✅ Audience page loaded');
    setTimeout(() => {
      if (presentationWindow && !presentationWindow.isDestroyed()) {
        presentationWindow.webContents.executeJavaScript(`
          window.location.hash = '/audience';
        `);
      }
    }, 1000);
  });

  presentationWindow.on('closed', () => {
    presentationWindow = null;
  });
}
```

---

## TESTING CHECKLIST

After each fix:

1. ✅ Rebuild: `npm run dist:win`
2. ✅ Run: `& ".\release\The Path 3.1.2.exe"`
3. ✅ Click "Present"
4. ✅ Check DevTools console
5. ✅ Does page load? (look for React logs)
6. ✅ Does diagnostic appear?
7. ✅ Does slide render?

If FIX 6 works, you know the problem is the BrowserWindow config. Then add back settings one at a time:
1. Add `show: false` - still works?
2. Add `frame: false` - still works?
3. Add `alwaysOnTop: true` - still works?
4. Add `backgroundColor: '#000000'` - still works?

Find which setting breaks it!

---

## IF NOTHING WORKS

Try this nuclear option:

**Don't use separate window for audience view**

Instead, add a button in presenter window to toggle fullscreen:
- Normal mode: Show presenter controls
- Fullscreen mode: Show audience view

This bypasses the window creation issue entirely.
