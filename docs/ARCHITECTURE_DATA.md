# 📊 DATA ARCHITECTURE

**Database Schema & Data Models**

---

## 1. DATA MODELS

### 1.1 Song Entity

```typescript
interface Song {
  id: string;              // UUID v4
  title: string;           // Song title (required)
  artist?: string;         // Artist/composer (optional)
  ccliNumber?: string;     // CCLI license number (optional)
  key?: string;            // Musical key: C, D, Eb, F, G, A, Bb (optional)
  tempo?: string;          // Fast, Medium, Slow (optional)
  lyrics: string;          // Full lyrics text (required)
  slides: Slide[];         // Generated slides array (required)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Example
{
  id: "550e8400-e29b-41d4-a716-446655440000",
  title: "Amazing Grace",
  artist: "John Newton",
  ccliNumber: "22025",
  key: "G",
  tempo: "Medium",
  lyrics: "Amazing grace how sweet the sound\n\nThat saved a wretch like me",
  slides: [
    {
      id: "slide-0",
      content: "Amazing grace how sweet the sound",
      order: 0,
      backgroundId: "mountain-1",
      layout: "full-bleed"
    },
    {
      id: "slide-1",
      content: "That saved a wretch like me",
      order: 1,
      backgroundId: "mountain-2",
      layout: "gradient-overlay"
    }
  ],
  createdAt: "2025-10-28T10:00:00.000Z",
  updatedAt: "2025-10-28T10:00:00.000Z"
}
```

### 1.2 Slide Entity (Sub-object)

```typescript
interface Slide {
  id: string;              // Unique slide identifier
  content: string;         // Slide text content
  order: number;           // Display order (0-indexed)
  backgroundId?: string;   // Reference to background image
  layout?: LayoutType;     // Layout style
}

type LayoutType =
  | 'full-bleed'        // Text fills entire screen
  | 'gradient-overlay'  // Dark gradient for readability
  | 'centered-mask'     // Circular vignette
  | 'split-dark-light'  // 50/50 text/image split
  | 'split-light-dark'  // Reverse split
  | 'modern-asymmetric' // Off-center text
  | 'frame-border';     // Text in bordered frame
```

### 1.3 Service Entity

```typescript
interface Service {
  id: string;              // UUID v4
  name: string;            // Service name (required)
  date: string;            // Date YYYY-MM-DD (required)
  churchName?: string;     // Church name (optional)
  churchLogo?: string;     // Logo URL or data URI (optional)
  items: ServiceItem[];    // Service items array (required)
  defaultBackgroundId?: string;  // Default background (optional)
  theme?: 'light' | 'dark';      // Theme (optional)
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Example
{
  id: "660e8400-e29b-41d4-a716-446655440001",
  name: "Sunday Morning Service",
  date: "2025-11-03",
  churchName: "The Path Church",
  items: [
    { type: "welcome", title: "Welcome", order: 0, duration: 2 },
    { type: "song", songId: "550e8400...", songTitle: "Amazing Grace", order: 1, duration: 5 },
    { type: "scripture", reference: "John 3:16", order: 2, duration: 2 },
    { type: "sermon", title: "Walking in Faith", order: 3, duration: 30 }
  ],
  createdAt: "2025-10-28T10:00:00.000Z",
  updatedAt: "2025-10-28T10:00:00.000Z"
}
```

### 1.4 ServiceItem Entity (Sub-object)

```typescript
interface ServiceItem {
  id: string;                    // UUID v4
  type: ServiceItemType;         // Item type (required)
  order: number;                 // Display order (required)
  duration?: number;             // Estimated minutes (optional)
  
  // Song-specific fields
  songId?: string;               // Reference to Song.id
  songTitle?: string;            // Cached song title
  
  // Scripture-specific fields
  scriptureReference?: string;   // e.g., "John 3:16-17"
  scriptureText?: string;        // Verse text
  scriptureVersion?: string;     // e.g., "NIV", "ESV", "KJV"
  
  // Generic fields (for all other types)
  title?: string;                // Item title
  content?: string;              // Item content/body
  backgroundId?: string;         // Background image reference
  textColor?: 'light' | 'dark';  // Text color
  notes?: string;                // Presenter notes (private)
  skipInPresentation?: boolean;  // Skip when presenting
}

type ServiceItemType =
  | 'song'           // Worship song
  | 'scripture'      // Bible verse/passage
  | 'welcome'        // Welcome/logo slide
  | 'announcement'   // Announcement slide
  | 'sermon'         // Sermon title slide
  | 'offering'       // Offering slide
  | 'closing'        // Closing/thank you slide
  | 'blank'          // Blank/transition slide
  | 'custom';        // Custom text slide
```

### 1.5 BackgroundImage Entity (Static Data)

```typescript
interface BackgroundImage {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  url: string;                   // Image URL (Unsplash)
  category: BackgroundCategory;  // Category
  textColor: 'light' | 'dark';   // Best text color
  mood: BackgroundMood;          // Emotional tone
}

type BackgroundCategory =
  | 'mountains'
  | 'water'
  | 'nature'
  | 'sky'
  | 'abstract'
  | 'light';

type BackgroundMood =
  | 'peaceful'
  | 'powerful'
  | 'joyful'
  | 'reflective';

// Example
{
  id: "mountain-1",
  name: "Mountain Lake Reflection",
  url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
  category: "mountains",
  textColor: "light",
  mood: "powerful"
}
```

### 1.6 DesignTemplate Entity (Future)

```typescript
interface DesignTemplate {
  id: string;                    // UUID v4
  name: string;                  // Template name
  isAiGenerated: boolean;        // Generated by AI?
  templateData: TemplateData;    // Style configuration
  createdAt: string;             // ISO 8601 timestamp
}

interface TemplateData {
  backgroundColor?: string;       // Hex color
  backgroundGradient?: string;   // CSS gradient
  backgroundImage?: string;      // Image URL
  textColor: string;             // Hex color
  textShadow?: string;           // CSS text-shadow
  fontFamily: string;            // Font name
  fontSize: string;              // CSS font-size
  textAlign: 'left' | 'center' | 'right';
  overlayOpacity: number;        // 0-1
}
```

---

## 2. DATABASE SCHEMA (SQLite)

### 2.1 Songs Table

```sql
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  ccli_number TEXT,
  key TEXT,
  tempo TEXT,
  lyrics TEXT NOT NULL,
  slides TEXT NOT NULL,          -- JSON array of Slide objects
  created_at TEXT NOT NULL,      -- ISO 8601 timestamp
  updated_at TEXT NOT NULL       -- ISO 8601 timestamp
);

-- Indexes for performance
CREATE INDEX idx_songs_title ON songs(title);
CREATE INDEX idx_songs_artist ON songs(artist);
CREATE INDEX idx_songs_created_at ON songs(created_at DESC);

-- Full-text search (future)
CREATE VIRTUAL TABLE songs_fts USING fts5(
  title,
  artist,
  lyrics,
  content=songs,
  content_rowid=rowid
);
```

### 2.2 Services Table

```sql
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT NOT NULL,            -- YYYY-MM-DD format
  church_name TEXT,
  church_logo TEXT,
  items TEXT NOT NULL,           -- JSON array of ServiceItem objects
  default_background_id TEXT,
  theme TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes
CREATE INDEX idx_services_date ON services(date DESC);
CREATE INDEX idx_services_name ON services(name);
```

### 2.3 Design Templates Table

```sql
CREATE TABLE IF NOT EXISTS design_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  is_ai_generated INTEGER DEFAULT 0,  -- 0 = false, 1 = true
  template_data TEXT NOT NULL,        -- JSON object
  created_at TEXT NOT NULL
);

CREATE INDEX idx_templates_name ON design_templates(name);
```

### 2.4 Settings Table (Key-Value Store)

```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,           -- JSON value
  updated_at TEXT NOT NULL
);

-- Common settings:
-- 'churchName': string
-- 'churchLogo': string
-- 'defaultBackground': string (backgroundId)
-- 'defaultTextColor': 'light' | 'dark'
-- 'presentationDisplay': number (monitor index)
```

---

## 3. LOCALSTORAGE SCHEMA (Web Mode)

### 3.1 Storage Keys

```typescript
const STORAGE_KEYS = {
  SONGS: 'churchSlides_songs',
  SERVICES: 'churchSlides_services',
  SETTINGS: 'churchSlides_settings',
} as const;
```

### 3.2 Data Format

```typescript
// localStorage.getItem('churchSlides_songs')
[
  {
    id: "550e8400-...",
    title: "Amazing Grace",
    // ... full Song object
  },
  {
    id: "660e8400-...",
    title: "How Great Thou Art",
    // ... full Song object
  }
]

// localStorage.getItem('churchSlides_services')
[
  {
    id: "770e8400-...",
    name: "Sunday Morning",
    date: "2025-11-03",
    items: [...]
  }
]

// localStorage.getItem('churchSlides_settings')
{
  churchName: "The Path Church",
  churchLogo: "data:image/png;base64,...",
  defaultBackground: "mountain-1",
  defaultTextColor: "light"
}
```

### 3.3 Size Limits

- **localStorage**: ~5-10MB per origin
- **Song average size**: ~10KB (with 10 slides)
- **Estimated capacity**: ~500-1000 songs
- **Service average size**: ~5KB
- **Estimated capacity**: ~1000-2000 services

---

## 4. DATA RELATIONSHIPS

### 4.1 Entity Relationship Diagram

```
┌──────────────┐
│    Song      │
│──────────────│
│ id (PK)      │
│ title        │
│ artist       │
│ lyrics       │
│ slides[]     │
└──────┬───────┘
       │
       │ Referenced by
       │
       ▼
┌──────────────┐       Contains        ┌──────────────┐
│  Service     │◄──────────────────────│ ServiceItem  │
│──────────────│                       │──────────────│
│ id (PK)      │                       │ id           │
│ name         │                       │ type         │
│ date         │                       │ songId (FK)  │
│ items[]      │                       │ order        │
└──────┬───────┘                       └──────────────┘
       │
       │ Uses
       │
       ▼
┌──────────────────┐
│ BackgroundImage  │ (Static data, not stored in DB)
│──────────────────│
│ id               │
│ url              │
│ category         │
└──────────────────┘
```

### 4.2 Relationships

**Song → ServiceItem**
- **Type**: One-to-Many
- **Cardinality**: One song can be used in multiple service items
- **Foreign Key**: `ServiceItem.songId` → `Song.id`
- **Cascade**: Delete song → Warn user about services using it

**Service → ServiceItem**
- **Type**: One-to-Many (Embedded)
- **Cardinality**: One service contains multiple items
- **Storage**: Items stored as JSON array in Service
- **Cascade**: Delete service → Delete all items

**ServiceItem → BackgroundImage**
- **Type**: Many-to-One (Reference)
- **Cardinality**: Many items can use same background
- **Foreign Key**: `ServiceItem.backgroundId` → `BackgroundImage.id`
- **Cascade**: No cascade (backgrounds are static)

**Slide → BackgroundImage**
- **Type**: Many-to-One (Reference)
- **Cardinality**: Many slides can use same background
- **Foreign Key**: `Slide.backgroundId` → `BackgroundImage.id`
- **Cascade**: No cascade (backgrounds are static)

---

## 5. DATA VALIDATION

### 5.1 Song Validation

```typescript
const songSchema = {
  title: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  artist: {
    type: 'string',
    required: false,
    maxLength: 100,
  },
  ccliNumber: {
    type: 'string',
    required: false,
    pattern: /^\d{5,7}$/,  // 5-7 digits
  },
  key: {
    type: 'string',
    required: false,
    enum: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
  },
  tempo: {
    type: 'string',
    required: false,
    enum: ['Slow', 'Medium', 'Fast'],
  },
  lyrics: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 50000,
  },
  slides: {
    type: 'array',
    required: true,
    minItems: 1,
    maxItems: 100,
  },
};
```

### 5.2 Service Validation

```typescript
const serviceSchema = {
  name: {
    type: 'string',
    required: true,
    minLength: 1,
    maxLength: 200,
  },
  date: {
    type: 'string',
    required: true,
    pattern: /^\d{4}-\d{2}-\d{2}$/,  // YYYY-MM-DD
  },
  items: {
    type: 'array',
    required: true,
    minItems: 0,
    maxItems: 100,
  },
};
```

---

## 6. DATA MIGRATION

### 6.1 Version History

```sql
CREATE TABLE IF NOT EXISTS schema_version (
  version INTEGER PRIMARY KEY,
  applied_at TEXT NOT NULL
);

INSERT INTO schema_version VALUES (1, datetime('now'));
```

### 6.2 Migration Scripts

```sql
-- Migration: v1 → v2 (Add tempo field)
ALTER TABLE songs ADD COLUMN tempo TEXT;

-- Migration: v2 → v3 (Add full-text search)
CREATE VIRTUAL TABLE songs_fts USING fts5(
  title, artist, lyrics, content=songs
);

-- Migration: v3 → v4 (Add service templates)
CREATE TABLE service_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  template_data TEXT NOT NULL
);
```

---

## 7. DATA IMPORT/EXPORT

### 7.1 Export Format (JSON)

```json
{
  "version": "1.0",
  "exportedAt": "2025-10-28T10:00:00.000Z",
  "data": {
    "songs": [
      {
        "id": "550e8400-...",
        "title": "Amazing Grace",
        // ... full song
      }
    ],
    "services": [
      {
        "id": "660e8400-...",
        "name": "Sunday Morning",
        // ... full service
      }
    ],
    "settings": {
      "churchName": "The Path Church",
      // ... all settings
    }
  }
}
```

### 7.2 Import Process

```typescript
async function importData(jsonString: string): Promise<void> {
  // 1. Parse JSON
  const data = JSON.parse(jsonString);
  
  // 2. Validate version
  if (data.version !== '1.0') {
    throw new Error('Unsupported export version');
  }
  
  // 3. Validate data structure
  // ... validation logic
  
  // 4. Import songs
  for (const song of data.data.songs) {
    await storage.saveSong(song);
  }
  
  // 5. Import services
  for (const service of data.data.services) {
    await storage.saveService(service);
  }
  
  // 6. Import settings
  await storage.saveSettings(data.data.settings);
  
  // 7. Reload app
  window.location.reload();
}
```

### 7.3 Backup Strategy

**Automatic Backups** (Future):
- Daily localStorage backup to IndexedDB
- Weekly export to downloadable JSON
- Cloud backup (optional paid feature)

**Manual Backups**:
- Export button in Settings
- Downloads JSON file
- User can save to Google Drive, Dropbox, etc.

---

## 8. DATA INTEGRITY

### 8.1 Referential Integrity

```typescript
// Check before deleting song
async function deleteSong(songId: string): Promise<void> {
  // 1. Check if song is used in any service
  const services = await storage.getAllServices();
  const usedIn = services.filter(s => 
    s.items.some(item => item.songId === songId)
  );
  
  if (usedIn.length > 0) {
    // 2. Warn user
    const confirm = window.confirm(
      `This song is used in ${usedIn.length} service(s). Delete anyway?`
    );
    if (!confirm) return;
  }
  
  // 3. Delete song
  await storage.deleteSong(songId);
  
  // 4. Clean up service references (optional)
  // Could remove service items or just leave songId reference
}
```

### 8.2 Data Consistency

```typescript
// Ensure slide order is sequential
function normalizeSlideOrder(slides: Slide[]): Slide[] {
  return slides
    .sort((a, b) => a.order - b.order)
    .map((slide, index) => ({ ...slide, order: index }));
}

// Ensure service item order is sequential
function normalizeItemOrder(items: ServiceItem[]): ServiceItem[] {
  return items
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));
}
```

### 8.3 Data Validation on Save

```typescript
function validateSong(song: Song): string[] {
  const errors: string[] = [];
  
  if (!song.title || song.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (!song.lyrics || song.lyrics.trim().length === 0) {
    errors.push('Lyrics are required');
  }
  
  if (!song.slides || song.slides.length === 0) {
    errors.push('At least one slide is required');
  }
  
  if (song.ccliNumber && !/^\d{5,7}$/.test(song.ccliNumber)) {
    errors.push('CCLI number must be 5-7 digits');
  }
  
  return errors;
}
```

---

## 9. QUERY PATTERNS

### 9.1 Common Queries

```typescript
// Get all songs sorted by title
const songs = getAllSongs()
  .sort((a, b) => a.title.localeCompare(b.title));

// Search songs by text
const results = getAllSongs()
  .filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.lyrics.toLowerCase().includes(query.toLowerCase())
  );

// Get songs by key
const songsInG = getAllSongs()
  .filter(s => s.key === 'G');

// Get recent songs
const recentSongs = getAllSongs()
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .slice(0, 10);

// Get services for date range
const servicesThisMonth = getAllServices()
  .filter(s => {
    const date = new Date(s.date);
    return date.getMonth() === new Date().getMonth();
  });
```

### 9.2 Aggregate Queries

```typescript
// Total song count
const totalSongs = getAllSongs().length;

// Songs by artist
const songsByArtist = getAllSongs()
  .reduce((acc, song) => {
    const artist = song.artist || 'Unknown';
    acc[artist] = (acc[artist] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

// Average slides per song
const avgSlides = getAllSongs()
  .reduce((sum, song) => sum + song.slides.length, 0) / totalSongs;

// Service statistics
const services = getAllServices();
const avgDuration = services.reduce((sum, s) => 
  sum + s.items.reduce((itemSum, item) => itemSum + (item.duration || 0), 0),
  0
) / services.length;
```

---

## 10. PERFORMANCE CONSIDERATIONS

### 10.1 Indexing Strategy

**SQLite**:
- Index on `songs.title` for sorting
- Index on `services.date` for calendar queries
- Full-text index on lyrics for search (future)

**localStorage**:
- All data loaded into memory
- Filter/sort in JavaScript
- Fast enough for <1000 items

### 10.2 Lazy Loading

```typescript
// Load only metadata, not full slides
interface SongMetadata {
  id: string;
  title: string;
  artist?: string;
  slideCount: number;
}

// Load full song on demand
async function getSongWithSlides(id: string): Promise<Song> {
  return storage.getSongById(id);
}
```

### 10.3 Caching Strategy

**React Query**:
- Cache songs for 5 minutes
- Background refetch on window focus
- Optimistic updates for creates/updates
- Automatic cache invalidation

---

**End of Data Architecture**

See ARCHITECTURE.md for system overview.
See ARCHITECTURE_COMPONENTS.md for component flows.
