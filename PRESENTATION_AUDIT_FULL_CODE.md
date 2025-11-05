# 🔍 COMPLETE PRESENTATION SYSTEM AUDIT
**Date**: November 5, 2025  
**Issue**: Audience window shows blank/black screen during presentation  
**Status**: 🔴 CRITICAL - Not working in production

---

## 📋 TABLE OF CONTENTS
1. [Problem Statement](#problem-statement)
2. [Complete Code Flow](#complete-code-flow)
3. [All Relevant Code](#all-relevant-code)
4. [Identified Issues](#identified-issues)
5. [Fix Plan](#fix-plan)

---

## 🚨 PROBLEM STATEMENT

**User Action**: Click "Present" button on a service  
**Expected**: Audience window opens and displays slides with backgrounds  
**Actual**: Audience window shows completely black screen  

**Environment**:
- ✅ Works in dev mode (`npm run dev:electron`)
- ❌ Fails in production build (`release/The Path 3.1.2.exe`)

---

## 🔄 COMPLETE CODE FLOW

### Step 1: User Clicks "Present" Button
**File**: `src/components/modals/ServiceEditorModal.tsx` (lines 218-245)

```typescript
useEffect(() => {
  if (autoStartPresentation && isOpen && items.length > 0 && !isPresentationMode && service) {
    console.log('🎭 Auto-starting presentation from PlannerPage...');
    const timer = setTimeout(async () => {
      const presentationService: Service = {
        ...service,
        items: items,
        name: service.name,
        date: service.date,
      };
      
      // STEP 1A: Start presentation in store
      startPresentation(presentationService, 'dual');
      
      // STEP 1B: Open audience window via IPC
      if (window.electron?.presentation?.start) {
        try {
          await window.electron.presentation.start();
          console.log('✅ Audience window opened');
        } catch (error) {
          console.error('❌ Failed to open audience window:', error);
        }
      }
      
      setIsPresentationMode(true);
      onPresentationStarted?.();
    }, 300);
    
    return () => clearTimeout(timer);
  }
}, [autoStartPresentation, isOpen, items, isPresentationMode, service, startPresentation, onPresentationStarted]);
```

### Step 2: IPC Call to Open Audience Window
**File**: `electron/preload.ts` (lines 44-45)

```typescript
presentation: {
  start: (serviceId?: string, songId?: string) =>
    ipcRenderer.invoke('presentation:start', serviceId, songId),
  // ...
}
```

**File**: `electron/main.ts` (lines 579-596)

```typescript
ipcMain.handle('presentation:start', async () => {
  console.log('🎭 presentation:start called');
  
  // Check if we have displays
  if (!presentationWindow || presentationWindow.isDestroyed()) {
    createPresentationWindow();
  } else {
    presentationWindow.show();
    presentationWindow.focus();
  }
  
  return {
    success: true,
    audienceDisplay: getAudienceDisplay()
  };
});
```

### Step 3: Create Presentation Window
**File**: `electron/main.ts` (lines 168-215)

```typescript
function createPresentationWindow() {
  const audienceDisplay = getAudienceDisplay();
  const { x, y, width, height } = audienceDisplay.bounds;
  
  presentationWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    frame: false,
    fullscreen: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    backgroundColor: '#000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load Audience View
  const startURL = process.env.ELECTRON_START_URL || 'http://localhost:5173';
  
  if (startURL.startsWith('http')) {
    presentationWindow.loadURL(`${startURL}/#/audience`);
    console.log('📺 Loading audience view from:', `${startURL}/#/audience`);
  } else {
    presentationWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: 'audience',
    });
    console.log('📺 Loading audience view from built files');
  }

  // Show and fullscreen window once content is loaded
  presentationWindow.webContents.once('did-finish-load', () => {
    if (presentationWindow && !presentationWindow.isDestroyed()) {
      presentationWindow.setFullScreen(true);
      presentationWindow.show();
      console.log('✅ Audience window shown in fullscreen');
    }
  });

  presentationWindow.on('closed', () => {
    presentationWindow = null;
    // Also close presenter window if it exists
    if (presenterWindow && !presenterWindow.isDestroyed()) {
      presenterWindow.close();
    }
  });
  
  console.log('📺 Created presentation window on audience display');
}
```

### Step 4: Audience Window Loads React App
**File**: `src/App.tsx` (checks route)

The hash `#/audience` routes to `AudienceViewPage`.

### Step 5: AudienceViewPage Initializes
**File**: `src/pages/AudienceViewPage.tsx` (lines 45-92)

```typescript
useEffect(() => {
  console.log('👀 Audience view initializing', {
    hasElectron: !!window.electron,
    hasPresentation: !!window.electron?.presentation,
    hasOnStateUpdate: !!window.electron?.presentation?.onStateUpdate,
    windowLocation: window.location.href,
    windowHash: window.location.hash
  });

  if (window.electron?.presentation?.onStateUpdate) {
    console.log('✅ Audience view listening for state updates');
    
    // Set up listener for state updates
    const unsubscribe = window.electron.presentation.onStateUpdate((state) => {
      console.log('📺 AUDIENCE: Received state update:', {
        hasService: !!state.service,
        currentItemIndex: state.currentItemIndex,
        currentSlideIndex: state.currentSlideIndex,
        hasSongData: !!state.currentSongData,
        songDataTitle: state.currentSongData?.title,
        songDataSlidesCount: state.currentSongData?.slidesData?.length,
        isBlank: state.isBlank,
        currentItemType: state.service?.items[state.currentItemIndex]?.type
      });
      
      // Log the full state for debugging
      console.log('📦 AUDIENCE: Full state object:', JSON.stringify(state, null, 2));
      
      setPresentationState(state);
    });

    // IMPORTANT: Request initial state after a short delay
    setTimeout(() => {
      console.log('📡 Audience requesting initial state...');
    }, 500);

    return () => {
      unsubscribe();
    };
  } else {
    console.error('❌ window.electron.presentation.onStateUpdate not available!');
  }
}, []);
```

### Step 6: Presenter Syncs State to Audience
**File**: `src/components/modals/ServiceEditorModal.tsx` (lines 141-162)

```typescript
// Sync presentation state to audience window
useEffect(() => {
  if (isPresentationMode && window.electron?.presentation?.syncState) {
    const state = {
      service: presentationService,
      currentItemIndex,
      currentSlideIndex,
      currentSongData,
      isPresenting: true
    };
    
    // Sync state to audience window
    window.electron.presentation.syncState(state).catch(console.error);
    console.log('📡 Synced state to audience window:', {
      hasService: !!presentationService,
      currentItemIndex,
      currentSlideIndex,
      hasSongData: !!currentSongData,
      songTitle: currentSongData?.title
    });
  }
}, [isPresentationMode, presentationService, currentItemIndex, currentSlideIndex, currentSongData]);
```

### Step 7: IPC Handler Forwards State
**File**: `electron/main.ts` (lines 616-622)

```typescript
ipcMain.handle('presentation:syncState', async (_event, state: any) => {
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.send('presentation:stateUpdate', state);
    return true;
  }
  return false;
});
```

### Step 8: Audience Receives State and Renders
**File**: `src/pages/AudienceViewPage.tsx` (lines 214-307)

```typescript
const renderSlide = () => {
  console.log('🎬 AudienceView renderSlide called:', {
    hasVisualData: !!visualData,
    hasService: !!service,
    hasCurrentItem: !!currentItem,
    currentItemType: currentItem?.type,
    currentItemIndex,
    currentSlideIndex
  });
  
  if (visualData) {
    // Visual slide (template-based)
    let { background, elements } = visualData;
    
    // Convert old background format if needed
    if (!background && (visualData.backgroundType || visualData.backgroundGradient || visualData.backgroundColor || visualData.backgroundImage)) {
      background = {
        type: visualData.backgroundType || (visualData.backgroundGradient ? 'gradient' : visualData.backgroundImage ? 'image' : 'solid'),
        color: visualData.backgroundColor,
        gradient: visualData.backgroundGradient,
        imageUrl: visualData.backgroundImage,
      };
    }
    
    // Use unified background resolver
    const resolved = resolveBackground(background);
    const backgroundStyle = resolved.style;
    
    console.log('🖼️ Resolved background:', {
      type: resolved.type,
      hasError: resolved.hasError,
      errorMessage: resolved.errorMessage,
      style: backgroundStyle
    });
    
    return (
      <div className="w-full h-full relative overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={backgroundStyle}
        />
        
        {/* Elements */}
        {elements?.map((element: any, index: number) => {
          // Render text, shapes, images...
        })}
      </div>
    );
  }
  // ... fallback rendering
}
```

### Step 9: Background Resolution
**File**: `src/utils/backgroundResolver.ts` (lines 146-198)

```typescript
export function resolveBackgroundImageUrl(
  background: BackgroundConfig | undefined | null
): string | null {
  
  if (!background) return null;

  // Get the ID or URL from various possible fields
  const bgRef = background.imageId || background.imageUrl || background.backgroundImage;
  
  if (!bgRef) return null;

  // If it's already a full URL or relative path, return it as-is
  if (bgRef.startsWith('http://') || bgRef.startsWith('https://') || 
      bgRef.startsWith('./') || bgRef.startsWith('../') || bgRef.startsWith('/') ||
      bgRef.startsWith('file://') || bgRef.startsWith('blob:') || bgRef.startsWith('data:')) {
    return bgRef;
  }

  // Otherwise, treat it as a background ID - look it up in WORSHIP_BACKGROUNDS
  const matchedBackground = WORSHIP_BACKGROUNDS.find(b => b.id === bgRef);
  if (matchedBackground) {
    return matchedBackground.url;
  }

  // Background ID not found - use intelligent category fallback
  console.warn('⚠️ Background ID not found:', bgRef, '- using fallback');
  
  // Try category-based matching...
  // Ultimate fallback: use first available background
  if (WORSHIP_BACKGROUNDS.length > 0) {
    console.log('⚠️ Using first available background as last resort');
    return WORSHIP_BACKGROUNDS[0].url;
  }

  return null;
}
```

---

## 📝 ALL RELEVANT CODE

### IPC Communication Setup

#### electron/preload.ts
```typescript
import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  presentation: {
    start: (serviceId?: string, songId?: string) =>
      ipcRenderer.invoke('presentation:start', serviceId, songId),
    syncState: (state: any) =>
      ipcRenderer.invoke('presentation:syncState', state),
    onStateUpdate: (callback: (state: any) => void) => {
      const listener = (_event: any, state: any) => callback(state);
      ipcRenderer.on('presentation:stateUpdate', listener);
      return () => ipcRenderer.removeListener('presentation:stateUpdate', listener);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);
```

#### electron/main.ts - IPC Handlers
```typescript
ipcMain.handle('presentation:start', async () => {
  console.log('🎭 presentation:start called');
  
  if (!presentationWindow || presentationWindow.isDestroyed()) {
    createPresentationWindow();
  } else {
    presentationWindow.show();
    presentationWindow.focus();
  }
  
  return {
    success: true,
    audienceDisplay: getAudienceDisplay()
  };
});

ipcMain.handle('presentation:syncState', async (_event, state: any) => {
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.send('presentation:stateUpdate', state);
    return true;
  }
  return false;
});
```

### Background Path Configuration

#### src/assets/backgrounds.ts
```typescript
export const WORSHIP_BACKGROUNDS: BackgroundImage[] = [
  {
    id: 'mountain-1',
    name: 'Majestic Blue Mountains',
    url: './backgrounds/mountain-1.jpg',  // ← RELATIVE PATH
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Blue/teal tones',
  },
  // ... 25 more images with ./backgrounds/ paths
];
```

---

## 🐛 IDENTIFIED ISSUES

### Issue 1: Initial State Not Sent ❗❗❗
**CRITICAL**: When the audience window opens, it waits for state updates, but NO initial state is sent!

**Problem Flow**:
1. Audience window opens and loads `AudienceViewPage`
2. Sets up listener for `presentation:stateUpdate`
3. **WAITS... but nothing is sent**
4. `presentationState` remains `null`
5. Shows "Waiting for presentation..." (black screen)

**Why?**:
The `useEffect` in `ServiceEditorModal.tsx` (lines 141-162) that syncs state only runs when dependencies change. But when presentation first starts:
- `isPresentationMode` changes from `false` → `true` ✓
- But `presentationService`, `currentItemIndex`, `currentSlideIndex`, `currentSongData` are **already set**
- **No dependency change** = **No state sync!**

### Issue 2: Song Data Not Loaded Initially ❗
**CRITICAL**: When presentation starts, `currentSongData` might be `null` if the song hasn't been preloaded yet.

**File**: `src/components/modals/ServiceEditorModal.tsx` (lines 76-139)

Songs are preloaded, but there's a race condition:
1. Presentation starts
2. State sync effect runs (but currentSongData might still be null)
3. Song preload effect runs AFTER
4. Audience receives state with null song data
5. Can't render slide

### Issue 3: Background Paths in Production 🔧
**Status**: Already fixed (relative paths), but need to verify it works.

Backgrounds use `./backgrounds/mountain-1.jpg`. In production with `loadFile()`:
- Base path: `file:///C:/path/to/app/dist/index.html`
- Background: `./backgrounds/mountain-1.jpg`
- Resolved: `file:///C:/path/to/app/dist/backgrounds/mountain-1.jpg`

**Should work IF** the `dist/backgrounds/` folder exists in the build.

### Issue 4: No Error Logging in Production
When things fail silently, we can't debug. The audience window might be:
- Not loading the HTML
- Not running JavaScript
- Not connecting to IPC
- Loading but crashing

**No visibility** into what's happening.

---

## 🔧 FIX PLAN

### Priority 1: FORCE Initial State Sync

**File**: `src/components/modals/ServiceEditorModal.tsx`

**Add a new effect that IMMEDIATELY syncs state when presentation starts**:

```typescript
// NEW EFFECT: Force initial sync when presentation starts
useEffect(() => {
  if (isPresentationMode && presentationService && window.electron?.presentation?.syncState) {
    console.log('🚀 FORCE INITIAL SYNC - Presentation just started');
    
    // Send initial state immediately
    const state = {
      service: presentationService,
      currentItemIndex: currentItemIndex || 0,
      currentSlideIndex: currentSlideIndex || 0,
      currentSongData: currentSongData || null,
      isPresenting: true,
      isBlank: false
    };
    
    console.log('📡 Sending initial state:', state);
    window.electron.presentation.syncState(state).catch(console.error);
  }
}, [isPresentationMode]); // ONLY depend on isPresentationMode
```

### Priority 2: Ensure Song Data is Loaded First

**File**: `src/components/modals/ServiceEditorModal.tsx`

**Modify the presentation start logic to wait for song data**:

```typescript
const timer = setTimeout(async () => {
  const presentationService: Service = {
    ...service,
    items: items,
    name: service.name,
    date: service.date,
  };
  
  // Preload ALL songs BEFORE starting presentation
  console.log('📀 Preloading all songs before presentation...');
  const songItems = items.filter(item => item.type === 'song' && item.songId);
  
  for (const item of songItems) {
    try {
      const song = await window.electron.database.getSongById(item.songId);
      if (song) {
        useServicePresentationStore.getState().preloadSongData(item.songId, song);
        console.log('✅ Preloaded:', song.title);
      }
    } catch (error) {
      console.error('❌ Failed to preload song:', item.songId, error);
    }
  }
  
  // NOW start presentation
  startPresentation(presentationService, 'dual');
  
  // Open audience window
  if (window.electron?.presentation?.start) {
    try {
      await window.electron.presentation.start();
      console.log('✅ Audience window opened');
    } catch (error) {
      console.error('❌ Failed to open audience window:', error);
    }
  }
  
  setIsPresentationMode(true);
  onPresentationStarted?.();
}, 300);
```

### Priority 3: Add Diagnostic Logging

**File**: `src/pages/AudienceViewPage.tsx`

**Add comprehensive logging to show what's happening**:

```typescript
// At the top of component
useEffect(() => {
  console.log('🔍 AUDIENCE DIAGNOSTIC:', {
    presentationState,
    hasService: !!presentationState?.service,
    hasCurrentItem: !!currentItem,
    hasCurrentSongData: !!currentSongData,
    hasVisualData: !!visualData,
    currentItemIndex,
    currentSlideIndex,
    currentItemType: currentItem?.type,
    backgroundResolver: resolveBackground
  });
}, [presentationState, currentItem, currentSongData, visualData]);

// Show diagnostic overlay in production
if (!presentationState || !service || !currentItem) {
  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <div className="text-white text-2xl font-mono p-8">
        <div className="mb-4">🔍 DIAGNOSTIC MODE</div>
        <div className="text-sm space-y-2">
          <div>Has Electron: {String(!!window.electron)}</div>
          <div>Has Presentation API: {String(!!window.electron?.presentation)}</div>
          <div>Has State Listener: {String(!!window.electron?.presentation?.onStateUpdate)}</div>
          <div>Presentation State: {presentationState ? 'Received' : 'NULL'}</div>
          <div>Has Service: {String(!!service)}</div>
          <div>Has Current Item: {String(!!currentItem)}</div>
          <div>Window Hash: {window.location.hash}</div>
        </div>
      </div>
    </div>
  );
}
```

### Priority 4: Verify Build Includes Backgrounds

**Check**: Does `dist/backgrounds/` folder exist after build?

```powershell
# After npm run build, check:
ls dist/backgrounds/
```

If NOT, need to add to Vite config to copy public folder.

### Priority 5: Test in Dev First

Before rebuilding production:

```powershell
npm run dev:electron
```

1. Open a service
2. Click "Present"
3. Check console logs
4. Verify state is synced
5. Verify backgrounds display

---

## 📊 TESTING CHECKLIST

### In Dev Mode:
- [ ] Audience window opens
- [ ] Console shows "🚀 FORCE INITIAL SYNC"
- [ ] Console shows "📺 AUDIENCE: Received state update"
- [ ] Audience displays slide with background
- [ ] Navigation works (next/previous)

### In Production:
- [ ] `dist/backgrounds/` folder exists with 26 images
- [ ] Audience window opens
- [ ] Backgrounds display (not black screen)
- [ ] Text elements visible
- [ ] Can navigate slides

---

## 🎯 EXPECTED OUTCOME

After implementing ALL Priority 1-3 fixes:
1. ✅ Initial state sent immediately when presentation starts
2. ✅ Song data loaded before presentation opens
3. ✅ Diagnostic logging shows what's happening
4. ✅ Backgrounds display correctly
5. ✅ No more black screen

---

## 📝 NEXT STEPS

1. **Implement Priority 1** (Force initial sync)
2. **Test in dev mode**
3. **If works, implement Priority 2** (Song preloading)
4. **Test again**
5. **Add Priority 3** (Diagnostics)
6. **Build production**
7. **Test production build**
8. **If still fails, analyze console logs**

---

## 🚨 CRITICAL DEPENDENCIES

The fix depends on:
- ✅ IPC handlers working (confirmed in code)
- ✅ Background resolver supporting relative paths (confirmed fixed)
- ❓ Initial state sync happening (NOT WORKING - FIX PRIORITY 1)
- ❓ Song data available when needed (RACE CONDITION - FIX PRIORITY 2)
- ❓ Backgrounds in dist folder (NEEDS VERIFICATION)

---

**END OF AUDIT**
