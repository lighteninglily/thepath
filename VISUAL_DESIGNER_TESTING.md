# 🧪 VISUAL DESIGNER - TESTING GUIDE

## ✅ INTEGRATION COMPLETE!

The Visual Designer is now fully integrated into the Song Form Modal.

---

## 🚀 HOW TO TEST

### **Step 1: Start the App**
```bash
npm run dev
```

### **Step 2: Open Song Form**
1. Go to Library page
2. Click "Add New Song"

### **Step 3: Create Slides**
1. Enter song title: "Amazing Grace"
2. Enter lyrics:
   ```
   Amazing grace how sweet the sound
   
   That saved a wretch like me
   
   I once was lost but now am found
   
   Was blind but now I see
   ```
3. Select a Quick Look or Background
4. Click outside the form or wait for slides to generate

### **Step 4: Open Visual Editor**
1. Click the **"Visual Editor"** button (blue, with sparkles icon ✨)
2. Visual Designer should open in full-screen

### **Step 5: Test Features**

**What You Should See:**
- ✅ Dark slate editor with 3 panels
- ✅ Canvas showing your slide with background
- ✅ Text element with "Amazing grace how sweet the sound"
- ✅ Blue selection ring around text

**Try These Actions:**

1. **Drag Text**
   - Click and drag the text around
   - It should move smoothly
   - Constrained to canvas bounds

2. **Select/Deselect**
   - Click text → Selected (blue ring)
   - Click canvas → Deselected (no ring)

3. **Edit Content**
   - Select text
   - Change content in right sidebar
   - Should update instantly

4. **Change Font Size**
   - Drag the slider (12-200px)
   - Text should resize

5. **Change Color**
   - Click color picker
   - Pick a color
   - Text should change color

6. **Change Font Weight**
   - Select dropdown (Light/Regular/Bold/etc.)
   - Text weight should change

7. **Change Alignment**
   - Click Left/Center/Right buttons
   - Text alignment should change

8. **Position with Numbers**
   - Type new X/Y values
   - Text should jump to position

9. **Add More Text**
   - Click "Add Text" button
   - New text element appears
   - Can drag and edit separately

10. **Layer Management**
    - Multiple text elements shown in left sidebar
    - Click layer to select
    - Shows in different colors

11. **Zoom**
    - Click + / - buttons
    - Canvas should zoom in/out (25%-200%)

12. **Save**
    - Click "Save" button
    - Should close designer
    - Changes should persist

---

## 🎯 EXPECTED BEHAVIOR

### **On First Open:**
- Converts existing simple slide to visual format
- Creates centered text element
- Preserves background image
- Sets default styling (white text, shadow)

### **While Editing:**
- All changes instant (no lag)
- Drag is smooth (60 FPS)
- Selection is clear (blue ring)
- Properties update in real-time

### **On Save:**
- Converts visual slide back to simple format
- Preserves changes
- Closes designer
- Returns to song form

### **On Close (X button):**
- Discards changes
- Returns to song form
- No data saved

---

## 🐛 TROUBLESHOOTING

### **"Please generate slides first" Alert**
- **Cause**: No slides created yet
- **Fix**: Enter lyrics and let slides generate first

### **Designer Doesn't Open**
- **Cause**: JavaScript error
- **Fix**: Check browser console (F12)
- **Report**: Screenshot the error

### **Can't Drag Text**
- **Cause**: Element might be locked
- **Fix**: Check if lock icon shows
- **Or**: Try clicking to select first

### **Changes Don't Save**
- **Cause**: Conversion error
- **Fix**: Check console for errors
- **Workaround**: Use "Edit Slides" instead

### **Canvas Too Small/Big**
- **Cause**: Zoom or screen size
- **Fix**: Use zoom +/- buttons
- **Or**: Resize browser window

---

## 📊 WHAT TO CHECK

### **Visual Quality:**
- ✅ Background renders correctly
- ✅ Text is readable
- ✅ Colors match original
- ✅ Positioning makes sense

### **Performance:**
- ✅ No lag when dragging
- ✅ No flicker when editing
- ✅ Smooth zoom
- ✅ Fast updates

### **Data Integrity:**
- ✅ Save persists changes
- ✅ Close discards changes
- ✅ Reopen shows last saved state
- ✅ No data loss

### **UX:**
- ✅ Obvious what to do
- ✅ Visual feedback on hover
- ✅ Selection is clear
- ✅ Errors are helpful

---

## 🎨 VISUAL DIFFERENCES

### **Simple Mode (Before):**
```
Slide: {
  content: "Amazing grace",
  backgroundId: "mountain-1",
  layout: "full-bleed"
}
```

### **Visual Mode (After):**
```
Slide: {
  elements: [
    {
      type: "text",
      content: "Amazing grace",
      position: { x: 160, y: 390 },
      size: { width: 1600, height: 300 },
      style: {
        fontSize: 56,
        color: "#ffffff",
        textAlign: "center",
        // ... more properties
      }
    }
  ],
  background: {
    type: "image",
    imageUrl: "mountain-1"
  }
}
```

**Backward Compatible**: Simple slides still work!

---

## 📝 KNOWN LIMITATIONS (Phase 1)

### **Not Yet Implemented:**
- ⏳ Resize handles (can't drag corners)
- ⏳ Rotation handles (can't rotate)
- ⏳ Shape elements (only text)
- ⏳ Image elements
- ⏳ Icon elements
- ⏳ Undo/redo
- ⏳ Keyboard shortcuts
- ⏳ Multi-select
- ⏳ Alignment guides
- ⏳ Grid snapping
- ⏳ Templates

### **Current Capabilities:**
- ✅ Text elements
- ✅ Drag & drop
- ✅ Font size, weight, color
- ✅ Text alignment
- ✅ Position & size inputs
- ✅ Layer management
- ✅ Multiple elements
- ✅ Zoom controls
- ✅ Save/close

---

## 🎉 SUCCESS CRITERIA

**Phase 1 is successful if:**

1. ✅ Visual Editor button appears in song form
2. ✅ Clicking opens full-screen designer
3. ✅ Can see slide with background
4. ✅ Can drag text around
5. ✅ Can edit text properties
6. ✅ Changes save correctly
7. ✅ No errors in console
8. ✅ Performance is smooth

---

## 📸 SCREENSHOTS TO TAKE

1. Song form with "Visual Editor" button
2. Designer opened (full view)
3. Text selected (blue ring)
4. Dragging text (mid-drag)
5. Properties panel (right sidebar)
6. Multiple elements (layer list)
7. Saved slide in preview

**Share these with me if you find issues!**

---

## 🚀 NEXT STEPS AFTER TESTING

**If everything works:**
- ✅ Phase 1 COMPLETE!
- → Move to Phase 2 (resize, rotation, etc.)

**If issues found:**
- 🐛 Report bugs with screenshots
- 🔧 I'll fix before moving forward

---

**Ready to test! Let me know how it goes!** 🎨✨
