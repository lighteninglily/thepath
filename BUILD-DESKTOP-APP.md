# 🚀 BUILD THE DESKTOP APP - QUICK GUIDE

## ✅ PREREQUISITES

- Node.js 18+ installed
- Git installed
- Windows 10+ (for Windows builds)

## 📦 BUILD STEPS

### 1. Install Dependencies (First Time Only)

```bash
npm install
```

### 2. Build the Desktop App

```bash
npm run dist:win
```

**Output**: `release/The-Path-Setup-3.1.0.exe`

**Build Time**: ~2-3 minutes

## 📥 INSTALL & TEST

1. Navigate to `release/` folder
2. Double-click `The-Path-Setup-3.1.0.exe`
3. Follow installer prompts
4. App installs to `C:\Program Files\The Path\`
5. Desktop shortcut created automatically

## 🔄 AUTO-UPDATES

The app is configured for automatic updates via GitHub Releases.

**To Push an Update**:

1. Make code changes
2. Update version in `package.json` (e.g., `3.1.1`)
3. Commit and push to GitHub
4. Build: `npm run dist:win`
5. Create GitHub Release at: https://github.com/lighteninglily/thepath/releases
6. Upload the installer from `release/` folder
7. **Users automatically get notified!**

## 📝 VERSION NUMBERS

- `3.1.0` → `3.1.1` = Bug fixes (patch)
- `3.1.0` → `3.2.0` = New features (minor)
- `3.1.0` → `4.0.0` = Breaking changes (major)

## 🎯 CURRENT VERSION

**3.1.0 - MVP Complete**

Features:
- Slide navigator with thumbnails
- Autosave for services and songs
- Theme selection for AI generation
- Dual-screen presentation
- Professional presenter view

## 🐛 TROUBLESHOOTING

**Build fails**: Run `npm install` again

**"electron-builder not found"**: Install it:
```bash
npm install --save-dev electron-builder
```

**App won't start**: Check Windows Defender isn't blocking it

## 🎉 READY FOR SUNDAY!

The desktop app is production-ready with:
- ✅ Professional features
- ✅ Auto-update system
- ✅ Easy to distribute
- ✅ Simple to update

**Next Update**: Just increment version, build, and create GitHub release!
