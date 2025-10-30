# DESKTOP APP DEPLOYMENT GUIDE

Version: 3.1.0 - Last Updated: October 30, 2025

## BUILDING THE APP

### Quick Start

```bash
# Install dependencies
npm install

# Build for Windows
npm run dist:win

# Output: release/The-Path-Setup-3.1.0.exe
```

### Build Commands

- `npm run dist` - Build for current platform
- `npm run dist:win` - Build Windows installer
- `npm run dist:mac` - Build macOS DMG
- `npm run dist:linux` - Build Linux AppImage
- `npm run release` - Build and publish to GitHub (requires GH_TOKEN)

## AUTO-UPDATE SYSTEM

### How It Works

1. App checks for updates on startup
2. Compares version with latest GitHub Release
3. Downloads update in background
4. Prompts user to restart
5. Installs automatically

### Configuration

In `package.json`:
```json
{
  "version": "3.1.0",
  "publish": {
    "provider": "github",
    "owner": "lighteninglily",
    "repo": "thepath"
  }
}
```

## CREATING A RELEASE

### Step 1: Update Version

Edit `package.json`:
```json
{
  "version": "3.1.1"
}
```

### Step 2: Build

```bash
npm run build
npm run dist:win
```

### Step 3: Create GitHub Release

1. Go to https://github.com/lighteninglily/thepath/releases
2. Click "Draft a new release"
3. Tag: `v3.1.1`
4. Upload installers from `release/` folder
5. Publish release

Users get automatic updates!

## SUSTAINABLE UPDATE WORKFLOW

### For Regular Updates:

```bash
# 1. Make code changes
# 2. Test thoroughly
# 3. Update version in package.json

# 4. Commit and push
git add .
git commit -m "Version 3.1.1: New features"
git push

# 5. Build
npm run build
npm run dist:win

# 6. Create GitHub Release with installers
# Users automatically get notified!
```

### Version Numbers

- **Major** (3.x.x): Breaking changes
- **Minor** (x.1.x): New features  
- **Patch** (x.x.1): Bug fixes

## INSTALLATION

### Windows
1. Download `The-Path-Setup-3.1.0.exe`
2. Run installer
3. App auto-updates from now on

### Requirements
- Windows 10+
- 2GB RAM minimum
- 500MB disk space
- Internet for updates

## TROUBLESHOOTING

### Build Issues

**Error: electron-builder not found**
```bash
npm install
```

**Updates not showing**
- Check version number is incremented
- Verify GitHub release exists
- Check internet connection

### Getting Help

Check console logs in app: Ctrl+Shift+I (DevTools)
