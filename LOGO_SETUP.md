# 🎨 LOGO SETUP INSTRUCTIONS

## ✅ CODE IS READY!

The sidebar has been updated to display your logo!

---

## 📁 WHERE TO SAVE YOUR LOGO

**Save your logo file as:**
```
src/assets/logo.png
```

**Full path:**
```
C:\Users\rsbiz\Documents\Church Slides\src\assets\logo.png
```

---

## 📝 STEPS

1. **Save the logo image you provided** as `logo.png`
2. **Place it in** the `src/assets/` folder
3. **Restart the Electron app** (if running)
4. **Your logo will appear** in the sidebar! ✅

---

## 🎨 WHAT IT WILL LOOK LIKE

The logo will:
- ✅ Display at the top of the left sidebar
- ✅ Be centered and properly sized (128px width)
- ✅ Show above "Church Presentations" text
- ✅ Have the blue sidebar background behind it

---

## 🔧 CURRENT SETUP

**File:** `src/components/layout/Sidebar.tsx`

The code now includes:
```tsx
import logo from '../../assets/logo.png';

<img 
  src={logo} 
  alt="The Path Logo" 
  className="w-32 h-auto mb-2"
/>
```

---

## 📊 FILE STRUCTURE

```
src/
  assets/
    logo.png  ← PUT YOUR LOGO HERE
    backgrounds.ts
    backgroundPacks.ts
  components/
    layout/
      Sidebar.tsx  ← Updated to use logo
```

---

## 🎯 EXPECTED RESULT

**Before:**
- Text: "The Path"
- Subtitle: "Church Presentations"

**After:**
- Logo image (your curved path symbol with "THE PATH" text)
- Subtitle: "Church Presentations"

---

## ⚠️ TROUBLESHOOTING

### **Logo not showing:**
1. Check the file is named exactly `logo.png` (lowercase)
2. Check it's in `src/assets/` folder
3. Restart the dev server or Electron app
4. Check browser console for errors

### **TypeScript error:**
- Already fixed! Created `vite-env.d.ts` to handle PNG imports

### **Logo too big/small:**
- Adjust the `className="w-32"` in Sidebar.tsx
- `w-32` = 128px width
- Try `w-24` (96px), `w-28` (112px), `w-36` (144px), `w-40` (160px)

---

## 🎨 CUSTOMIZING LOGO SIZE

If you want to change the logo size, edit this line in `Sidebar.tsx`:

```tsx
className="w-32 h-auto mb-2"
```

**Size options:**
- `w-24` - Small (96px)
- `w-28` - Medium Small (112px)
- `w-32` - Medium (128px) ← Current
- `w-36` - Medium Large (144px)
- `w-40` - Large (160px)
- `w-48` - Extra Large (192px)

---

## ✅ SUMMARY

1. ✅ Code updated to use logo
2. ✅ TypeScript declarations added
3. ✅ Sidebar layout adjusted
4. 📁 **YOU NEED TO:** Save `logo.png` to `src/assets/` folder

---

**Once you save the logo file, restart the app and it will appear!** 🎉
