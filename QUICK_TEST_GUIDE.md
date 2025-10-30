# Quick Test Guide - The Path

## ✅ ERRORS FIXED!

1. **JSX Structure** - Fixed SongFormModal
2. **CSS @import** - Already at top of file (warnings are normal)
3. **Console Logging** - Added for debugging

---

## 🧪 How to Test Adding a Song

### Step 1: Add a Song
1. Click "Add Your First Song" button
2. Fill in the form:
   - **Title**: Amazing Grace
   - **Artist**: John Newton  
   - **CCLI**: 22025
   - **Key**: G
   - **Tempo**: 90
   - **Lyrics**: 
```
Amazing grace, how sweet the sound
That saved a wretch like me

I once was lost, but now I'm found
Was blind, but now I see
```

### Step 2: Choose a Template
- Scroll down to see 5 template options
- Click one to select it (you'll see a checkmark)

### Step 3: Preview Slides
- Click "Preview Slides" tab at top
- You should see 2 slides generated:
  - Slide 1: First verse
  - Slide 2: Second verse

### Step 4: Save
- Click "Add Song" button
- Song should appear in grid

---

## 🔍 Debugging Checklist

### If Song Doesn't Appear:
1. Open browser console (F12)
2. Look for:
   - "Submitting song:" message
   - "Song created:" message
   - Any error messages
3. Check Network tab for database calls

### If Only 1 Slide Shows:
- Check console for "Parsing lyrics into slides:" message
- Make sure you have a **blank line** between verses
- The parser splits on double newlines (`\n\n`)

### If Templates Don't Load:
- Check console for "Error getting templates"
- Database should have 5 templates pre-loaded

---

## 🎯 What Should Work:

✅ Modal opens/closes  
✅ Form validation (title & lyrics required)  
✅ Template selector shows 5 templates  
✅ Preview tab shows parsed slides  
✅ Save button creates song  
✅ Song appears in grid with badges  
✅ Edit/Delete/Present buttons appear on hover  

---

## 🐛 Known Issues to Watch For:

1. **Lyrics must have blank lines** - Single newlines won't create new slides
2. **Database path** - Check console for database location
3. **React Query cache** - Song list should auto-refresh after save

---

## 💡 Tips:

- Use **double Enter** between verses to create separate slides
- Choose a template BEFORE previewing for best results
- Preview tab updates in real-time as you type lyrics
- Console logging will show exactly what's happening

---

## 🚀 Next Test: Presentation

Once a song is added:
1. Hover over song card
2. Click green **Play** button
3. Presentation modal should open
4. Use **Space** to advance slides
5. Use **B** to blank screen
6. Use **ESC** to exit

---

**Check browser console (F12) for detailed logs!**
