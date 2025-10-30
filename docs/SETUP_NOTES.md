# Setup Notes for The Path

## SQLite Installation Issue (Windows)

The `better-sqlite3` package requires native compilation on Windows, which needs Visual Studio Build Tools.

### Solution: Install Visual Studio Build Tools

Run this command in PowerShell as Administrator:

```powershell
npm install --global windows-build-tools
```

OR download and install manually:
1. Download Visual Studio Build Tools: https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022
2. During installation, select "Desktop development with C++"
3. After installation, run `npm install` again in the project directory

### Alternative: Use Pre-built Binary

If the above doesn't work, try:

```powershell
npm install better-sqlite3 --build-from-source=false
```

## Next Steps After Installing Build Tools

1. Run `npm install` again to complete installation
2. Run `npm run dev` to start the development server
3. The app should load at http://localhost:5173

## Current Status

- ✅ Project structure created
- ✅ Configuration files set up
- ✅ Documentation complete
- ✅ Most dependencies installed
- ⏳ `better-sqlite3` needs build tools
- ⏳ Ready to start development once dependencies are complete

## Your API Keys

Remember to add your API keys to `docs/credentials.json`:
- OpenAI API key
- Anthropic API key
- Genius API key (optional for Phase 2)
