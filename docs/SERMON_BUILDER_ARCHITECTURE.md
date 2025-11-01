# 📝 SERMON BUILDER ARCHITECTURE

**Version**: 2.0 | **Updated**: October 31, 2025 | **Status**: ✅ Production Ready

---

## 1. OVERVIEW

### Purpose
Professional sermon slide creation system with template-based design and modern visual editing capabilities.

### Key Features
- ✅ **3-Panel Interface**: Navigator, Editor, Template Gallery
- ✅ **10+ Templates**: Title, Scripture, Point, Multi-Point, Quote, Transition, Question
- ✅ **Modern Visual Editor**: Same professional editor as announcements/scripture
- ✅ **Drag & Drop**: Reorder slides visually
- ✅ **Live Preview**: See template formatting in real-time
- ✅ **Auto-save**: Changes persist automatically

---

## 2. COMPONENT ARCHITECTURE

### Component Hierarchy
```
AddSermonModal (Container + Visual Editor Integration)
  └─ SermonSlideBuilder (Main 3-Panel Interface)
      ├─ SermonSlideNavigator (Left: Slide List)
      ├─ SermonSlideEditor (Center: Preview + Edit)
      └─ SermonTemplateGallery (Right: Template Picker)
  
When Customizing:
  └─ VisualItemEditorModal (Modern Editor with Toolbar)
```

### File Structure
```
src/components/sermon/
  ├─ AddSermonModal.tsx          # Container & Visual Editor integration
  ├─ SermonSlideBuilder.tsx      # Main 3-panel interface
  ├─ SermonSlideEditor.tsx       # Center panel (preview & edit)
  ├─ SermonSlideNavigator.tsx    # Left panel (slide list)
  └─ SermonTemplateGallery.tsx   # Right panel (templates)

src/components/modals/
  └─ VisualItemEditorModal.tsx   # Shared modern visual editor

src/config/
  └─ sermonTemplates.ts          # Template definitions

src/utils/
  └─ sermonTemplateMatcher.ts    # Content analysis & placeholder replacement
```

---

## 3. DATA FLOW

### Template Application
```typescript
// 1. User clicks template → handleSelectTemplate(template)
const visualData = applyTemplateToContent(template, content);

// 2. Update slide with template
newSlides[index] = {
  ...currentSlide,
  templateId: template.id,
  visualData: {
    background: { type: 'gradient', value: '...' },
    elements: [{ id, type, content, x, y, width, height, style }]
  }
};

// 3. Preview renders with VisualCanvas
<VisualCanvas slide={visualDataSlide} />

// 4. Customize button enabled
<button disabled={!hasTemplate} onClick={onOpenVisualEditor}>
  Customize
</button>
```

### Visual Editor Integration
```typescript
// Opening Editor
const serviceItem: ServiceItem = {
  type: 'sermon',
  content: currentSlide.visualData  // Visual data in content field
};

<VisualItemEditorModal
  item={serviceItem}
  onSave={handleSaveFromVisualEditor}
/>

// Saving Changes
const visualData = typeof updatedItem.content === 'string'
  ? JSON.parse(updatedItem.content)
  : updatedItem.content;

newSlides[editingSlideIndex].visualData = visualData;
```

---

## 4. TEMPLATE SYSTEM

### Template Structure
```typescript
interface SermonTemplate {
  id: string;
  name: string;
  category: 'title' | 'scripture' | 'point' | 'multi-point' | 'quote' | 'transition' | 'question';
  visualData: {
    background: { type: 'gradient' | 'color'; value: string };
    elements: Array<{
      id: string;
      type: 'text';
      content: string;  // With {{PLACEHOLDERS}}
      x: number;        // Percentage (0-100)
      y: number;
      width: number;
      height: number;
      style: { fontSize, fontFamily, fontWeight, color, textAlign, ... };
    }>;
  };
}
```

### Placeholders
- `{{TITLE}}` - First line
- `{{SUBTITLE}}` - Second line
- `{{POINT_NUMBER}}` - Extracted number (1, 2, A)
- `{{POINT_TITLE}}` - Main point text
- `{{POINT_BODY}}` - Supporting text
- `{{SCRIPTURE_REFERENCE}}` - Bible reference
- `{{SCRIPTURE_TEXT}}` - Verse text

### Application Logic
```typescript
export function applyTemplateToContent(template, content) {
  const visualData = cloneDeep(template.visualData);
  
  visualData.elements = visualData.elements.map(element => ({
    ...element,
    content: element.content
      .replace(/\{\{TITLE\}\}/g, content.split('\n')[0])
      .replace(/\{\{SUBTITLE\}\}/g, content.split('\n')[1])
      .replace(/\{\{POINT_NUMBER\}\}/g, extractNumber(content))
      .replace(/\{\{POINT_TITLE\}\}/g, extractTitle(content))
      // ... more replacements
  }));
  
  return visualData;
}
```

---

## 5. KEY COMPONENTS

### AddSermonModal.tsx
**Purpose**: Container managing workflow steps and Visual Editor integration

**Key Functions**:
```typescript
// Open Visual Editor
const handleOpenVisualEditor = (slide, index) => {
  setSermonSlides(slides => {
    slides[index] = slide;  // Save current state
    return slides;
  });
  setEditingSlideIndex(index);
  setStep('visual-editor');  // Switch to editor
};

// Save from Visual Editor
const handleSaveFromVisualEditor = (updatedItem) => {
  const visualData = updatedItem.content;  // Extract changes
  sermonSlides[editingSlideIndex].visualData = visualData;
  setStep('builder');  // Return to builder
};

// Render Visual Editor
if (step === 'visual-editor') {
  return <VisualItemEditorModal
    item={{ ...currentSlide, content: currentSlide.visualData }}
    onSave={handleSaveFromVisualEditor}
  />;
}
```

### SermonSlideBuilder.tsx
**Purpose**: Main 3-panel interface

**Key Functions**:
```typescript
// Apply template
const handleSelectTemplate = (template) => {
  const visualData = applyTemplateToContent(template, currentSlide.content);
  
  newSlides[currentSlideIndex] = {
    ...currentSlide,
    templateId: template.id,
    visualData
  };
  
  setSlides(newSlides);
};

// Open customization
const handleOpenVisualEditor = () => {
  onOpenVisualEditor(currentSlide, currentSlideIndex);
};
```

### SermonSlideEditor.tsx
**Purpose**: Center panel with preview and controls

**Preview Rendering**:
```typescript
{hasTemplate && slide.visualData ? (
  <VisualCanvas
    slide={{
      elements: slide.visualData.elements,
      background: slide.visualData.background,
      aspectRatio: '16:9'
    }}
  />
) : (
  <div>No template applied</div>
)}

<button
  onClick={onOpenVisualEditor}
  disabled={!hasTemplate}
>
  Customize
</button>
```

---

## 6. TECHNICAL DECISIONS

### Why VisualItemEditorModal?
**User Request**: "Use the same visual editor as announcements"

**Benefits**:
- ✅ Consistent UX across all slide types
- ✅ Modern toolbar (Change Template, Brand Assets, Insert Scripture, Upload, Font Style)
- ✅ No code duplication
- ✅ Professional features (drag & drop, properties panel, background picker)
- ✅ Stable (no crashes)

**Implementation**:
- Sermon slides convert to `ServiceItem` format
- Visual data stored in `content` field
- Changes extracted back to sermon slide

### Why Remove AI Suggest?
**User Feedback**: "Take it out. It's not helpful."

**Changes**:
- ❌ Removed AI Suggest buttons (2)
- ❌ Removed "Suggested for You" section
- ✅ Simple template picker
- ✅ Full-width Customize button

**Result**: Cleaner UX, faster workflow

### Percentage-Based Coordinates
Templates use % (0-100) instead of pixels:

**Benefits**:
- Responsive at any resolution
- Portable across devices
- Simple to design
- Canvas-independent

**Conversion**:
```typescript
// Display: % → pixels
pixelX = (percentX / 100) * 1920;
pixelY = (percentY / 100) * 1080;

// Storage: pixels → %
percentX = (pixelX / 1920) * 100;
percentY = (pixelY / 1080) * 100;
```

---

## 7. DATA MODEL

### SermonSlide Interface
```typescript
interface SermonSlide {
  id: string;              // slide-{timestamp}
  content: string;         // User-entered text
  templateId?: string;     // Applied template ID
  visualData?: {
    background: { type: 'gradient' | 'color'; value: string };
    elements: Array<VisualElement>;
  };
  order: number;
}
```

### Storage
- Sermons stored as `ServiceItem` with `type: 'sermon'`
- `content` field contains slide array
- Persisted to localStorage/SQLite
- Auto-saves via service autosave (1s debounce)

---

## 8. USER WORKFLOW

```
1. Click "Add Sermon" → Enter title
2. Opens 3-panel builder
3. Type content: "1. Faith Requires Action\nWe must act"
4. Click "Point Numbered" template from gallery
5. Preview shows beautifully formatted slide
6. Click "Customize" → Modern editor opens
7. Edit fonts, colors, add logo, adjust layout
8. Click "Save" → Returns to builder
9. Click "Save Sermon" → Adds to service
10. Slides appear in presentation
```

---

## 9. KEYBOARD SHORTCUTS

```
Ctrl+S       → Save sermon
Ctrl+N       → New slide
Arrow Keys   → Navigate slides
Esc          → Close builder
```

---

## 10. DEBUGGING

### Debug Logging
```typescript
console.log('🎨 Applying template:', template.name);
console.log('📊 Generated visualData:', { background, elementCount });
console.log('✅ Template applied:', { templateId, hasVisualData });
console.log('Opening Visual Editor for slide', index + 1);
```

### Common Issues
1. **Customize disabled**: Check `!!slide.visualData`
2. **Blank preview**: Verify `visualData.background` and `visualData.elements`
3. **Editor crash**: Ensure elements have all required properties

---

**End of Sermon Builder Architecture**

*For visual editor details, see `VISUAL-EDITOR-DOCUMENTATION.md`*
*For template definitions, see `src/config/sermonTemplates.ts`*
