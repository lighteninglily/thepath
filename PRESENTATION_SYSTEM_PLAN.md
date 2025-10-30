# 🎭 PRESENTATION SYSTEM - AUDIT & PLAN

**Date**: October 29, 2025  
**Status**: Needs Implementation  
**Priority**: HIGH

---

## 🔍 AUDIT FINDINGS

### ✅ What EXISTS:
1. **Song Presentation** - Works for library songs
   - `PresentationModal.tsx` - Basic presenter + output view
   - `PresentationPage.tsx` - Full-screen display
   - `presentationStore.ts` - State management
   - Keyboard shortcuts (Space, Backspace, B for blank)
   - Slide counter display

2. **Basic Infrastructure**:
   - Settings for presentation display preference
   - Keyboard shortcut configuration
   - Presenter notes field in service items

### ❌ What's MISSING:
1. **NO Present Button for Services** - Main issue!
2. **NO Service Presentation System** - Can't present services
3. **NO Multi-Monitor Support** - PowerPoint-style dual display
4. **NO Presenter View** - No next slide preview
5. **NO Visual Data Rendering** - Templates won't display properly

---

## 🎯 REQUIREMENTS (PowerPoint-Style)

### **Multi-Monitor Presentation:**

**Display 1 - Presenter View (Main Screen):**
```
┌────────────────────────────────────────┐
│  Service: Sunday Morning               │
│                                        │
│  ┌──────────┐    ┌──────────┐        │
│  │ Current  │    │   Next   │        │
│  │  Slide   │    │  Slide   │        │
│  │          │    │          │        │
│  └──────────┘    └──────────┘        │
│                                        │
│  Slide 3 of 12                        │
│  ⏱️ 00:15:30                           │
│  📝 Notes: Welcome everyone...        │
│                                        │
│  [◀️ Prev] [▶️ Next] [⬛ Blank] [❌ Exit]│
└────────────────────────────────────────┘
```

**Display 2 - Audience View (Projector/External):**
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│         CURRENT SLIDE ONLY             │
│         (FULL SCREEN)                  │
│                                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

---

## 📋 IMPLEMENTATION PLAN

### **Phase 1: Service Presentation Core** ⏳

**1.1 Add Present Button to ServiceEditorModal**
```typescript
// In ServiceEditorModal header
<button
  onClick={handleStartPresentation}
  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
>
  <Play size={18} />
  Present Service
</button>
```

**1.2 Create ServicePresentationModal**
- Full-screen overlay
- Render all service item types:
  - Songs (existing SlidePreview)
  - Scripture (template visual data)
  - Announcements (template visual data)
  - Sermons (template visual data)
  - Generic items (template visual data)
- Keyboard navigation
- Slide counter

**Files to Create:**
- `src/components/presentation/ServicePresentationModal.tsx`
- `src/store/servicePresentationStore.ts`

---

### **Phase 2: Multi-Monitor Support** ⏳

**2.1 Electron Window Management**
```typescript
// In main.ts
function createPresentationWindow() {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find(d => d.bounds.x !== 0) || displays[0];
  
  presentationWindow = new BrowserWindow({
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    fullscreen: true,
    // ... config
  });
}
```

**2.2 IPC Communication**
- Main ↔ Presenter View sync
- Presenter View ↔ Audience View sync
- Real-time slide updates

**2.3 Display Selection UI**
- Dropdown to choose presentation monitor
- Preview of each display
- Save preference in settings

---

### **Phase 3: Presenter View** ⏳

**3.1 Presenter Interface**
- Current slide (large preview)
- Next slide (smaller preview)
- Timer (elapsed/countdown)
- Presenter notes display
- Service item list (sidebar)
- Quick navigation

**3.2 Controls**
- Previous/Next buttons
- Blank screen toggle
- Jump to slide
- Exit presentation
- Confidence monitor

**3.3 Visual Enhancements**
- Smooth transitions
- Keyboard shortcut hints
- Progress bar
- Slide thumbnails

---

### **Phase 4: Visual Data Rendering** ⏳

**4.1 AdvancedSlidePreview Enhancement**
```typescript
// Render template-based slides
<AdvancedSlidePreview
  visualData={item.content ? JSON.parse(item.content) : null}
  fallback={<SimpleTextSlide title={item.title} />}
/>
```

**4.2 Template Rendering Support**
- Background images
- Text elements with positioning
- Shape rendering
- Image rendering
- All styling preserved

---

### **Phase 5: Professional Features** ⏳

**5.1 Timer**
- Countdown/count-up
- Configurable duration
- Warning colors (yellow at 5min, red at 1min)

**5.2 Blank/Logo Screen**
- Press B for blank
- Custom logo display option
- Fade in/out transitions

**5.3 Slide Transitions**
- Fade
- Slide
- None
- Configurable in settings

**5.4 Remote Control**
- Mobile app integration (future)
- Web interface for remote control
- Networked presenter clicker

---

## 🚀 IMMEDIATE ACTION ITEMS

### **Quick Win - Basic Service Presentation**

**Goal**: Get a working Present button for services

**Steps:**
1. Add Present button to ServiceEditorModal ✅
2. Create ServicePresentationModal (single screen) ✅
3. Render service items in full-screen ✅
4. Keyboard navigation (Space, Backspace, Esc) ✅
5. Slide counter ✅

**Time Estimate**: 2-3 hours

---

### **Next Steps - PowerPoint-Style Features**

**After basic works:**
1. Multi-monitor setup (Electron windows)
2. Presenter view with next slide
3. Timer and notes display
4. Visual data rendering for templates

**Time Estimate**: 8-12 hours

---

## 🎯 USER REQUEST SUMMARY

**What User Wants:**
1. ✅ Present button that works
2. ⏳ Multi-monitor support (presenter view + audience view)
3. ⏳ See what's next (like PowerPoint)
4. ⏳ Full presentation system

**Also Mentioned:**
- GPT-5 update (when available)

---

## 📚 TECHNICAL DETAILS

### **Service Item Rendering**

**Different types need different renderers:**

```typescript
function renderServiceItem(item: ServiceItem) {
  switch (item.type) {
    case 'song':
      return <SongSlidePreview song={item.song} />;
    
    case 'scripture':
    case 'announcement':
    case 'sermon':
      // Has visual data from template
      if (item.content) {
        const visualData = JSON.parse(item.content);
        return <AdvancedSlidePreview visualData={visualData} />;
      }
      return <SimpleTextSlide title={item.title} text={item.scriptureText} />;
    
    case 'welcome':
    case 'closing':
    case 'offering':
      // Generic or template-based
      if (item.content) {
        const visualData = JSON.parse(item.content);
        return <AdvancedSlidePreview visualData={visualData} />;
      }
      return <SimpleTextSlide title={item.title} />;
    
    default:
      return <SimpleTextSlide title={item.title} />;
  }
}
```

---

## 🎬 MOCKUP - PRESENTER VIEW

```
┌─────────────────────────────────────────────────────────────┐
│  🎭 Presenting: Sunday Morning Service    00:15:30   [❌ Exit]│
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│   📋 SERVICE ITEMS    │   CURRENT SLIDE (Slide 3/12)       │
│   ─────────────────   │   ┌───────────────────────────┐   │
│   1. ✅ Welcome       │   │                           │   │
│   2. ✅ Worship Song  │   │   For God so loved the    │   │
│   3. ▶️  John 3:16    │   │   world that he gave his  │   │
│   4. ⏸️  Announcement │   │   one and only Son...     │   │
│   5. ⏸️  Sermon       │   │                           │   │
│                       │   │      - John 3:16          │   │
│                       │   └───────────────────────────┘   │
│                       │                                     │
│                       │   NEXT SLIDE                        │
│                       │   ┌───────────────────────────┐   │
│                       │   │  Key Points:              │   │
│                       │   │  1. God's Love            │   │
│                       │   │  2. Sacrifice             │   │
│                       │   └───────────────────────────┘   │
│                       │                                     │
│                       │   📝 NOTES:                         │
│                       │   Emphasize God's love, pause       │
│                       │   after reading                     │
│                       │                                     │
├───────────────────────┴─────────────────────────────────────┤
│  [◀️ Previous]  [▶️ Next]  [⬛ Blank]  [⏱️ Timer]  [⚙️ Settings] │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ SUCCESS CRITERIA

**Presentation system is complete when:**
1. ✅ Can click "Present" button on any service
2. ✅ Service displays full-screen with all items
3. ✅ Keyboard navigation works (Space, Backspace, Esc)
4. ✅ Templates render correctly (visual data preserved)
5. ✅ Multi-monitor support (presenter + audience view)
6. ✅ Presenter view shows next slide
7. ✅ Timer and notes visible in presenter view
8. ✅ Professional UI/UX quality

---

## 🚀 LET'S BUILD IT!

**Starting with Phase 1: Basic Service Presentation**

Would you like me to:
1. ✅ Add the Present button first
2. ✅ Build the basic single-screen presentation
3. ✅ Then add multi-monitor support
4. ✅ Finally add presenter view features

**Or prioritize differently?**
