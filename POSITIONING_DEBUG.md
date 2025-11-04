# 🔍 POSITIONING DEBUG - CHECKLIST

## What to Check in Console

When you open the visual editor on a NEW song, you should see:

```
🔍 CHECKING SLIDE DATA:
  hasVisualData: false
  content: "Awesome God..."
  backgroundId: "waves-3"

🆕 Creating NEW visualData with unified system

🎨 UNIFIED SYSTEM: contentToVisualData() called
📝 Content: Awesome God...

📐 UNIFIED POSITIONING:
  - Position: { x: 230, y: 216 }
  - Size: { width: 1459, height: 648 }
  - Font size: 80

✅ UNIFIED SYSTEM: Created visualData: {...}
```

## If You See "♻️ Using EXISTING visualData"

The slide already has visualData saved. To test with NEW positioning:
1. Delete the song
2. Create it again
3. Open visual editor immediately

## The REAL Problem

Even if we calculate position correctly, **VisualCanvas renders differently than UnifiedSlideRenderer**.

The visual editor uses:
- `VisualCanvas` for editing
- Custom rendering logic
- Different percentage calculations

The preview uses:
- `UnifiedSlideRenderer` 
- Our positioning calculation
- Different rendering

**They're still using different renderers!**

## THE FIX

We need to make VisualCanvas use the SAME rendering as UnifiedSlideRenderer, OR we need to verify that our calculation actually matches what VisualCanvas expects.

The calculation should be:
```
Canvas: 1920x1080
Padding: 96px total (48px each side)
Available: 1824px
Text width: 80% of 1824 = 1459px
Text X: (1920 - 1459) / 2 = 230px ✅
```

But VisualCanvas might be expecting different values!

## NEXT STEP

Please check the browser console and tell me:
1. Do you see "🆕 Creating NEW visualData"?
2. What are the Position values shown?
3. Do you see any errors?

This will tell us if the problem is:
A) Our calculation is wrong
B) VisualCanvas renders it differently
C) Something else entirely
