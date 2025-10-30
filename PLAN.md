# The Path - Development Plan

## Current Phase: FOUNDATION & PHASE 1 MVP
**Date Started**: October 28, 2025
**Approach**: Build slowly, test thoroughly, one module at a time

---

## PHASE 1: MVP FOUNDATION (Current)

### Stage 1: Project Setup & Infrastructure ⏳
**Goal**: Establish solid foundation with all tooling configured

1. **Initialize Project Structure** ✅
   - Create Electron + React + TypeScript project
   - Configure Vite for fast development
   - Set up Tailwind CSS
   - Install shadcn/ui components
   - Configure TypeScript strict mode
   - Status: COMPLETE
   - Note: better-sqlite3 requires VS Build Tools (see docs/SETUP_NOTES.md)

2. **Database Foundation**
   - Create SQLite schema (see DICTIONARY.md)
   - Implement database service wrapper
   - Create migration system
   - Write database initialization code
   - Test: Database CRUD operations
   - Status: PENDING

3. **Development Environment**
   - Configure ESLint + Prettier
   - Set up testing framework (Vitest + Testing Library)
   - Configure Electron build process
   - Create development scripts
   - Test: Dev server runs, hot reload works
   - Status: PENDING

### Stage 2: Core Application Shell
**Goal**: Basic UI framework and navigation

4. **Main Application Layout**
   - Create Electron main process
   - Set up IPC communication bridge
   - Implement window management
   - Create React app shell with routing
   - Test: App launches, windows communicate
   - Status: PENDING

5. **UI Navigation Framework**
   - Build sidebar navigation component
   - Create main content area layout
   - Implement routing (Library, Planner, Settings)
   - Apply branding colors from BRANDING.md
   - Test: Navigation works, branding applied
   - Status: PENDING

### Stage 3: Song Library (Manual Entry)
**Goal**: Users can add, edit, and manage songs manually

6. **Song Database Service**
   - Implement song CRUD operations
   - Create database queries with proper error handling
   - Add validation for song data
   - Write unit tests for database operations
   - Test: Can create, read, update, delete songs
   - Status: PENDING

7. **Song Library UI**
   - Build song list view with search/filter
   - Create "Add New Song" form
   - Implement song editing interface
   - Add delete confirmation dialog
   - Test: Full song management workflow
   - Status: PENDING

8. **Manual Lyrics Entry**
   - Create textarea for lyrics input
   - Add metadata fields (title, artist, CCLI, key, tempo)
   - Implement basic lyrics parser (split by double newline)
   - Show slide preview as user types
   - Test: Lyrics parsed correctly into slides
   - Status: PENDING

### Stage 4: Basic Slide Design System
**Goal**: Pre-built templates without AI (Phase 1 scope)

9. **Design Template System**
   - Create 5 pre-designed templates (minimal, modern, traditional, nature, celebration)
   - Implement template database storage
   - Build template selector UI
   - Apply template to song slides
   - Test: Templates apply correctly to slides
   - Status: PENDING

10. **Slide Preview Component**
    - Build slide rendering component
    - Apply design theme CSS dynamically
    - Show text with proper formatting
    - Create thumbnail view for slide list
    - Test: Slides render accurately with different templates
    - Status: PENDING

### Stage 5: Presentation Mode (Basic)
**Goal**: Display slides in fullscreen with keyboard controls

11. **Presentation Window Management**
    - Create separate presentation window
    - Implement dual-display detection
    - Build control window UI
    - Show current and next slide preview
    - Test: Presentation opens on correct display
    - Status: PENDING

12. **Slide Navigation Controls**
    - Implement keyboard shortcuts (Space, Backspace, ESC)
    - Add mouse click to advance
    - Create slide transition animations (fade)
    - Build blank screen toggle (B key)
    - Test: All navigation methods work smoothly
    - Status: PENDING

13. **Control Window Features**
    - Display current slide number
    - Show next slide preview
    - Add "Go to Slide" selector
    - Include Exit Presentation button
    - Test: Control window provides full presentation control
    - Status: PENDING

### Stage 6: Basic Service Planner
**Goal**: Create simple service orders

14. **Service Builder UI**
    - Create service list view
    - Build "New Service" form
    - Implement drag-and-drop song ordering
    - Add save/load service functionality
    - Test: Can create and save service orders
    - Status: PENDING

15. **Service Playback**
    - Load service items in sequence
    - Auto-advance to next song after current ends
    - Show service progress in control window
    - Test: Full service runs smoothly
    - Status: PENDING

### Stage 7: Settings & Configuration
**Goal**: Basic app configuration

16. **Settings UI**
    - Create settings page layout
    - Implement church info input (name, brand colors)
    - Add display selection for presentation
    - Save settings to database
    - Test: Settings persist and apply correctly
    - Status: PENDING

17. **Keyboard Shortcuts Configuration**
    - Build shortcuts editor
    - Allow custom key mapping
    - Save preferences to settings table
    - Test: Custom shortcuts work as configured
    - Status: PENDING

### Stage 8: Testing & Refinement
**Goal**: Ensure Phase 1 is stable and bug-free

18. **Comprehensive Testing Suite**
    - Write unit tests for all services
    - Create integration tests for workflows
    - Build user simulation scripts
    - Test on different screen configurations
    - Status: PENDING

19. **Bug Fixes & Polish**
    - Fix any issues found in testing
    - Improve error messages
    - Add loading states
    - Optimize performance
    - Status: PENDING

20. **Documentation**
    - Write user guide for basic features
    - Document codebase for Phase 2
    - Create quick-start tutorial
    - Status: PENDING

---

## PHASE 2: AI INTEGRATION (Future)
**Not starting until Phase 1 is complete and stable**

- Online lyrics search (Genius API)
- AI-powered lyrics parsing (OpenAI/Anthropic)
- AI-generated slide designs
- Background image generation
- Enhanced design customization

---

## PHASE 3: ADVANCED FEATURES (Future)

- Announcement slides with rich editor
- Advanced transitions and effects
- Video backgrounds
- Scripture integration
- Analytics and reporting

---

## PHASE 4: DISTRIBUTION (Future)

- Code signing
- Installers for Windows/macOS/Linux
- Auto-update mechanism
- Complete documentation

---

## Testing Protocol (Applies to All Stages)

For each module:
1. **Write the code**
2. **Create unit tests** for the module
3. **Run tests and fix issues**
4. **Code audit** - review for quality, security, performance
5. **Create user simulation** - test full workflow
6. **Fix any issues** found in simulation
7. **Mark as complete** only when all tests pass

## Success Criteria for Phase 1

- [ ] App launches without errors
- [ ] Can add 10+ songs manually
- [ ] All 5 templates render correctly
- [ ] Presentation mode works on dual displays
- [ ] Keyboard shortcuts respond instantly
- [ ] Can create and run a full service
- [ ] Zero crashes during 30-minute test presentation
- [ ] Settings persist across app restarts
- [ ] All unit tests pass
- [ ] User simulation completes without errors

---

**Next Step**: Initialize project structure and development environment
