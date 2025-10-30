# The Path - System Architecture

**Last Updated**: October 28, 2025  
**Version**: 1.0 - Phase 1 MVP

---

## Overview

The Path is an Electron-based desktop application for church presentations, built with React, TypeScript, and SQLite. This document outlines architectural decisions, design patterns, and system structure.

---

## Technology Stack

### Core Framework
- **Electron**: Desktop application framework
- **React 18**: UI library with hooks
- **TypeScript**: Strict typing throughout
- **Vite**: Fast build tool and dev server

### UI & Styling
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library (built on Radix UI)
- **Lucide React**: Icon library
- **Framer Motion**: Animation library for transitions

### State Management
- **Zustand**: Lightweight state management
- **React Query (TanStack Query)**: Server state management (for DB operations)

### Database
- **SQLite**: Local database via better-sqlite3
- **better-sqlite3**: Fast, synchronous SQLite bindings

### Testing
- **Vitest**: Unit test framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing (Phase 2+)

### Code Quality
- **ESLint**: Linting with TypeScript rules
- **Prettier**: Code formatting
- **TypeScript Strict Mode**: No implicit any

---

## Project Structure

```
church-slides-app/
├── electron/                    # Electron main process
│   ├── main.ts                 # Main entry point
│   ├── preload.ts              # IPC bridge (context isolation)
│   ├── windows/                # Window management
│   │   ├── mainWindow.ts
│   │   └── presentationWindow.ts
│   └── database/
│       ├── schema.sql          # Database schema
│       ├── migrations/         # Migration scripts
│       └── db.ts               # Database initialization
│
├── src/                        # React application
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # Root component
│   │
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   │   ├── AppShell.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── TopBar.tsx
│   │   ├── library/          # Song library components
│   │   │   ├── SongList.tsx
│   │   │   ├── SongForm.tsx
│   │   │   └── SongCard.tsx
│   │   ├── editor/           # Lyrics & slide editing
│   │   │   ├── LyricsEditor.tsx
│   │   │   ├── SlidePreview.tsx
│   │   │   └── TemplateSelector.tsx
│   │   ├── presentation/     # Presentation mode
│   │   │   ├── ControlWindow.tsx
│   │   │   ├── PresentationOutput.tsx
│   │   │   └── SlideRenderer.tsx
│   │   └── planner/          # Service planning
│   │       ├── ServiceList.tsx
│   │       ├── ServiceBuilder.tsx
│   │       └── ServiceItem.tsx
│   │
│   ├── services/             # Business logic layer
│   │   ├── database/
│   │   │   ├── songService.ts
│   │   │   ├── announcementService.ts
│   │   │   ├── serviceService.ts
│   │   │   └── settingsService.ts
│   │   ├── lyrics/
│   │   │   └── lyricsParser.ts
│   │   ├── presentation/
│   │   │   └── presentationManager.ts
│   │   └── templates/
│   │       └── templateEngine.ts
│   │
│   ├── store/                # Zustand stores
│   │   ├── appStore.ts       # Global app state
│   │   ├── presentationStore.ts
│   │   └── libraryStore.ts
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useDatabase.ts
│   │   ├── useKeyboard.ts
│   │   └── usePresentation.ts
│   │
│   ├── types/                # TypeScript definitions
│   │   ├── index.ts          # Main type exports
│   │   ├── database.ts
│   │   ├── song.ts
│   │   └── presentation.ts
│   │
│   ├── utils/                # Helper functions
│   │   ├── validators.ts
│   │   ├── formatters.ts
│   │   └── constants.ts
│   │
│   └── styles/               # Global styles
│       ├── globals.css
│       └── themes.css
│
├── tests/                    # Test files
│   ├── unit/
│   ├── integration/
│   └── simulations/
│
├── docs/                     # Documentation
│   ├── credentials.json      # API keys (gitignored)
│   ├── BRANDING.md
│   └── DICTIONARY.md
│
├── public/                   # Static assets
│   └── templates/           # Pre-built design templates
│
├── dist/                    # Build output (gitignored)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── PLAN.md
├── SYSTEM.md
└── README.md
```

---

## Architecture Patterns

### 1. Electron IPC Communication

**Pattern**: Secure context isolation with preload script

```typescript
// electron/preload.ts - Expose safe APIs
contextBridge.exposeInMainWorld('electron', {
  database: {
    getSongs: () => ipcRenderer.invoke('db:getSongs'),
    createSong: (song) => ipcRenderer.invoke('db:createSong', song)
  },
  presentation: {
    start: () => ipcRenderer.invoke('presentation:start'),
    navigate: (direction) => ipcRenderer.invoke('presentation:navigate', direction)
  }
});

// src/services/database/songService.ts - Use in React
const songs = await window.electron.database.getSongs();
```

**Why**: Security - prevents direct Node.js access from renderer process

### 2. Database Service Layer

**Pattern**: Service objects wrapping database operations

```typescript
// Services handle all database logic
class SongService {
  async getAllSongs(): Promise<Song[]>
  async getSongById(id: string): Promise<Song | null>
  async createSong(data: CreateSongInput): Promise<Song>
  async updateSong(id: string, data: UpdateSongInput): Promise<Song>
  async deleteSong(id: string): Promise<void>
}
```

**Why**: 
- Centralized database logic
- Easy to test
- Type-safe operations
- Error handling in one place

### 3. State Management Strategy

**Zustand for UI State**:
```typescript
// Global app state (theme, settings, navigation)
const useAppStore = create((set) => ({
  theme: 'dark',
  currentRoute: 'library',
  setTheme: (theme) => set({ theme }),
  navigate: (route) => set({ currentRoute: route })
}));
```

**React Query for Server State**:
```typescript
// Database operations (songs, services)
const { data: songs } = useQuery({
  queryKey: ['songs'],
  queryFn: () => songService.getAllSongs()
});
```

**Why**: 
- Zustand: Simple, no boilerplate for UI state
- React Query: Automatic caching, refetching for data

### 4. Component Architecture

**Pattern**: Smart/Dumb component separation

- **Smart Components** (containers): Handle logic, state, data fetching
- **Dumb Components** (presentational): Receive props, render UI

```typescript
// Smart: SongListContainer.tsx
export function SongListContainer() {
  const { data: songs } = useSongs();
  const handleDelete = useSongDelete();
  
  return <SongList songs={songs} onDelete={handleDelete} />;
}

// Dumb: SongList.tsx
export function SongList({ songs, onDelete }: SongListProps) {
  return <div>{songs.map(song => <SongCard key={song.id} />)}</div>;
}
```

### 5. Error Handling Strategy

**Multi-layer approach**:

1. **Database Layer**: Wrap operations in try-catch, log errors
2. **Service Layer**: Validate inputs, throw typed errors
3. **UI Layer**: Error boundaries, toast notifications

```typescript
// Service layer
class SongService {
  async createSong(data: CreateSongInput): Promise<Song> {
    try {
      // Validation
      if (!data.title) throw new ValidationError('Title required');
      
      // Database operation
      const song = await db.insertSong(data);
      return song;
    } catch (error) {
      logger.error('Failed to create song', error);
      throw new DatabaseError('Could not save song', error);
    }
  }
}

// UI layer
function SongForm() {
  const createSong = useSongCreate();
  
  const handleSubmit = async (data) => {
    try {
      await createSong(data);
      toast.success('Song created!');
    } catch (error) {
      toast.error(error.message);
    }
  };
}
```

---

## Data Flow

### Creating a Song
1. User fills form in `SongForm.tsx`
2. Component calls `useSongCreate()` hook
3. Hook invokes `songService.createSong()`
4. Service validates and calls IPC bridge
5. Electron main process writes to SQLite
6. Result returned through IPC
7. React Query invalidates cache
8. UI automatically re-renders with new data

### Running a Presentation
1. User clicks "Start Presentation" in `ServiceBuilder`
2. Component calls `presentationManager.start(serviceId)`
3. Manager opens new `presentationWindow`
4. Manager loads service items from database
5. Control window subscribes to presentation state
6. User navigates with keyboard
7. IPC events sync state between windows
8. Slides render in presentation window

---

## Design Decisions

### Why Electron?
- True desktop app with native OS integration
- Access to file system for media storage
- Multi-window support for dual displays
- Mature ecosystem

### Why SQLite?
- No server setup required
- Fast local operations
- Portable database file
- Perfect for single-user desktop app

### Why Zustand over Redux?
- Simpler API, less boilerplate
- Built-in TypeScript support
- No context providers needed
- Perfect for small to medium apps

### Why React Query?
- Eliminates manual cache management
- Automatic background refetching
- Built-in loading/error states
- Perfect for database operations

### Why better-sqlite3?
- Synchronous API (simpler than async)
- Excellent performance
- Well-maintained
- Works great in Electron

---

## Performance Considerations

### Database
- Create indexes on frequently queried columns (title, created_at)
- Use prepared statements for repeated queries
- Keep database file on SSD for fast access
- Vacuum database periodically

### Rendering
- Virtualize long lists (react-window)
- Memoize expensive computations (useMemo)
- Debounce search inputs
- Lazy load images

### Presentation Mode
- Preload next slide for instant transitions
- Use CSS transforms for 60fps animations
- GPU acceleration for slide rendering
- Minimize JavaScript during transitions

---

## Security Considerations

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Sandbox enabled for renderer processes
- Content security policy configured

### API Keys
- Store in credentials.json (gitignored)
- Never expose in renderer process
- Load in main process only
- Encrypt before storing locally (Phase 2)

### Input Validation
- Validate all user inputs
- Sanitize HTML content
- Prevent SQL injection (use parameterized queries)
- Limit file upload sizes

---

## Testing Strategy

### Unit Tests
- Test services in isolation
- Mock database operations
- Test utility functions
- Test hooks with @testing-library/react-hooks

### Integration Tests
- Test complete workflows
- Use in-memory SQLite database
- Test IPC communication
- Test state management integration

### User Simulations
- Automated scripts simulating real usage
- Create song → Edit → Present → Delete
- Create service → Add songs → Run presentation
- Test error scenarios

---

## Build & Deployment

### Development
```bash
npm run dev        # Start dev server with hot reload
npm run test       # Run tests
npm run lint       # Check code quality
```

### Production Build
```bash
npm run build      # Build for current platform
npm run build:win  # Build for Windows
npm run build:mac  # Build for macOS
npm run build:all  # Build for all platforms
```

### Distribution (Phase 4)
- Code signing for Windows/macOS
- Auto-update with electron-updater
- Crash reporting with Sentry
- Analytics with privacy-first approach

---

## Future Architecture Considerations

### Phase 2 (AI Integration)
- Add AI service layer with OpenAI/Anthropic clients
- Implement request queuing for rate limiting
- Cache AI responses to reduce costs
- Fallback to non-AI features if APIs unavailable

### Phase 3 (Advanced Features)
- Video playback engine (HTML5 video)
- Rich text editor (TipTap or Slate)
- Bible API integration (Bible.org or ESV API)
- Cloud sync (optional, via Firebase or custom API)

### Phase 4 (Distribution)
- Auto-update mechanism
- Telemetry (optional, opt-in)
- Plugin system for extensibility
- Multi-language support (i18n)

---

## Maintenance

### Code Quality
- Run linter before commits (husky pre-commit hook)
- Enforce TypeScript strict mode
- Keep dependencies updated (renovate bot)
- Regular code reviews

### Database Migrations
- Version database schema
- Write migration scripts for updates
- Test migrations on copy before production
- Backup database before migrations

### Documentation
- Update SYSTEM.md when architecture changes
- Document all public APIs
- Keep DICTIONARY.md in sync with schema
- Write ADRs (Architecture Decision Records) for major changes

---

**Next**: See PLAN.md for implementation roadmap
