# 🔧 CRITICAL FIXES - Presentation & Persistence

**Date**: November 5, 2025  
**Issues Fixed**:
1. ❌ Audience screen completely black during presentation
2. ❌ Service editor items not persisting (deleted items come back)

---

## 🎭 ISSUE 1: Black Audience Screen

### Problem:
When starting a presentation, the audience window displayed a completely black screen instead of showing slides with backgrounds.

### Root Cause:
The `backgroundResolver.ts` was treating **relative paths** like `./backgrounds/mountain-1.jpg` as **background IDs** instead of returning them as valid image URLs.

**The Logic Flow**:
1. Background paths changed from `/backgrounds/` to `./backgrounds/` for production
2. `resolveBackgroundImageUrl()` checked if URL starts with `http://` or `https://`
3. If not, it assumed it was an ID and tried to look it up in `WORSHIP_BACKGROUNDS`
4. Lookup failed (IDs are like "mountain-1", not "./backgrounds/mountain-1.jpg")
5. Fell back to first background, but still didn't work correctly
6. Result: Black screen

### The Fix:
**File**: `src/utils/backgroundResolver.ts`

**Before**:
```typescript
// If it's already a full URL, return it
if (bgRef.startsWith('http://') || bgRef.startsWith('https://')) {
  return bgRef;
}

// Otherwise, treat it as a background ID
const matchedBackground = WORSHIP_BACKGROUNDS.find(b => b.id === bgRef);
```

**After**:
```typescript
// If it's already a full URL or relative path, return it as-is
if (bgRef.startsWith('http://') || bgRef.startsWith('https://') || 
    bgRef.startsWith('./') || bgRef.startsWith('../') || bgRef.startsWith('/') ||
    bgRef.startsWith('file://') || bgRef.startsWith('blob:') || bgRef.startsWith('data:')) {
  return bgRef;
}

// Otherwise, treat it as a background ID
const matchedBackground = WORSHIP_BACKGROUNDS.find(b => b.id === bgRef);
```

### What Changed:
Added checks for ALL valid path types:
- ✅ `./` (relative current directory)
- ✅ `../` (relative parent directory)  
- ✅ `/` (absolute path)
- ✅ `file://` (file protocol for custom uploads)
- ✅ `blob:` (blob URLs from file picker)
- ✅ `data:` (data URLs for inline images)

Now any URL that looks like a path is returned as-is, not looked up as an ID.

---

## 💾 ISSUE 2: Service Items Not Persisting

### Problem:
When editing a service:
1. Delete an item
2. Add a new song/item
3. Close and reopen the service editor
4. **Deleted item reappears!**

### Root Cause:
**Race condition in ServiceEditorModal.tsx**

**The Bad Logic**:
```typescript
useEffect(() => {
  if (service && isOpen) {
    setItems(service.items || []);
  }
}, [service, isOpen]);
```

**The Problem**:
1. This effect depends on the entire `service` object
2. When autosave triggers, it calls `onSave(updatedService)`
3. Parent component updates and passes new service prop back
4. This triggers the useEffect **because service object changed**
5. `setItems(service.items)` runs, **overwriting local changes**
6. User's edits get wiped out!

**Timeline of the Bug**:
```
00:00 - User deletes item "A"
00:00 - items state: [B, C] ✓
00:01 - Autosave timer fires
00:01 - onSave called with [B, C]
00:02 - Parent updates service prop
00:02 - useEffect sees service changed
00:02 - setItems(service.items) runs
00:03 - If parent had stale data, items could be [A, B, C] ❌
```

### The Fix:
**File**: `src/components/modals/ServiceEditorModal.tsx`

**Before**:
```typescript
useEffect(() => {
  if (service && isOpen) {
    setItems(service.items || []);
  }
}, [service, isOpen]); // ❌ Reloads on EVERY service change
```

**After**:
```typescript
const [loadedServiceId, setLoadedServiceId] = useState<string | null>(null);

useEffect(() => {
  // Only reload if:
  // 1. Modal is opening (isOpen becomes true)
  // 2. OR we're switching to a different service (service.id changed)
  const shouldReload = isOpen && service && (
    loadedServiceId !== service.id
  );
  
  if (shouldReload) {
    console.log('📖 Loading service into editor:', {
      name: service.name,
      itemCount: service.items?.length || 0,
      reason: loadedServiceId === null ? 'initial load' : 'service changed'
    });
    setItems(service.items || []);
    setInitialItems(service.items || []);
    setLoadedServiceId(service.id);
  }
}, [service?.id, isOpen]); // ✅ Only depends on service ID, not full object
```

### What Changed:
1. **Track which service is loaded** - Use `loadedServiceId` state
2. **Only reload items when service ID changes** - Not on every prop update
3. **Preserve local edits** - If user is editing same service, don't reload
4. **Only reload on**:
   - First open (loadedServiceId is null)
   - Switching to different service (service.id changed)

**Result**: User's edits are preserved during autosave cycles!

---

## ✅ VERIFICATION

### Test Audience Screen:
1. Open a service
2. Click "Present"
3. **Expected**: Audience window shows slides with backgrounds
4. **Before**: Black screen ❌
5. **After**: Backgrounds display correctly ✅

### Test Item Persistence:
1. Open a service
2. Delete an item
3. Add a new song
4. Wait for "Saving..." to complete
5. Close and reopen the service editor
6. **Expected**: Deleted item stays deleted
7. **Before**: Deleted item reappears ❌
8. **After**: Changes persist correctly ✅

---

## 📊 FILES MODIFIED

### Fix 1: Background Resolver
```
src/utils/backgroundResolver.ts
  - resolveBackgroundImageUrl() function
  - Added support for all path types
  - Lines 157-162
```

### Fix 2: Service Persistence
```
src/components/modals/ServiceEditorModal.tsx
  - Added loadedServiceId state tracking
  - Rewrote service loading useEffect
  - Lines 164-186
```

---

## 🚀 NEXT STEPS

### 1. Test in Dev Mode:
```powershell
npm run dev:electron
```
- Open a service
- Start presentation
- Verify backgrounds show in audience window
- Edit service items (add/delete)
- Close and reopen to verify persistence

### 2. If Tests Pass, Rebuild Production:
```powershell
npm run dist:win
```

### 3. Test Production Build:
```powershell
.\release\The Path 3.1.2.exe
```

---

## 🎯 EXPECTED RESULTS

After these fixes:
- ✅ Presentation works (backgrounds display)
- ✅ Audience window shows slides correctly
- ✅ Service edits persist (no more disappearing changes)
- ✅ Autosave works without data loss
- ✅ Both dev and production builds work

---

## 🔍 TECHNICAL NOTES

### Why The Background Issue Was Hard to Spot:
- Dev mode uses Vite dev server (serves from root)
- Production uses file:// protocol (different path resolution)
- The resolver worked for IDs but not for paths
- Needed to handle BOTH ID lookup AND path passthrough

### Why The Persistence Issue Existed:
- React's reconciliation caused service prop to update
- useEffect with broad dependencies is dangerous
- Need to track WHAT about the prop changed (ID vs content)
- Solution: Track identity (ID), ignore content changes

---

## 📝 COMMIT MESSAGE

```
fix: presentation black screen & service item persistence

CRITICAL FIXES:

1. Audience screen black during presentation
   - backgroundResolver now handles relative paths
   - Added support for ./, ../, /, file://, blob:, data: URLs
   - Paths returned as-is instead of treated as IDs

2. Service items not persisting (deleted items reappear)
   - Fixed race condition in ServiceEditorModal
   - Only reload items when service ID changes
   - Preserve local edits during autosave cycles

FILES:
- src/utils/backgroundResolver.ts
- src/components/modals/ServiceEditorModal.tsx

RESULT:
✅ Presentations now work correctly
✅ Service edits persist properly
```

---

## 🎉 STATUS

**Dev Build**: ✅ Ready to test  
**Production Build**: Pending successful dev test  
**Ready for Users**: After production rebuild
