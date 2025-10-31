# Sermon Slide Builder - Integration Guide

## How to Add to Your App

### Option 1: Add to Planner Page (Recommended)

```tsx
// In src/pages/PlannerPage.tsx

import { useState } from 'react';
import { AddSermonModal } from '../components/sermon/AddSermonModal';

export function PlannerPage() {
  const [showAddSermon, setShowAddSermon] = useState(false);

  const handleSaveSermon = (sermon) => {
    console.log('Saving sermon:', sermon);
    // TODO: Save to database
    // addSermonToService(sermon);
    setShowAddSermon(false);
  };

  return (
    <div>
      {/* Add Sermon Button */}
      <button
        onClick={() => setShowAddSermon(true)}
        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
      >
        Add Sermon
      </button>

      {/* Sermon Builder Modal */}
      {showAddSermon && (
        <AddSermonModal
          onClose={() => setShowAddSermon(false)}
          onSave={handleSaveSermon}
        />
      )}
    </div>
  );
}
```

### Option 2: Create Dedicated Sermon Library Page

```tsx
// In src/pages/SermonLibraryPage.tsx

import { useState } from 'react';
import { AddSermonModal } from '../components/sermon/AddSermonModal';

export function SermonLibraryPage() {
  const [showAddSermon, setShowAddSermon] = useState(false);
  const [sermons, setSermons] = useState([]);

  const handleSaveSermon = (sermon) => {
    // Save sermon
    const newSermon = {
      id: Date.now(),
      ...sermon,
      createdAt: new Date(),
    };
    
    setSermons([...sermons, newSermon]);
    setShowAddSermon(false);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sermon Library</h1>
        <button
          onClick={() => setShowAddSermon(true)}
          className="px-6 py-3 bg-orange-500 text-white rounded-lg"
        >
          Create Sermon
        </button>
      </div>

      {/* Sermon List */}
      <div className="grid grid-cols-3 gap-4">
        {sermons.map(sermon => (
          <div key={sermon.id} className="border rounded-lg p-4">
            <h3>{sermon.title}</h3>
            <p>{sermon.slides.length} slides</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddSermon && (
        <AddSermonModal
          onClose={() => setShowAddSermon(false)}
          onSave={handleSaveSermon}
        />
      )}
    </div>
  );
}
```

## Database Schema (Suggested)

```typescript
interface Sermon {
  id: string;
  title: string;
  date?: string;
  speaker?: string;
  scripture?: string;
  slides: SermonSlide[];
  createdAt: Date;
  updatedAt: Date;
}

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: {
    background: {
      type: 'gradient' | 'color' | 'image';
      value: string;
    };
    elements: Array<{
      id: string;
      type: 'text' | 'shape';
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      style: any;
    }>;
  };
  order: number;
}
```

## Save to Database Example

```typescript
// Using your existing database service

async function saveSermon(sermon: Sermon) {
  try {
    const result = await window.electron.ipcRenderer.invoke(
      'sermon:create',
      sermon
    );
    return result;
  } catch (error) {
    console.error('Failed to save sermon:', error);
    throw error;
  }
}
```

## Visual Editor Integration

The sermon builder has a "Customize" button that opens the Visual Editor:

```tsx
// In SermonSlideBuilder.tsx (already implemented)

const handleOpenVisualEditor = () => {
  if (onOpenVisualEditor && currentSlide.visualData) {
    onOpenVisualEditor(currentSlide, currentSlideIndex);
  }
};
```

To connect this to your existing SlideDesigner:

```tsx
<SermonSlideBuilder
  sermonTitle={title}
  onSave={handleSave}
  onClose={handleClose}
  onOpenVisualEditor={(slide, index) => {
    // Convert sermon slide to format SlideDesigner expects
    const designerSlide = {
      id: slide.id,
      type: 'sermon',
      content: slide.content,
      visualData: slide.visualData,
    };
    
    // Open SlideDesigner
    setSlideForDesigner(designerSlide);
    setShowDesigner(true);
  }}
/>
```

## Complete Workflow Example

```tsx
function SermonWorkflow() {
  const [step, setStep] = useState<'list' | 'create' | 'edit' | 'present'>('list');
  const [currentSermon, setCurrentSermon] = useState(null);
  const [showDesigner, setShowDesigner] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);

  return (
    <>
      {/* Step 1: Create Sermon */}
      {step === 'create' && (
        <AddSermonModal
          onClose={() => setStep('list')}
          onSave={(sermon) => {
            saveSermon(sermon);
            setStep('list');
          }}
        />
      )}

      {/* Step 2: Edit with Visual Editor (if needed) */}
      {showDesigner && editingSlide && (
        <SlideDesigner
          slides={[editingSlide]}
          onSave={(updatedSlides) => {
            // Update sermon slide with changes
            updateSermonSlide(updatedSlides[0]);
            setShowDesigner(false);
          }}
          onClose={() => setShowDesigner(false)}
        />
      )}

      {/* Step 3: Present */}
      {step === 'present' && currentSermon && (
        <PresentationView sermon={currentSermon} />
      )}
    </>
  );
}
```

## Testing the Builder

1. **Add button to your UI:**
   ```tsx
   <button onClick={() => setShowAddSermon(true)}>
     Create Sermon
   </button>
   ```

2. **Open modal and test workflow:**
   - Enter sermon title
   - Click "Create Slides"
   - Add first slide (title)
   - Type content
   - Click AI Suggest or choose template
   - Add more slides
   - Save

3. **Verify data structure:**
   ```tsx
   console.log('Saved sermon:', sermon);
   // Should show: { title, slides: [...] }
   ```

## Keyboard Shortcuts

When in Sermon Builder:
- `Ctrl+S` - Save sermon
- `Ctrl+N` - New slide
- `←/→` - Navigate slides
- `Esc` - Close modal

## Next Steps

1. Add database persistence
2. Create sermon library view
3. Add edit sermon functionality
4. Integrate with service planner
5. Add presentation mode

## Component Tree

```
AddSermonModal
  └─ SermonSlideBuilder (main 3-panel)
      ├─ SermonSlideNavigator (left)
      ├─ SermonSlideEditor (center)
      └─ SermonTemplateGallery (right)
          └─ Templates from sermonTemplates.ts
```

## Tips

- Start with simple sermons (3-5 slides)
- Let users see the AI suggestions in action
- The template gallery is searchable and filterable
- Templates auto-apply with placeholders filled
- Visual Editor provides ultimate customization

---

**Ready to integrate!** The sermon builder is fully functional and ready to use.
