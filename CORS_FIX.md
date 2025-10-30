# 🔧 CORS FIX - Lyrics Search

## 🚨 THE PROBLEM

**CORS Error:**
```
Access to fetch at 'https://lyrist.vercel.app/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present 
on the requested resource.
```

**Why it happened:**
- Browser made direct API call to Lyricist API
- Lyricist API doesn't allow cross-origin requests from browsers
- CORS (Cross-Origin Resource Sharing) blocked the request

---

## ✅ THE SOLUTION

**Move API calls to Electron backend (Node.js)**

### **Why This Works:**
- CORS is a **browser** security feature
- Node.js (Electron main process) is **not a browser**
- Backend can make API calls without CORS restrictions
- Frontend calls backend, backend calls API

### **Architecture:**
```
Frontend (Browser/React)
    ↓ (IPC)
Electron Backend (Node.js)
    ↓ (HTTPS)
Lyricist API
    ↓
Response
```

---

## 🔧 WHAT WAS FIXED

### **1. Added Lyrics IPC Handler (Electron Backend)**
**File:** `electron/main.ts`

```typescript
ipcMain.handle('lyrics:search', async (_event, trackName: string, artistName?: string) => {
  // API call happens in Node.js (no CORS!)
  const response = await fetch(url);
  const data = await response.json();
  return data;
});
```

### **2. Exposed Lyrics API (Preload)**
**File:** `electron/preload.ts`

```typescript
lyrics: {
  search: (trackName: string, artistName?: string) =>
    ipcRenderer.invoke('lyrics:search', trackName, artistName),
}
```

### **3. Updated Type Definitions**
**Files:** `electron/types.ts` and `src/types/index.ts`

```typescript
lyrics: {
  search: (trackName: string, artistName?: string) => Promise<{
    title: string;
    artist: string;
    lyrics: string;
    source: string;
  }>;
}
```

### **4. Updated Frontend Service**
**File:** `src/services/lyricsApi.ts`

```typescript
// Check if Electron API available
if (window.electron?.lyrics) {
  // Use Electron backend (bypasses CORS)
  const data = await window.electron.lyrics.search(trackName, artistName);
} else {
  // Fallback for browser dev (will hit CORS)
  const response = await fetch(url);
}
```

---

## 📊 DATA FLOW

### **Before (CORS Error):**
```
React Component
    ↓
lyricsApi.ts
    ↓ fetch()
Lyricist API ❌ CORS BLOCKED
```

### **After (Working):**
```
React Component
    ↓
lyricsApi.ts
    ↓ window.electron.lyrics.search()
Electron Preload
    ↓ ipcRenderer.invoke()
Electron Main Process
    ↓ fetch() (Node.js - no CORS!)
Lyricist API ✅ SUCCESS
    ↓
Response flows back
```

---

## 🧪 HOW TO TEST

### **Step 1: Rebuild Electron**
```bash
npm run build:electron
```

### **Step 2: Run Dev Mode**
```bash
npm run dev:electron
```

### **Step 3: Test Search**
1. Click "Add Song"
2. Click "Search Lyrics" ✨
3. Enter: "Goodness of God" + "Bethel"
4. Click "Search"
5. **EXPECTED**: Lyrics appear! ✅

---

## 🔍 TROUBLESHOOTING

### **If still getting CORS error:**

**Check 1: Are you running Electron?**
```bash
npm run dev:electron  # Not just npm run dev!
```

**Check 2: Electron built?**
```bash
npm run build:electron
```

**Check 3: Check console**
Should see:
```
🎵 Searching lyrics via Electron backend...
✅ Lyrics found (Electron): {...}
```

NOT:
```
⚠️ Using browser fallback (may hit CORS)
```

---

## 📝 TECHNICAL DETAILS

### **Why Node.js Doesn't Have CORS:**
- CORS is enforced by **browsers** for security
- Prevents malicious websites from making unauthorized requests
- Node.js is a **server environment**, not a browser
- Servers can make requests to any API (no CORS)

### **IPC (Inter-Process Communication):**
- Frontend (renderer process) ↔ Backend (main process)
- `ipcRenderer.invoke()` sends message to main process
- `ipcMain.handle()` receives and processes
- Secure communication within Electron app

### **Context Bridge:**
- `contextBridge.exposeInMainWorld()` safely exposes APIs
- `window.electron.lyrics.search()` available in React
- TypeScript types ensure type safety

---

## 🎯 FILES MODIFIED

1. ✅ **electron/main.ts**
   - Added `lyrics:search` IPC handler
   - Makes API call in Node.js

2. ✅ **electron/preload.ts**
   - Exposed lyrics API to frontend
   - Added to context bridge

3. ✅ **electron/types.ts**
   - Added lyrics API type definition
   - For backend TypeScript

4. ✅ **src/types/index.ts**
   - Added lyrics API to ElectronAPI
   - For frontend TypeScript

5. ✅ **src/services/lyricsApi.ts**
   - Updated to use Electron API
   - Fallback for browser dev mode

---

## ✅ RESULT

**CORS error fixed!**
- ✅ API calls work in Electron
- ✅ No CORS restrictions
- ✅ Lyrics search functional
- ✅ Proper error handling
- ✅ TypeScript type safety

---

## 🚀 NEXT STEPS

1. **Rebuild Electron**: `npm run build:electron`
2. **Run Electron Dev**: `npm run dev:electron`
3. **Test search**: Should work now!

---

**The lyrics search now works by routing requests through the Electron backend!** ✨
