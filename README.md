# The Path

**Church Presentation Software for The Way**

A beautiful, modern desktop application for displaying song lyrics and presentations during worship services.

---

## Features (Phase 1 MVP)

- **Song Library**: Manage your church's song collection with metadata
- **Manual Lyrics Entry**: Add songs with verse/chorus structure
- **Design Templates**: 5 pre-built, beautiful slide designs
- **Presentation Mode**: Dual-display support with keyboard controls
- **Service Planning**: Create and save service orders
- **Branding**: Custom earthy, pastel color scheme

---

## Technology

- **Electron** - Desktop framework
- **React + TypeScript** - UI with strict typing
- **SQLite** - Local database
- **Tailwind CSS + shadcn/ui** - Beautiful, modern UI
- **Vite** - Fast development

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Windows 10+ (macOS/Linux support coming)

### Installation

```bash
# Install dependencies
npm install

# Set up credentials
# Edit docs/credentials.json with your API keys

# Start development server
npm run dev
```

### Development

```bash
npm run dev          # Start dev server
npm run test         # Run tests
npm run lint         # Check code quality
npm run build        # Build for production
```

---

## Project Structure

See [SYSTEM.md](SYSTEM.md) for complete architecture documentation.

```
church-slides-app/
├── electron/        # Main process
├── src/            # React app
├── tests/          # Test suites
├── docs/           # Documentation
└── public/         # Static assets
```

---

## Documentation

- **[PLAN.md](PLAN.md)** - Development roadmap and current progress
- **[SYSTEM.md](SYSTEM.md)** - System architecture and design decisions
- **[docs/DICTIONARY.md](docs/DICTIONARY.md)** - Database schema reference
- **[docs/BRANDING.md](docs/BRANDING.md)** - Brand guidelines and colors

---

## Roadmap

### Phase 1: MVP (Current)
- ✅ Project setup
- ⏳ Song library with manual entry
- ⏳ Pre-built design templates
- ⏳ Basic presentation mode
- ⏳ Service planning

### Phase 2: AI Integration
- Online lyrics search
- AI-powered slide designs
- Background generation

### Phase 3: Advanced Features
- Announcement slides
- Video backgrounds
- Scripture integration

### Phase 4: Distribution
- Installers for all platforms
- Auto-updates

---

## Contributing

This is a private project for The Way church. For questions or issues, contact the development team.

---

## License

Proprietary - © 2025 The Way Church
