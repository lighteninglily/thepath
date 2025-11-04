# 🔍 SERVICE ITEMS AUDIT - Audience View Rendering

**Date**: November 4, 2025  
**Issue**: Scripture showing black screen on audience view  
**Status**: In Progress

---

## 🎯 AUDIT CHECKLIST

### **Item Types to Check**:
1. ✅ Scripture Reading - **FIXED**
2. ⏳ Announcement
3. ⏳ Sermon
4. ⏳ Offering
5. ⏳ Welcome
6. ⏳ Closing

---

## 📊 AUDIT RESULTS

### **1. Scripture Reading** ✅ **FIXED**

**Problem**: Templates use `backgroundColor` directly, but AudienceViewPage expected `background` object

**Fix Applied**:
```typescript
// Before: Only converted if backgroundType existed
if (!background && visualData.backgroundType) {
  background = { type: visualData.backgroundType, ... };
}

// After: Converts any missing background object
if (!background) {
  background = {
    type: visualData.backgroundType || (visualData.backgroundColor ? 'color' : 'image'),
    color: visualData.backgroundColor,
    gradient: visualData.backgroundGradient,
    imageUrl: visualData.backgroundImage,
  };
}
```

**Testing**: ✅ Should now render correctly

---

### **2. Announcement** ⏳

**How It's Created**:
- User selects template in TemplatePickerModal
- Template has visualData with elements
- Stored as: `content: JSON.stringify(visualData)`

**Potential Issues**:
- Same as scripture - templates may have `backgroundColor` instead of `background` object
- **Fix already applied** - same fix handles announcements

**Testing Needed**: Test announcement on audience view

---

### **3. Sermon** ⏳

**How It's Created** (PlannerPage.tsx lines 169-197):
```typescript
const newItem: ServiceItem = {
  id: crypto.randomUUID(),
  type: 'sermon',
  title: sermon.title,
  duration: 20,
  order: selectedService.items.length,
  content: JSON.stringify(sermon.slides), // Store slides array
};
```

**Format**: Array of slides, each with visualData

**Potential Issues**:
- Audience view expects single visualData object, not array
- Need to handle slide navigation within sermon

**Needs Investigation**: Check if AudienceViewPage handles sermon slides array

---

### **4. Offering** ⏳

**How It's Created** (PlannerPage.tsx lines 199-213):
- Goes through template picker
- Same format as announcement/scripture

**Potential Issues**:
- Same as scripture - **Fix already applied**

**Testing Needed**: Test offering on audience view

---

### **5. Welcome** ⏳

**How It's Created** (PlannerPage.tsx lines 215-229):
- Goes through template picker
- Same format as announcement/scripture

**Potential Issues**:
- Same as scripture - **Fix already applied**

**Testing Needed**: Test welcome on audience view

---

### **6. Closing** ⏳

**How It's Created** (PlannerPage.tsx lines 231-245):
- Goes through template picker
- Same format as announcement/scripture

**Potential Issues**:
- Same as scripture - **Fix already applied**

**Testing Needed**: Test closing on audience view

---

## 🚨 CRITICAL ISSUE: SERMON SLIDES

**Problem**: Sermon stores an ARRAY of slides, but AudienceViewPage expects single visualData

**Current Code** (AudienceViewPage.tsx lines 126-140):
```typescript
else if (currentItem?.content) {
  try {
    const parsed = typeof currentItem.content === 'string' 
      ? JSON.parse(currentItem.content) 
      : currentItem.content;
    visualData = parsed;
  } catch (e) {
    console.error('Failed to parse content:', e);
  }
}
```

**Issue**: If `parsed` is an array (sermon slides), setting `visualData = parsed` breaks rendering

**Solution Needed**: 
```typescript
else if (currentItem?.content) {
  try {
    const parsed = typeof currentItem.content === 'string' 
      ? JSON.parse(currentItem.content) 
      : currentItem.content;
    
    // Handle sermon slides (array format)
    if (Array.isArray(parsed)) {
      visualData = parsed[currentSlideIndex] || parsed[0];
    } else {
      visualData = parsed;
    }
  } catch (e) {
    console.error('Failed to parse content:', e);
  }
}
```

---

## ✅ FIXES SUMMARY

### **Fix 1: Background Conversion** ✅ **APPLIED**
- **File**: `src/pages/AudienceViewPage.tsx` line 206
- **Change**: Convert `backgroundColor` to `background` object
- **Affected**: Scripture, Announcement, Offering, Welcome, Closing

### **Fix 2: Sermon Slides Array** ⏳ **NEEDS APPLYING**
- **File**: `src/pages/AudienceViewPage.tsx` line 126
- **Change**: Handle array of slides for sermon items
- **Affected**: Sermon only

---

## 🧪 TESTING PLAN

1. ✅ **Scripture** - Test with scripture reading item
2. ⏳ **Announcement** - Add announcement, present, verify audience view
3. ⏳ **Sermon** - Add sermon with multiple slides, verify navigation works
4. ⏳ **Offering** - Add offering, present, verify audience view
5. ⏳ **Welcome** - Add welcome, present, verify audience view
6. ⏳ **Closing** - Add closing, present, verify audience view

---

## 📝 NEXT STEPS

1. **Apply Fix 2** for sermon slides array
2. **Test all item types** systematically
3. **Document any other issues** found during testing
4. **Update this audit** with test results

---

**Status**: 1 of 2 fixes applied, ready for testing
