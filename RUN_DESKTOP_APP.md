# 🚀 HOW TO RUN THE DESKTOP APP

## ⚠️ ONE-TIME FIX NEEDED:

The `better-sqlite3` module needs to be rebuilt for Electron.

**Run this ONCE:**

```bash
npm install --save-dev @electron/rebuild
npx electron-rebuild -f -w better-sqlite3
```

Then you can run the app!

---

## ✅ DAILY DEVELOPMENT:

### **Step 1: Start Vite (React dev server)**
```bash
npm run dev
```
Leave this running!

### **Step 2: Start Electron (in NEW terminal)**
```bash
npx electron .
```

Desktop window opens with your app! ✅

---

## 🎯 WHAT YOU'LL SEE:

- Desktop window (not browser)
- Console shows: "✅ Using real Electron API"
- Add songs → Close app → Reopen → Songs still there!
- **DATA PERSISTS!** 🎉

---

## 📍 DATABASE LOCATION:

Windows: `C:\Users\[You]\AppData\Roaming\the-path\the_path.db`

---

## 🐛 TROUBLESHOOTING:

### **"better-sqlite3 module error"**
```bash
npx electron-rebuild -f -w better-sqlite3
```

### **"Cannot find dist-electron/main.js"**
```bash
npm run build:electron
```

### **"Port 5173 already in use"**
Stop other dev server, or change port in vite.config.ts

---

## 💡 TIP:

Keep 2 terminals open:
- Terminal 1: `npm run dev` (Vite)
- Terminal 2: `npx electron .` (Electron)

Make React changes → Vite hot reloads ✅  
Make Electron changes → Rebuild and restart

---

**That's it! Desktop app with persistent database!** 🚀
