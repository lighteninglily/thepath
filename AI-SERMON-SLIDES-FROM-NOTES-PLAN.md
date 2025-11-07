# 🎤 AI Sermon Slides from Uploaded Notes - WORLD-CLASS PLAN

**Date**: November 6, 2025  
**Feature**: AI-powered sermon slide generation from uploaded sermon notes  
**AI**: Claude Sonnet 4 (Anthropic API)

---

## 🎯 FEATURE OVERVIEW

Pastors upload their sermon notes, and AI automatically:
1. **Extracts all scripture references** and creates professional slides
2. **Identifies main sermon points** (Point 1, 2, 3, etc.) and creates title slides
3. **Splits long scriptures** across multiple slides for readability
4. **Uses existing templates** from your slide system

### **User Flow:**
```
Service Planner → Add Item → "Sermon Slides (AI)" 
→ Upload sermon notes (.txt, .docx, .pdf)
→ AI analyzes document
→ Preview generated slides (scriptures + points)
→ Accept → Slides added to service
```

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Tech Stack:**
- **AI**: Claude 3.5 Sonnet (best at document analysis)
- **File Upload**: Electron file picker + parser
- **Document Parsing**: 
  - TXT: Direct read
  - DOCX: `mammoth.js` library
  - PDF: `pdf-parse` library
- **Scripture API**: Bible API (ESV or YouVersion)
- **Slide System**: Existing visualData + templates

---

## 📋 IMPLEMENTATION PHASES

### **PHASE 1: File Upload & Parsing** (Foundation)

#### **Step 1.1: Add Menu Option**
**File**: `src/components/planner/AddItemMenu.tsx`

Add new menu item:
```typescript
{
  type: 'sermon-ai' as const,
  icon: Sparkles,
  label: 'Sermon Slides (AI)',
  color: 'purple'
}
```

#### **Step 1.2: Create Upload Modal**
**New File**: `src/components/modals/AddSermonAIModal.tsx`

Features:
- File upload button (drag & drop optional)
- Supported formats badge (.txt, .docx, .pdf)
- Progress indicator
- Preview parsed text

#### **Step 1.3: Document Parser Service**
**New File**: `src/services/documentParser.ts`

```typescript
export interface ParsedDocument {
  text: string;
  wordCount: number;
  success: boolean;
  error?: string;
}

export async function parseDocument(
  filePath: string, 
  fileType: 'txt' | 'docx' | 'pdf'
): Promise<ParsedDocument>
```

**Dependencies to install:**
```bash
npm install mammoth pdf-parse
npm install -D @types/pdf-parse
```

---

### **PHASE 2: AI Analysis with Claude** (Core Intelligence)

#### **Step 2.1: Claude Service**
**New File**: `src/services/claudeService.ts`

Use Anthropic API (you have the key in credentials.json):
```typescript
import Anthropic from '@anthropic-ai/sdk';

export interface SermonAnalysis {
  scriptures: ScriptureReference[];
  mainPoints: SermonPoint[];
  title?: string;
  theme?: string;
}

export interface ScriptureReference {
  reference: string;      // "John 3:16-17"
  book: string;           // "John"
  chapter: number;        // 3
  startVerse: number;     // 16
  endVerse?: number;      // 17
  context?: string;       // Surrounding text
}

export interface SermonPoint {
  number: number;         // 1, 2, 3
  title: string;          // "God's Love is Unconditional"
  description?: string;   // Short summary
  scripture?: string;     // Associated verse
}
```

**Claude Prompt Strategy:**
```typescript
const SERMON_ANALYSIS_PROMPT = `
You are analyzing sermon notes to create presentation slides.

Your tasks:
1. Find ALL scripture references (format: "John 3:16", "Romans 8:28-30", etc.)
2. Identify main sermon points (numbered or bulleted sections)
3. Extract the sermon title if present
4. Identify the main theme

Return JSON format:
{
  "title": "Sermon title or null",
  "theme": "Main theme or null",
  "scriptures": [
    {
      "reference": "John 3:16-17",
      "book": "John",
      "chapter": 3,
      "startVerse": 16,
      "endVerse": 17,
      "context": "Text around the reference"
    }
  ],
  "mainPoints": [
    {
      "number": 1,
      "title": "First Point Title",
      "description": "Brief summary",
      "scripture": "Related verse if any"
    }
  ]
}

Sermon notes:
{SERMON_TEXT}
`;
```

#### **Step 2.2: Scripture Text Fetching**
**New File**: `src/services/bibleApi.ts`

Use free Bible API:
- **Option A**: ESV API (https://api.esv.org/) - High quality, requires free key
- **Option B**: Bible API (https://bible-api.com/) - No key needed, multiple versions
- **Option C**: YouVersion API - If you have access

```typescript
export interface ScriptureText {
  reference: string;
  text: string;
  version: string;
  verses: VerseText[];
}

export interface VerseText {
  verse: number;
  text: string;
}

export async function fetchScripture(
  reference: string,
  version: string = 'ESV'
): Promise<ScriptureText>
```

---

### **PHASE 3: Slide Generation** (Visual Output)

#### **Step 3.1: Scripture Slide Builder**
**New File**: `src/utils/scriptureSlideBuilder.ts`

Logic:
```typescript
export function createScriptureSlides(
  scripture: ScriptureText,
  template: SlideTemplate
): Slide[] {
  // Rules:
  // - Max 4 verses per slide (80-100 words)
  // - Each verse labeled (John 3:16, John 3:17)
  // - Use scripture template design
  // - Add reference slide at start
  
  const slides: Slide[] = [];
  
  // Slide 1: Reference title
  slides.push(createReferenceSlide(scripture.reference));
  
  // Slides 2+: Verse text (split if needed)
  const verseSlides = splitVersesIntoSlides(scripture.verses);
  slides.push(...verseSlides);
  
  return slides;
}
```

**Smart Splitting Logic:**
```typescript
function splitVersesIntoSlides(verses: VerseText[]): Slide[] {
  const maxWordsPerSlide = 80;
  const maxVersesPerSlide = 4;
  
  // Group verses by word count and verse limit
  // If single verse > 80 words, split into multiple slides
  // If multiple verses fit, group them
}
```

#### **Step 3.2: Point Slide Builder**
**New File**: `src/utils/pointSlideBuilder.ts`

```typescript
export function createPointSlides(
  points: SermonPoint[],
  template: SlideTemplate
): Slide[] {
  // Each point gets a title slide
  // Format: "Point 1: [Title]"
  // Optional: Description on separate slide
  // Optional: Associated scripture
  
  return points.flatMap(point => {
    const slides: Slide[] = [];
    
    // Main point title slide
    slides.push(createPointTitleSlide(point));
    
    // If description exists, add description slide
    if (point.description) {
      slides.push(createDescriptionSlide(point));
    }
    
    // If associated scripture, add verse slide
    if (point.scripture) {
      slides.push(createPointScriptureSlide(point.scripture));
    }
    
    return slides;
  });
}
```

#### **Step 3.3: Template Selection**
Use existing templates:
- **Scripture slides**: Use scripture templates from `slideTemplatesFixed.ts`
- **Point slides**: Use sermon templates (bold statement style)
- **Title slide**: Use sermon title template

---

### **PHASE 4: UI/UX Polish** (User Experience)

#### **Step 4.1: Progress Indicator**
Show steps:
```
1. Uploading file... ✓
2. Parsing document... ✓
3. Analyzing with AI... ⏳
4. Fetching scripture text... 
5. Generating slides...
6. Complete!
```

#### **Step 4.2: Preview & Edit**
Before adding to service:
- Show slide count: "Generated 12 slides (8 scripture, 4 points)"
- Preview slides in grid
- Allow removing slides
- Allow editing text
- Allow changing templates

#### **Step 4.3: Error Handling**
- File too large (>5MB)
- Unsupported format
- No scriptures found (offer manual mode)
- No points found (suggest adding manually)
- API errors (Claude or Bible API)

---

## 🎨 TEMPLATE DESIGN RECOMMENDATIONS

### **Scripture Slide Design:**
```
┌─────────────────────────────┐
│  JOHN 3:16-17               │ ← Reference header
│                             │
│  "For God so loved the      │
│   world that he gave his    │
│   one and only Son..."      │ ← Verse text
│                             │
│         ESV                 │ ← Version
└─────────────────────────────┘
```

### **Point Slide Design:**
```
┌─────────────────────────────┐
│                             │
│      POINT 1                │ ← Small label
│                             │
│   GOD'S LOVE IS             │
│   UNCONDITIONAL             │ ← Large title
│                             │
│   John 3:16                 │ ← Optional verse
└─────────────────────────────┘
```

---

## 🔄 WORKFLOW EXAMPLE

### **Input: Sermon Notes**
```
Title: The Power of Grace

Main Text: Ephesians 2:8-9

Introduction:
Grace is God's unmerited favor...

Point 1: Grace is a Gift
We cannot earn salvation (Romans 3:23-24)
It's freely given by God

Point 2: Grace Transforms Lives
When we receive grace, we are changed
2 Corinthians 5:17 says we become new creations

Point 3: Grace Empowers Service
Grace enables us to serve others
Supporting verse: 1 Peter 4:10

Conclusion:
Remember Titus 2:11-12...
```

### **AI Analysis Output:**
```json
{
  "title": "The Power of Grace",
  "theme": "Grace and salvation",
  "scriptures": [
    {
      "reference": "Ephesians 2:8-9",
      "book": "Ephesians",
      "chapter": 2,
      "startVerse": 8,
      "endVerse": 9
    },
    {
      "reference": "Romans 3:23-24",
      "book": "Romans",
      "chapter": 3,
      "startVerse": 23,
      "endVerse": 24
    },
    {
      "reference": "2 Corinthians 5:17",
      "book": "2 Corinthians",
      "chapter": 5,
      "startVerse": 17
    },
    {
      "reference": "1 Peter 4:10",
      "book": "1 Peter",
      "chapter": 4,
      "startVerse": 10
    },
    {
      "reference": "Titus 2:11-12",
      "book": "Titus",
      "chapter": 2,
      "startVerse": 11,
      "endVerse": 12
    }
  ],
  "mainPoints": [
    {
      "number": 1,
      "title": "Grace is a Gift",
      "description": "We cannot earn salvation, it's freely given",
      "scripture": "Romans 3:23-24"
    },
    {
      "number": 2,
      "title": "Grace Transforms Lives",
      "description": "We become new creations",
      "scripture": "2 Corinthians 5:17"
    },
    {
      "number": 3,
      "title": "Grace Empowers Service",
      "description": "Grace enables us to serve others",
      "scripture": "1 Peter 4:10"
    }
  ]
}
```

### **Generated Slides (15 total):**
1. Sermon title: "The Power of Grace"
2. Main text reference: "Ephesians 2:8-9"
3. Ephesians 2:8-9 (full text)
4. Point 1: "Grace is a Gift"
5. Romans 3:23-24 (reference)
6. Romans 3:23-24 (text)
7. Point 2: "Grace Transforms Lives"
8. 2 Corinthians 5:17 (reference)
9. 2 Corinthians 5:17 (text)
10. Point 3: "Grace Empowers Service"
11. 1 Peter 4:10 (reference)
12. 1 Peter 4:10 (text)
13. Conclusion reference: "Titus 2:11-12"
14. Titus 2:11-12 (text - slide 1)
15. Titus 2:11-12 (text - slide 2, if needed)

---

## 📦 DEPENDENCIES TO INSTALL

```bash
# Document parsing
npm install mammoth pdf-parse

# Claude AI (Anthropic)
npm install @anthropic-ai/sdk

# Bible API (if using ESV)
# npm install axios  # Already have this

# Types
npm install -D @types/pdf-parse
```

---

## 🔑 API KEYS NEEDED

### **Already Have:**
- ✅ Anthropic API Key (in credentials.json)
- ✅ OpenAI API Key (backup option)

### **Need to Get:**
- 📋 ESV Bible API Key (free at https://api.esv.org/)
  - OR use Bible API (https://bible-api.com/) - no key needed

---

## 🎯 RECOMMENDED IMPLEMENTATION ORDER

### **Week 1: Foundation**
1. Add menu option "Sermon Slides (AI)"
2. Create file upload modal
3. Implement document parser (TXT, DOCX, PDF)
4. Test file parsing with sample sermons

### **Week 2: AI Integration**
5. Set up Claude service
6. Create sermon analysis prompts
7. Test AI scripture detection
8. Test AI point extraction

### **Week 3: Scripture System**
9. Integrate Bible API
10. Build scripture slide generator
11. Implement smart text splitting
12. Test with various scripture lengths

### **Week 4: Point Slides & Polish**
13. Build point slide generator
14. Create preview UI
15. Add edit capabilities
16. Error handling & edge cases

---

## 🧪 TESTING CHECKLIST

### **Document Parsing:**
- [ ] TXT file with sermon notes
- [ ] DOCX file from Word
- [ ] PDF file (typed and scanned)
- [ ] Large files (>1MB)
- [ ] Special characters

### **AI Analysis:**
- [ ] Single scripture reference
- [ ] Multiple scripture references
- [ ] Scripture ranges (John 3:16-18)
- [ ] Different formats ("John 3:16" vs "Jn 3:16")
- [ ] 2-5 sermon points
- [ ] Sermon without clear points

### **Scripture Fetching:**
- [ ] Old Testament books
- [ ] New Testament books
- [ ] Single verse
- [ ] Verse range
- [ ] Multiple chapters
- [ ] Psalm 119 (longest chapter)

### **Slide Generation:**
- [ ] Short scripture (1 verse)
- [ ] Long scripture (10+ verses)
- [ ] 3 point sermon
- [ ] 5 point sermon
- [ ] Mixed content

---

## 🚀 ADVANCED FEATURES (Future)

### **Phase 2 Enhancements:**
1. **Multiple Bible Versions**: Let user choose ESV, NIV, KJV, etc.
2. **Custom Templates**: AI selects template based on sermon mood
3. **Image Suggestions**: AI recommends background images per section
4. **Speaker Notes**: Export slides with pastor's notes
5. **Outline View**: Show sermon outline with slide numbers
6. **Duplicate Detection**: Don't create duplicate scripture slides
7. **Smart Ordering**: AI orders slides logically
8. **Cross-References**: Detect "as mentioned in..." references

---

## 💡 EXISTING SOLUTIONS TO STUDY

### **Similar Products:**
1. **SermonAI** (sermonai.com) - AI sermon writing, not slides
2. **Faithlife Proclaim** - Sermon slides, but manual input
3. **EasyWorship** - Presentation software, no AI
4. **Planning Center Services** - Service planning, limited AI

**YOUR ADVANTAGE**: 
- First to combine AI document analysis with automated slide creation
- Use Claude 3.5 (best at document understanding)
- Integrate with existing beautiful templates
- Free/low-cost (vs $30-50/month competitors)

---

## 📊 ESTIMATED COSTS

### **API Usage per Sermon:**
- **Claude API**: ~$0.10-0.30 per sermon (analyzing notes)
- **Bible API**: Free (bible-api.com) or $0.01 (ESV API)
- **Total**: ~$0.10-0.35 per sermon

### **Monthly Costs (10 sermons/month):**
- **Claude**: $1-3/month
- **Bible**: Free or $0.10/month
- **Total**: ~$1-3/month (vs $30-50 for competitors)

---

## 🎉 SUCCESS METRICS

### **User Experience:**
- Upload sermon → See slides in **under 60 seconds**
- **90%+ accuracy** on scripture detection
- **80%+ accuracy** on point identification
- **Zero manual formatting** needed

### **Technical:**
- Parse 95%+ of documents successfully
- Handle 100-page sermon notes
- Support 50+ different Bible books
- Generate 1-50 slides per sermon

---

## 📞 SUPPORT & ERROR RECOVERY

### **When AI Misses Scriptures:**
- Show "Review scriptures" button
- Let user manually add missed references
- Learn from corrections (future enhancement)

### **When AI Misses Points:**
- Show "Add point" button
- Let user manually add points
- Suggest based on headers in document

### **When File Won't Parse:**
- Offer "Copy/paste text" fallback
- Show helpful error message
- Suggest file format conversion

---

## 🔮 FUTURE VISION

**Phase 1**: Upload notes → Get slides (THIS PLAN)  
**Phase 2**: Speak sermon → AI generates slides (voice recognition)  
**Phase 3**: Import from popular sermon prep tools  
**Phase 4**: AI suggests improvements to sermon structure  
**Phase 5**: Multi-language support  

---

**STATUS**: 📋 **READY TO BUILD**  
**COMPLEXITY**: High (but achievable in 4 weeks)  
**IMPACT**: 🚀 **GAME-CHANGING** for pastors  
**UNIQUENESS**: First-of-its-kind in church presentation software

---

**Would you like me to start implementing this? I recommend starting with Phase 1 (file upload & parsing) to establish the foundation.**
