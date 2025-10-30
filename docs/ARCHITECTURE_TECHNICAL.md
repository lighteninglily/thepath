# 🔧 TECHNICAL ARCHITECTURE

**Detailed Implementation Guide**

---

## 1. FILE STRUCTURE

```
church-slides/
├── src/                          # React application
│   ├── assets/                   # Static data & configurations
│   │   ├── backgrounds.ts        # 24 curated background images with categories
│   │   ├── backgroundPacks.ts    # 7 themed packs + rotation logic
│   │   ├── quickLooks.ts         # 7 Canva-style presets + layout algorithms
│   │   └── layouts.ts            # Layout type definitions (future utils)
│   │
│   ├── components/               # React components
│   │   ├── backgrounds/
│   │   │   ├── BackgroundPicker.tsx        # Grid of 24 backgrounds
│   │   │   ├── BackgroundPackPicker.tsx    # Theme pack selector
│   │   │   └── QuickLookPicker.tsx         # Quick Look preset selector
│   │   ├── planner/
│   │   │   ├── AddItemMenu.tsx             # 8-button popup menu
│   │   │   ├── ServiceItemCard.tsx         # Color-coded service item
│   │   │   ├── ServiceItemEditor.tsx       # Modal for editing items
│   │   │   └── ServiceSlidePreview.tsx     # Renders all 8 slide types
│   │   ├── presentation/
│   │   │   ├── PresentationModal.tsx       # Full-screen presentation
│   │   │   └── ControlPanel.tsx            # Slide navigation controls
│   │   ├── slides/
│   │   │   ├── SlideEditor.tsx             # Individual slide editor
│   │   │   └── SlidePreview.tsx            # Single slide preview
│   │   └── songs/
│   │       ├── SongCard.tsx                # Grid item for song
│   │       ├── SongFormModal.tsx           # Main song creation modal
│   │       └── SongList.tsx                # Grid of songs
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useSongs.ts           # Song CRUD hooks
│   │   ├── useServices.ts        # Service CRUD hooks
│   │   ├── useTemplates.ts       # Template hooks
│   │   └── useMockElectron.ts    # Storage abstraction layer
│   │
│   ├── pages/                    # Top-level page components
│   │   ├── LibraryPage.tsx       # Song library with search
│   │   ├── PlannerPage.tsx       # Service planner with timeline
│   │   └── SettingsPage.tsx      # App settings
│   │
│   ├── types/                    # TypeScript definitions
│   │   ├── index.ts              # Core types (Song, Slide, Template, etc.)
│   │   └── service.ts            # Service planner types
│   │
│   ├── utils/                    # Utility functions
│   │   ├── localStorage.ts       # Browser storage wrapper
│   │   ├── parseChords.ts        # Chord parsing (future)
│   │   └── layouts.ts            # Layout utilities (future)
│   │
│   ├── App.tsx                   # Root component + routing
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind imports
│
├── electron/                     # Desktop application (optional)
│   ├── database/
│   │   ├── db.ts                 # SQLite initialization
│   │   ├── songService.ts        # Song database operations
│   │   ├── templateService.ts    # Template database operations
│   │   └── schema.sql            # Database schema DDL
│   ├── main.ts                   # Electron main process
│   ├── preload.ts                # IPC bridge (secure)
│   └── types.ts                  # Electron-specific types
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md           # This file
│   ├── DICTIONARY.md             # Data dictionary
│   ├── PLAN.md                   # Development roadmap
│   └── credentials.json          # API keys (gitignored)
│
├── public/                       # Static assets
│   └── icon.ico                  # Application icon
│
├── tests/                        # Test files
│   └── setup.ts                  # Test configuration
│
├── dist/                         # Vite build output
├── dist-electron/                # Electron build output
├── node_modules/                 # Dependencies
│
├── .eslintrc.cjs                 # ESLint configuration
├── .prettierrc                   # Prettier configuration
├── .gitignore                    # Git ignore rules
│
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript config (web)
├── tsconfig.electron.json        # TypeScript config (Electron)
├── vite.config.ts                # Vite configuration
├── tailwind.config.js            # Tailwind configuration
├── postcss.config.js             # PostCSS configuration
├── vitest.config.ts              # Test configuration
│
└── README.md                     # Project documentation
```

---

## 2. API & DATA FLOW

### 2.1 React Query Hook Pattern

```typescript
// Hook Definition (src/hooks/useSongs.ts)
export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const electron = getElectron();
      return electron.database.getSongs();
    },
  });
}

// Component Usage
function LibraryPage() {
  const { data: songs, isLoading, error } = useSongs();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  
  return <SongList songs={songs} />;
}
```

### 2.2 Storage Abstraction

```typescript
// src/hooks/useMockElectron.ts

const getElectron = () => {
  if (typeof window !== 'undefined' && window.electron) {
    // Desktop: Real Electron API → SQLite
    console.log('✅ Using Electron API');
    return window.electron;
  } else {
    // Web: Mock API → localStorage
    console.log('💾 Using localStorage');
    return mockElectronAPI;
  }
};

// Mock API Implementation (Web Mode)
export const mockElectronAPI = {
  database: {
    getSongs: async () => {
      const songs = storage.getAllSongs();  // localStorage
      return Promise.resolve(songs);
    },
    
    createSong: async (input) => {
      const newSong = { ...input, id: uuidv4(), ... };
      storage.saveSong(newSong);  // localStorage
      return Promise.resolve(newSong);
    },
    
    // ... more methods
  },
};
```

### 2.3 localStorage Wrapper

```typescript
// src/utils/localStorage.ts

const KEYS = {
  SONGS: 'churchSlides_songs',
  SERVICES: 'churchSlides_services',
  SETTINGS: 'churchSlides_settings',
};

export function getAllSongs(): Song[] {
  const data = localStorage.getItem(KEYS.SONGS);
  return data ? JSON.parse(data) : [];
}

export function saveSong(song: Song): void {
  const songs = getAllSongs();
  const index = songs.findIndex(s => s.id === song.id);
  
  if (index >= 0) {
    songs[index] = song;  // Update
  } else {
    songs.push(song);     // Create
  }
  
  localStorage.setItem(KEYS.SONGS, JSON.stringify(songs));
}

// Export/Import for backup
export function exportData(): string {
  return JSON.stringify({
    songs: getAllSongs(),
    services: getAllServices(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  }, null, 2);
}
```

### 2.4 Electron IPC (Desktop Mode)

```typescript
// electron/main.ts - IPC Handlers

ipcMain.handle('db:getSongs', async () => {
  return SongService.getAllSongs();
});

ipcMain.handle('db:createSong', async (_event, song) => {
  return SongService.createSong(song);
});

ipcMain.handle('db:updateSong', async (_event, id, data) => {
  return SongService.updateSong(id, data);
});

ipcMain.handle('db:deleteSong', async (_event, id) => {
  SongService.deleteSong(id);
});

// electron/preload.ts - Secure Bridge

contextBridge.exposeInMainWorld('electron', {
  database: {
    getSongs: () => ipcRenderer.invoke('db:getSongs'),
    createSong: (song) => ipcRenderer.invoke('db:createSong', song),
    updateSong: (id, data) => ipcRenderer.invoke('db:updateSong', id, data),
    deleteSong: (id) => ipcRenderer.invoke('db:deleteSong', id),
  },
});
```

---

## 3. COMPONENT PATTERNS

### 3.1 Page Component

```typescript
// src/pages/LibraryPage.tsx

export function LibraryPage() {
  // Data fetching
  const { data: songs, isLoading } = useSongs();
  const createSong = useCreateSong();
  
  // Local state
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Derived state
  const filteredSongs = useMemo(
    () => songs?.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [songs, searchQuery]
  );
  
  // Event handlers
  const handleAddSong = () => setShowModal(true);
  const handleSave = (data) => {
    createSong.mutate(data);
    setShowModal(false);
  };
  
  return (
    <div className="page-container">
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <SongList songs={filteredSongs} />
      <AddButton onClick={handleAddSong} />
      {showModal && <SongFormModal onSave={handleSave} onClose={() => setShowModal(false)} />}
    </div>
  );
}
```

### 3.2 Modal Component

```typescript
// src/components/songs/SongFormModal.tsx

interface Props {
  song?: Song;  // Undefined = create, defined = edit
  onSave: (data: CreateSongInput) => void;
  onClose: () => void;
}

export function SongFormModal({ song, onSave, onClose }: Props) {
  const [formData, setFormData] = useState({
    title: song?.title || '',
    lyrics: song?.lyrics || '',
    // ... more fields
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
        <input 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="..."
        />
        {/* More fields */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
```

### 3.3 List Component

```typescript
// src/components/songs/SongList.tsx

interface Props {
  songs: Song[];
  onSelect?: (song: Song) => void;
}

export function SongList({ songs, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {songs.map(song => (
        <SongCard 
          key={song.id} 
          song={song} 
          onClick={() => onSelect?.(song)} 
        />
      ))}
    </div>
  );
}
```

---

## 4. DESIGN SYSTEM IMPLEMENTATION

### 4.1 Background Data Structure

```typescript
// src/assets/backgrounds.ts

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;  // Unsplash URL
  category: 'mountains' | 'water' | 'nature' | 'sky' | 'abstract' | 'light';
  textColor: 'light' | 'dark';  // Which text color works best
  mood: 'peaceful' | 'powerful' | 'joyful' | 'reflective';
}

export const WORSHIP_BACKGROUNDS: BackgroundImage[] = [
  {
    id: 'mountain-1',
    name: 'Mountain Lake Reflection',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
  },
  // ... 23 more
];
```

### 4.2 Background Pack System

```typescript
// src/assets/backgroundPacks.ts

export interface BackgroundPack {
  id: string;
  name: string;
  description: string;
  backgrounds: BackgroundImage[];
  textColor: 'light' | 'dark';
  mood: string;
}

export const BACKGROUND_PACKS: BackgroundPack[] = [
  {
    id: 'mountains',
    name: '🏔️ Mountains',
    description: '4 majestic mountain peaks',
    textColor: 'light',
    mood: 'powerful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'mountains'),
  },
  // ... 6 more packs
];

// Rotation Algorithm
export function assignBackgroundsFromPack(
  pack: BackgroundPack,
  slideCount: number
): string[] {
  return Array(slideCount)
    .fill(0)
    .map((_, i) => pack.backgrounds[i % pack.backgrounds.length].id);
}
```

### 4.3 Quick Look System

```typescript
// src/assets/quickLooks.ts

export interface QuickLook {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundPack: BackgroundPack;
  layoutStyle: 'varied' | 'minimal' | 'bold' | 'split' | 'modern';
  recommendedFor: string[];
  preview: string;
}

export const QUICK_LOOKS: QuickLook[] = [
  {
    id: 'mountain-powerful',
    name: 'Mountain Majesty',
    description: 'Bold text on majestic mountains',
    icon: '🏔️',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'mountains')!,
    layoutStyle: 'bold',
    recommendedFor: ['Powerful worship', 'Victory songs'],
    preview: 'Bold, centered text with mountain imagery',
  },
  // ... 6 more
];

// Layout Assignment Algorithm
export function getLayoutsForStyle(
  style: QuickLook['layoutStyle'], 
  count: number
): LayoutType[] {
  const layouts: LayoutType[] = [];
  
  switch (style) {
    case 'bold':
      for (let i = 0; i < count; i++) {
        layouts.push(i % 2 === 0 ? 'full-bleed' : 'gradient-overlay');
      }
      break;
    // ... more cases
  }
  
  return layouts;
}
```

### 4.4 Layout Types

```typescript
// src/types/index.ts

export type LayoutType =
  | 'full-bleed'        // Text fills entire screen
  | 'gradient-overlay'  // Dark gradient for readability
  | 'centered-mask'     // Circular vignette
  | 'split-dark-light'  // 50/50 text/image split
  | 'split-light-dark'  // Reverse split
  | 'modern-asymmetric' // Off-center text
  | 'frame-border';     // Text in bordered frame
```

---

## 5. ALGORITHMS

### 5.1 Lyrics Parsing

```typescript
// Splits lyrics into slides

export function parseLyrics(lyrics: string): string[] {
  return lyrics
    .split(/\n\n+/)              // Split by blank lines
    .map(section => section.trim())
    .filter(section => section.length > 0);
}

// Example:
// Input:
// "Amazing grace how sweet the sound\n\n
//  That saved a wretch like me"
// 
// Output:
// ["Amazing grace how sweet the sound", "That saved a wretch like me"]
```

### 5.2 Slide Generation

```typescript
// Generates complete slides with backgrounds & layouts

export function generateSlides(
  lyrics: string,
  backgroundPack: BackgroundPack,
  layoutStyle: string
): Slide[] {
  // 1. Parse lyrics into sections
  const sections = parseLyrics(lyrics);
  
  // 2. Assign backgrounds (rotating through pack)
  const backgroundIds = assignBackgroundsFromPack(backgroundPack, sections.length);
  
  // 3. Assign layouts based on style
  const layouts = getLayoutsForStyle(layoutStyle, sections.length);
  
  // 4. Combine into slides
  return sections.map((content, i) => ({
    id: `slide-${i}`,
    content,
    order: i,
    backgroundId: backgroundIds[i],
    layout: layouts[i],
  }));
}
```

### 5.3 Search & Filter

```typescript
// Fuzzy search implementation

export function searchSongs(
  songs: Song[],
  query: string
): Song[] {
  const lowerQuery = query.toLowerCase();
  
  return songs.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist?.toLowerCase().includes(lowerQuery) ||
    song.lyrics.toLowerCase().includes(lowerQuery)
  );
}

// Filter by metadata
export function filterSongs(
  songs: Song[],
  filters: {
    key?: string;
    tempo?: string;
    hasCCLI?: boolean;
  }
): Song[] {
  return songs.filter(song => {
    if (filters.key && song.key !== filters.key) return false;
    if (filters.tempo && song.tempo !== filters.tempo) return false;
    if (filters.hasCCLI && !song.ccliNumber) return false;
    return true;
  });
}
```

---

## 6. PERFORMANCE OPTIMIZATIONS

### 6.1 React Query Caching

```typescript
// Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 minutes
      cacheTime: 10 * 60 * 1000,     // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### 6.2 Memoization

```typescript
// Expensive computation memoization

const filteredAndSortedSongs = useMemo(() => {
  let result = songs || [];
  
  // Filter
  if (searchQuery) {
    result = searchSongs(result, searchQuery);
  }
  
  // Sort
  result = result.sort((a, b) => 
    a.title.localeCompare(b.title)
  );
  
  return result;
}, [songs, searchQuery]);
```

### 6.3 Virtual Scrolling (Future)

```typescript
// For large song lists (100+ items)

import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={3}
  columnWidth={300}
  height={600}
  rowCount={Math.ceil(songs.length / 3)}
  rowHeight={200}
  width={1000}
>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style}>
      <SongCard song={songs[rowIndex * 3 + columnIndex]} />
    </div>
  )}
</FixedSizeGrid>
```

---

## 7. TESTING STRATEGY

### 7.1 Unit Tests (Vitest)

```typescript
// utils/parseLyrics.test.ts

describe('parseLyrics', () => {
  it('splits lyrics by blank lines', () => {
    const input = 'Line 1\n\nLine 2\n\nLine 3';
    const result = parseLyrics(input);
    expect(result).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });
  
  it('filters empty sections', () => {
    const input = 'Line 1\n\n\n\nLine 2';
    const result = parseLyrics(input);
    expect(result).toEqual(['Line 1', 'Line 2']);
  });
});
```

### 7.2 Component Tests (Testing Library)

```typescript
// components/SongCard.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';

describe('SongCard', () => {
  const song: Song = {
    id: '1',
    title: 'Amazing Grace',
    artist: 'John Newton',
    // ... more fields
  };
  
  it('renders song title', () => {
    render(<SongCard song={song} />);
    expect(screen.getByText('Amazing Grace')).toBeInTheDocument();
  });
  
  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<SongCard song={song} onClick={handleClick} />);
    fireEvent.click(screen.getByText('Amazing Grace'));
    expect(handleClick).toHaveBeenCalledWith(song);
  });
});
```

### 7.3 Integration Tests (Future)

```typescript
// E2E test with Playwright

test('create and present song', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Navigate to library
  await page.click('text=Library');
  
  // Add new song
  await page.click('text=Add New Song');
  await page.fill('[name="title"]', 'Test Song');
  await page.fill('[name="lyrics"]', 'Verse 1\n\nVerse 2');
  await page.click('text=Generate Slides');
  
  // Verify song appears
  await expect(page.locator('text=Test Song')).toBeVisible();
  
  // Present song
  await page.click('text=Test Song');
  await page.click('text=Present');
  await expect(page.locator('text=Verse 1')).toBeVisible();
});
```

---

## 8. BUILD & DEPLOYMENT

### 8.1 Development

```bash
# Start Vite dev server (web mode)
npm run dev
# → http://localhost:5173

# Start Electron (desktop mode)
npm run build:electron  # Build once
npm run dev:electron    # Run Electron
```

### 8.2 Production Build (Web)

```bash
# Build for production
npm run build

# Output: dist/
# ├── index.html
# ├── assets/
# │   ├── index-[hash].js   # Main bundle
# │   ├── index-[hash].css  # Styles
# │   └── [images]

# Deploy to hosting
# Netlify: drag dist/ folder
# Vercel: `vercel deploy`
# GitHub Pages: push dist/ to gh-pages branch
```

### 8.3 Desktop Build (Future)

```bash
# Build Electron app
npm run build
npm run build:electron
npx electron-builder

# Output: release/
# ├── The Path Setup 1.0.0.exe  # Windows installer
# ├── The Path-1.0.0.dmg         # macOS disk image
# └── The Path-1.0.0.AppImage    # Linux app image
```

---

## 9. ENVIRONMENT VARIABLES

```bash
# .env (web mode)
VITE_API_URL=http://localhost:3000  # Future backend
VITE_ENV=development

# .env.production
VITE_ENV=production
```

---

## 10. DEBUGGING

### 10.1 Browser DevTools

```typescript
// Enable React Query Devtools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### 10.2 Console Logging

```typescript
// Storage detection
console.log('🔧 Using storage:', window.electron ? 'SQLite' : 'localStorage');

// Query logging
console.log('💾 localStorage: Created song:', newSong.title);
console.log('📦 MOCK: Getting songs:', songs.length);
```

### 10.3 Electron DevTools

```typescript
// electron/main.ts
if (process.env.NODE_ENV === 'development') {
  mainWindow.webContents.openDevTools();
}
```

---

**End of Technical Architecture**

See ARCHITECTURE_DATA.md for database details.
See ARCHITECTURE_COMPONENTS.md for component flows.
