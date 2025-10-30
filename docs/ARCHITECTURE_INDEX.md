# 📚 ARCHITECTURE DOCUMENTATION INDEX

**Complete System Architecture Reference**

---

## DOCUMENT STRUCTURE

This architecture is split into 4 focused documents:

### **1. ARCHITECTURE.md** - System Overview
- System purpose & capabilities
- High-level architecture
- Technology stack
- Design decisions & rationale
- Feature modules overview
- Performance targets
- Security considerations
- Deployment options
- Future roadmap

**Read this first** to understand the overall system.

---

### **2. ARCHITECTURE_TECHNICAL.md** - Implementation Details
- Complete file structure
- API & data flow patterns
- Component implementation
- Design system (backgrounds, packs, layouts)
- Algorithms (lyrics parsing, slide generation)
- Performance optimizations
- Testing strategy
- Build & deployment
- Debugging techniques

**Read this** for technical implementation details.

---

### **3. ARCHITECTURE_DATA.md** - Data Layer
- Complete data models (Song, Service, Slide, etc.)
- SQLite database schema
- localStorage schema
- Entity relationships
- Data validation rules
- Migration strategy
- Import/export formats
- Query patterns
- Performance considerations

**Read this** for database and data structure details.

---

### **4. ARCHITECTURE_COMPONENTS.md** - Component Architecture
- Full component hierarchy tree
- Data flow diagrams (creation, presentation, planning)
- State management patterns
- Component props & interfaces
- Event handling patterns
- Component communication
- User journey maps
- Responsive design
- Accessibility

**Read this** for component structure and user flows.

---

## QUICK REFERENCE

### Technology Stack Summary
- **Frontend**: React 18 + TypeScript + Vite + Tailwind
- **State**: React Query + React Hooks
- **Storage**: localStorage (web) or SQLite (desktop)
- **Desktop**: Electron 28 (optional)

### Key Files
- `src/pages/LibraryPage.tsx` - Song management
- `src/pages/PlannerPage.tsx` - Service planning
- `src/components/songs/SongFormModal.tsx` - Song editor
- `src/components/planner/ServiceItemEditor.tsx` - Service item editor
- `src/components/presentation/PresentationModal.tsx` - Presentation
- `src/hooks/useSongs.ts` - Song data hooks
- `src/utils/localStorage.ts` - Storage abstraction
- `src/assets/backgrounds.ts` - Background images
- `src/assets/backgroundPacks.ts` - Theme packs
- `src/assets/quickLooks.ts` - Quick Look presets

### Data Models
- **Song**: Title, lyrics, slides[], metadata
- **Slide**: Content, backgroundId, layout, order
- **Service**: Name, date, items[]
- **ServiceItem**: Type, title, content, metadata

### Key Features
1. **Song Management** - Create, edit, delete songs
2. **Design System** - 24 backgrounds, 7 packs, 7 Quick Looks
3. **Slide Generation** - Automatic from lyrics
4. **Service Planning** - 8 slide types, drag-drop
5. **Presentation** - Full-screen with keyboard nav

---

## RELATED DOCUMENTATION

- **README.md** - Project setup & getting started
- **PLAN.md** - Development roadmap
- **DICTIONARY.md** - Data dictionary
- **SYSTEM.md** - System overview
- **GETTING_STARTED.md** - Quick start guide

---

**Last Updated**: October 28, 2025  
**Version**: 1.0.0
