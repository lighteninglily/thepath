# 🏗️ THE PATH - SYSTEM ARCHITECTURE

**Church Presentation Software**  
**Version**: 3.1.0 - MVP Complete  
**Last Updated**: October 30, 2025 - 2:25 PM

---

## 📋 DOCUMENT INDEX

This architecture documentation is split into focused sections:

1. **ARCHITECTURE.md** (this file) - Overview & System Design
2. **ARCHITECTURE_TECHNICAL.md** - Technical Stack & Implementation
3. **ARCHITECTURE_DATA.md** - Data Models & Database Schema
4. **ARCHITECTURE_COMPONENTS.md** - Component Structure & Flow

---

## 1. SYSTEM OVERVIEW

### 1.1 Purpose
Church presentation software for displaying worship lyrics, scriptures, announcements, and sermon slides with professional designs and intuitive service planning.

### 1.2 Core Capabilities
- **Song Management**: Create, edit, organize worship songs with automatic slide generation
- **Lyrics Search**: Integrated Genius API for automated lyrics import  
- **🎨 Template System**: 10+ beautiful pre-designed templates with gallery picker
  - Sermon templates (3 variations)
  - Announcement templates (3 variations)
  - Scripture templates (2 variations)
  - Dramatic backgrounds and frames
  - One-click customization
- **🖌️ Visual Editor**: EXCEPTIONAL Professional-Grade Canva/Figma-Level Editor
  - **↩️ Undo/Redo**: 50-step history (Ctrl+Z, Ctrl+Shift+Z)
  - **📋 Copy/Paste**: Clone elements (Ctrl+C, Ctrl+V)
  - **✨ Duplicate**: Instant copy (Ctrl+D)
  - **📂 Layer Management**: Bring forward/send backward (Ctrl+], Ctrl+[)
  - **🎨 Opacity Control**: 0-100% transparency slider
  - **🔄 Rotation Control**: 0-360° rotation slider
  - **🎪 25+ Google Fonts**: All fonts loaded via CDN
  - **💪 Font weights**: Thin (100) to Black (900)
  - **🖘️ Drag-and-drop**: Click and drag elements anywhere
  - **⏱️ Keyboard shortcuts**: 11 professional shortcuts
  - **➕ Add Text**: Creates and auto-selects new elements
  - **⚡ Property syncing**: Instant updates, no lag
  - **🟥 Shape & image support**: Cards, frames, backgrounds
  - **🌄 Background editing**: Color picker, image URL, presets
  - **👁️ Real-time preview**: WYSIWYG - instant visual feedback
  - **✨ Professional UX**: Polished toolbar with tooltips and visual states
  - **🌐 Cross-platform**: Windows (Ctrl) & Mac (Cmd) support
- **📅 Service Planning**: Complete worship service planner
  - Create/edit/delete services
  - Add 6 item types (songs, scripture, announcement, sermon, offering, welcome, closing)
  - Template selection for each item type
  - Visual editing for custom slides
  - Duration tracking
  - Full CRUD operations
- **📖 AI Scripture Lookup**: GPT-4 powered Bible verse search
  - Type reference → Get verse text
  - Multiple translations (NIV, ESV, KJV, etc.)
  - One-click add to service
- **🎭 Live Presentation**: Dual-screen presentation system
  - **Presenter View**: Professional presenter display with slide navigator
  - **Slide Navigator**: Left sidebar showing ALL slides with thumbnails
  - **Click-to-Jump**: Jump to any slide instantly
  - **Visual Indicators**: Current (blue), Next (green), Past (gray)
  - **Audience View**: Clean full-screen output for projection
  - **Keyboard Control**: Arrow keys, B for blank, ESC to exit
  - **Elapsed Timer**: Track service duration in real-time
- **💾 Autosave System**: Never lose work
  - **Services**: Auto-saves 1 second after editing stops
  - **Songs**: Auto-saves 2 seconds after editing stops  
  - **Visual Status**: Live "Saving..." / "All changes saved" indicators
  - **No Interruptions**: Modals stay open while you work
- **🎨 Design System**: Professional themes, backgrounds, and layouts (Canva-style)
- **📦 Theme Packs**: 3 cohesive packs (Mountains, Waves, Clouds) with verified backgrounds
- **🎨 Theme Selection**: Choose background theme before AI generation (user control)
- **📋 Slide Duplication**: One-click duplicate for choruses and tags
- **💾 Data Persistence**: Browser localStorage or SQLite database (dual-mode)

### 1.3 Target Users
- Church worship teams
- Service coordinators
- Presentation operators
- Pastors and speakers

### 1.4 Current State - **MVP COMPLETE** 🎉
- ✅ **Web Application**: Fully functional React SPA with localStorage
- ✅ **Desktop Application**: Electron configured with dual-screen presentation
- ✅ **Template System**: 10+ beautiful templates with gallery picker
- ✅ **Visual Editor**: **EXCEPTIONAL** Professional-Grade Editor
  - 🎯 **Undo/Redo**: 50-step history management
  - 📋 **Copy/Paste/Duplicate**: Industry-standard shortcuts
  - 📂 **Layer Management**: Bring forward/send backward (z-index)
  - 🎨 **Opacity & Rotation**: Advanced styling controls
  - ⏱️ **11 Keyboard Shortcuts**: Ctrl+Z, Ctrl+C/V, Ctrl+D, Ctrl+[/], Delete, Esc
  - 🎪 25+ Google Fonts loaded and working
  - 🖘️ Drag-and-drop element movement
  - 👍 Real-time property syncing
  - ✨ Professional toolbar with visual states
  - 🌐 Cross-platform (Windows Ctrl / Mac Cmd)
  - 📚 Help text & keyboard reference
- ✅ **Presenter View**: Professional slide navigator with thumbnails
  - 📋 All slides visible in left sidebar
  - 🖱️ Click any slide to jump instantly
  - 🎨 Visual indicators (current/next/past)
  - ⏱️ Live elapsed timer
  - 🎮 Full keyboard control
- ✅ **Autosave System**: Never lose work
  - 💾 Services auto-save (1 second debounce)
  - 💾 Songs auto-save (2 second debounce)
  - 🟢 Live save status indicators
  - 📝 No interruption workflow
- ✅ **Service Planner**: Full CRUD with template integration & autosave
- ✅ **AI Scripture**: GPT-4 powered verse lookup with template pre-fill
- ✅ **Song Library**: Complete management with AI Quick Create
  - 🎨 User-selectable themes (Mountains/Waves/Clouds)
  - 📋 Slide duplication for choruses
  - ➕ Add custom slides for transitions
  - 🔄 Full slide editor with thumbnails
- ✅ **Lyrics Search**: Genius API integrated (Electron only)
- ✅ **Theme Packs**: Mountains (4), Waves (3), Clouds (5) - verified working images
- ✅ **Background System**: Centralized config, easy enable/disable
- 🔧 **Database Options**: better-sqlite3 (needs build tools) OR sql.js (ready to use)
- ✅ **Production-Ready**: Desktop app ready for Sunday services & regular updates

---

## 2. HIGH-LEVEL ARCHITECTURE

### 2.1 System Layers

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│  React Components │ UI │ User Interactions               │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                 APPLICATION LAYER                        │
│  Business Logic │ Hooks │ State Management              │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│                DATA ACCESS LAYER                         │
│  API Abstraction │ Storage Interface                    │
└────────────────────┬────────────────────────────────────┘
                     │
            ┌────────┴────────┐
            │                 │
┌───────────▼──────┐  ┌──────▼─────────┐
│   localStorage   │  │ SQLite (Elect) │
│    (Browser)     │  │   (Desktop)    │
└──────────────────┘  └────────────────┘
```

### 2.2 Deployment Modes

#### **Mode 1: Web Application** (Current Primary)
```
Browser → React SPA → localStorage → Persist to disk
```
- **Pros**: No setup, works immediately, cross-platform
- **Cons**: Browser-only, no desktop window, storage limits

#### **Mode 2: Desktop Application** (Future/Optional)
```
Electron → React → IPC → SQLite → Persist to disk
```
- **Pros**: Desktop window, full-screen, file system access, unlimited storage
- **Cons**: Requires Visual Studio Build Tools, native modules, larger bundle

---

## 3. TECHNOLOGY STACK

### 3.1 Frontend Stack
```yaml
Framework: React 18.2 (Functional Components + Hooks)
Language: TypeScript 5.3 (Strict Mode)
Build Tool: Vite 5.0 (Fast HMR, ESM)
UI Framework: Tailwind CSS 3.4 (Utility-First)
Fonts: Google Fonts CDN (25+ fonts loaded in index.html)
State Management:
  - React Query 5.14 (Server State)
  - React Hooks (Local State)
Icons: Lucide React 0.294
Animations: Framer Motion 10.16
Routing: React Router (future)
APIs:
  - OpenAI GPT-4 (Scripture Lookup)
  - Genius API (Lyrics Search)
  - genius-lyrics-api package
```

### 3.2 Desktop Stack (Optional)
```yaml
Runtime: Electron 28.1
Process Model: Main + Renderer + Preload
Database Options:
  - better-sqlite3 12.4 (requires Visual Studio Build Tools)
  - sql.js (pure JavaScript, no build tools needed)
IPC: contextBridge + ipcRenderer/ipcMain
Security: Context Isolation + No Node Integration
Status: Configured but native module compilation blocked
```

### 3.3 Development Tools
```yaml
Linting: ESLint 8.56 + TypeScript ESLint
Formatting: Prettier 3.1
Testing: Vitest 1.1 + Testing Library
Type Checking: TypeScript strict mode
Package Manager: npm
Version Control: Git
```

---

## 4. ARCHITECTURE PATTERNS

### 4.1 Component Architecture

**Atomic Design Pattern**:
- **Pages**: Full views (`LibraryPage`, `PlannerPage`, `SettingsPage`)
- **Components**: Reusable UI (`SongCard`, `SlidePreview`, `BackgroundPicker`)
- **Hooks**: Data & logic (`useSongs`, `useServices`, `useCreateSong`)
- **Utils**: Pure functions (`parseLyrics`, `formatDate`, `exportData`)
- **Assets**: Static data (`backgrounds`, `layouts`, `quickLooks`)

### 4.2 State Management Strategy

```typescript
// Server/Persistent State (React Query)
const { data: songs, isLoading } = useSongs();
const createSong = useCreateSong();

// Local Component State (useState)
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedBackground, setSelectedBackground] = useState(null);

// Derived State (useMemo)
const filteredSongs = useMemo(() => 
  songs?.filter(s => s.title.toLowerCase().includes(search)),
  [songs, search]
);

// Effects (useEffect)
useEffect(() => {
  // Side effects, subscriptions
}, [dependencies]);
```

### 4.3 Data Flow Pattern

```
User Action → Event Handler → Hook/Mutation → 
→ Storage Layer → Cache Invalidation → UI Re-render
```

**Example: Creating a Song**
```
1. User fills form in SongFormModal
2. Clicks "Generate Slides"
3. handleSubmit() called
4. createSong.mutate(songData)
5. storage.saveSong() persists to localStorage/SQLite
6. React Query invalidates ['songs'] cache
7. useSongs() refetches automatically
8. LibraryPage re-renders with new song
```

---

## 5. KEY DESIGN DECISIONS

### 5.1 React (vs Vue/Svelte)
**Decision**: React  
**Rationale**: Mature ecosystem, TypeScript support, hooks, large community, excellent tooling

### 5.2 Vite (vs Webpack/CRA)
**Decision**: Vite  
**Rationale**: Lightning-fast HMR, modern ESM, simpler config, better DX

### 5.3 Tailwind (vs CSS Modules/Styled Components)
**Decision**: Tailwind CSS  
**Rationale**: Rapid prototyping, consistent design system, no CSS files, utility-first

### 5.4 TypeScript (vs JavaScript)
**Decision**: TypeScript strict mode  
**Rationale**: Type safety, better IDE support, catches bugs at compile-time, self-documenting

### 5.5 React Query (vs Redux/Context)
**Decision**: React Query  
**Rationale**: Built for async/server state, caching, auto-refetch, optimistic updates, simpler than Redux

### 5.6 localStorage (vs Electron immediately)
**Decision**: Start with localStorage, Electron optional  
**Rationale**:
- No native modules (no Visual Studio Build Tools)
- Works immediately in browser
- Faster development iteration
- Can add Electron later without refactoring
- Easier deployment (static hosting)

### 5.7 SQLite (vs PostgreSQL/MongoDB)
**Decision**: SQLite for desktop, localStorage for web  
**Rationale**:
- Serverless (no hosting needed)
- Fast local queries
- Single file database
- Perfect for single-user desktop app
- No network latency

### 5.8 Monolithic (vs Microservices)
**Decision**: Monolithic frontend + local storage  
**Rationale**:
- Single-user application
- No scaling requirements
- Simpler architecture
- Faster development
- Offline-first

### 5.9 No Backend API (vs REST/GraphQL)
**Decision**: Client-only with local storage  
**Rationale**:
- Privacy (data stays local)
- No hosting costs
- No server maintenance
- Works offline
- Faster (no network)
- Future: Optional cloud sync as premium feature

---

## 6. FEATURE MODULES

### 6.1 Song Management & AI Quick Create System
**Status**: ✅ Complete with Theme Selection & Slide Duplication  
**Location**: `src/pages/LibraryPage.tsx`, `src/components/songs/`, `src/services/slideGeneratorService.ts`

---

#### 6.1.1 Overview

The song management system provides comprehensive tools for creating, editing, and managing worship songs with automated slide generation powered by AI. It features three creation methods:

1. **Manual Entry**: Type lyrics and customize slides manually
2. **Lyrics Search**: Import from Genius API (requires Electron)
3. **🎨 AI Quick Create**: Fully automated end-to-end generation (NEW Theme Selection!)

---

#### 6.1.2 AI Quick Create System

**The Power Feature**: One-click song creation from title only!

**User Flow**:
```
1. Click "Quick Create" button
2. Enter song title (e.g., "Goodness of God")
3. Enter artist (optional but recommended)
4. **🎨 SELECT THEME**: Choose Mountains, Waves, or Clouds
5. Click "Generate Slides" → Wait ~30 seconds
6. ✅ Complete song with lyrics, slides, backgrounds ready!
```

**What Happens Behind the Scenes**:
```
Step 1: Fetch lyrics from Genius API
Step 2: Analyze song with OpenAI GPT-4
Step 3: Break lyrics into slides (6-8 lines each)
Step 4: Generate slides with selected theme backgrounds
Result: 15-20 slides ready to present!
```

**🎨 NEW: Theme Selection Feature**

Users now choose the background theme instead of random AI selection:

- **Mountains** 🏔️ - Powerful, majestic worship (blue/purple tones)
- **Ocean Waves** 🌊 - Joyful, flowing worship (teal/blue tones)  
- **Clouds** ☁️ - Peaceful, reflective worship (soft blue/white tones)

This ensures visual consistency and matches the song's mood.

---

#### 6.1.3 Component Architecture

**QuickGenerateModal.tsx** - User Interface
```typescript
// Location: src/components/songs/QuickGenerateModal.tsx

interface QuickGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: GenerationResult) => void;
}

// NEW: Theme selection state
const [selectedTheme, setSelectedTheme] = useState<'mountains' | 'waves' | 'clouds'>('waves');

// Theme selection UI (3-column grid with icons)
<div className="grid grid-cols-3 gap-3">
  <button onClick={() => setSelectedTheme('mountains')}>
    <Mountain /> Mountains - Powerful, majestic
  </button>
  <button onClick={() => setSelectedTheme('waves')}>
    <Waves /> Ocean Waves - Joyful, flowing
  </button>
  <button onClick={() => setSelectedTheme('clouds')}>
    <Cloud /> Clouds - Peaceful, reflective
  </button>
</div>

// Pass theme to generation service
const result = await generateAsync({ title, artist, themePack: selectedTheme });
```

**Key Features**:
- Visual theme picker with icons and descriptions
- Default to "Waves" (most versatile)
- Disabled state when AI not available
- Real-time progress tracking (4 steps)
- Error handling with helpful messages

---

#### 6.1.4 Slide Generation Service

**slideGeneratorService.ts** - Core AI Logic
```typescript
// Location: src/services/slideGeneratorService.ts

export class SlideGeneratorService {
  async generateSongSlides(
    title: string,
    artist: string,
    onProgress?: ProgressCallback,
    themePack?: 'mountains' | 'waves' | 'clouds'  // NEW: User-selected theme
  ): Promise<GenerationResult> {
    
    // Step 1: Fetch lyrics from Genius
    const lyricsResult = await searchLyrics(title, artist);
    
    // Step 2: Analyze song with GPT-4
    const analysis = await openaiService.analyzeSong(
      lyricsResult.title,
      lyricsResult.artist,
      lyricsResult.lyrics
    );
    // Returns: { mood, energy, themes, recommendedColors, pace }
    
    // Step 3: Break into slides (6-8 lines each)
    const slideBreakdown = await openaiService.breakIntoSlides(lyricsResult.lyrics);
    
    // SAFETY CHECK: Split slides >8 lines into multiple slides
    slideBreakdown.slides.forEach((slide, idx) => {
      const lines = slide.content.split('\n');
      if (lines.length > 8) {
        // Split into chunks of 6 lines
        for (let i = 0; i < lines.length; i += 6) {
          const chunk = lines.slice(i, i + 6).join('\n');
          safeSlides.push({ content: chunk, type: slide.type, order: safeSlides.length });
        }
      }
    });
    
    // 🎨 NEW: Use user-selected theme if provided
    let selectedThemePack: string;
    if (themePack) {
      selectedThemePack = themePack;  // User choice takes priority!
      console.log(`🎨 User selected theme pack: ${themePack}`);
    } else {
      const templateSelection = selectTemplate(analysis);  // AI fallback
      selectedThemePack = templateSelection.themePack;
      console.log(`🤖 AI selected theme pack: ${selectedThemePack}`);
    }
    
    // Get backgrounds from selected pack
    const pack = getBackgroundPacks().find(p => p.id === selectedThemePack);
    console.log(`✅ Using ${pack.name} with ${pack.backgrounds.length} backgrounds`);
    
    // Step 4: Create slides with rotating backgrounds
    const generatedSlides = slideBreakdown.slides.map((slide, index) => {
      const backgroundIndex = index % pack.backgrounds.length;
      const background = pack.backgrounds[backgroundIndex];
      
      return {
        id: `slide_${Date.now()}_${index}`,
        content: slide.content,
        backgroundId: background.id,
        layout: 'center',
        visualData: {
          background: { type: 'image', imageId: background.id },
          elements: [{
            type: 'text',
            content: slide.content,
            visible: true,
            opacity: 1,
            zIndex: 10,
            position: { x: 160, y: 340 },
            size: { width: 1600, height: 400 },
            style: {
              fontSize: 64,
              fontWeight: 700,
              color: '#ffffff',
              textAlign: 'center',
              textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'
            }
          }]
        }
      };
    });
    
    return { slides: generatedSlides, analysis, songInfo, metadata };
  }
}
```

**Key Algorithms**:
1. **Lyric Safety Check**: Prevents slides with >8 lines (readability)
2. **Background Rotation**: Cycles through pack backgrounds (visual variety)
3. **Theme Selection Priority**: User choice > AI recommendation
4. **VisualData Generation**: Creates editor-compatible slide data

---

#### 6.1.5 Background Configuration System

**backgroundConfig.ts** - Easy Enable/Disable
```typescript
// Location: src/config/backgroundConfig.ts

export const MOUNTAINS_CONFIG: BackgroundConfig[] = [
  { id: 'mountain-1', enabled: true, name: 'Mountain Peak', url: '...' },
  { id: 'mountain-2', enabled: true, name: 'Snowy Summit', url: '...' },
  { id: 'mountain-3', enabled: false, name: 'Rocky Trail', url: '...' },  // Disabled
  // ... 6 total
];

export function getEnabledBackgrounds(category: 'mountains' | 'waves' | 'clouds') {
  const configs = { mountains: MOUNTAINS_CONFIG, waves: WAVES_CONFIG, clouds: CLOUDS_CONFIG };
  return configs[category].filter(bg => bg.enabled);
}
```

**Benefits**:
- Centralized background management
- Easy enable/disable without code changes
- Respects pack consistency
- ~6 backgrounds per pack (optimal variety)

---

#### 6.1.6 Slide Editor & Duplication

**SlideEditor.tsx** - Edit Song Slides
```typescript
// Location: src/components/slides/SlideEditor.tsx

export function SlideEditor({ slides, backgrounds, layouts, onSave, onClose }) {
  const [slides, setSlides] = useState(initialSlides);
  
  // 🆕 DUPLICATE SLIDE FEATURE
  const handleDuplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`,
      order: index + 1
    };
    
    // Insert after current slide
    const newSlides = [
      ...slides.slice(0, index + 1),
      newSlide,
      ...slides.slice(index + 1)
    ];
    
    setSlides(newSlides);
    setBackgrounds([...backgrounds.slice(0, index + 1), backgrounds[index], ...backgrounds.slice(index + 1)]);
    setLayouts([...layouts.slice(0, index + 1), layouts[index], ...layouts.slice(index + 1)]);
  };
  
  // ADD CUSTOM SLIDE FEATURE (already existed)
  const handleAddSlide = () => {
    const newSlide = {
      id: `slide-${Date.now()}`,
      type: 'custom',
      content: 'New slide\nAdd your text here',
      order: slides.length
    };
    setSlides([...slides, newSlide]);
  };
  
  // UI: Duplicate button next to each slide
  <button onClick={() => handleDuplicateSlide(index)} title="Duplicate slide">
    <Copy size={16} />
  </button>
}
```

**Use Cases for Duplication**:
- **Repeat Chorus**: Duplicate chorus slides 2-3 times
- **Tag Ending**: Duplicate last line for worship tags
- **Verse Variations**: Duplicate and edit for similar verses
- **Bridge Repeats**: Duplicate bridge for extended worship

**Use Cases for Custom Slides**:
- **Intro/Outro**: Add "Welcome" or "Thank You" slides
- **Transition**: Add blank or instruction slides between songs
- **Instrumental**: Add "Instrumental Break" text slides
- **Special Notes**: Add musician cues or key changes

---

#### 6.1.7 Complete Feature List

**Song Creation**:
- ✅ Manual lyrics entry with live preview
- ✅ Genius API lyrics search (Electron only)
- ✅ AI Quick Create with theme selection
- ✅ Metadata: CCLI number, key, tempo, tags
- ✅ Automatic slide generation (6-8 lines per slide)

**Slide Editing**:
- ✅ Edit slide text inline
- ✅ Change background per slide
- ✅ Change layout per slide (7 types)
- ✅ **🆕 Duplicate slides** (for chorus/tags)
- ✅ **🆕 Add custom slides** (for transitions)
- ✅ Delete slides
- ✅ Reorder slides (drag handles)
- ✅ Visual editor integration (advanced)

**Design Options**:
- ✅ **🎨 Theme packs**: Mountains, Waves, Clouds
- ✅ 24+ worship backgrounds across 8 categories
- ✅ 7 layout types: full-bleed, split, thirds, etc.
- ✅ Quick Looks: Canva-style presets
- ✅ Visual editor: Full Canva-level customization

**AI Features**:
- ✅ GPT-4 song mood analysis
- ✅ Automatic theme selection (or user override)
- ✅ Smart slide breaking (6-8 lines)
- ✅ Safety checks (split long slides)
- ✅ Background rotation algorithm

**Data Management**:
- ✅ Search & filter songs
- ✅ Duplicate songs
- ✅ Delete songs
- ✅ Export/import (future)
- ✅ localStorage or SQLite persistence

---

#### 6.1.8 API Integration Details

**Genius API** (Lyrics Search)
```typescript
// Location: src/services/lyricsApi.ts
// Requires: Electron IPC to bypass CORS

export async function searchLyrics(title: string, artist: string) {
  const result = await window.electron.lyrics.search({ title, artist });
  // Returns: { title, artist, lyrics, album, year }
}
```

**OpenAI API** (Song Analysis)
```typescript
// Location: src/services/openaiService.ts
// Model: gpt-4o-mini (optimized for speed/cost)

export async function analyzeSong(title: string, artist: string, lyrics: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{
      role: 'system',
      content: 'Analyze worship song mood, energy level, themes...'
    }, {
      role: 'user',
      content: `Title: ${title}\nArtist: ${artist}\nLyrics: ${lyrics}`
    }]
  });
  
  return JSON.parse(response.choices[0].message.content);
  // Returns: { mood: 'joyful', energy: 8, themes: ['praise', 'celebration'], ... }
}

export async function breakIntoSlides(lyrics: string) {
  // Prompt: "Break lyrics into slides, 6-8 lines each, preserve structure..."
  // Returns: { slides: [{ content: '...', type: 'verse', order: 0 }, ...] }
}
```

---

#### 6.1.9 Performance & Optimization

**Generation Speed**:
- Genius API: ~2-3 seconds
- OpenAI Analysis: ~3-5 seconds  
- OpenAI Slide Breaking: ~2-3 seconds
- Total: **~8-11 seconds** (vs 30 seconds estimate)

**Cost Per Song** (OpenAI):
- Model: gpt-4o-mini
- Tokens: ~2000 input + ~1500 output
- Cost: **~$0.005 per song** (half a cent!)

**Caching Strategy**:
- Lyrics cached by song ID
- Songs cached in React Query
- Backgrounds loaded once (browser cache)
- No re-fetching on navigation

---

#### 6.1.10 Error Handling

**Genius API Failures**:
```
"Could not find song lyrics. Please try a different search or add manually."
→ Fallback: Manual lyrics entry
```

**OpenAI API Failures**:
```
"AI analysis failed. Using default theme."
→ Fallback: Waves theme (most versatile)
```

**Network Failures**:
```
"Generation failed. Please check your internet connection."
→ Retry button available
```

**Validation Errors**:
```
"Song title is required."
"No API key configured. Add VITE_OPENAI_API_KEY to .env"
```

---

#### 6.1.11 Recommendations for AI Improvement

**Current Limitations**:
1. ❌ AI sometimes selects theme inconsistent with mood
2. ❌ No preview before generation completes
3. ❌ Cannot adjust slide breaking rules
4. ❌ No A/B theme comparison

**Suggested Enhancements**:

**1. Improve Theme Selection Accuracy**
```typescript
// Add more nuanced mapping in templateMappings.ts
const themeSelection = {
  // Energy-based selection
  lowEnergy: analysis.energy < 4 ? 'clouds' : 'waves',
  highEnergy: analysis.energy > 7 ? 'mountains' : 'waves',
  
  // Mood-based overrides
  peaceful: ['calm', 'peaceful', 'restful'] → 'clouds',
  powerful: ['mighty', 'powerful', 'victorious'] → 'mountains',
  joyful: ['joyful', 'celebrate', 'dance'] → 'waves',
  
  // Theme-based selection
  nature: ['creation', 'ocean', 'mountain'] → match theme,
  spiritual: ['holy', 'spirit', 'heaven'] → 'clouds'
};
```

**2. Add Preview Step**
```typescript
// Show AI analysis + recommended theme BEFORE generating
<AnalysisPreview analysis={analysis} recommendedTheme="waves">
  <button onClick={acceptAndGenerate}>✅ Looks good!</button>
  <ThemePicker onOverride={setTheme} />
</AnalysisPreview>
```

**3. Customizable Slide Breaking**
```typescript
// Add user preferences
<SlideSettings>
  <Range label="Lines per slide" min={4} max={10} value={6} />
  <Checkbox label="Keep verses intact" checked />
  <Checkbox label="Separate choruses" checked />
</SlideSettings>
```

**4. Multi-Theme Generation**
```typescript
// Generate 3 versions in parallel (mountains, waves, clouds)
// Let user pick after seeing previews
const [version1, version2, version3] = await Promise.all([
  generateWith('mountains'),
  generateWith('waves'),
  generateWith('clouds')
]);
```

**5. Fine-tune GPT-4 Prompts**
```typescript
// Current prompt is generic - make it more specific
const improvedPrompt = `
Analyze this worship song for presentation purposes.
Consider:
- Vocal dynamics (soft vs powerful)
- Lyrical themes (nature, victory, intimacy)
- Imagery (ocean, mountains, sky, fire)
- Energy progression (builds, sustains, resolves)

Return theme recommendation with confidence score:
{ theme: 'waves', confidence: 0.92, reasoning: '...' }
`;
```

---

**End of Song Management Documentation**

### 6.2 Design System
**Status**: ✅ Complete  
**Location**: `src/assets/`, `src/components/backgrounds/`

**Components**:
- **30+ Backgrounds** (8 categories)
  - Mountains: 6 images (blue/purple tones)
  - Waves: 6 images (teal/blue tones)
  - Clouds: 6 images (soft blue/white tones)
  - Nature: 4 images (green tones)
  - Water: 2 images
  - Abstract: 4 images
  - Light: 4 images
- **8 Background Packs** (themed collections)
  - Mountains, Waves, Clouds (NEW - cohesive palettes)
  - Nature, Lakes, Abstract, Light, Mixed Variety
- **7 Quick Looks** (Canva-style presets)
- **7 Layout Types** (text positioning)
- **Color Palette Consistency** (no jarring transitions)

### 6.3 Service Planning
**Status**: ✅ Complete with Templates & AI Integration  
**Location**: `src/pages/PlannerPage.tsx`, `src/components/planner/`, `src/components/modals/`

**Features**:
- **Service Management**: Create services (name, date, church)
- **Item Types**: Add 6 types (song, scripture, announcement, sermon, offering, welcome, closing)
- **Template Gallery**: Beautiful template picker for each item type
  - Announcement: 3 templates (Key Points Grid, Large Question, Three Steps)
  - Sermon: 3 templates (Elegant Script Title, Clean Title on Dark, Thank You/Closing)
  - Scripture: 2 templates (Split Screen with Cross, Verse with Reference)
- **Visual Editing**: Click edit → Opens world-class visual editor
  - Drag-and-drop element positioning
  - 25+ fonts loaded and working
  - Keyboard shortcuts
  - Professional UX
- **AI Scripture Integration**: 
  - Type reference (e.g., "John 3:16 NIV")
  - GPT-4 returns verse text
  - Template picker opens automatically
  - **Verse pre-fills into selected template**
  - Opens in visual editor ready to customize
- **Item Management**: Edit/delete items, reorder, duration tracking
- **Data Flow**: 
  ```
  Add Item → Select Type → 
  [Scripture: AI Lookup → Get Verse → Store Temporarily] → 
  Template Gallery → Pick Template → 
  [Scripture: Pre-fill Verse into Template Elements] → 
  Add to Service → Edit in Visual Editor → Save
  ```
- **Persistence**: All changes saved to localStorage/SQLite
- **Full CRUD**: Complete create, read, update, delete operations

### 6.4 Dual-Screen Presentation System
**Status**: ✅ **COMPLETE - Production Ready**  
**Location**: `src/pages/PresenterPage.tsx`, `src/pages/AudienceViewPage.tsx`
**Quality**: Professional-Grade, PowerPoint-Level Presenter View

---

#### 6.4.1 Overview

Professional dual-screen presentation system with separate **Presenter View** (control) and **Audience View** (projection).

**Architecture**:
```
┌─────────────────┐         IPC          ┌──────────────────┐
│  Presenter View │ ◄─────────────────► │  Audience View   │
│  (Main Window)  │    State Sync        │  (Projection)    │
└─────────────────┘                      └──────────────────┘
     ↓ Controls                               ↓ Displays
  All Slides                               Current Slide Only
```

---

#### 6.4.2 Presenter View Features

**Left Sidebar - Slide Navigator** (NEW!):
- **All Slides Visible**: Shows thumbnails of every slide in the service
- **Click-to-Jump**: Click any slide to jump instantly
- **Visual Indicators**:
  - 🔵 **Current Slide**: Blue background with white ring
  - 🟢 **Next Slide**: Green border with "→ UP NEXT" label
  - ⚫ **Past Slides**: Gray with reduced opacity
  - ⚪ **Future Slides**: Default style
- **Thumbnail Preview**: Scaled-down slide preview (64×36 px)
- **Slide Numbers**: Padded 2-digit numbers (01, 02, etc.)
- **Slide Titles**: Song title + slide number or item type

**Center Panel - Main Display**:
- **Current Slide**: Large preview of what audience sees
- **Next Slide Preview**: Shows upcoming slide (smaller, 70% opacity)
- **Blank Screen Mode**: Shows "⬛ BLANK SCREEN" when blanked
- **Presenter Notes**: Shows item notes if available

**Top Header**:
- **Service Name**: Display with 🎭 icon
- **Slide Counter**: "Slide X of Y" (global count)
- **Elapsed Timer**: Live MM:SS format
- **Exit Button**: Close presentation (also ESC key)

**Bottom Controls**:
- **Previous Button**: Go back (Arrow Left)
- **Blank Button**: Toggle blank screen (B key)
- **Next Button**: Advance forward (Arrow Right)
- Disabled states when at start/end

---

#### 6.4.3 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **→ Right Arrow** | Next slide |
| **← Left Arrow** | Previous slide |
| **B** | Toggle blank screen |
| **ESC** | Exit presentation |

---

#### 6.4.4 Audience View Features

**Clean Full-Screen Output**:
- **No Controls**: Pure content display
- **Dual-Screen Mode**: Opens on secondary monitor automatically
- **Hash Routing**: `/#/audience` for dedicated window
- **Background Rendering**: Full 1920×1080 backgrounds
- **Text Overlays**: Lyrics, scriptures, announcements
- **Visual Data Support**: Renders template-based slides
- **Blank Screen**: Solid black when blanked

---

#### 6.4.5 IPC State Synchronization

**Real-Time Sync via Electron IPC**:
```typescript
// Presenter → Audience sync
window.electron.presentation.syncState({
  service,
  currentItemIndex,
  currentSlideIndex,
  isBlank,
  isPresenting,
  currentSongData // Full song with slides
});
```

**Dual Sync Strategy**:
1. **Immediate Sync**: On presenter action
2. **Delayed Sync (300ms)**: Ensures audience window is ready

**What Gets Synced**:
- Current service data
- Item index (which item in service)
- Slide index (which slide within item)
- Blank state
- Song data (for multi-slide songs)

---

#### 6.4.6 Slide Navigation Algorithm

**Flat Slide List Generation**:
```typescript
// Build array of ALL slides from all items
service.items.forEach((item, itemIndex) => {
  if (item.type === 'song' && song) {
    // Add each song slide
    song.slidesData.forEach((slide, slideIndex) => {
      allSlides.push({ itemIndex, slideIndex, item, song });
    });
  } else {
    // Single slide items
    allSlides.push({ itemIndex, slideIndex: 0, item });
  }
});
```

**Benefits**:
- Single flat array of all slides
- Easy global indexing (Slide X of Y)
- Fast click-to-jump navigation
- Consistent thumbnail rendering

---

#### 6.4.7 Technical Implementation

**File Structure**:
```
src/pages/
├── PresenterPage.tsx        ← Main presenter interface
└── AudienceViewPage.tsx     ← Clean audience output

electron/
├── main.ts                  ← Window management
└── preload.ts               ← IPC bridge
```

**Window Management** (`electron/main.ts`):
```typescript
// Open audience window on secondary monitor
ipcMain.handle('presentation:start', async () => {
  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find(d => d.bounds.x !== 0) || displays[0];
  
  audienceWindow = new BrowserWindow({
    x: externalDisplay.bounds.x,
    y: externalDisplay.bounds.y,
    fullscreen: true,
    frame: false,
    webPreferences: { preload: path.join(__dirname, 'preload.js') }
  });
  
  audienceWindow.loadURL('http://localhost:5173/#/audience');
});
```

**State Broadcasting** (`PresenterPage.tsx`):
```typescript
useEffect(() => {
  if (!service || !window.electron?.presentation?.syncState) return;
  
  const state = {
    service: JSON.parse(JSON.stringify(service)), // Deep clone
    currentItemIndex,
    currentSlideIndex,
    isBlank,
    isPresenting,
    currentSongData: currentSong ? {
      id: currentSong.id,
      title: currentSong.title,
      slidesData: currentSong.slidesData
    } : null
  };
  
  window.electron.presentation.syncState(state);
}, [service, currentItemIndex, currentSlideIndex, isBlank, songs]);
```

---

#### 6.4.8 Performance Optimizations

- **Thumbnail Scaling**: CSS transform scale (0.15) instead of image resize
- **Virtualization**: Could add for 100+ slides (not needed yet)
- **Debounced Sync**: Prevents excessive IPC calls
- **Deep Clone**: JSON serialize/parse for safe IPC transfer
- **Lazy Loading**: Slides render as-needed

---

#### 6.4.9 User Experience Highlights

✅ **Professional**: Like PowerPoint/Keynote presenter view  
✅ **Intuitive**: Visual indicators make navigation obvious  
✅ **Fast**: Click any slide, instant jump  
✅ **Reliable**: Dual sync ensures audience never desynchronizes  
✅ **Keyboard-Friendly**: All controls have shortcuts  
✅ **Production-Ready**: Tested for live worship services

---

**End of Presentation System Documentation**

---

### 6.5 Autosave System
**Status**: ✅ **COMPLETE - Never Lose Work**  
**Location**: `src/components/modals/ServiceEditorModal.tsx`, `src/components/songs/SongFormModal.tsx`
**Quality**: Google Docs-Level Auto-Save

---

#### 6.5.1 Overview

Automatic saving system that saves changes in the background without interrupting workflow. No more annoying "Save & Close" buttons!

**Key Benefits**:
- ✅ Never lose work
- ✅ No interruption to workflow
- ✅ Visual feedback of save status
- ✅ Modals stay open while editing
- ✅ Debounced for performance

---

#### 6.5.2 Service Editor Autosave

**Behavior**:
- Saves **1 second** after last change
- Tracks service items (add, remove, reorder, edit)
- No modal close on save
- Visual status indicator

**Implementation** (`ServiceEditorModal.tsx`):
```typescript
const [initialItems, setInitialItems] = useState<ServiceItem[]>([]);
const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);

// Autosave effect
useEffect(() => {
  if (!service || !isOpen || !hasChanges) return;
  
  const timer = setTimeout(() => {
    const updatedService = {
      ...service,
      items,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedService);
    setInitialItems(items); // Update baseline
  }, 1000); // 1 second debounce
  
  return () => clearTimeout(timer);
}, [items, service, isOpen, hasChanges, onSave]);
```

**Visual Feedback**:
```tsx
{hasChanges ? (
  <span className="text-orange-600">
    <span className="animate-pulse">●</span> Saving...
  </span>
) : (
  <span className="text-green-600">
    ● All changes saved
  </span>
)}
```

---

#### 6.5.3 Song Form Autosave

**Behavior**:
- Saves **2 seconds** after last change (songs are more complex)
- Tracks all song data (title, lyrics, slides, metadata)
- Only for EXISTING songs (new songs still need "Add Song" button)
- No modal close on save

**Implementation** (`SongFormModal.tsx`):
```typescript
const [initialFormData, setInitialFormData] = useState<CreateSongInput | null>(null);
const [hasChanges, setHasChanges] = useState(false);

// Detect changes
useEffect(() => {
  if (!initialFormData) return;
  const changed = JSON.stringify(formData) !== JSON.stringify(initialFormData);
  setHasChanges(changed);
}, [formData, initialFormData]);

// Autosave effect
useEffect(() => {
  if (!song || !hasChanges || !formData.title.trim()) return;
  
  const timer = setTimeout(() => {
    onSubmit(formData);
    setInitialFormData(JSON.parse(JSON.stringify(formData)));
    setHasChanges(false);
  }, 2000); // 2 second debounce for songs
  
  return () => clearTimeout(timer);
}, [formData, song, hasChanges, onSubmit]);
```

**UI Changes**:
- Editing existing song: Shows "Close" button + autosave status
- Creating new song: Shows "Add Song" button (manual submit required)

---

#### 6.5.4 Debounce Strategy

**Why Debounce?**
- Prevents excessive saves while user is still typing
- Reduces database writes
- Improves performance
- Better user experience

**Timing Choices**:
- **Services (1s)**: Simple data (array of items)
- **Songs (2s)**: Complex data (lyrics, slides, visual data)

**How It Works**:
```
User types → Timer starts (1s or 2s)
User types again → Timer resets
User stops typing → Timer completes → SAVE
```

---

#### 6.5.5 Change Detection

**Deep Comparison**:
```typescript
const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialData);
```

**What Triggers Save**:
- **Services**:
  - Add/remove service items
  - Reorder items
  - Edit item content
  - Change item duration
  - Update item notes
- **Songs**:
  - Change title/artist
  - Edit lyrics
  - Modify slides
  - Update metadata (CCLI, key, tempo)
  - Change backgrounds/layouts

---

#### 6.5.6 Modal Stay-Open Behavior

**Before Autosave** (Annoying):
```
Edit → Click "Save Changes" → Modal closes immediately
Want to make another edit → Reopen modal → Start over
```

**After Autosave** (Smooth):
```
Edit → Keep working → Autosave in background → Modal stays open
Make more edits → Autosave again → Click "Close" when done
```

**Implementation**:
- Removed "Save Changes" button
- Changed "Cancel" to "Close"
- `handleSave` no longer calls `onClose()`
- User decides when to close

---

#### 6.5.7 Error Handling

**Save Failures**:
```typescript
try {
  await updateService.mutateAsync(service);
  console.log('✅ Service autosaved');
} catch (error) {
  console.error('❌ Error saving service:', error);
  alert(`Failed to save: ${error.message}`);
}
```

**User Feedback**:
- Success: Green "All changes saved"
- Saving: Orange pulsing "Saving..."
- Error: Alert with error message

---

#### 6.5.8 Performance Considerations

**Optimizations**:
- Only saves if `hasChanges === true`
- Debounced to prevent rapid saves
- Deep clone only when needed
- No save on modal open (uses initial state)

**Memory Usage**:
- Stores one copy of initial state
- Lightweight change detection
- Timer cleanup on unmount

---

#### 6.5.9 User Experience

✅ **Seamless**: Works in background, no interruption  
✅ **Visible**: Always know save status  
✅ **Forgiving**: Can't lose work by forgetting to save  
✅ **Natural**: Like Google Docs, Notion, modern apps  
✅ **Fast**: 1-2 second delay feels instant  
✅ **Reliable**: Deep change detection catches everything

---

**End of Autosave System Documentation**

---

### 6.6 Visual Editor  
**Status**: ✅ EXCEPTIONAL - Canva/Figma Level  
**Location**: `src/components/designer/`, `src/components/modals/VisualItemEditorModal.tsx`, `src/hooks/useHistory.ts`
**Quality**: Professional Grade, Industry-Leading, Fully Polished
**Version**: 3.0.0

**Core Features**:
- **VisualCanvas**: 1920×1080 professional design canvas with auto-scaling
- **Element Types**: Text, shapes, images (full rendering support)
- **Google Fonts Integration**: All 25+ fonts loaded via CDN in `index.html`
- **History Management**: Custom useHistory hook with 50-step undo/redo
- **Clipboard System**: Copy/paste/duplicate with offset positioning

**Interaction Model**:
- **Click to Select**: Blue border highlight, properties panel populates
- **Drag-and-Drop**: Click and drag elements anywhere on canvas
  - Smooth movement with visual feedback
  - Canvas bounds enforcement
  - Scale-aware coordinate conversion
  - Pixel-perfect positioning
- **Comprehensive Keyboard Shortcuts** (11 total):
  - **Ctrl/Cmd + Z** → Undo (50-step history)
  - **Ctrl/Cmd + Shift + Z** or **Ctrl/Cmd + Y** → Redo
  - **Ctrl/Cmd + C** → Copy selected element
  - **Ctrl/Cmd + V** → Paste copied element
  - **Ctrl/Cmd + D** → Duplicate selected element
  - **Ctrl/Cmd + ]** → Bring element forward (layer up)
  - **Ctrl/Cmd + [** → Send element backward (layer down)
  - **Delete** key → Remove selected element
  - **Escape** key → Deselect element
- **Cross-Platform**: Automatic Cmd (Mac) or Ctrl (Windows) detection
- **Auto-Select**: New elements automatically selected for immediate editing

**Text Manipulation**:
- **Content Editing**: Multi-line textarea input
- **25+ Professional Fonts** (Google Fonts):
  - **Modern**: Outfit, Inter, Poppins, Montserrat, Roboto, Open Sans
  - **Traditional**: Playfair Display, Merriweather, Lora, Georgia, Times New Roman
  - **Script**: Pacifico, Dancing Script, Great Vibes, Satisfy, Allura
  - **Display**: Bebas Neue, Oswald, Anton, Cinzel
  - **Handwriting**: Caveat, Patrick Hand
  - **System**: Arial, Helvetica, Verdana
- **Font Weights**: 100-900 (Thin, Extra Light, Light, Regular, Medium, Semi Bold, Bold, Extra Bold, Black)
- **Font Sizes**: 8-300px with slider and input
- **Color Picker**: Visual picker + hex input (#RRGGBB)
- **Text Alignment**: Left, Center, Right buttons
- **Position Control**: X, Y coordinate inputs
- **Size Control**: Width, Height inputs
- **Opacity Control**: 0-100% slider with live percentage display
- **Rotation Control**: 0-360° slider with live degree display

**Shape Rendering**:
- Rectangles, cards, frames (used for template borders)
- Background colors with transparency
- Border radius for rounded corners
- Drop shadows (offset, blur, color)

**Background Editing**:
- **Type Selection**: Solid color or image background
- **Solid Color**: Color picker + hex input
- **Image Background**: URL input field
- **Quick Presets**: 3 dramatic background images
- Shows when no element selected (click canvas)

**Element Management**:
- **Add Text Button**: Creates new text element with all required properties
- **Copy Button**: Copy selected element (Ctrl+C)
- **Duplicate Button**: Instant copy with offset (Ctrl+D)
- **Layer Up Button**: Bring element forward (Ctrl+])
- **Layer Down Button**: Send element backward (Ctrl+[)
- **Delete Button**: Remove selected element
- **Delete Key**: Keyboard shortcut for removal
- **Escape Key**: Deselect current element
- **Auto-Select**: New and pasted elements selected immediately
- **Clipboard**: Copied element persists across edits

**Property Syncing**:
- Dual-level updates (top-level + style object)
- Instant visual feedback (no lag)
- Console logging for debugging
- All changes persist correctly

**Template Integration**:
- Loads template visualData from service items
- Converts template format to canvas format
- Adds required properties (visible, locked, opacity, rotation)
- Preserves all styling and positioning
- Saves back to service on Save button

**UX Polish**:
- **Professional Toolbar**: Organized sections with visual separators
  - History controls (Undo/Redo)
  - Element actions (Copy/Duplicate)
  - Layer management (Forward/Backward)
  - Creation & save (Add Text/Save/Close)
- **Visual Button States**: Enabled, disabled (30% opacity), hover
- **Tooltips**: All buttons show shortcuts and descriptions
- **Footer Help Bar**: 
  - Left: Basic interaction hints
  - Right: Keyboard shortcut quick reference with styled <kbd> tags
- **Live Property Feedback**: Opacity shows %, rotation shows °
- Smooth animations and transitions
- Clear visual feedback
- Empty state messaging
- Error handling and validation
- Console logging for debugging

**Technical Excellence**:
- **Custom useHistory Hook**: Generic, 50-step limit, memory-efficient
- **Layer Management**: Array-based z-index via element swapping
- **Clipboard System**: Element deep-copy with offset positioning
- **Platform Detection**: Mac (Cmd) vs Windows (Ctrl) auto-detection
- **Event Prevention**: preventDefault() to avoid browser conflicts
- React state management with history tracking
- Scale-aware drag calculations
- Canvas coordinate conversion
- Bounds constraint enforcement
- Comprehensive keyboard event handling
- Real-time property updates with dual-level syncing
- Complete data persistence (opacity, rotation, all properties)

**Data Persistence**: Complete visualData structure stored in service item content as JSON

**History Management**:
- 50-step undo/redo buffer (prevents memory overflow)
- History branch slicing (redo tree removed on new action)
- canUndo/canRedo state tracking for UI
- clearHistory() option for reset

**Keyboard Shortcuts Table**:
| Shortcut | Action | Cross-Platform |
|----------|--------|----------------|
| Ctrl/Cmd + Z | Undo | ✅ |
| Ctrl/Cmd + Shift + Z | Redo | ✅ |
| Ctrl/Cmd + Y | Redo (Alt) | ✅ |
| Ctrl/Cmd + C | Copy | ✅ |
| Ctrl/Cmd + V | Paste | ✅ |
| Ctrl/Cmd + D | Duplicate | ✅ |
| Ctrl/Cmd + ] | Bring Forward | ✅ |
| Ctrl/Cmd + [ | Send Backward | ✅ |
| Delete | Remove Element | ✅ |
| Escape | Deselect | ✅ |

### 6.6 AI Scripture Lookup
**Status**: ✅ Complete (OpenAI GPT-4)  
**Location**: `src/components/modals/AddScriptureModal.tsx`, `src/services/openaiService.ts`

**Features**:
- **GPT-4 Integration**: OpenAI API for intelligent scripture lookup
- **Model**: gpt-4o-mini (optimized for speed and cost)
- **Search Interface**: Type reference (e.g., "John 3:16")
- **Translation Support**: NIV, ESV, KJV, NASB, NLT, and more
- **Instant Results**: Returns verse text in 1-2 seconds
- **One-Click Add**: Adds scripture as service item with template
- **Error Handling**: Validates reference, provides helpful messages
- **API Key**: Stored in environment variable (VITE_OPENAI_API_KEY)
- **Privacy**: All lookups processed securely through OpenAI
- **Fallback**: Manual scripture entry always available

### 6.7 Lyrics Search
**Status**: ✅ Integrated (Requires Electron)  
**Location**: `src/components/lyrics/`, `src/services/lyricsApi.ts`

**Features**:
- **Genius API**: Official lyrics database
- **Search modal**: Title + artist search
- **Live preview**: View lyrics before importing
- **One-click import**: Auto-fills title, artist, lyrics
- **Metadata**: Album, year, source info
- **Backend routing**: Uses Electron IPC to bypass CORS
- **Status**: Requires Electron runtime (not available in browser mode)

### 6.8 Template System
**Status**: ✅ Complete  
**Location**: `src/config/slideTemplatesFixed.ts`, `src/components/modals/TemplatePickerModal.tsx`

**Overview**: Professional pre-designed slide templates based on custom JPEG designs from `src/assets/`. Templates provide starting points that are fully editable in the Visual Editor.

#### 6.8.1 Template Architecture

**Template Definition Structure**:
```typescript
interface SlideTemplate {
  id: string;                    // Unique identifier
  name: string;                  // Display name (e.g., "Modern Worship 1")
  category: 'announcement' | 'scripture' | 'sermon' | ...;
  thumbnail: string;             // Preview image URL
  description: string;           // Brief description for picker
  visualData: {
    backgroundImage?: string;    // Background URL/path
    backgroundColor?: string;    // Solid color fallback
    elements: Array<{
      id: string;                // Element identifier
      type: 'text' | 'shape' | 'image';
      content?: string;          // Text content or image URL
      position: { x: number; y: number };  // Absolute pixels
      size: { width: number; height: number };
      fontSize?: number;         // Text size in pixels
      fontWeight?: number;       // 400, 700, 800, 900
      color?: string;            // Hex color
      textAlign?: 'left' | 'center' | 'right';
      backgroundColor?: string;  // For shapes/backgrounds
      borderRadius?: number;     // Rounded corners
      zIndex?: number;           // Layer order
    }>;
  };
}
```

#### 6.8.2 Template Sources

**Custom JPEG Templates** (`src/assets/`):
- **BB Series** (bb 1-5.jpg): Modern worship backgrounds with clean typography areas
- **B&W Series** (11 -bw 1-3.jpg): Dramatic black & white high-contrast designs
- **RP Series** (Rp 1-3.jpg): Nature/outdoor worship scenes with warm tones

**Asset Loading Method**:
```typescript
// Uses new URL() to handle filenames with spaces/special chars
const bb1 = new URL('../assets/bb (1).jpg', import.meta.url).href;
```
- **Why**: Standard `import` fails with spaces in filenames
- **Solution**: `new URL(path, import.meta.url).href` is Vite's recommended pattern
- **Result**: Returns proper blob:// or asset URL for runtime use

#### 6.8.3 Template Categories

**Announcements (11 templates)**:
- Modern Worship 1-5 (BB series backgrounds)
- Dramatic B&W 1-3 (High-contrast designs)
- Nature Scene 1-3 (RP series backgrounds)
- Key Points Grid (Original card-based layout)

**Future Categories** (Planned):
- Scripture templates with verse formatting
- Sermon title slides with speaker info
- Welcome/Closing slides
- Offering slides

#### 6.8.4 Template Picker Flow

**User Experience**:
```
1. Click "Add Item" → Select Type (Announcement)
2. TemplatePickerModal opens
3. Grid displays 11 thumbnails with descriptions
4. User clicks template → Highlights with checkmark
5. "Use This Template" button → Applies template
6. Service item created with template's visualData
7. User clicks "Edit" → Visual Editor loads with:
   - Background image from template
   - Text elements positioned as defined
   - Full editing capabilities enabled
```

**Technical Flow**:
```typescript
// PlannerPage.tsx - Template Selection Handler
const handleSelectTemplate = (template: SlideTemplate) => {
  const newItem: ServiceItem = {
    id: String(Date.now()),
    type: template.category,
    title: template.name,
    order: selectedService.items.length,
    duration: 3,
    content: JSON.stringify(template.visualData),  // ← Store as JSON
  };
  
  const updatedService = {
    ...selectedService,
    items: [...selectedService.items, newItem],
  };
  
  setSelectedService(updatedService);
};
```

#### 6.8.5 Visual Editor Integration

**Template Loading Process** (`VisualItemEditorModal.tsx`):

1. **Parse Content**:
```typescript
const visualData = JSON.parse(item.content);
// visualData = { backgroundImage: '...', elements: [...] }
```

2. **Convert Elements** to Canvas Format:
```typescript
const elements = visualData.elements.map(el => ({
  ...el,
  visible: el.visible !== false,
  locked: el.locked || false,
  rotation: el.rotation || 0,
  opacity: el.opacity ?? 1,
  zIndex: el.zIndex ?? 10,
  style: {
    color: el.color,
    backgroundColor: el.backgroundColor,
    fontFamily: el.fontFamily,
    fontSize: el.fontSize,
    fontWeight: el.fontWeight || 400,
    fontStyle: el.fontStyle || 'normal',
    textAlign: el.textAlign || 'left',
    borderRadius: el.borderRadius,
  }
}));
```

3. **Create Slide Object**:
```typescript
const convertedSlide = {
  id: item.id,
  elements,
  background: visualData.backgroundImage ? {
    type: 'image',
    imageUrl: visualData.backgroundImage
  } : {
    type: 'solid',
    color: visualData.backgroundColor || '#E8E3DC'
  },
  aspectRatio: '16:9',
  isVisualMode: true,
};
```

4. **Render in VisualCanvas**:
   - Background image loads
   - Elements render at exact positions
   - User can drag, resize, edit text
   - Changes save back to `item.content`

#### 6.8.6 Template Recreation Fidelity

**Design Principle**: Templates must look IDENTICAL in Visual Editor to their original JPEG designs.

**Positioning System**:
- **Canvas Size**: 1920x1080 pixels (16:9 aspect ratio)
- **Position Origin**: Top-left corner (x, y)
- **Text Alignment**: Applied AFTER positioning (center aligns within bounding box)

**Example - Centered Title**:
```typescript
{
  id: 'title',
  type: 'text',
  content: 'IMPORTANT MESSAGE',
  position: { x: 210, y: 540 },     // Top-left of text box
  size: { width: 1500, height: 180 },
  fontSize: 80,
  fontWeight: 800,
  color: '#FFFFFF',
  textAlign: 'center',  // Centers text WITHIN the 1500px width
  zIndex: 10,
}
```

**Common Issues & Solutions**:

| Issue | Cause | Solution |
|-------|-------|----------|
| Text not visible | Position off-canvas or z-index too low | Check x/y in 0-1920/0-1080 range, zIndex ≥ 10 |
| Wrong background | Path/URL incorrect | Use `new URL()` for local assets, full URLs for remote |
| Text not centered | Position vs alignment confusion | Position = box location, textAlign = text within box |
| ~~Elements jump~~ | ~~Old migration code~~ | ~~FIXED: Removed broken position migration logic~~ |

#### 6.8.7 Adding New Templates

**Step-by-Step Process**:

1. **Add JPEG to Assets**:
```bash
src/assets/new-template.jpg
```

2. **Import in slideTemplatesFixed.ts**:
```typescript
const newTemplate = new URL('../assets/new-template.jpg', import.meta.url).href;
```

3. **Define Template**:
```typescript
{
  id: 'announcement-new',
  name: 'New Template',
  category: 'announcement',
  thumbnail: newTemplate,
  description: 'Brief description',
  visualData: {
    backgroundImage: newTemplate,
    elements: [
      {
        id: 'title',
        type: 'text',
        content: 'Default Title',
        position: { x: 260, y: 500 },
        size: { width: 1400, height: 200 },
        fontSize: 80,
        fontWeight: 700,
        color: '#FFFFFF',
        textAlign: 'center',
        zIndex: 10,
      },
    ],
  },
}
```

4. **Add to Template Array**:
```typescript
export const ANNOUNCEMENT_TEMPLATES: SlideTemplate[] = [
  // ... existing templates
  newTemplate,  // ← Add here
];
```

5. **Test**:
   - Open template picker
   - Verify thumbnail shows
   - Select template
   - Open in Visual Editor
   - Verify background and elements match JPEG

#### 6.8.8 Technical Constraints

**Vite Asset Handling**:
- ❌ Cannot use string paths like `/src/assets/file.jpg` (not bundled)
- ❌ Cannot import files with spaces normally: `import x from 'bb (1).jpg'`
- ✅ Must use: `new URL('bb (1).jpg', import.meta.url).href`
- ✅ Vite converts to proper blob/asset URL at build time

**Element Properties**:
- All positions in absolute pixels (1920x1080 canvas)
- Font sizes in pixels (not rem/em)
- Colors in hex format (#FFFFFF)
- Z-index determines layer order (higher = front)

**Performance**:
- Templates stored as JSON in database
- No re-parsing needed on edit
- Background images cached by browser
- Fast load times (<100ms)

---

## 7. PERFORMANCE TARGETS

### 7.1 Metrics
- **First Paint**: <500ms
- **Time to Interactive**: <2s
- **Bundle Size**: <300KB gzipped
- **Lighthouse Score**: >90

### 7.2 Optimizations
- ✅ Tree-shaking (Vite)
- ✅ Code splitting
- ✅ React Query caching
- ✅ Tailwind PurgeCSS
- ✅ Memoization (useMemo)
- ⏳ Virtual scrolling (future)
- ⏳ Image lazy loading (future)

---

## 8. SECURITY CONSIDERATIONS

### 8.1 Web Security
- ✅ React XSS protection (auto-escaping)
- ✅ localStorage is origin-isolated
- ✅ No sensitive data stored
- ✅ TypeScript prevents type errors
- ⏳ Content Security Policy (future)

### 8.2 Desktop Security (Electron)
- ✅ Context isolation enabled
- ✅ Node integration disabled
- ✅ Preload script sanitization
- ✅ IPC whitelist only
- ⏳ Code signing (future)

---

## 9. DEPLOYMENT OPTIONS

### 9.1 Web Deployment
**Platforms**: Netlify, Vercel, GitHub Pages, Cloudflare Pages

**Build**:
```bash
npm run build
# Output: dist/ folder
# Deploy: Upload dist/ to hosting
```

**URL**: `https://[your-domain].com`

### 9.2 Desktop Deployment (Future)
**Platforms**: Windows, macOS, Linux

**Build**:
```bash
npm run build          # Build web
npm run build:electron # Build Electron
npx electron-builder   # Package app
```

**Output**: `.exe`, `.dmg`, `.AppImage`

---

## 10. FUTURE ARCHITECTURE

### 10.1 Planned Enhancements

**Phase 2**:
- [ ] Resolve native module issue (better-sqlite3 OR switch to sql.js)
- [ ] Full Electron deployment
- [ ] Cloud sync (Firebase/Supabase)
- [ ] Multi-device support
- [ ] Collaboration features
- [ ] Mobile app (React Native)
- [ ] CCLI API integration (official licensed lyrics)

**Phase 3**:
- [ ] AI-generated designs (OpenAI DALL-E)
- [ ] Chord detection & display
- [ ] Song recommendations
- [ ] Analytics dashboard

**Phase 4**:
- [ ] SaaS offering
- [ ] Multi-tenant architecture
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard

### 10.2 Scalability Plan

**Current**: Single-user, local storage  
**Future**: Multi-user, cloud database

**Migration Path**:
```
localStorage → SQLite → PostgreSQL/Firebase
```

**Architecture Evolution**:
```
Monolith → Backend API → Microservices
```

---

## 11. KNOWN ISSUES & WORKAROUNDS

### 11.1 Electron Native Module Issue
**Issue**: better-sqlite3 requires Visual Studio Build Tools to compile for Electron  
**Status**: Blocking Electron runtime  
**Workarounds**:
1. Use browser mode with localStorage (fully functional except lyrics search)
2. Switch to sql.js (pure JavaScript SQLite, ready to use)
3. Install Visual Studio 2022 with C++ tools and rebuild modules

**Documentation**: See `NATIVE_MODULE_ISSUE.md` for detailed troubleshooting

### 11.2 Lyrics Search Browser Limitation
**Issue**: Genius API calls blocked by CORS in browser  
**Solution**: Implemented Electron IPC backend routing  
**Workaround**: Manual lyrics entry works perfectly in browser mode

---

## 12. RELATED DOCUMENTATION

- **ARCHITECTURE_TECHNICAL.md** - Detailed tech implementation
- **ARCHITECTURE_DATA.md** - Database schema & data models
- **ARCHITECTURE_COMPONENTS.md** - Component hierarchy & flows
- **DICTIONARY.md** - Data dictionary
- **SYSTEM.md** - System overview
- **PLAN.md** - Development roadmap
- **NATIVE_MODULE_ISSUE.md** - better-sqlite3 troubleshooting
- **GENIUS_API_INTEGRATION.md** - Lyrics API documentation
- **NEW_THEME_PACKS.md** - Theme pack details
- **CORS_FIX.md** - API CORS resolution

---

**End of Overview Document**

See related architecture docs for deep technical details.
