/**
 * Curated background images for worship slides
 * Using Unsplash for high-quality free images
 */

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  category: 'mountains' | 'forest' | 'water' | 'sky' | 'abstract' | 'light' | 'waves' | 'clouds' | 'cross' | 'worship';
  textColor: 'light' | 'dark'; // Which text color works best
  mood: 'peaceful' | 'powerful' | 'joyful' | 'reflective';
  palette?: string; // Color palette description
}

/**
 * Curated collection of worship-appropriate backgrounds
 * Each optimized for readability and beauty
 */
export const WORSHIP_BACKGROUNDS: BackgroundImage[] = [
  // ═══════════════════════════════════════════════════════════
  // MOUNTAINS PACK - Blue/Purple Tones (Consistent Palette)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'mountain-1',
    name: 'Majestic Blue Mountains',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Blue/teal tones',
  },
  {
    id: 'mountain-3',
    name: 'Misty Mountain Range',
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Blue/gray tones',
  },
  {
    id: 'mountain-5',
    name: 'Alpine Mountain Vista',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Blue/purple tones',
  },

  // Nature - Peaceful & Green (Forests, fields, trees only)
  {
    id: 'forest-1',
    name: 'Sunrays Through Trees',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    category: 'forest',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'forest-3',
    name: 'Dense Forest Trees',
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=1920&q=80',
    category: 'forest',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'forest-8',
    name: 'Forest Road with Sunrays',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
    category: 'forest',
    textColor: 'light',
    mood: 'peaceful',
  },

  // ═══════════════════════════════════════════════════════════
  // WAVES PACK - Teal/Blue Ocean Tones (Consistent Palette)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'waves-1',
    name: 'Deep Blue Ocean Waves',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Deep blue/teal',
  },
  {
    id: 'waves-2',
    name: 'Turquoise Sea Surface',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Turquoise/teal',
  },
  {
    id: 'waves-3',
    name: 'Rolling Ocean Tides',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Deep blue/teal',
  },

  // Water - Lakes & Rivers (kept for variety)
  {
    id: 'water-1',
    name: 'Calm Lake Mirror',
    url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80',
    category: 'water',
    textColor: 'dark',
    mood: 'reflective',
  },
  {
    id: 'water-2',
    name: 'Beach Sunrise',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80',
    category: 'water',
    textColor: 'light',
    mood: 'joyful',
  },

  // ═══════════════════════════════════════════════════════════
  // CLOUDS PACK - Soft Blue/White Tones (Consistent Palette)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'clouds-1',
    name: 'Soft Blue Sky Clouds',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80',
    category: 'clouds',
    textColor: 'dark',
    mood: 'peaceful',
    palette: 'Light blue/white',
  },
  {
    id: 'clouds-3',
    name: 'Gentle Sky Clouds',
    url: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=1920&q=80',
    category: 'clouds',
    textColor: 'dark',
    mood: 'peaceful',
    palette: 'Soft blue/white',
  },
  {
    id: 'clouds-4',
    name: 'Heavenly Cloud Formations',
    url: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1920&q=80',
    category: 'clouds',
    textColor: 'dark',
    mood: 'reflective',
    palette: 'Light blue/white',
  },

  // Sky - General (kept for variety)
  {
    id: 'sky-1',
    name: 'Sunset Sky',
    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&q=80',
    category: 'sky',
    textColor: 'light',
    mood: 'peaceful',
  },

  // Abstract - Modern & Artistic (Contemporary art & design)
  {
    id: 'abstract-1',
    name: 'Light Bokeh Blur',
    url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1920&q=80',
    category: 'abstract',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'abstract-2',
    name: 'Color Gradient Flow',
    url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80',
    category: 'abstract',
    textColor: 'light',
    mood: 'powerful',
  },
  {
    id: 'abstract-3',
    name: 'Soft Pastel Colors',
    url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80',
    category: 'abstract',
    textColor: 'dark',
    mood: 'peaceful',
  },
  {
    id: 'abstract-4',
    name: 'Modern Color Waves',
    url: 'https://images.unsplash.com/photo-1561212044-bac5ef688a07?w=1920&q=80',
    category: 'abstract',
    textColor: 'light',
    mood: 'joyful',
  },

  // Light - Bright & Hopeful (Sunlight & bright scenes)
  {
    id: 'light-1',
    name: 'Sun Rays Through Trees',
    url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80',
    category: 'light',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'light-2',
    name: 'Golden Hour Glow',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80',
    category: 'light',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'light-3',
    name: 'Bright Sunshine Sky',
    url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80',
    category: 'light',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'light-4',
    name: 'Sunrise Light Beams',
    url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1920&q=80',
    category: 'light',
    textColor: 'light',
    mood: 'joyful',
  },

  // ═══════════════════════════════════════════════════════════
  // CROSS PACK - Worship & Religious Imagery
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cross-1',
    name: 'Black Cross Silhouette',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=1920&q=80',
    category: 'cross',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Dark/purple sky',
  },
  {
    id: 'cross-2',
    name: 'Cross Under Stars',
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    category: 'cross',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Night sky',
  },
  {
    id: 'cross-3',
    name: 'Wooden Cross Silhouette',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    category: 'cross',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Warm sunset',
  },
];

/**
 * Get backgrounds by category
 */
export function getBackgroundsByCategory(category: BackgroundImage['category']) {
  return WORSHIP_BACKGROUNDS.filter(bg => bg.category === category);
}

/**
 * Get backgrounds suitable for specific text color
 */
export function getBackgroundsForText(textColor: 'light' | 'dark') {
  return WORSHIP_BACKGROUNDS.filter(bg => bg.textColor === textColor);
}

/**
 * Get random background
 */
export function getRandomBackground() {
  return WORSHIP_BACKGROUNDS[Math.floor(Math.random() * WORSHIP_BACKGROUNDS.length)];
}

/**
 * Get random background for text color
 */
export function getRandomBackgroundForText(textColor: 'light' | 'dark') {
  const suitable = getBackgroundsForText(textColor);
  return suitable[Math.floor(Math.random() * suitable.length)];
}

/**
 * Get all backgrounds including local and remote
 */
export async function getAllBackgrounds(): Promise<BackgroundImage[]> {
  try {
    const { LOCAL_BACKGROUNDS } = await import('./localBackgrounds');
    return [...WORSHIP_BACKGROUNDS, ...LOCAL_BACKGROUNDS];
  } catch (e) {
    // Local backgrounds not available, return only remote
    return WORSHIP_BACKGROUNDS;
  }
}
