/**
 * PROFESSIONAL CHURCH SLIDE TEMPLATES - 2025 Edition
 * 
 * Based on 2025 design trends:
 * ✓ Dynamic gradients with depth
 * ✓ Bold, impactful typography
 * ✓ Clean minimalist layouts
 * ✓ Strategic use of white space
 * ✓ Subtle textures and overlays
 * ✓ Professional color palettes
 * 
 * 30+ templates across all categories
 * NO external dependencies - pure CSS gradients
 */

const PLACEHOLDER_THUMB = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5UZW1wbGF0ZTwvdGV4dD48L3N2Zz4=';

export interface SlideTemplate {
  id: string;
  name: string;
  category: 'sermon' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'offering' | 'song' | 'generic';
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
      color?: string;
      textAlign?: 'left' | 'center' | 'right';
      zIndex?: number;
      backgroundColor?: string;
      borderRadius?: number;
      opacity?: number;
    }>;
    backgroundGradient?: string;
    backgroundColor?: string;
  };
}

// ========================================
// SONG / WORSHIP LYRICS TEMPLATES (10)
// ========================================

export const SONG_TEMPLATES: SlideTemplate[] = [
  {
    id: 'song-gradient-purple-modern',
    name: 'Purple Wave',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Modern purple gradient with bold centered lyrics',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Amazing grace how sweet the sound\nThat saved a wretch like me',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 56,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-ocean-calm',
    name: 'Ocean Calm',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Calming blue gradient for reflective worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 5,
        },
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Be still and know that I am God\nBe still and know',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 58,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-fire',
    name: 'Holy Fire',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Energetic warm gradient for upbeat worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Holy Spirit living breath of God\nBreathe new life into my willing soul',
          position: { x: 240, y: 360 },
          size: { width: 1440, height: 360 },
          fontSize: 52,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-gold-royal',
    name: 'Royal Gold',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Elegant gold gradient for majestic songs',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff6e7f 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 5,
        },
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'How great is our God\nSing with me how great is our God',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 60,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-emerald',
    name: 'Emerald Peace',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Peaceful green gradient for contemplative worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 5,
        },
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'The Lord is my shepherd I shall not want\nHe makes me lie down in green pastures',
          position: { x: 240, y: 360 },
          size: { width: 1440, height: 360 },
          fontSize: 50,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-dark-elegant',
    name: 'Dark Elegance',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Sophisticated dark gradient with white text',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      elements: [
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'In Christ alone my hope is found\nHe is my light my strength my song',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 56,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-sunset',
    name: 'Sunset Worship',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Warm sunset gradient for evening services',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.15)',
          zIndex: 5,
        },
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Great is Thy faithfulness\nMorning by morning new mercies I see',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 54,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-deep-blue',
    name: 'Deep Waters',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Deep blue gradient for powerful worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
      elements: [
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Oceans where feet may fail\nAnd there I find You in the mystery',
          position: { x: 240, y: 380 },
          size: { width: 1440, height: 320 },
          fontSize: 56,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-soft-pink',
    name: 'Gentle Grace',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Soft pink gradient for gentle worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          zIndex: 5,
        },
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'Your grace is enough\nHeaven reaching down to us',
          position: { x: 240, y: 400 },
          size: { width: 1440, height: 280 },
          fontSize: 58,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'song-gradient-crimson',
    name: 'Crimson Love',
    category: 'song',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Rich red gradient for passionate worship',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #c94b4b 0%, #4b134f 100%)',
      elements: [
        {
          id: 'lyrics-main',
          type: 'text',
          content: 'The blood of Jesus washes white as snow\nI am redeemed by His great love',
          position: { x: 240, y: 360 },
          size: { width: 1440, height: 360 },
          fontSize: 52,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// ANNOUNCEMENT TEMPLATES (8)
// ========================================

export const ANNOUNCEMENT_TEMPLATES: SlideTemplate[] = [
  {
    id: 'announcement-bold-modern',
    name: 'Bold Impact',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'High-impact announcement with bold typography',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        {
          id: 'label',
          type: 'text',
          content: 'ANNOUNCEMENT',
          position: { x: 760, y: 280 },
          size: { width: 400, height: 40 },
          fontSize: 18,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'YOUTH GROUP\nFRIDAY NIGHT',
          position: { x: 360, y: 340 },
          size: { width: 1200, height: 240 },
          fontSize: 84,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: '7:00 PM • Fellowship Hall',
          position: { x: 660, y: 620 },
          size: { width: 600, height: 60 },
          fontSize: 28,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-card-white',
    name: 'Clean Card',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Professional white card on gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        {
          id: 'card',
          type: 'shape',
          position: { x: 360, y: 240 },
          size: { width: 1200, height: 600 },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 24,
          zIndex: 8,
        },
        {
          id: 'label',
          type: 'text',
          content: 'UPCOMING EVENT',
          position: { x: 560, y: 320 },
          size: { width: 800, height: 40 },
          fontSize: 16,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: '#f5576c',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'COMMUNITY\nOUTREACH',
          position: { x: 460, y: 380 },
          size: { width: 1000, height: 200 },
          fontSize: 72,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Saturday 9 AM • City Park',
          position: { x: 660, y: 620 },
          size: { width: 600, height: 60 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: '#666666',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-minimal-dark',
    name: 'Dark Minimal',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Elegant dark background with clean typography',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      elements: [
        {
          id: 'accent-line',
          type: 'shape',
          position: { x: 360, y: 420 },
          size: { width: 120, height: 6 },
          backgroundColor: '#3498db',
          borderRadius: 3,
          zIndex: 8,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'SPECIAL WORSHIP\nNIGHT',
          position: { x: 360, y: 460 },
          size: { width: 1200, height: 200 },
          fontSize: 76,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'left',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Join us this Wednesday at 7 PM',
          position: { x: 360, y: 700 },
          size: { width: 800, height: 60 },
          fontSize: 26,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'left',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-gradient-teal',
    name: 'Fresh Teal',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Fresh teal gradient for modern announcements',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 5,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'VACATION BIBLE\nSCHOOL',
          position: { x: 360, y: 380 },
          size: { width: 1200, height: 240 },
          fontSize: 80,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Registration Now Open • Ages 5-12',
          position: { x: 560, y: 660 },
          size: { width: 800, height: 60 },
          fontSize: 28,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-split-design',
    name: 'Split Design',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Modern split-screen announcement',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        {
          id: 'left-panel',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 960, height: 1080 },
          backgroundColor: '#2a2a2a',
          zIndex: 5,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'NEW\nMEMBERS\nCLASS',
          position: { x: 120, y: 340 },
          size: { width: 720, height: 400 },
          fontSize: 90,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'left',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'SUNDAYS\n10:30 AM\nROOM 201',
          position: { x: 1080, y: 400 },
          size: { width: 720, height: 280 },
          fontSize: 48,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-warm-orange',
    name: 'Warm Welcome',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Warm orange gradient for friendly announcements',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #fa8231 0%, #fcb045 100%)',
      elements: [
        {
          id: 'main-title',
          type: 'text',
          content: 'FAMILY\nPICNIC',
          position: { x: 360, y: 340 },
          size: { width: 1200, height: 240 },
          fontSize: 96,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Sunday After Service • Bring a Dish to Share',
          position: { x: 460, y: 640 },
          size: { width: 1000, height: 80 },
          fontSize: 30,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.95)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-royal-purple',
    name: 'Royal Purple',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Elegant purple for special events',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
      elements: [
        {
          id: 'card',
          type: 'shape',
          position: { x: 460, y: 320 },
          size: { width: 1000, height: 440 },
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 20,
          zIndex: 8,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'EASTER\nCELEBRATION',
          position: { x: 560, y: 400 },
          size: { width: 800, height: 200 },
          fontSize: 70,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Sunrise Service 6 AM • Main Service 10 AM',
          position: { x: 560, y: 640 },
          size: { width: 800, height: 60 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'announcement-vibrant-multi',
    name: 'Vibrant Energy',
    category: 'announcement',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Energetic multi-color gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      elements: [
        {
          id: 'label',
          type: 'text',
          content: 'DON\'T MISS',
          position: { x: 760, y: 300 },
          size: { width: 400, height: 40 },
          fontSize: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'main-title',
          type: 'text',
          content: 'PRAYER\nWALK',
          position: { x: 460, y: 360 },
          size: { width: 1000, height: 260 },
          fontSize: 100,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'details',
          type: 'text',
          content: 'Saturday Morning • Meet at the Church',
          position: { x: 560, y: 660 },
          size: { width: 800, height: 60 },
          fontSize: 26,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// SCRIPTURE TEMPLATES (5)
// ========================================

export const SCRIPTURE_TEMPLATES: SlideTemplate[] = [
  {
    id: 'scripture-elegant-serif',
    name: 'Elegant Scripture',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Classic serif typography for Bible verses',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      elements: [
        {
          id: 'verse-text',
          type: 'text',
          content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
          position: { x: 360, y: 340 },
          size: { width: 1200, height: 320 },
          fontSize: 48,
          fontFamily: 'Georgia, serif',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: 'JOHN 3:16',
          position: { x: 760, y: 720 },
          size: { width: 400, height: 50 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'scripture-modern-card',
    name: 'Modern Card',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Contemporary white card for scripture',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        {
          id: 'card',
          type: 'shape',
          position: { x: 360, y: 280 },
          size: { width: 1200, height: 520 },
          backgroundColor: 'rgba(255, 255, 255, 0.97)',
          borderRadius: 20,
          zIndex: 8,
        },
        {
          id: 'verse-text',
          type: 'text',
          content: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
          position: { x: 460, y: 380 },
          size: { width: 1000, height: 280 },
          fontSize: 40,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: 'PROVERBS 3:5-6',
          position: { x: 660, y: 700 },
          size: { width: 600, height: 50 },
          fontSize: 22,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#764ba2',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'scripture-gradient-calm',
    name: 'Peaceful Waters',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Calming blue gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 5,
        },
        {
          id: 'verse-text',
          type: 'text',
          content: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters.',
          position: { x: 360, y: 360 },
          size: { width: 1200, height: 280 },
          fontSize: 44,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: 'PSALM 23:1-2',
          position: { x: 760, y: 700 },
          size: { width: 400, height: 50 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'scripture-warm-gold',
    name: 'Golden Light',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Warm golden gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      elements: [
        {
          id: 'verse-text',
          type: 'text',
          content: 'I can do all this through him who gives me strength.',
          position: { x: 360, y: 420 },
          size: { width: 1200, height: 180 },
          fontSize: 52,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: 'PHILIPPIANS 4:13',
          position: { x: 760, y: 660 },
          size: { width: 400, height: 50 },
          fontSize: 26,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#ff6e7f',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'scripture-deep-purple',
    name: 'Deep Reflection',
    category: 'scripture',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Rich purple for contemplative verses',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)',
      elements: [
        {
          id: 'verse-text',
          type: 'text',
          content: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.',
          position: { x: 360, y: 380 },
          size: { width: 1200, height: 260 },
          fontSize: 46,
          fontFamily: 'Georgia, serif',
          fontWeight: 400,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: 'PSALM 46:10',
          position: { x: 760, y: 700 },
          size: { width: 400, height: 50 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// SERMON TEMPLATES (4)
// ========================================

export const SERMON_TEMPLATES: SlideTemplate[] = [
  {
    id: 'sermon-bold-title',
    name: 'Bold Statement',
    category: 'sermon',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'High-impact sermon title',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
      elements: [
        {
          id: 'series-label',
          type: 'text',
          content: 'MESSAGE SERIES',
          position: { x: 360, y: 280 },
          size: { width: 1200, height: 40 },
          fontSize: 18,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.5)',
          textAlign: 'left',
          zIndex: 10,
        },
        {
          id: 'sermon-title',
          type: 'text',
          content: 'FAITH\nUNSHAKEABLE',
          position: { x: 360, y: 340 },
          size: { width: 1200, height: 280 },
          fontSize: 100,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'left',
          zIndex: 10,
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Building a Foundation that Lasts',
          position: { x: 360, y: 680 },
          size: { width: 1000, height: 60 },
          fontSize: 28,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'left',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'sermon-gradient-blue',
    name: 'Ocean Deep',
    category: 'sermon',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Deep blue sermon background',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      elements: [
        {
          id: 'sermon-title',
          type: 'text',
          content: 'TRANSFORMED\nBY GRACE',
          position: { x: 360, y: 380 },
          size: { width: 1200, height: 260 },
          fontSize: 88,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'sermon-minimal-white',
    name: 'Clean Focus',
    category: 'sermon',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Minimal white card design',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        {
          id: 'card',
          type: 'shape',
          position: { x: 360, y: 280 },
          size: { width: 1200, height: 520 },
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          borderRadius: 24,
          zIndex: 8,
        },
        {
          id: 'sermon-title',
          type: 'text',
          content: 'WALKING\nIN LIGHT',
          position: { x: 460, y: 400 },
          size: { width: 1000, height: 240 },
          fontSize: 80,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'sermon-warm-energy',
    name: 'Fiery Message',
    category: 'sermon',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Energetic warm gradient',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          zIndex: 5,
        },
        {
          id: 'sermon-title',
          type: 'text',
          content: 'SPIRIT\nEMPOWERED',
          position: { x: 360, y: 360 },
          size: { width: 1200, height: 280 },
          fontSize: 92,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// WELCOME TEMPLATES (3)
// ========================================

export const WELCOME_TEMPLATES: SlideTemplate[] = [
  {
    id: 'welcome-warm-greeting',
    name: 'Warm Welcome',
    category: 'welcome',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Friendly welcome slide',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      elements: [
        {
          id: 'church-name',
          type: 'text',
          content: 'GRACE COMMUNITY CHURCH',
          position: { x: 560, y: 280 },
          size: { width: 800, height: 50 },
          fontSize: 24,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'welcome-text',
          type: 'text',
          content: 'WELCOME',
          position: { x: 460, y: 420 },
          size: { width: 1000, height: 140 },
          fontSize: 110,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'tagline',
          type: 'text',
          content: 'We\'re glad you\'re here today',
          position: { x: 560, y: 620 },
          size: { width: 800, height: 60 },
          fontSize: 30,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'welcome-elegant-blue',
    name: 'Elegant Blue',
    category: 'welcome',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Sophisticated blue welcome',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        {
          id: 'welcome-text',
          type: 'text',
          content: 'WELCOME HOME',
          position: { x: 360, y: 420 },
          size: { width: 1200, height: 140 },
          fontSize: 96,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'church-name',
          type: 'text',
          content: 'Your Church Name',
          position: { x: 660, y: 600 },
          size: { width: 600, height: 60 },
          fontSize: 28,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 500,
          color: 'rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'welcome-minimal-dark',
    name: 'Modern Dark',
    category: 'welcome',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Contemporary dark welcome',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      elements: [
        {
          id: 'welcome-text',
          type: 'text',
          content: 'WELCOME',
          position: { x: 360, y: 360 },
          size: { width: 1200, height: 160 },
          fontSize: 120,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'Join us in worship today',
          position: { x: 560, y: 580 },
          size: { width: 800, height: 60 },
          fontSize: 32,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// CLOSING / BENEDICTION TEMPLATES (2)
// ========================================

export const CLOSING_TEMPLATES: SlideTemplate[] = [
  {
    id: 'closing-peaceful',
    name: 'Peaceful Blessing',
    category: 'closing',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Calm closing slide',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          zIndex: 5,
        },
        {
          id: 'closing-text',
          type: 'text',
          content: 'Go in Peace',
          position: { x: 560, y: 440 },
          size: { width: 800, height: 120 },
          fontSize: 80,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 700,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'subtitle',
          type: 'text',
          content: 'And serve the Lord',
          position: { x: 660, y: 600 },
          size: { width: 600, height: 60 },
          fontSize: 32,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.85)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'closing-warm-gold',
    name: 'Golden Blessing',
    category: 'closing',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Warm benediction slide',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      elements: [
        {
          id: 'closing-text',
          type: 'text',
          content: 'Blessed to Be\na Blessing',
          position: { x: 460, y: 380 },
          size: { width: 1000, height: 260 },
          fontSize: 76,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 800,
          color: '#2a2a2a',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// OFFERING TEMPLATES (2)
// ========================================

export const OFFERING_TEMPLATES: SlideTemplate[] = [
  {
    id: 'offering-elegant',
    name: 'Grateful Giving',
    category: 'offering',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Elegant offering slide',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      elements: [
        {
          id: 'title',
          type: 'text',
          content: 'OFFERING',
          position: { x: 660, y: 360 },
          size: { width: 600, height: 100 },
          fontSize: 72,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 800,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'verse',
          type: 'text',
          content: 'Each of you should give what you have decided\nin your heart to give',
          position: { x: 460, y: 520 },
          size: { width: 1000, height: 120 },
          fontSize: 30,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 400,
          color: 'rgba(255, 255, 255, 0.9)',
          textAlign: 'center',
          zIndex: 10,
        },
        {
          id: 'reference',
          type: 'text',
          content: '2 CORINTHIANS 9:7',
          position: { x: 710, y: 680 },
          size: { width: 500, height: 40 },
          fontSize: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.6)',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
  
  {
    id: 'offering-modern',
    name: 'Generous Hearts',
    category: 'offering',
    thumbnail: PLACEHOLDER_THUMB,
    description: 'Modern offering design',
    visualData: {
      backgroundGradient: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
      elements: [
        {
          id: 'overlay',
          type: 'shape',
          position: { x: 0, y: 0 },
          size: { width: 1920, height: 1080 },
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          zIndex: 5,
        },
        {
          id: 'title',
          type: 'text',
          content: 'TIME OF\nGIVING',
          position: { x: 560, y: 380 },
          size: { width: 800, height: 220 },
          fontSize: 76,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          zIndex: 10,
        },
      ],
    },
  },
];

// ========================================
// EXPORT ALL TEMPLATES
// ========================================

export const ALL_TEMPLATES: SlideTemplate[] = [
  ...SONG_TEMPLATES,
  ...ANNOUNCEMENT_TEMPLATES,
  ...SCRIPTURE_TEMPLATES,
  ...SERMON_TEMPLATES,
  ...WELCOME_TEMPLATES,
  ...CLOSING_TEMPLATES,
  ...OFFERING_TEMPLATES,
];

export function getTemplatesByCategory(category: SlideTemplate['category']): SlideTemplate[] {
  return ALL_TEMPLATES.filter(template => template.category === category);
}

export function getTemplateById(id: string): SlideTemplate | undefined {
  return ALL_TEMPLATES.find(template => template.id === id);
}
