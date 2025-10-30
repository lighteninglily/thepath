/**
 * PROFESSIONAL "PRO" TEMPLATES - World-Class Quality
 * 
 * These are showcase templates demonstrating the new professional standard.
 * Each template has 5-8+ elements with rich visual hierarchy.
 * 
 * KEY FEATURES:
 * ✓ 4-level text hierarchy (label, title, subtitle, details)
 * ✓ Decorative shapes (circles, lines, bars, frames)
 * ✓ Advanced typography (letterSpacing, lineHeight, textTransform)
 * ✓ Rich visual elements (borders, shadows, accents)
 * ✓ Professional composition
 * 
 * USE THESE AS TEMPLATES TO UPGRADE ALL EXISTING TEMPLATES!
 */

import type { SlideTemplate } from './slideTemplatesFixed';

const PLACEHOLDER_THUMB = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Qcm8gVGVtcGxhdGU8L3RleHQ+PC9zdmc+';

// ========================================
// SHOWCASE: ANNOUNCEMENT PRO TEMPLATES
// ========================================

export const ANNOUNCEMENT_PRO_TEMPLATES: SlideTemplate[] = [
  {
    id: 'announcement-bold-impact-pro',
    name: 'Bold Impact Pro',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: '⭐ Professional announcement with rich visual hierarchy and decorative elements',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        // LAYER 1: Decorative Elements
        // Corner decoration (top-left)
        {
          id: 'corner-circle',
          type: 'shape',
          position: { x: 60, y: 60 },
          size: { width: 100, height: 100 },
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 50,
          zIndex: 5,
        },
        
        // Side bar accent (left)
        {
          id: 'left-bar',
          type: 'shape',
          position: { x: 340, y: 360 },
          size: { width: 6, height: 280 },
          backgroundColor: '#FFFFFF',
          opacity: 0.4,
          borderRadius: 3,
          zIndex: 7,
        },
        
        // Side bar accent (right)
        {
          id: 'right-bar',
          type: 'shape',
          position: { x: 1574, y: 360 },
          size: { width: 6, height: 280 },
          backgroundColor: '#FFFFFF',
          opacity: 0.4,
          borderRadius: 3,
          zIndex: 7,
        },
        
        // Label background card
        {
          id: 'label-card',
          type: 'shape',
          position: { x: 760, y: 220 },
          size: { width: 400, height: 50 },
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 25,
          zIndex: 8,
        },
        
        // LAYER 2: Typography Hierarchy
        // Small label (Level 1)
        {
          id: 'label',
          type: 'text',
          content: 'ANNOUNCEMENT',
          position: { x: 760, y: 228 },
          size: { width: 400, height: 35 },
          fontSize: 15,
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Huge main title (Level 2)
        {
          id: 'main-title',
          type: 'text',
          content: 'YOUTH GROUP\nFRIDAY NIGHT',
          position: { x: 360, y: 360 },
          size: { width: 1200, height: 240 },
          fontSize: 92,
          fontWeight: 900,
          lineHeight: 1.1,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Medium subtitle (Level 3)
        {
          id: 'subtitle',
          type: 'text',
          content: 'Join us for games, worship, and fellowship',
          position: { x: 460, y: 640 },
          size: { width: 1000, height: 50 },
          fontSize: 26,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.95)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Bottom divider
        {
          id: 'divider',
          type: 'shape',
          position: { x: 760, y: 720 },
          size: { width: 400, height: 2 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 8,
        },
        
        // Small details (Level 4)
        {
          id: 'details',
          type: 'text',
          content: '7:00 PM • Fellowship Hall',
          position: { x: 660, y: 750 },
          size: { width: 600, height: 50 },
          fontSize: 24,
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Decorative dots (bottom-right)
        {
          id: 'dot-1',
          type: 'shape',
          position: { x: 1700, y: 920 },
          size: { width: 20, height: 20 },
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 10,
          zIndex: 5,
        },
        {
          id: 'dot-2',
          type: 'shape',
          position: { x: 1740, y: 920 },
          size: { width: 20, height: 20 },
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 10,
          zIndex: 5,
        },
        {
          id: 'dot-3',
          type: 'shape',
          position: { x: 1780, y: 920 },
          size: { width: 20, height: 20 },
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderRadius: 10,
          zIndex: 5,
        },
      ],
    },
  },
  
  {
    id: 'announcement-elegant-frame-pro',
    name: 'Elegant Frame Pro',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: '⭐ Sophisticated frame design with geometric accents',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      elements: [
        // Main decorative frame
        {
          id: 'main-frame',
          type: 'shape',
          position: { x: 340, y: 280 },
          size: { width: 1240, height: 520 },
          backgroundColor: 'transparent',
          border: '3px solid rgba(255, 255, 255, 0.25)',
          borderRadius: 8,
          zIndex: 7,
        },
        
        // Inner frame
        {
          id: 'inner-frame',
          type: 'shape',
          position: { x: 380, y: 320 },
          size: { width: 1160, height: 440 },
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 4,
          zIndex: 6,
        },
        
        // Top corner accents
        {
          id: 'top-left-accent',
          type: 'shape',
          position: { x: 320, y: 260 },
          size: { width: 60, height: 60 },
          backgroundColor: 'transparent',
          border: '4px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 4,
          transform: 'rotate(45deg)',
          zIndex: 9,
        },
        
        {
          id: 'top-right-accent',
          type: 'shape',
          position: { x: 1540, y: 260 },
          size: { width: 60, height: 60 },
          backgroundColor: 'transparent',
          border: '4px solid rgba(255, 255, 255, 0.4)',
          borderRadius: 4,
          transform: 'rotate(45deg)',
          zIndex: 9,
        },
        
        // Label
        {
          id: 'label',
          type: 'text',
          content: 'UPCOMING EVENT',
          position: { x: 760, y: 360 },
          size: { width: 400, height: 30 },
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Main title
        {
          id: 'title',
          type: 'text',
          content: 'COMMUNITY\nOUTREACH',
          position: { x: 460, y: 420 },
          size: { width: 1000, height: 180 },
          fontSize: 76,
          fontWeight: 900,
          lineHeight: 1.15,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Subtitle
        {
          id: 'subtitle',
          type: 'text',
          content: 'Serving our neighborhood together',
          position: { x: 560, y: 630 },
          size: { width: 800, height: 50 },
          fontSize: 26,
          fontWeight: 400,
          fontStyle: 'italic',
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Details
        {
          id: 'details',
          type: 'text',
          content: 'Saturday 9:00 AM • City Park',
          position: { x: 660, y: 710 },
          size: { width: 600, height: 40 },
          fontSize: 22,
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// SHOWCASE: SONG PRO TEMPLATES
// ========================================

export const SONG_PRO_TEMPLATES: SlideTemplate[] = [
  {
    id: 'song-purple-wave-pro',
    name: 'Purple Wave Pro',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: '⭐ Modern worship with decorative corners and side accents',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        // Top decorative circles
        {
          id: 'top-circle-1',
          type: 'shape',
          position: { x: 120, y: 120 },
          size: { width: 80, height: 80 },
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 40,
          zIndex: 5,
        },
        
        {
          id: 'top-circle-2',
          type: 'shape',
          position: { x: 1720, y: 140 },
          size: { width: 60, height: 60 },
          backgroundColor: 'rgba(255, 255, 255, 0.06)',
          borderRadius: 30,
          zIndex: 5,
        },
        
        // Side accent bars
        {
          id: 'left-accent',
          type: 'shape',
          position: { x: 220, y: 380 },
          size: { width: 4, height: 320 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
          zIndex: 7,
        },
        
        {
          id: 'right-accent',
          type: 'shape',
          position: { x: 1696, y: 380 },
          size: { width: 4, height: 320 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 2,
          zIndex: 7,
        },
        
        // Small label
        {
          id: 'verse-label',
          type: 'text',
          content: 'VERSE 1',
          position: { x: 860, y: 300 },
          size: { width: 200, height: 25 },
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Main lyrics
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Amazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost but now I\'m found\nWas blind but now I see',
          position: { x: 260, y: 380 },
          size: { width: 1400, height: 320 },
          fontSize: 52,
          fontWeight: 700,
          lineHeight: 1.4,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Bottom accent line
        {
          id: 'bottom-line',
          type: 'shape',
          position: { x: 660, y: 780 },
          size: { width: 600, height: 3 },
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          borderRadius: 1.5,
          zIndex: 8,
        },
        
        // Bottom dots
        {
          id: 'dot-1',
          type: 'shape',
          position: { x: 900, y: 850 },
          size: { width: 16, height: 16 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 8,
          zIndex: 5,
        },
        {
          id: 'dot-2',
          type: 'shape',
          position: { x: 940, y: 850 },
          size: { width: 16, height: 16 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 8,
          zIndex: 5,
        },
        {
          id: 'dot-3',
          type: 'shape',
          position: { x: 980, y: 850 },
          size: { width: 16, height: 16 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: 8,
          zIndex: 5,
        },
      ],
    },
  },
];

// ========================================
// SHOWCASE: SCRIPTURE PRO TEMPLATES
// ========================================

export const SCRIPTURE_PRO_TEMPLATES: SlideTemplate[] = [
  {
    id: 'scripture-elegant-pro',
    name: 'Elegant Scripture Pro',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: '⭐ Beautiful verse display with cross and decorative frame',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      elements: [
        // Subtle cross shape (top)
        {
          id: 'cross-vertical',
          type: 'shape',
          position: { x: 956, y: 140 },
          size: { width: 8, height: 80 },
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 4,
          zIndex: 5,
        },
        {
          id: 'cross-horizontal',
          type: 'shape',
          position: { x: 926, y: 170 },
          size: { width: 68, height: 8 },
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 4,
          zIndex: 5,
        },
        
        // Verse card background
        {
          id: 'verse-card',
          type: 'shape',
          position: { x: 360, y: 320 },
          size: { width: 1200, height: 360 },
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 12,
          border: '2px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          zIndex: 6,
        },
        
        // Opening quote mark decoration
        {
          id: 'quote-mark',
          type: 'text',
          content: '"',
          position: { x: 400, y: 320 },
          size: { width: 80, height: 80 },
          fontSize: 120,
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.15)',
          textAlign: 'left',
          zIndex: 7,
        },
        
        // Verse text
        {
          id: 'verse-text',
          type: 'text',
          content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          position: { x: 420, y: 380 },
          size: { width: 1080, height: 240 },
          fontSize: 38,
          fontWeight: 500,
          lineHeight: 1.6,
          fontStyle: 'italic',
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Divider line
        {
          id: 'divider',
          type: 'shape',
          position: { x: 760, y: 720 },
          size: { width: 400, height: 2 },
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          zIndex: 8,
        },
        
        // Reference
        {
          id: 'reference',
          type: 'text',
          content: 'JOHN 3:16',
          position: { x: 760, y: 750 },
          size: { width: 400, height: 40 },
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          zIndex: 10,
        },
        
        // Bottom decoration - book icon representation
        {
          id: 'book-base',
          type: 'shape',
          position: { x: 910, y: 880 },
          size: { width: 100, height: 80 },
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          zIndex: 5,
        },
        {
          id: 'book-pages',
          type: 'shape',
          position: { x: 930, y: 890 },
          size: { width: 60, height: 2 },
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: 6,
        },
      ],
    },
  },
];

// Export all pro templates
export const ALL_PRO_TEMPLATES: SlideTemplate[] = [
  ...ANNOUNCEMENT_PRO_TEMPLATES,
  ...SONG_PRO_TEMPLATES,
  ...SCRIPTURE_PRO_TEMPLATES,
];

// Helper to get pro templates by category
export function getProTemplatesByCategory(category: SlideTemplate['category']): SlideTemplate[] {
  return ALL_PRO_TEMPLATES.filter(template => template.category === category);
}
