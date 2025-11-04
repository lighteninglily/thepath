# 🎨 VISUAL EDITOR INTEGRATION - COMPLETE REFERENCE

**Date**: November 4, 2025  
**Issue**: Visual editor text positioning doesn't match slide preview  
**Goal**: Make visual editor display EXACTLY like the slide preview

---

## 📋 TABLE OF CONTENTS

1. [The Problem](#the-problem)
2. [What We've Tried](#what-weve-tried)
3. [Current Code](#current-code)
4. [How Slides Are Rendered](#how-slides-are-rendered)
5. [How Visual Editor Works](#how-visual-editor-works)
6. [The Mismatch](#the-mismatch)
7. [Solution Approach](#solution-approach)
8. [All Relevant Code Files](#all-relevant-code-files)

---

## 🔍 THE PROBLEM

**Issue**: When opening a song slide in the visual editor, the text positioning/alignment doesn't match how it appears in the slide preview.

**Expected**: Text should appear EXACTLY as it does in the slide preview  
**Actual**: Text appears in a different position/alignment

**Screenshot Evidence**: Text is left-aligned but positioned differently than preview

---

## 🧪 WHAT WE'VE TRIED

### **Attempt 1: Center Text**
```typescript
textAlign: 'center',
position: { x: 160, y: 390 },
size: { width: 1600, height: 300 }
```
**Result**: ❌ Text was centered but slide preview shows left-aligned

---

### **Attempt 2: Match 80% Width with Left Align**
```typescript
textAlign: 'left',
position: { x: 192, y: 340 },  // (1920 - 1536) / 2 = 192
size: { width: 1536, height: 400 }  // 80% of 1920
```
**Result**: ❌ Still doesn't match exactly

---

### **Attempt 3: Copy ALL Styling from Preview**
```typescript
textAlign: 'left',
fontWeight: '500',
lineHeight: 1.4,
textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
```
**Result**: ❌ Styling matches but positioning still off

---

## 📝 CURRENT CODE

### **SongFormModal.tsx - Visual Editor Setup** (Lines 968-1019)

```typescript
{showVisualDesigner && currentSlides.length > 0 && (() => {
  const currentSlide = currentSlides[visualSlideIndex];
  
  // Prepare visual data
  let visualContent;
  
  if (currentSlide.visualData) {
    // Use existing visual data
    visualContent = currentSlide.visualData;
  } else {
    // Create new visual data that MATCHES AdvancedSlidePreview rendering
    // Canvas: 1920x1080
    // Text takes 80% width = 1536px
    // Centered: (1920 - 1536) / 2 = 192px from left
    const textWidth = Math.floor(1920 * 0.8); // 1536px
    const textX = (1920 - textWidth) / 2; // 192px
    const textY = 340;
    
    // Calculate font size based on content
    const lineCount = currentSlide.content.split('\n').filter(l => l.trim()).length;
    let fontSize = 72;
    if (lineCount <= 2) fontSize = 80;
    else if (lineCount <= 4) fontSize = 72;
    else if (lineCount <= 6) fontSize = 60;
    else fontSize = 52;
    
    visualContent = {
      elements: [{
        id: 'text-1',
        type: 'text',
        content: currentSlide.content,
        position: { x: textX, y: textY }, // 192, 340
        size: { width: textWidth, height: 400 }, // 1536 x 400
        style: {
          fontSize: fontSize,
          fontWeight: '500',
          color: '#FFFFFF',
          textAlign: 'left',
          fontFamily: 'Inter',
          lineHeight: 1.4,
          textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
        },
      }],
      backgroundImage: currentSlide.backgroundId 
        ? WORSHIP_BACKGROUNDS.find(bg => bg.id === currentSlide.backgroundId)?.url 
        : undefined,
      backgroundColor: '#000000',
    };
  }
  
  // Convert to ServiceItem for visual editor
  const visualItem = {
    id: currentSlide.id,
    type: 'song' as const,
    title: `${formData.title} - Slide ${visualSlideIndex + 1}`,
    content: JSON.stringify(visualContent),
    scriptureReference: undefined,
    order: visualSlideIndex,
  };
  
  return (
    <VisualItemEditorModal
      item={visualItem}
      isOpen={showVisualDesigner}
      onClose={() => setShowVisualDesigner(false)}
      onSave={handleSaveVisualSlide}
    />
  );
})()}
```

---

## 🎬 HOW SLIDES ARE RENDERED

### **AdvancedSlidePreview.tsx** - The Slide Preview Component

**File**: `src/components/slides/AdvancedSlidePreview.tsx`

#### **Key Function: renderFullBleedLayout** (Lines 52-92)

```typescript
function renderFullBleedLayout(
  lines: string[], 
  background: BackgroundImage | null | undefined, 
  _textColor: string,
  fontSize: string,
  className: string
) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* Background Image */}
      {background ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background.url})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-brand-deepBrown" />
      )}
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Text - THE KEY PART */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div style={{ 
          color: '#FFFFFF',
          fontSize,
          lineHeight: '1.4',
          textAlign: 'left',        // ⚠️ LEFT ALIGNED
          textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
          fontWeight: '500',
          maxWidth: '80%',          // ⚠️ 80% WIDTH
        }}>
          {lines.map((line, i) => (
            <div key={i} className="mb-2">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**CRITICAL DETAILS**:
- Uses **flexbox**: `flex items-center justify-center`
- Text container is **centered on canvas**
- Text has `maxWidth: '80%'`
- Text inside is `textAlign: 'left'`
- Padding `p-12` = 3rem = 48px

**Effective positioning**:
- Outer div: Full canvas (1920x1080)
- Flexbox centers the content
- Content: Max 80% width with 48px padding
- Text: Left-aligned within that centered container

---

#### **Visual Data Rendering** (Lines 248-441)

```typescript
function renderVisualSlide(visualData: any, className: string) {
  // ... validation ...
  
  const elements = visualData.elements.map((el: any) => {
    // Element processing
  });
  
  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {/* Background */}
      {/* ... background rendering ... */}
      
      {/* Elements */}
      <div className="absolute inset-0">
        {elements.map((element: any) => {
          if (element.type === 'text') {
            return (
              <div
                key={element.id}
                className="absolute whitespace-pre-wrap"
                style={{
                  // ⚠️ ABSOLUTE POSITIONING - Different from flexbox!
                  left: `${(element.position.x / 1920) * 100}%`,
                  top: `${(element.position.y / 1080) * 100}%`,
                  width: `${(element.size.width / 1920) * 100}%`,
                  height: `${(element.size.height / 1080) * 100}%`,
                  
                  // Text styling
                  fontFamily: style.fontFamily || 'Inter',
                  fontSize: style.fontSize ? `${(style.fontSize / 1080) * 100}vh` : '5vh',
                  fontWeight: style.fontWeight || 600,
                  color: style.color || '#ffffff',
                  textAlign: style.textAlign || 'center',
                  lineHeight: style.lineHeight || 1.3,
                  textShadow: style.textShadow || '2px 2px 4px rgba(0,0,0,0.8)',
                  
                  // ⚠️ FLEX WITHIN ABSOLUTE
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: style.textAlign === 'left' ? 'flex-start' 
                    : style.textAlign === 'right' ? 'flex-end' 
                    : 'center',
                }}
              >
                {element.content}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
```

**CRITICAL DETAILS**:
- Uses **absolute positioning** with percentages
- Position is **top-left corner** of element
- Text uses flexbox **within** the absolute container
- `justifyContent` is based on `textAlign`

---

## 🎨 HOW VISUAL EDITOR WORKS

### **VisualItemEditorModal.tsx**

**File**: `src/components/modals/VisualItemEditorModal.tsx`

#### **Component Purpose**:
- Full-featured visual editor for slides
- Has undo/redo, templates, assets, fonts
- Uses `VisualCanvas` for rendering

#### **Data Flow**:
1. Receives `item` with `content` as JSON string
2. Parses content to get `visualData`
3. Passes to `VisualCanvas` for rendering
4. User edits elements
5. Returns updated `visualData` on save

---

### **VisualCanvas.tsx**

**File**: `src/components/designer/VisualCanvas.tsx`

**Purpose**: Renders the editable canvas with all elements

**Key Features**:
- Renders background (image/gradient/color)
- Renders all elements (text, images)
- Handles selection and dragging
- Uses absolute positioning

**Rendering Logic** (Similar to renderVisualSlide above):
```typescript
// Element rendering
<div
  style={{
    position: 'absolute',
    left: `${(element.position.x / 1920) * 100}%`,
    top: `${(element.position.y / 1080) * 100}%`,
    width: `${(element.size.width / 1920) * 100}%`,
    // ... text styling ...
    display: 'flex',
    alignItems: 'center',
    justifyContent: textAlign === 'left' ? 'flex-start' : 'center',
  }}
>
  {content}
</div>
```

---

## ⚠️ THE MISMATCH

### **Problem Identified**:

**Slide Preview (No visualData)**:
- Uses **flexbox centering** of entire container
- Container is centered on canvas
- Text is left-aligned WITHIN container
- Container width: `maxWidth: 80%`
- Padding: `p-12` (48px)

**Visual Editor (With visualData)**:
- Uses **absolute positioning**
- Position is top-left corner
- Must calculate exact pixel position
- No flexbox centering

### **The Math Doesn't Match**:

**Flexbox approach** (slide preview):
```
Outer: 1920x1080 full canvas
Middle: Flexbox centered container with maxWidth 80% + 48px padding
Inner: Text left-aligned
```

**Absolute approach** (visual editor):
```
Position: x=192, y=340 (our calculation)
Size: 1536x400 (80% width)
Text: left-aligned
```

**Issue**: Flexbox centering with padding ≠ Absolute positioning at calculated pixel

---

## 💡 SOLUTION APPROACH

### **Option 1: Make Visual Editor Match Flexbox** (RECOMMENDED)

Change how visualData is positioned to account for:
1. Actual flexbox behavior
2. Padding (48px on all sides = 96px total horizontal)
3. Vertical centering with items-center

**New calculation**:
```typescript
// Account for padding: 48px * 2 = 96px
const padding = 96;
const availableWidth = 1920 - padding; // 1824px
const textWidth = Math.floor(availableWidth * 0.8); // 1459px (80% of available)
const textX = (1920 - textWidth) / 2; // 230px (centered with padding considered)
const textY = 360; // Vertically centered with flex items-center

// Also match the vertical spacing from flex
const lineHeight = 1.4;
const marginBottom = 8; // mb-2 = 0.5rem = 8px
```

---

### **Option 2: Make Slide Preview Use VisualData**

Instead of having two rendering paths, always convert to visualData:
1. When slide doesn't have visualData, create it on-the-fly
2. Use same renderVisualSlide function for both preview and editor
3. Ensures 100% consistency

---

### **Option 3: Adjust VisualCanvas to Match**

Modify how VisualCanvas calculates positioning to account for flexbox-like behavior.

---

## 📁 ALL RELEVANT CODE FILES

### **1. SongFormModal.tsx**
**Path**: `src/components/songs/SongFormModal.tsx`  
**Lines**: 943-1032 (Visual editor setup)  
**Purpose**: Creates visualData and opens VisualItemEditorModal

---

### **2. AdvancedSlidePreview.tsx**
**Path**: `src/components/slides/AdvancedSlidePreview.tsx`  
**Lines**: 52-92 (renderFullBleedLayout), 248-441 (renderVisualSlide)  
**Purpose**: Renders slide preview in edit mode

---

### **3. VisualItemEditorModal.tsx**
**Path**: `src/components/modals/VisualItemEditorModal.tsx`  
**Lines**: Full file (1467 lines)  
**Purpose**: The visual editor modal with all features

---

### **4. VisualCanvas.tsx**
**Path**: `src/components/designer/VisualCanvas.tsx`  
**Lines**: Element rendering section  
**Purpose**: Canvas that renders and allows editing elements

---

### **5. AudienceViewPage.tsx**
**Path**: `src/pages/AudienceViewPage.tsx`  
**Purpose**: How slides render during presentation (must also match!)

---

## 🔧 RECOMMENDED FIX

### **Change in SongFormModal.tsx**:

```typescript
// Instead of this:
const textWidth = Math.floor(1920 * 0.8); // 1536
const textX = (1920 - textWidth) / 2; // 192
const textY = 340;

// Do this (account for flexbox + padding):
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const PADDING = 96; // 48px * 2 (p-12 on all sides)
const MAX_WIDTH_PERCENT = 0.8;

const availableWidth = CANVAS_WIDTH - PADDING; // 1824px
const textWidth = Math.floor(availableWidth * MAX_WIDTH_PERCENT); // 1459px
const textX = (CANVAS_WIDTH - textWidth) / 2; // 230px
const textY = Math.floor((CANVAS_HEIGHT - 400) / 2); // Vertically centered

visualContent = {
  elements: [{
    id: 'text-1',
    type: 'text',
    content: currentSlide.content,
    position: { x: textX, y: textY }, // 230, 340
    size: { width: textWidth, height: 400 }, // 1459 x 400
    style: {
      fontSize: fontSize,
      fontWeight: '500',
      color: '#FFFFFF',
      textAlign: 'left',
      fontFamily: 'Inter',
      lineHeight: 1.4,
      textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
    },
  }],
  // ... rest
};
```

---

## 🧪 TESTING CHECKLIST

After implementing fix:

1. [ ] Open song in edit mode
2. [ ] View slide in preview (left panel)
3. [ ] Note exact text position
4. [ ] Open visual editor
5. [ ] Text should be in EXACT same position
6. [ ] Edit text in visual editor
7. [ ] Save
8. [ ] Check preview again
9. [ ] Text should still match exactly

---

## 📊 COMPARISON TABLE

| Aspect | Slide Preview (Flexbox) | Visual Editor (Absolute) | Match? |
|--------|-------------------------|--------------------------|--------|
| Layout Method | Flexbox centering | Absolute positioning | ❌ Different |
| Container Width | maxWidth 80% | 1536px (80%) | ⚠️ Close but padding difference |
| Text Align | left | left | ✅ Same |
| Padding | 48px (p-12) | None (absolute) | ❌ Not accounted for |
| Vertical Center | flex items-center | y: 340px | ⚠️ Approximation |
| Font Size | Dynamic (clamp) | Fixed 72px | ⚠️ Different |
| Line Height | 1.4 | 1.4 | ✅ Same |
| Text Shadow | Yes (same) | Yes (same) | ✅ Same |

---

## 💭 KEY INSIGHTS

1. **Flexbox vs Absolute**: The fundamental difference - flexbox auto-centers, absolute requires exact math
2. **Padding Matters**: The `p-12` (48px) padding shifts everything inward
3. **Font Sizing**: Slide preview uses responsive `clamp()`, editor uses fixed pixels
4. **Two Rendering Paths**: Having separate render functions causes inconsistency

---

## 🎯 NEXT STEPS

1. **Try the recommended fix** (account for padding)
2. **If still doesn't match**: Consider unified rendering approach
3. **Test thoroughly** with different slide content lengths
4. **Document final solution** for future reference

---

## 📞 FOR WHOEVER HELPS NEXT

**The core issue**: We have TWO different ways of rendering the same slide:
1. Flexbox-based (preview)
2. Absolute positioning (visual editor)

**They need to produce identical results but use different math.**

**Key files to focus on**:
- `SongFormModal.tsx` (lines 943-1032) - Where visualData is created
- `AdvancedSlidePreview.tsx` (lines 52-92, 248-441) - How slides render
- `VisualCanvas.tsx` - How visual editor renders

**The solution** is either:
A. Make visualData positioning account for flexbox+padding behavior, OR
B. Make everything use visualData with absolute positioning

Good luck! 🚀
