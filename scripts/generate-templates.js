// Script to generate slide templates file with gradient backgrounds
const fs = require('fs');
const path = require('path');

const PLACEHOLDER_THUMB = 'data:image/svg+xml,%3Csvg width="320" height="180" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%234b6cb7;stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:%23182f4a;stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width="320" height="180" fill="url(%23g)"/%3E%3C/svg%3E';

const header = `/**
 * SLIDE TEMPLATES - PROFESSIONAL DESIGNS
 * All templates use gradient/solid backgrounds - NO external image dependencies
 * Thumbnails show the actual template design
 */

console.log('📦 Template system loaded - Using gradient backgrounds');

export interface SlideTemplate {
  id: string;
  name: string;
  category: 'sermon' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'offering' | 'generic';
  thumbnail: string;
  description: string;
  visualData: {
    elements: Array<{
      id: string;
      type: 'text' | 'image' | 'shape';
      content?: string;
      position: { x: number; y: number };
      size: { width: number; height: number };
      fontSize?: number;
      fontFamily?: string;
      fontWeight?: number;
      fontStyle?: string;
      color?: string;
      textAlign?: 'left' | 'center' | 'right';
      zIndex?: number;
      opacity?: number;
      backgroundColor?: string;
      borderRadius?: number;
      rotation?: number;
    }>;
    backgroundType?: 'color' | 'image' | 'gradient';
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundGradient?: string;
  };
}

const PLACEHOLDER_THUMB = '${PLACEHOLDER_THUMB}';

`;

const templates = {
  announcement: `
export const ANNOUNCEMENT_TEMPLATES: SlideTemplate[] = [
  {
    id: 'announcement-gradient-1',
    name: 'Blue Gradient',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Professional blue gradient with multi-line title',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        { id: 'church-name', type: 'text', content: 'YOUR CHURCH NAME', position: { x: 560, y: 200 }, size: { width: 800, height: 60 }, fontSize: 24, fontWeight: 400, fontFamily: 'Inter', color: '#E0E0E0', textAlign: 'center', zIndex: 10 },
        { id: 'greeting', type: 'text', content: 'Important Announcement', position: { x: 460, y: 280 }, size: { width: 1000, height: 80 }, fontSize: 56, fontWeight: 400, fontFamily: 'Georgia', fontStyle: 'italic', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'main-message', type: 'text', content: 'BOLD STATEMENT', position: { x: 160, y: 420 }, size: { width: 1600, height: 200 }, fontSize: 90, fontWeight: 900, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'details', type: 'text', content: 'Join us for this special event', position: { x: 460, y: 680 }, size: { width: 1000, height: 60 }, fontSize: 32, fontWeight: 400, fontFamily: 'Inter', color: '#D0D0D0', textAlign: 'center', zIndex: 10 },
        { id: 'date', type: 'text', content: 'SUNDAY, 10:00 AM', position: { x: 1420, y: 960 }, size: { width: 400, height: 50 }, fontSize: 22, fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'right', zIndex: 10 },
      ],
    },
  },
  {
    id: 'announcement-card-1',
    name: 'White Card',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Clean white card on blue gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4b6cb7 0%, #182f4a 100%)',
      elements: [
        { id: 'card', type: 'shape', content: '', position: { x: 360, y: 240 }, size: { width: 1200, height: 600 }, backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: 16, zIndex: 8 },
        { id: 'header', type: 'text', content: 'SPECIAL ANNOUNCEMENT', position: { x: 460, y: 300 }, size: { width: 1000, height: 50 }, fontSize: 22, fontWeight: 600, fontFamily: 'Inter', color: '#666666', textAlign: 'center', zIndex: 10 },
        { id: 'main-message', type: 'text', content: 'Important Update', position: { x: 460, y: 420 }, size: { width: 1000, height: 180 }, fontSize: 72, fontWeight: 800, fontFamily: 'Inter', color: '#1a1a1a', textAlign: 'center', zIndex: 10 },
        { id: 'details', type: 'text', content: 'Join us this Sunday', position: { x: 460, y: 640 }, size: { width: 1000, height: 100 }, fontSize: 28, fontWeight: 400, fontFamily: 'Inter', color: '#444444', textAlign: 'center', zIndex: 10 },
        { id: 'footer', type: 'text', content: 'SUNDAY SERVICE • 10:00 AM', position: { x: 460, y: 770 }, size: { width: 1000, height: 40 }, fontSize: 20, fontWeight: 600, fontFamily: 'Inter', color: '#666666', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
  welcome: `
export const WELCOME_TEMPLATES: SlideTemplate[] = [
  {
    id: 'welcome-warm-1',
    name: 'Warm Welcome',
    category: 'welcome',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Friendly welcome with warm gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        { id: 'church-name', type: 'text', content: 'COMMUNITY CHURCH', position: { x: 660, y: 240 }, size: { width: 600, height: 50 }, fontSize: 20, fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'greeting', type: 'text', content: 'Welcome', position: { x: 660, y: 320 }, size: { width: 600, height: 80 }, fontSize: 56, fontWeight: 300, fontFamily: 'Georgia', fontStyle: 'italic', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'main-title', type: 'text', content: "WE'RE GLAD\\nYOU'RE HERE", position: { x: 360, y: 440 }, size: { width: 1200, height: 250 }, fontSize: 80, fontWeight: 800, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'date', type: 'text', content: 'SUNDAY WORSHIP • 10:00 AM', position: { x: 560, y: 780 }, size: { width: 800, height: 50 }, fontSize: 24, fontWeight: 600, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
  closing: `
export const CLOSING_TEMPLATES: SlideTemplate[] = [
  {
    id: 'closing-peaceful-1',
    name: 'Peaceful Blessing',
    category: 'closing',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Calming gradient with benediction',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      elements: [
        { id: 'pre-text', type: 'text', content: 'Benediction', position: { x: 660, y: 280 }, size: { width: 600, height: 60 }, fontSize: 36, fontWeight: 300, fontFamily: 'Georgia', fontStyle: 'italic', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'main-title', type: 'text', content: 'GO IN PEACE\\nSERVE THE LORD', position: { x: 360, y: 420 }, size: { width: 1200, height: 220 }, fontSize: 68, fontWeight: 800, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'response', type: 'text', content: 'Thanks Be To God', position: { x: 560, y: 700 }, size: { width: 800, height: 60 }, fontSize: 32, fontWeight: 400, fontFamily: 'Georgia', fontStyle: 'italic', color: '#E8E8E8', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
  sermon: `
export const SERMON_TEMPLATES: SlideTemplate[] = [
  {
    id: 'sermon-title-1',
    name: 'Sermon Title',
    category: 'sermon',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Professional sermon title with speaker info',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      elements: [
        { id: 'series-label', type: 'text', content: 'SERMON SERIES', position: { x: 660, y: 220 }, size: { width: 600, height: 40 }, fontSize: 20, fontWeight: 700, fontFamily: 'Inter', color: '#64b5f6', textAlign: 'center', zIndex: 10 },
        { id: 'sermon-title', type: 'text', content: 'SERMON TITLE', position: { x: 260, y: 380 }, size: { width: 1400, height: 220 }, fontSize: 80, fontWeight: 900, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'scripture', type: 'text', content: 'Scripture Reference', position: { x: 560, y: 650 }, size: { width: 800, height: 60 }, fontSize: 32, fontWeight: 400, fontFamily: 'Georgia', fontStyle: 'italic', color: '#B0BEC5', textAlign: 'center', zIndex: 10 },
        { id: 'pastor', type: 'text', content: 'Pastor Name', position: { x: 660, y: 800 }, size: { width: 600, height: 50 }, fontSize: 26, fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
  scripture: `
export const SCRIPTURE_TEMPLATES: SlideTemplate[] = [
  {
    id: 'scripture-verse-1',
    name: 'Scripture Verse',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Clean scripture display with reference',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #8e9eab 0%, #eef2f3 100%)',
      elements: [
        { id: 'verse-text', type: 'text', content: '"For God so loved the world..."', position: { x: 260, y: 360 }, size: { width: 1400, height: 300 }, fontSize: 42, fontWeight: 400, fontFamily: 'Georgia', fontStyle: 'italic', color: '#2c3e50', textAlign: 'center', zIndex: 10 },
        { id: 'reference', type: 'text', content: 'John 3:16 NIV', position: { x: 660, y: 720 }, size: { width: 600, height: 60 }, fontSize: 32, fontWeight: 700, fontFamily: 'Inter', color: '#546e7a', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
  offering: `
export const OFFERING_TEMPLATES: SlideTemplate[] = [
  {
    id: 'offering-generous-1',
    name: 'Generous Giving',
    category: 'offering',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Offering slide with scripture',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      elements: [
        { id: 'title', type: 'text', content: 'OFFERING', position: { x: 660, y: 300 }, size: { width: 600, height: 80 }, fontSize: 56, fontWeight: 800, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'verse', type: 'text', content: '"God loves a cheerful giver"', position: { x: 460, y: 480 }, size: { width: 1000, height: 120 }, fontSize: 36, fontWeight: 400, fontFamily: 'Georgia', fontStyle: 'italic', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
        { id: 'reference', type: 'text', content: '2 Corinthians 9:7', position: { x: 660, y: 650 }, size: { width: 600, height: 50 }, fontSize: 26, fontWeight: 600, fontFamily: 'Inter', color: '#E8F5E9', textAlign: 'center', zIndex: 10 },
        { id: 'methods', type: 'text', content: 'Give Online • Text • Offering Boxes', position: { x: 510, y: 820 }, size: { width: 900, height: 50 }, fontSize: 22, fontWeight: 500, fontFamily: 'Inter', color: '#FFFFFF', textAlign: 'center', zIndex: 10 },
      ],
    },
  },
];
`,
};

const footer = `
// Helper function to get templates by category
export function getTemplatesByCategory(category: SlideTemplate['category']): SlideTemplate[] {
  const allTemplates = [
    ...ANNOUNCEMENT_TEMPLATES,
    ...WELCOME_TEMPLATES,
    ...CLOSING_TEMPLATES,
    ...SERMON_TEMPLATES,
    ...SCRIPTURE_TEMPLATES,
    ...OFFERING_TEMPLATES,
  ];
  return allTemplates.filter(t => t.category === category);
}

// Export all templates
export const ALL_TEMPLATES = [
  ...ANNOUNCEMENT_TEMPLATES,
  ...WELCOME_TEMPLATES,
  ...CLOSING_TEMPLATES,
  ...SERMON_TEMPLATES,
  ...SCRIPTURE_TEMPLATES,
  ...OFFERING_TEMPLATES,
];
`;

const fullFile = header + templates.announcement + templates.welcome + templates.closing + templates.sermon + templates.scripture + templates.offering + footer;

const outputPath = path.join(__dirname, '..', 'src', 'config', 'slideTemplatesFixed.ts');
fs.writeFileSync(outputPath, fullFile, 'utf8');

console.log('✅ Generated slideTemplatesFixed.ts');
console.log(`📊 Created templates for:`);
console.log('   - Announcements (2)');
console.log('   - Welcome (1)');
console.log('   - Closing (1)');
console.log('   - Sermon (1)');
console.log('   - Scripture (1)');
console.log('   - Offering (1)');
console.log(`📁 File: ${outputPath}`);
