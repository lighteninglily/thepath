# 📸 BACKGROUND MANAGEMENT GUIDE

## 🎯 HOW TO MANAGE BACKGROUNDS

All background management is done in **ONE FILE**:
```
src/config/backgroundConfig.ts
```

This file controls which backgrounds AI can use when generating slides.

---

## 🚫 HOW TO DISABLE A BACKGROUND

### **Step 1: Open the config file**
```
src/config/backgroundConfig.ts
```

### **Step 2: Find the background you don't like**

For example, if you don't like "waves-3":
```typescript
{
  id: 'waves-3',
  enabled: true,  ← Change this
  name: 'Rolling Ocean Tides',
  url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
  category: 'waves',
}
```

### **Step 3: Change `enabled: true` to `enabled: false`**

```typescript
{
  id: 'waves-3',
  enabled: false,  ← Changed!
  name: 'Rolling Ocean Tides',
  url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
  category: 'waves',
  notes: 'Too busy, prefer calmer waves'  ← Optional note
}
```

### **Step 4: Save and restart**
1. Save the file (Ctrl+S)
2. Restart Electron
3. AI will never use this background again! ✅

---

## 🔄 HOW TO REPLACE A BACKGROUND IMAGE

### **Step 1: Find a new image**

1. Go to https://unsplash.com
2. Search for what you want (e.g., "calm ocean waves")
3. Click on an image you like
4. Right-click the image → "Copy Image Address"

### **Step 2: Format the URL**

The URL should look like:
```
https://images.unsplash.com/photo-XXXXXXXXX...
```

Add `?w=1920&q=80` to the end:
```
https://images.unsplash.com/photo-XXXXXXXXX?w=1920&q=80
```

### **Step 3: Replace in config**

```typescript
{
  id: 'waves-2',
  enabled: true,
  name: 'Turquoise Sea Surface',
  url: 'https://images.unsplash.com/photo-YOURNEWID?w=1920&q=80',  ← NEW URL
  category: 'waves',
  notes: 'Replaced with better image'
}
```

### **Step 4: Save and restart**
The new image will be used instead!

---

## ➕ HOW TO ADD A NEW BACKGROUND

### **Step 1: Copy an existing background**

```typescript
{
  id: 'waves-6',  ← Copy from here
  enabled: true,
  name: 'Deep Sea Blue',
  url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1920&q=80',
  category: 'waves',
},
```

### **Step 2: Change the ID and details**

```typescript
{
  id: 'waves-7',  ← New ID (increment number)
  enabled: true,
  name: 'Your New Wave Background',  ← New name
  url: 'https://images.unsplash.com/photo-YOURNEWID?w=1920&q=80',  ← Your URL
  category: 'waves',
  notes: 'Added for variety'
},
```

### **Step 3: Add comma**

Make sure there's a comma after the previous background:
```typescript
},  ← Comma here
{
  id: 'waves-7',
  ...
}
```

### **Step 4: Save and restart**
AI will now include your new background!

---

## 📋 CURRENT CONFIGURATION

### **Mountains Pack** (6 backgrounds)
- mountain-1: Majestic Blue Mountains
- mountain-2: Snowy Mountain Peaks
- mountain-3: Misty Mountain Range
- mountain-4: Mountain Lake Dusk
- mountain-5: Alpine Mountain Vista
- mountain-6: Blue Hour Mountains

### **Waves Pack** (6 backgrounds)
- waves-1: Deep Blue Ocean Waves
- waves-2: Turquoise Sea Surface
- waves-3: Rolling Ocean Tides
- waves-4: Calm Blue Waters
- waves-5: Ocean Horizon
- waves-6: Deep Sea Blue

### **Clouds Pack** (6 backgrounds)
- clouds-1: Soft Blue Sky Clouds
- clouds-2: Wispy Cloud Layers
- clouds-3: Gentle Sky Clouds
- clouds-4: Heavenly Cloud Formations
- clouds-5: Serene Sky View
- clouds-6: Peaceful Cloud Cover

---

## 🎨 FINDING GOOD IMAGES

### **Best Unsplash Search Terms:**

**For Mountains:**
- "mountain peaks"
- "alpine mountains"
- "misty mountains"
- "snowy mountains"

**For Waves:**
- "ocean waves"
- "calm sea"
- "blue water"
- "ocean horizon"

**For Clouds:**
- "soft clouds"
- "blue sky clouds"
- "peaceful sky"
- "wispy clouds"

### **What Makes a Good Background:**
✅ Simple, not busy
✅ Good text contrast (light text shows up)
✅ Worship-appropriate
✅ No people
✅ High quality

---

## 🚦 WORKFLOW EXAMPLE

### **Scenario: You don't like waves-2 and waves-5**

**Step 1**: Open `src/config/backgroundConfig.ts`

**Step 2**: Find waves-2 and waves-5:
```typescript
{
  id: 'waves-2',
  enabled: false,  ← Disable
  name: 'Turquoise Sea Surface',
  url: '...',
  category: 'waves',
  notes: 'Too bright, don\'t like this one'
},
// ...
{
  id: 'waves-5',
  enabled: false,  ← Disable
  name: 'Ocean Horizon',
  url: '...',
  category: 'waves',
  notes: 'Too plain'
},
```

**Step 3**: Save and restart

**Result**: AI will only use waves-1, waves-3, waves-4, and waves-6! ✅

---

## 📊 CHECKING YOUR CHANGES

After you disable/add backgrounds, check the console when generating:

```
🎨 Using theme pack: Ocean Waves with 4 enabled backgrounds
```

This shows how many backgrounds are active in that pack!

If you disabled 2 out of 6, it should say "4 enabled backgrounds".

---

## ⚠️ IMPORTANT NOTES

### **Don't Delete, Just Disable:**
- ❌ DON'T delete background objects
- ✅ DO set `enabled: false`
- This way you can re-enable them later

### **Keep At Least 3 Per Pack:**
- Each pack should have at least 3-4 enabled backgrounds
- Otherwise AI might repeat the same images too often

### **File Format:**
- Keep the commas between objects
- Keep the square brackets `[` and `]`
- Keep the curly braces `{` and `}`
- Save as TypeScript (.ts file)

### **Restart Required:**
- Changes take effect after restarting the app
- The config is loaded once at startup

---

## 🔧 TROUBLESHOOTING

### **Problem: Changes not showing**
- Make sure you saved the file
- Restart the Electron app completely
- Check console for errors

### **Problem: Syntax error in file**
- Check for missing commas
- Check for matching brackets
- Use VS Code - it highlights errors

### **Problem: Background not loading**
- Check the URL is correct
- Make sure it ends with `?w=1920&q=80`
- Try the URL in a browser first

---

## 📝 QUICK REFERENCE

```typescript
// DISABLE a background
enabled: false,

// REPLACE image URL
url: 'https://images.unsplash.com/photo-NEWID?w=1920&q=80',

// ADD a note
notes: 'Why I disabled this or what it is',

// ADD new background
{
  id: 'waves-7',
  enabled: true,
  name: 'My New Background',
  url: 'https://images.unsplash.com/photo-ID?w=1920&q=80',
  category: 'waves',
},
```

---

## ✅ BEST PRACTICES

1. **Test one change at a time** - Easier to debug
2. **Add notes** - Remember why you disabled something
3. **Keep backups** - Copy the file before big changes
4. **Use good names** - Describe what the image looks like
5. **Check console** - Verify your changes worked

---

## 🎯 SUMMARY

- **ONE FILE controls everything**: `src/config/backgroundConfig.ts`
- **Disable backgrounds**: Set `enabled: false`
- **Replace images**: Change the `url`
- **Add new backgrounds**: Copy and modify an existing one
- **Restart required**: Changes take effect after restart

---

**File location**: `src/config/backgroundConfig.ts`  
**No coding required**: Just edit `enabled`, `url`, and `name`  
**Safe to experiment**: Can't break anything, just revert changes!

🎉 **You now have full control over which backgrounds AI uses!**
