# 🎨 Visual Editor System - Complete Documentation

**Version**: 3.1.0  
**Last Updated**: October 30, 2025  
**Status**: Production-Ready

---

## 📋 TABLE OF CONTENTS

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Data Structures](#data-structures)
4. [Core Components](#core-components)
5. [Data Flow](#data-flow)
6. [Templates System](#templates-system)
7. [Conversion System](#conversion-system)
8. [Integration Points](#integration-points)
9. [How To Use](#how-to-use)
10. [Developer Guide](#developer-guide)

---

## 🎯 OVERVIEW

### **What Is The Visual Editor?**

The Visual Editor is a **drag-and-drop WYSIWYG editor** that allows users to create and edit slides with multiple visual elements (text, shapes, images) positioned anywhere on a 1920x1080 canvas.

### **Key Features:**
- ✅ **Multi-Element Editing** - Multiple text/shape/image elements per slide
- ✅ **Drag & Drop** - Move elements around the canvas
- ✅ **Resize & Rotate** - Visual manipulation of elements
- ✅ **Template System** - Pre-designed templates for announcements, sermons, etc.
- ✅ **Undo/Redo** - Full history management
- ✅ **Background Support** - Images, gradients, solid colors
- ✅ **Export/Import** - Save and load visual designs
- ✅ **Backward Compatible** - Works with existing simple text slides

### **Canvas Specs:**
- **Resolution**: 1920×1080px (16:9 aspect ratio)
- **Coordinate System**: Top-left origin (0,0)
- **Scaling**: Auto-scales to fit viewport
- **Elements**: Layered with z-index (0-100)

---

## 🏗️ ARCHITECTURE

### **System Layers:**

```
┌─────────────────────────────────────────────────┐
│  USER INTERFACE (React Components)              │
│  - VisualItemEditorModal                        │
│  - VisualCanvas                                  │
│  - SlideDesigner                                 │
└─────────────┬───────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────┐
│  STATE MANAGEMENT                                │
│  - useHistory (undo/redo)                        │
│  - Local state (selected element)                │
│  - Element manipulation                          │
└─────────────┬───────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────┐
│  DATA LAYER                                      │
│  - VisualSlide (full design structure)           │
│  - Slide (simple text format)                    │
│  - slideConverter (bidirectional conversion)     │
└─────────────┬───────────────────────────────────┘
              │
┌─────────────▼───────────────────────────────────┐
│  PERSISTENCE                                     │
│  - SQLite Database (visualData JSON column)      │
│  - Service Items (content field)                 │
└──────────────────────────────────────────────────┘
```

---

## 📊 DATA STRUCTURES

### **1. VisualSlide (Complete Design)**

The master structure for a visual slide:

```typescript
interface VisualSlide {
  // Core
  id: string;                    // Unique identifier
  content: string;               // Plain text fallback
  order: number;                 // Slide position in sequence
  
  // Visual Design
  elements: VisualElement[];     // All elements on the slide
  background: VisualBackground;  // Background configuration
  
  // Layout
  aspectRatio: '16:9' | '4:3';
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Metadata
  isVisualMode: boolean;         // True if edited visually
  templateId?: string;           // Source template (if any)
}
```

---

### **2. VisualElement (Base Element)**

Base structure for all elements on the canvas:

```typescript
interface VisualElement {
  // Identity
  id: string;                    // Unique element ID
  type: 'text' | 'shape' | 'image';
  
  // Geometry
  position: { x: number; y: number };  // Top-left corner (px)
  size: { width: number; height: number };  // Size (px)
  rotation: number;              // Degrees (0-360)
  
  // Appearance
  opacity: number;               // 0-1
  zIndex: number;                // Layer order (higher = front)
  
  // State
  locked: boolean;               // Prevent editing
  visible: boolean;              // Show/hide element
  
  // Content (type-specific)
  content?: string;              // For text/shape elements
  style?: TextStyle | ShapeStyle;  // Type-specific styling
}
```

---

### **3. TextElement (Text-Specific)**

Extended element for text:

```typescript
interface TextElement extends VisualElement {
  type: 'text';
  content: string;
  
  style: {
    // Font
    fontFamily: string;          // e.g., 'Inter', 'Arial'
    fontSize: number;            // px
    fontWeight: number;          // 100-900
    fontStyle: 'normal' | 'italic';
    
    // Text Layout
    textAlign: 'left' | 'center' | 'right';
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textDecoration: 'none' | 'underline' | 'line-through';
    lineHeight: number;          // Multiplier (e.g., 1.2)
    letterSpacing: number;       // px
    
    // Color
    color: string;               // Hex or rgba
    backgroundColor?: string;    // Background behind text
    
    // Effects
    textShadowOffsetX?: number;
    textShadowOffsetY?: number;
    textShadowBlur?: number;
    textShadowColor?: string;
    
    // Border
    borderRadius?: number;       // px (for background)
  };
}
```

---

### **4. VisualBackground**

Background configuration for the slide:

```typescript
type VisualBackground = 
  | SolidBackground 
  | GradientBackground 
  | ImageBackground;

interface SolidBackground {
  type: 'solid';
  color: string;                 // Hex color
}

interface GradientBackground {
  type: 'gradient';
  gradient: string | {           // CSS gradient or object
    type: 'linear' | 'radial';
    angle?: number;              // For linear (degrees)
    colors: string[];            // Color stops
    stops?: number[];            // Position of stops (0-100)
  };
}

interface ImageBackground {
  type: 'image';
  imageUrl?: string;             // Image URL or ID
  imageId?: string;              // Background pack ID
  
  // Image Effects
  imageFilters?: {
    blur?: number;               // px
    brightness?: number;         // % (100 = normal)
    contrast?: number;           // % (100 = normal)
    saturation?: number;         // % (100 = normal)
    hue?: number;                // degrees
    sepia?: number;              // % (0 = none)
    grayscale?: number;          // % (0 = none)
  };
  
  // Overlay
  overlay?: {
    enabled: boolean;
    color: string;               // Overlay color
    opacity: number;             // 0-100
    blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
  };
}
```

---

### **5. Simple Slide (Legacy Format)**

The original simple text-based format:

```typescript
interface Slide {
  id: string;
  type: 'title' | 'verse' | 'chorus' | 'bridge' | 'custom';
  content: string;               // Plain text content
  order: number;
  backgroundId?: string | null;  // Single background ID
  layout?: string | null;
  
  // CRITICAL: Stores complete visual design
  visualData?: any;              // Serialized VisualSlide
}
```

**Key Point**: `visualData` stores the COMPLETE `VisualSlide` structure, preserving all visual editing when converting back to simple format.

---

## 🎨 CORE COMPONENTS

### **1. VisualCanvas.tsx**

The rendering engine for the visual editor.

**Location**: `src/components/designer/VisualCanvas.tsx`

**Purpose**: Renders a 1920x1080 canvas with interactive elements

**Key Features:**
- Auto-scaling to fit viewport
- Element selection and dragging
- Background rendering (solid, gradient, image)
- Element layering (z-index)
- Image filter effects

**Props:**
```typescript
interface VisualCanvasProps {
  slide: VisualSlide;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<VisualElement>) => void;
  zoom?: number;  // Default 1
}
```

**Rendering Pipeline:**

1. **Background Layer**
   ```typescript
   // Renders based on background type
   if (background.type === 'solid') {
     // Solid color fill
   } else if (background.type === 'gradient') {
     // CSS gradient
   } else if (background.type === 'image') {
     // Background image + overlay + filters
   }
   ```

2. **Elements Layer**
   ```typescript
   // Sorted by zIndex (lowest to highest)
   sortedElements.map(element => {
     if (element.visible) {
       return <ElementRenderer element={element} />
     }
   })
   ```

3. **Selection Layer**
   ```typescript
   // Visual feedback for selected element
   if (selectedElementId) {
     <SelectionBox element={selectedElement} />
   }
   ```

**Coordinate System:**
```
(0,0) ──────────────────────────────► (1920, 0)
  │
  │    Canvas: 1920×1080px
  │    
  │    Element position: { x, y }
  │    - x: Left edge (0-1920)
  │    - y: Top edge (0-1080)
  │
  ▼
(0,1080)                        (1920,1080)
```

---

### **2. VisualItemEditorModal.tsx**

The main editor modal with controls.

**Location**: `src/components/modals/VisualItemEditorModal.tsx`

**Purpose**: Full-featured editor with toolbar, canvas, and properties panel

**Key Features:**
- **Undo/Redo** (useHistory hook)
- **Element Selection** (click to select)
- **Add Elements** (text, shape, image)
- **Delete Elements**
- **Copy/Paste Elements**
- **Template Loading**
- **Background Selection**
- **Element Ordering** (bring to front, send to back)

**Layout:**
```
┌────────────────────────────────────────────┐
│ HEADER                                     │
│ [Title]              [Undo] [Redo] [Close] │
├────────────────────────────────────────────┤
│ TOOLBAR                                    │
│ [Add Text] [Change Template] [Brand Assets]│
│ [Add Image] [Add Shape] [Delete]           │
├────────────────────────────────────────────┤
│                                            │
│              VISUAL CANVAS                 │
│           (1920×1080 scaled)               │
│                                            │
├────────────────────────────────────────────┤
│ PROPERTIES PANEL (if element selected)    │
│ Position: X [___] Y [___]                 │
│ Size: W [___] H [___]                     │
│ Font: [___] Size: [__]                    │
│ Color: [___] Background: [___]            │
└────────────────────────────────────────────┘
```

**State Management:**
```typescript
// History management (undo/redo)
const { state: slide, setState: setSlide, undo, redo, canUndo, canRedo } 
  = useHistory<VisualSlide | null>(null);

// Current selection
const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

// Clipboard
const [copiedElement, setCopiedElement] = useState<any | null>(null);
```

**Core Actions:**

1. **Add Text Element**
   ```typescript
   const handleAddText = () => {
     const newElement = createDefaultTextElement('New Text');
     setSlide({
       ...slide,
       elements: [...slide.elements, newElement]
     });
   };
   ```

2. **Update Element**
   ```typescript
   const handleUpdateElement = (elementId: string, updates: Partial<VisualElement>) => {
     setSlide({
       ...slide,
       elements: slide.elements.map(el => 
         el.id === elementId ? { ...el, ...updates } : el
       )
     });
   };
   ```

3. **Delete Element**
   ```typescript
   const handleDeleteElement = () => {
     setSlide({
       ...slide,
       elements: slide.elements.filter(el => el.id !== selectedElementId)
     });
     setSelectedElementId(null);
   };
   ```

4. **Bring to Front / Send to Back**
   ```typescript
   const handleBringToFront = () => {
     const maxZ = Math.max(...slide.elements.map(el => el.zIndex));
     handleUpdateElement(selectedElementId, { zIndex: maxZ + 1 });
   };
   
   const handleSendToBack = () => {
     const minZ = Math.min(...slide.elements.map(el => el.zIndex));
     handleUpdateElement(selectedElementId, { zIndex: minZ - 1 });
   };
   ```

---

### **3. SlideDesigner.tsx**

Standalone designer for creating slides from scratch.

**Location**: `src/components/designer/SlideDesigner.tsx`

**Purpose**: Full-page designer for creating new visual slides

**Similar to VisualItemEditorModal** but:
- No modal wrapper
- Full-page layout
- Better for creating slides from scratch
- Can save as templates

---

## 🔄 DATA FLOW

### **Opening Visual Editor**

```
1. User clicks "Visual Editor" on a slide
   │
   ▼
2. SongFormModal.tsx
   └─ Calls: handleOpenVisualDesigner()
   │
   ▼
3. Converts Slide → VisualSlide
   └─ slideConverter.simpleToVisualSlide(slide)
      │
      ├─ HAS visualData? → Use stored design
      │
      └─ NO visualData? → Create default centered text
   │
   ▼
4. Opens VisualItemEditorModal
   └─ Passes VisualSlide
   │
   ▼
5. User edits in visual editor
   │
   ▼
6. User clicks "Save"
   │
   ▼
7. Converts VisualSlide → Slide
   └─ slideConverter.visualToSimpleSlide(visualSlide)
      │
      └─ Stores complete design in visualData field
   │
   ▼
8. Updates song in database
   └─ SQLite stores JSON in visualData column
```

---

### **Editing Flow**

```
User Action (Click/Drag)
   │
   ▼
VisualCanvas Event Handler
   │
   ├─ Element Click → onSelectElement(elementId)
   │
   ├─ Drag → onUpdateElement(elementId, { position })
   │
   └─ Background Click → onSelectElement(null)
   │
   ▼
VisualItemEditorModal State Update
   │
   └─ setSlide({ ...slide, elements: [...] })
   │
   ▼
useHistory Hook
   │
   └─ Pushes to history stack (for undo)
   │
   ▼
VisualCanvas Re-renders
   └─ Shows updated design
```

---

## 📐 TEMPLATES SYSTEM

### **Template Structure**

Templates are pre-designed slides stored in JSON format:

**Location**: `src/config/slideTemplatesFixed.ts`

**Example Template:**
```typescript
{
  id: 'announcement-modern-gradient',
  name: 'Modern Gradient',
  category: 'announcement',
  thumbnail: 'data:image/svg...',
  description: 'Modern gradient with centered title',
  
  visualData: {
    backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#667eea',
    
    elements: [
      // Background shape (z-index 5)
      {
        id: 'bg-shape',
        type: 'shape',
        position: { x: 0, y: 0 },
        size: { width: 1920, height: 1080 },
        zIndex: 5,
        visible: true,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      },
      
      // Church name (z-index 10)
      {
        id: 'church-name',
        type: 'text',
        content: 'YOUR CHURCH NAME',
        position: { x: 160, y: 100 },
        size: { width: 1600, height: 80 },
        zIndex: 10,
        visible: true,
        style: {
          fontSize: 36,
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
        }
      },
      
      // Event title (z-index 11)
      {
        id: 'event-title',
        type: 'text',
        content: 'SPECIAL EVENT',
        position: { x: 160, y: 400 },
        size: { width: 1600, height: 200 },
        zIndex: 11,
        visible: true,
        style: {
          fontSize: 96,
          fontWeight: 800,
          color: '#ffffff',
          textAlign: 'center',
        }
      },
      
      // Date/time (z-index 12)
      {
        id: 'event-datetime',
        type: 'text',
        content: 'Sunday at 10:00 AM',
        position: { x: 160, y: 650 },
        size: { width: 1600, height: 60 },
        zIndex: 12,
        visible: true,
        style: {
          fontSize: 42,
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
        }
      }
    ]
  }
}
```

### **Z-Index Layers:**
```
0-4:   Background elements (shapes, overlays)
5-8:   Decorative elements (cards, dividers)
10+:   Content elements (text, images, logos)
100+:  Always-on-top elements
```

---

## 🔄 CONVERSION SYSTEM

### **Purpose**

Maintains backward compatibility between:
- **Simple Format**: Plain text slides (legacy)
- **Visual Format**: Multi-element designs (new)

**Location**: `src/utils/slideConverter.ts`

---

### **simpleToVisualSlide()**

Converts a simple text slide to a visual slide.

**Usage:**
```typescript
import { simpleToVisualSlide } from '../utils/slideConverter';

const simpleSlide: Slide = {
  id: '123',
  type: 'verse',
  content: 'Amazing grace how sweet the sound',
  order: 0,
  backgroundId: 'mountain-1',
};

const visualSlide = simpleToVisualSlide(simpleSlide);
// Result: VisualSlide with centered text element
```

**Logic:**
```typescript
1. Check if slide.visualData exists
   └─ YES: Return stored visualData (preserve design)
   └─ NO: Create default visual slide

2. Create centered text element
   └─ Position: (160, 390) - centered with margins
   └─ Size: 1600×300px
   └─ Font: 56px, white, bold, centered
   └─ Shadow: For readability

3. Create background
   └─ If backgroundId exists: Image background
   └─ Else: Solid dark color

4. Return VisualSlide structure
```

---

### **visualToSimpleSlide()**

Converts a visual slide back to simple format (for saving).

**Usage:**
```typescript
const visualSlide: VisualSlide = { /* ... */ };
const simpleSlide = visualToSimpleSlide(visualSlide);

// Result: Slide with visualData preserved
```

**Logic:**
```typescript
1. Extract all text elements
   └─ Sort by zIndex (top to bottom)
   └─ Combine content with "\n\n"

2. Extract background
   └─ If image background: Store imageUrl as backgroundId
   └─ Else: null

3. Create Slide object
   └─ content: Combined text
   └─ backgroundId: Extracted background
   └─ visualData: COMPLETE VisualSlide (CRITICAL!)

4. Return Slide
```

**CRITICAL**: The `visualData` field stores the ENTIRE `VisualSlide` structure, ensuring no design is lost when converting between formats.

---

## 🔗 INTEGRATION POINTS

### **1. Song Editor (SongFormModal.tsx)**

**Visual Editor Button:**
```typescript
<button onClick={handleOpenVisualDesigner}>
  <Sparkles size={18} />
  Visual Editor
</button>
```

**Opening Flow:**
```typescript
const handleOpenVisualDesigner = () => {
  if (!currentSlides || currentSlides.length === 0) return;
  
  // Convert slides to visual format
  const visualSlides = currentSlides.map(simpleToVisualSlide);
  
  // Open designer modal
  setVisualDesignerSlides(visualSlides);
  setShowVisualDesigner(true);
};
```

---

### **2. Service Planner (ServiceEditorModal.tsx)**

Service items store visual designs in the `content` field:

```typescript
interface ServiceItem {
  id: string;
  type: 'announcement' | 'welcome' | 'sermon' | ...;
  title: string;
  content: string;  // JSON stringified VisualSlide
  duration: number;
}
```

**Editing:**
```typescript
const handleEditItem = (item: ServiceItem) => {
  // Parse visual data from content
  const visualData = JSON.parse(item.content);
  
  // Open visual editor
  setEditingItem({ ...item, parsedContent: visualData });
  setShowVisualEditor(true);
};
```

---

### **3. Database Storage**

**SQLite Schema:**
```sql
-- Slides table (for songs)
CREATE TABLE slides (
  id TEXT PRIMARY KEY,
  song_id TEXT,
  content TEXT,
  order_index INTEGER,
  background_id TEXT,
  visual_data TEXT,  -- JSON serialized VisualSlide
  ...
);

-- Service items table
CREATE TABLE service_items (
  id TEXT PRIMARY KEY,
  service_id TEXT,
  type TEXT,
  title TEXT,
  content TEXT,  -- JSON serialized VisualSlide
  ...
);
```

**Saving:**
```typescript
// Convert visual slide to simple format
const simpleSlide = visualToSimpleSlide(visualSlide);

// Save to database (visual_data field contains full design)
await db.updateSlide(slideId, {
  content: simpleSlide.content,
  visual_data: JSON.stringify(simpleSlide.visualData)
});
```

---

## 🎓 HOW TO USE

### **For Users**

#### **Editing a Song Slide:**
1. Open song in Library
2. Click "Visual Editor" tab
3. Visual editor opens with all slides
4. Select a slide to edit
5. Use tools:
   - Click element to select
   - Drag to move
   - Resize handles to change size
   - Properties panel to edit text/colors
6. Click "Save" when done

#### **Creating an Announcement:**
1. Go to Service Planner
2. Click "Add Item" → "Announcement"
3. Choose a template
4. Visual editor opens
5. Edit text (church name, event title, date)
6. Customize colors/fonts if needed
7. Click "Save"

#### **Tips:**
- **Undo/Redo**: Use undo/redo buttons if you make a mistake
- **Templates**: Start with a template, then customize
- **Text**: Double-click text to edit content
- **Background**: Click "Change Background" to select different image
- **Logo**: Click "Brand Assets" to add your church logo

---

### **For Developers**

#### **Adding a New Element Type:**

1. **Define Type** (`src/types/designer.ts`)
   ```typescript
   interface VideoElement extends VisualElement {
     type: 'video';
     videoUrl: string;
     autoplay: boolean;
   }
   ```

2. **Update Renderer** (`VisualCanvas.tsx`)
   ```typescript
   const renderElement = (element: VisualElement) => {
     if (element.type === 'video') {
       return <VideoRenderer element={element} />;
     }
     // ...
   };
   ```

3. **Add Controls** (`VisualItemEditorModal.tsx`)
   ```typescript
   const handleAddVideo = () => {
     const newElement: VideoElement = {
       id: uuidv4(),
       type: 'video',
       videoUrl: '',
       autoplay: false,
       // ... standard properties
     };
     setSlide({
       ...slide,
       elements: [...slide.elements, newElement]
     });
   };
   ```

---

#### **Creating a Custom Template:**

1. **Define Template** (`src/config/slideTemplatesFixed.ts`)
   ```typescript
   {
     id: 'my-custom-template',
     name: 'My Custom Design',
     category: 'announcement',
     thumbnail: 'data:image/svg+xml,...',
     description: 'Custom design for special events',
     
     visualData: {
       backgroundGradient: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
       
       elements: [
         {
           id: 'title',
           type: 'text',
           content: 'EVENT TITLE',
           position: { x: 200, y: 400 },
           size: { width: 1520, height: 280 },
           zIndex: 10,
           visible: true,
           style: {
             fontSize: 120,
             fontWeight: 900,
             color: '#ffffff',
             textAlign: 'center',
             textShadow: '0 4px 20px rgba(0,0,0,0.5)',
           }
         },
         // Add more elements...
       ]
     }
   }
   ```

2. **Export Template**
   ```typescript
   export const MY_CUSTOM_TEMPLATES: SlideTemplate[] = [
     // ... templates
   ];
   ```

3. **Register Template** (in same file)
   ```typescript
   export const ALL_TEMPLATES = [
     ...ANNOUNCEMENT_TEMPLATES,
     ...MY_CUSTOM_TEMPLATES,
   ];
   ```

---

## 🐛 TROUBLESHOOTING

### **Elements Not Showing**
- Check `visible: true` property
- Check z-index (might be behind other elements)
- Check position (might be off-canvas)

### **Template Not Loading**
- Verify JSON structure
- Check all required fields are present
- Console logs in `VisualItemEditorModal.tsx` line 34

### **Undo/Redo Not Working**
- Check useHistory hook is wrapping state
- Ensure `setState` is used, not direct mutation

### **Background Not Showing**
- Check background.type matches data structure
- For images, verify imageUrl or imageId is valid
- Check WORSHIP_BACKGROUNDS array for ID

---

## 📚 KEY FILES REFERENCE

| File | Purpose |
|------|---------|
| `src/types/designer.ts` | Type definitions |
| `src/components/designer/VisualCanvas.tsx` | Rendering engine |
| `src/components/modals/VisualItemEditorModal.tsx` | Main editor modal |
| `src/components/designer/SlideDesigner.tsx` | Full-page designer |
| `src/utils/slideConverter.ts` | Format conversion |
| `src/config/slideTemplatesFixed.ts` | Template library |
| `src/hooks/useHistory.ts` | Undo/redo management |

---

## 🎯 BEST PRACTICES

### **Performance**
- Limit elements to 20 per slide (performance)
- Use solid colors instead of images when possible
- Compress images before adding

### **Design**
- Keep text readable (min 24px font)
- Use text shadows for readability on images
- Maintain contrast (dark text on light, light on dark)
- Follow z-index convention (0-4 bg, 5-8 decor, 10+ content)

### **Data**
- Always preserve visualData when converting
- Validate VisualSlide structure before saving
- Handle missing properties gracefully

---

## ✅ SUMMARY

The Visual Editor is a **powerful drag-and-drop system** that enables users to create professional multi-element slides while maintaining full backward compatibility with simple text slides.

**Key Points:**
- ✅ Multi-element editing on 1920×1080 canvas
- ✅ Template system for quick starts
- ✅ Bidirectional conversion (simple ↔ visual)
- ✅ Full undo/redo support
- ✅ Saved as JSON in database
- ✅ Production-ready and stable

**Next Steps:**
- Add animation support
- Video element support
- Advanced shape tools
- Collaborative editing

---

**Questions?** See the code in the files referenced above or check console logs for debugging output.

**Last Updated**: October 30, 2025  
**Version**: 3.1.0
