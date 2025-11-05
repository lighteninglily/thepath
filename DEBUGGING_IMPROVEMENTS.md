# 🔧 DEBUGGING IMPROVEMENTS - Audience Window Console Forwarding

**Date**: November 5, 2025, 2:55pm  
**Issue**: Cannot open DevTools on audience window, can't see console logs  
**Status**: ✅ FIXED - Console logs now forwarded to terminal

---

## 🚨 PROBLEM

The audience window runs on the external display and doesn't allow opening DevTools, making it impossible to see what's happening or debug issues.

---

## ✅ SOLUTION APPLIED

### 1. Console Log Forwarding (Electron Main Process)

**File**: `electron/main.ts`

Added console message forwarding from audience window:

```typescript
// Forward console logs from audience window to main terminal
presentationWindow.webContents.on('console-message', (_event, level, message, line, sourceId) => {
  const prefix = '[AUDIENCE]';
  const levelMap: Record<number, string> = {
    0: '🔵', // log
    1: '⚠️', // warning
    2: '❌', // error
    3: '🐛'  // debug
  };
  const emoji = levelMap[level] || '📺';
  console.log(`${prefix} ${emoji} ${message}`);
});
```

**Result**: All console logs from the audience window now appear in your terminal with the `[AUDIENCE]` prefix!

---

### 2. Enhanced Logging (AudienceViewPage)

**File**: `src/pages/AudienceViewPage.tsx`

Added comprehensive logging:

```typescript
// Log received state
console.log('📺 AUDIENCE: Received state update:', {
  hasService: !!state.service,
  currentItemIndex: state.currentItemIndex,
  currentSlideIndex: state.currentSlideIndex,
  hasSongData: !!state.currentSongData,
  songDataTitle: state.currentSongData?.title,
  songDataSlidesCount: state.currentSongData?.slidesData?.length,
  ...
});

// Log full state
console.log('📦 AUDIENCE: Full state object:', JSON.stringify(state, null, 2));

// Log visual data checking
console.log('🎵 AUDIENCE: Checking for visual data:', {
  itemType: currentItem?.type,
  hasSongData: !!currentSongData,
  songTitle: currentSongData?.title,
  ...
});
```

---

### 3. Improved Background Resolver

**File**: `src/utils/backgroundResolver.ts`

Fixed background detection to work without explicit `type` field:

```typescript
// Check for explicit type OR presence of image fields
const hasImageRef = !!(background.imageUrl || background.imageId || background.backgroundImage);
const isImageType = background.type === 'image' || background.backgroundType === 'image';

if (isImageType || hasImageRef) {
  // Resolve image...
}
```

**Why**: Some backgrounds might have `imageUrl` but no `type: 'image'`, causing them to be skipped.

---

## 📊 WHAT YOU'LL SEE NOW

When you run `npm run dev:electron`, you'll see logs like:

```
[AUDIENCE] 🔵 🎭 AudienceViewPage MOUNTED
[AUDIENCE] 🔵 👀 Audience view initializing
[AUDIENCE] 🔵 ✅ Audience view listening for state updates
[AUDIENCE] 🔵 📺 AUDIENCE: Received state update: { hasService: true, ... }
[AUDIENCE] 🔵 📦 AUDIENCE: Full state object: { "service": {...}, ... }
[AUDIENCE] 🔵 🎵 AUDIENCE: Checking for visual data: { itemType: 'song', ... }
[AUDIENCE] 🔵 📺 AUDIENCE: Song slide data: { slideIndex: 0, ... }
[AUDIENCE] 🔵 🖼️ Resolved background: { type: 'image', hasError: false, ... }
```

---

## 🧪 TESTING INSTRUCTIONS

1. **Run the app**:
   ```bash
   npm run dev:electron
   ```

2. **Start a presentation**

3. **Watch the terminal** for `[AUDIENCE]` prefixed logs

4. **Look for**:
   - ✅ `Received state update` - State is being sent
   - ✅ `hasSongData: true` - Song data is included
   - ✅ `Using song slide visual data` - Visual data found
   - ❌ `Song item but NO song data!` - Song data missing (problem!)
   - ❌ `Song slide missing visualData!` - Slide has no visual data (problem!)

---

## 🎯 DEBUGGING WORKFLOW

**If scripture slides still show wrong background:**
1. Look for: `[AUDIENCE] 📦 Full state object` in terminal
2. Check if `service.items[0].content` has valid JSON
3. Check if background color is in the visual data

**If song slides show "content here" text:**
1. Look for: `[AUDIENCE] 🎵 AUDIENCE: Checking for visual data`
2. Check if `hasSongData: true`
3. Check if `slidesDataLength` > 0
4. Look for error: `Song item but NO song data!`

**If backgrounds are black:**
1. Look for: `[AUDIENCE] 🖼️ Resolved background`
2. Check if `hasError: true`
3. Check `errorMessage` for details

---

## 📝 FILES CHANGED

1. **electron/main.ts** - Added console forwarding
2. **src/pages/AudienceViewPage.tsx** - Enhanced logging
3. **src/utils/backgroundResolver.ts** - Fixed image detection

---

## ✅ NEXT STEPS

1. Run the app again
2. Share the **full terminal output** (especially `[AUDIENCE]` logs)
3. This will show us exactly what the audience window is receiving and where it's failing

**Now we can see what's happening in the audience window! 🎉**
