# 🎭 COMPLETE PRESENTATION SYSTEM ARCHITECTURE

**Version**: 1.0.0  
**Date**: October 29, 2025  
**Goal**: PowerPoint-style professional multi-monitor presentation system

---

## 🎯 SYSTEM OVERVIEW

### **Three-Component Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    MAIN APPLICATION                         │
│  ┌────────────────────────────────────────────────────┐    │
│  │  ServiceEditorModal                                │    │
│  │  - Service content                                 │    │
│  │  - Edit items                                      │    │
│  │  - [Present Service] ← Button                     │    │
│  └────────────────────────────────────────────────────┘    │
│                          │                                  │
│                          │ Click "Present"                  │
│                          ▼                                  │
│  ┌────────────────────────────────────────────────────┐    │
│  │  Opens: Presenter Window (Main Screen)            │    │
│  │  + Audience Window (External Display)             │    │
│  └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          │
                          │
        ┌─────────────────┴─────────────────┐
        │                                   │
        ▼                                   ▼
┌─────────────────┐               ┌─────────────────┐
│ PRESENTER VIEW  │               │ AUDIENCE VIEW   │
│  (Monitor 1)    │◄─────IPC─────►│ (Monitor 2)     │
└─────────────────┘               └─────────────────┘
```

---

## 📦 COMPONENT BREAKDOWN

### **1. Main Window Components**

#### **ServiceEditorModal Enhancement**
**File**: `src/components/modals/ServiceEditorModal.tsx`

**New Features:**
- Present button in header
- Opens presentation mode
- Passes service data to presentation system

```typescript
<button
  onClick={handleStartPresentation}
  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
  disabled={service.items.length === 0}
>
  <Play size={18} />
  Present Service
</button>
```

---

### **2. Presentation State Management**

#### **servicePresentationStore.ts**
**File**: `src/store/servicePresentationStore.ts`

**State Structure:**
```typescript
interface ServicePresentationState {
  // Core state
  isPresenting: boolean;
  service: Service | null;
  currentItemIndex: number;
  currentSlideIndex: number;
  
  // Display state
  isBlank: boolean;
  displayMode: 'single' | 'dual';
  presenterDisplay: number;
  audienceDisplay: number;
  
  // Timer
  startTime: number | null;
  elapsedTime: number;
  targetDuration: number | null;
  
  // Navigation
  slideHistory: number[];
  
  // Actions
  startPresentation: (service: Service, mode: 'single' | 'dual') => void;
  stopPresentation: () => void;
  nextSlide: () => void;
  previousSlide: () => void;
  jumpToItem: (itemIndex: number) => void;
  jumpToSlide: (itemIndex: number, slideIndex: number) => void;
  toggleBlank: () => void;
  resetTimer: () => void;
}
```

**Key Features:**
- Central state for both presenter and audience views
- Zustand for reactive updates
- Sync across windows via IPC

---

### **3. Slide Rendering System**

#### **AdvancedSlidePreview Component**
**File**: `src/components/slides/AdvancedSlidePreview.tsx`

**Purpose**: Render ALL slide types with visual data support

**Supports:**
1. **Visual Data Slides** (from templates)
   - Parse JSON visualData
   - Render elements with positioning
   - Apply backgrounds, opacity, rotation
   - Match exact editor output

2. **Song Slides**
   - Verse/chorus display
   - Lyrics formatting
   - Background support

3. **Scripture Slides**
   - Reference display
   - Verse text
   - Template-based or simple

4. **Generic Slides**
   - Title/content fallback
   - Simple text display

```typescript
interface AdvancedSlidePreviewProps {
  item: ServiceItem;
  slideIndex?: number; // For multi-slide items (songs)
  className?: string;
}

export function AdvancedSlidePreview({ item, slideIndex = 0, className }: Props) {
  // Determine render method
  if (item.type === 'song' && item.song) {
    return <SongSlidePreview song={item.song} slideIndex={slideIndex} />;
  }
  
  // Has visual data from template editor
  if (item.content) {
    try {
      const visualData = JSON.parse(item.content);
      return <VisualDataSlide visualData={visualData} />;
    } catch (e) {
      // Fallback
    }
  }
  
  // Simple fallback
  return <SimpleSlide title={item.title} content={item.scriptureText || item.content} />;
}
```

---

### **4. Presenter View**

#### **PresenterView Component**
**File**: `src/components/presentation/PresenterView.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎭 Presenting: Sunday Morning    00:15:30    [❌ Exit]      │
├────────────┬────────────────────────────────────────────────┤
│            │                                                │
│  SERVICE   │  CURRENT SLIDE (Large)                        │
│  ITEMS     │  ┌──────────────────────────────────┐         │
│  ────────  │  │                                  │         │
│  1.✅Welcome│  │      For God so loved the       │         │
│  2.✅Song 1 │  │      world that he gave his     │         │
│  3.▶️ John  │  │      one and only Son...        │         │
│     3:16   │  │                                  │         │
│  4.⏸️Announce│ │         - John 3:16             │         │
│  5.⏸️Sermon │  └──────────────────────────────────┘         │
│            │                                                │
│            │  NEXT SLIDE (Small Preview)                   │
│  Duration: │  ┌────────────────┐                          │
│  45 mins   │  │ Key Points:    │                          │
│            │  │ 1. God's Love  │                          │
│  Progress: │  └────────────────┘                          │
│  33% ████─ │                                                │
│            │  📝 NOTES:                                    │
│            │  Emphasize God's love here. Pause after       │
│            │  reading to let it sink in. Make eye          │
│            │  contact with congregation.                   │
├────────────┴────────────────────────────────────────────────┤
│  [◀️ Previous (←)]  [▶️ Next (→)]  [⬛ Blank (B)]  [⏱️ Reset]│
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Service Item List** (left sidebar)
  - Shows all items
  - Marks completed (✅), current (▶️), upcoming (⏸️)
  - Click to jump
  - Progress indicator

- **Current Slide** (center, large)
  - Full preview of current slide
  - Matches audience view exactly

- **Next Slide** (center, small)
  - Preview of upcoming slide
  - Helps presenter prepare

- **Timer** (top)
  - Elapsed time (00:15:30)
  - Can countdown from target duration
  - Color warnings (yellow at 80%, red at 100%)

- **Presenter Notes** (bottom)
  - Shows notes from service item
  - Large readable text
  - Scrollable if long

- **Controls** (bottom bar)
  - Navigation buttons
  - Blank screen toggle
  - Timer reset
  - Exit button

**Implementation:**
```typescript
export function PresenterView() {
  const {
    service,
    currentItemIndex,
    currentSlideIndex,
    isBlank,
    elapsedTime,
    nextSlide,
    previousSlide,
    jumpToItem,
    toggleBlank,
    stopPresentation
  } = useServicePresentationStore();
  
  const currentItem = service?.items[currentItemIndex];
  const nextItem = service?.items[currentItemIndex + 1];
  
  // Calculate what slide is next
  const { nextItem: actualNextItem, nextSlideIndex } = getNextSlide(
    service,
    currentItemIndex,
    currentSlideIndex
  );
  
  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header with timer and exit */}
      <PresenterHeader 
        serviceName={service?.name}
        elapsedTime={elapsedTime}
        onExit={stopPresentation}
      />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Service Items */}
        <ServiceItemList
          items={service?.items || []}
          currentIndex={currentItemIndex}
          onJumpToItem={jumpToItem}
        />
        
        {/* Center - Current & Next Slides */}
        <div className="flex-1 p-6 space-y-4">
          {/* Current Slide */}
          <div className="flex-1">
            <h3 className="text-white text-sm mb-2">CURRENT SLIDE</h3>
            <div className="bg-black rounded-lg overflow-hidden">
              {isBlank ? (
                <div className="aspect-video bg-black" />
              ) : (
                <AdvancedSlidePreview 
                  item={currentItem}
                  slideIndex={currentSlideIndex}
                />
              )}
            </div>
          </div>
          
          {/* Next Slide */}
          <div className="h-48">
            <h3 className="text-white text-sm mb-2">NEXT SLIDE</h3>
            <div className="bg-black rounded-lg overflow-hidden h-full">
              {actualNextItem && (
                <AdvancedSlidePreview 
                  item={actualNextItem}
                  slideIndex={nextSlideIndex}
                  className="scale-50 origin-top-left"
                />
              )}
            </div>
          </div>
          
          {/* Presenter Notes */}
          <div className="h-32 bg-gray-800 rounded-lg p-4 overflow-auto">
            <h3 className="text-white text-sm mb-2">NOTES</h3>
            <p className="text-gray-300 text-base">
              {currentItem?.notes || 'No notes for this slide'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Controls */}
      <PresenterControls
        onPrevious={previousSlide}
        onNext={nextSlide}
        onToggleBlank={toggleBlank}
        isBlank={isBlank}
      />
    </div>
  );
}
```

---

### **5. Audience View**

#### **AudienceView Component**
**File**: `src/components/presentation/AudienceView.tsx`

**Layout:**
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                                                             │
│                                                             │
│                     CURRENT SLIDE                           │
│                    (FULL SCREEN)                            │
│                                                             │
│                                                             │
│                                                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Full-screen slide display
- No controls visible
- Syncs with presenter view
- Supports blank screen
- Clean, distraction-free

**Implementation:**
```typescript
export function AudienceView() {
  const {
    service,
    currentItemIndex,
    currentSlideIndex,
    isBlank
  } = useServicePresentationStore();
  
  const currentItem = service?.items[currentItemIndex];
  
  return (
    <div className="w-screen h-screen bg-black">
      {isBlank ? (
        <div className="w-full h-full bg-black" />
      ) : currentItem ? (
        <AdvancedSlidePreview 
          item={currentItem}
          slideIndex={currentSlideIndex}
          className="w-full h-full"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-white text-2xl">No slide to display</p>
        </div>
      )}
    </div>
  );
}
```

---

### **6. Electron Multi-Window System**

#### **main.ts Enhancement**
**File**: `main.ts`

**New Features:**
- Detect available displays
- Create presenter window (main screen)
- Create audience window (external display)
- IPC handlers for sync

```typescript
let presenterWindow: BrowserWindow | null = null;
let audienceWindow: BrowserWindow | null = null;

// IPC Handler: Start Presentation
ipcMain.handle('presentation:start', async (event, service: Service, mode: 'single' | 'dual') => {
  const displays = screen.getAllDisplays();
  console.log('📺 Available displays:', displays.length);
  
  if (mode === 'dual' && displays.length > 1) {
    // Multi-monitor setup
    const primaryDisplay = screen.getPrimaryDisplay();
    const externalDisplay = displays.find(d => d.id !== primaryDisplay.id);
    
    // Create Presenter Window (primary display)
    presenterWindow = new BrowserWindow({
      x: primaryDisplay.bounds.x,
      y: primaryDisplay.bounds.y,
      width: primaryDisplay.bounds.width,
      height: primaryDisplay.bounds.height,
      fullscreen: false, // Windowed for controls
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    presenterWindow.loadURL(`${VITE_DEV_SERVER_URL}/#/presenter`);
    
    // Create Audience Window (external display)
    if (externalDisplay) {
      audienceWindow = new BrowserWindow({
        x: externalDisplay.bounds.x,
        y: externalDisplay.bounds.y,
        width: externalDisplay.bounds.width,
        height: externalDisplay.bounds.height,
        fullscreen: true, // Full screen for audience
        frame: false,
        webPreferences: {
          nodeIntegration: true,
          contextIsolation: false
        }
      });
      
      audienceWindow.loadURL(`${VITE_DEV_SERVER_URL}/#/audience`);
    }
  } else {
    // Single screen mode (presenter view only)
    presenterWindow = new BrowserWindow({
      fullscreen: true,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
    });
    
    presenterWindow.loadURL(`${VITE_DEV_SERVER_URL}/#/presenter`);
  }
  
  return { success: true, displayCount: displays.length };
});

// IPC Handler: Stop Presentation
ipcMain.handle('presentation:stop', async () => {
  if (presenterWindow) {
    presenterWindow.close();
    presenterWindow = null;
  }
  if (audienceWindow) {
    audienceWindow.close();
    audienceWindow = null;
  }
  return { success: true };
});

// IPC Handler: Sync State (presenter → audience)
ipcMain.on('presentation:sync', (event, state) => {
  if (audienceWindow) {
    audienceWindow.webContents.send('presentation:update', state);
  }
});

// IPC Handler: Get Displays
ipcMain.handle('presentation:getDisplays', async () => {
  const displays = screen.getAllDisplays();
  return displays.map(d => ({
    id: d.id,
    bounds: d.bounds,
    primary: d.id === screen.getPrimaryDisplay().id
  }));
});
```

---

### **7. IPC Communication Bridge**

#### **presentationBridge.ts**
**File**: `src/electron/presentationBridge.ts`

```typescript
import { ipcRenderer } from 'electron';
import type { Service } from '../types/service';

export const presentationBridge = {
  // Start presentation
  async startPresentation(service: Service, mode: 'single' | 'dual') {
    return await ipcRenderer.invoke('presentation:start', service, mode);
  },
  
  // Stop presentation
  async stopPresentation() {
    return await ipcRenderer.invoke('presentation:stop');
  },
  
  // Get available displays
  async getDisplays() {
    return await ipcRenderer.invoke('presentation:getDisplays');
  },
  
  // Sync state to audience window
  syncState(state: any) {
    ipcRenderer.send('presentation:sync', state);
  },
  
  // Listen for state updates (audience window)
  onStateUpdate(callback: (state: any) => void) {
    ipcRenderer.on('presentation:update', (event, state) => callback(state));
  }
};
```

---

### **8. Keyboard Shortcuts**

**Global Shortcuts:**
- `Space` / `→` / `↓` → Next slide
- `Backspace` / `←` / `↑` → Previous slide
- `B` → Toggle blank screen
- `Escape` → Exit presentation
- `T` → Reset timer
- `G` → Go to slide (opens dialog)
- `1-9` → Jump to service item 1-9

---

### **9. Helper Utilities**

#### **getNextSlide Function**
```typescript
function getNextSlide(
  service: Service,
  currentItemIndex: number,
  currentSlideIndex: number
): { nextItem: ServiceItem | null, nextSlideIndex: number } {
  const currentItem = service.items[currentItemIndex];
  
  // If current item has multiple slides (song)
  if (currentItem.type === 'song' && currentItem.song) {
    const slideCount = currentItem.song.slides.length;
    if (currentSlideIndex < slideCount - 1) {
      // Next slide is within current item
      return {
        nextItem: currentItem,
        nextSlideIndex: currentSlideIndex + 1
      };
    }
  }
  
  // Move to next item
  const nextItem = service.items[currentItemIndex + 1];
  return {
    nextItem: nextItem || null,
    nextSlideIndex: 0
  };
}
```

---

## 🗂️ FILE STRUCTURE

```
src/
├── components/
│   ├── presentation/
│   │   ├── PresenterView.tsx          ← NEW
│   │   ├── AudienceView.tsx           ← NEW
│   │   ├── PresenterHeader.tsx        ← NEW
│   │   ├── PresenterControls.tsx      ← NEW
│   │   ├── ServiceItemList.tsx        ← NEW
│   │   └── PresentationModal.tsx      (existing, for songs)
│   ├── slides/
│   │   ├── AdvancedSlidePreview.tsx   ← NEW (renders all types)
│   │   ├── VisualDataSlide.tsx        ← NEW (template rendering)
│   │   ├── SongSlidePreview.tsx       (existing)
│   │   └── SimpleSlide.tsx            ← NEW (fallback)
│   └── modals/
│       └── ServiceEditorModal.tsx      (enhance with Present button)
├── store/
│   └── servicePresentationStore.ts    ← NEW
├── electron/
│   ├── presentationBridge.ts          ← NEW
│   └── ipcHandlers.ts                 ← NEW
├── pages/
│   ├── PresenterPage.tsx              ← NEW (route: /presenter)
│   └── AudiencePage.tsx               ← NEW (route: /audience)
└── utils/
    └── presentationHelpers.ts         ← NEW
```

---

## 🔄 DATA FLOW

### **Presentation Start:**
```
1. User clicks "Present Service" in ServiceEditorModal
2. ServiceEditorModal → presentationBridge.startPresentation(service, 'dual')
3. Electron IPC → Create presenter + audience windows
4. Both windows → Load routes (/presenter, /audience)
5. Both components → Subscribe to servicePresentationStore
6. Store initializes with service data
```

### **Navigation (Next Slide):**
```
1. User presses Space in PresenterView
2. PresenterView → store.nextSlide()
3. Store updates currentItemIndex/currentSlideIndex
4. Store → presentationBridge.syncState(newState)
5. Electron IPC → Send to audience window
6. AudienceView receives update
7. Both views re-render with new slide
```

### **Blank Screen:**
```
1. User presses B in PresenterView
2. Store.toggleBlank() → isBlank = true
3. Sync to audience window
4. AudienceView shows black screen
5. PresenterView dims current slide preview
```

---

## ✅ SUCCESS CRITERIA

**Minimum Viable Product:**
1. ✅ Present button in ServiceEditorModal
2. ✅ Opens presenter view (full screen or windowed)
3. ✅ Displays all service items with correct rendering
4. ✅ Keyboard navigation works
5. ✅ Timer displays elapsed time
6. ✅ Presenter notes visible

**Complete PowerPoint-Style System:**
1. ✅ Multi-monitor support (2 separate windows)
2. ✅ Presenter view with next slide preview
3. ✅ Audience view syncs perfectly
4. ✅ Service item list with progress
5. ✅ Jump to any item/slide
6. ✅ Blank screen toggle
7. ✅ Timer with countdown option
8. ✅ Professional UI/UX

---

## 🚀 IMPLEMENTATION ORDER

1. **Foundation** (30 min)
   - Create servicePresentationStore
   - Add routes for /presenter and /audience
   - Create basic page components

2. **Rendering** (45 min)
   - Build AdvancedSlidePreview
   - Build VisualDataSlide for template rendering
   - Test all service item types

3. **Presenter View** (60 min)
   - Build PresenterView layout
   - Add ServiceItemList sidebar
   - Add current/next slide display
   - Add timer and notes

4. **Audience View** (15 min)
   - Build simple full-screen AudienceView
   - Sync with store

5. **Navigation** (30 min)
   - Implement keyboard shortcuts
   - Add navigation buttons
   - Add jump-to functionality

6. **Electron Integration** (45 min)
   - Add IPC handlers to main.ts
   - Create presentationBridge
   - Test multi-window creation
   - Test state sync

7. **Integration** (30 min)
   - Add Present button to ServiceEditorModal
   - Connect everything
   - End-to-end testing

**Total Time**: ~4 hours

---

## 📝 NOTES

- Start with single-screen mode first, then add dual-monitor
- Use existing PresentationModal code as reference for songs
- Reuse VisualCanvas rendering logic for template slides
- Test on single monitor initially, dual-monitor later
- Keep audience view ultra-simple (no controls, just display)

---

**READY TO BUILD? Let's implement the complete system!**
