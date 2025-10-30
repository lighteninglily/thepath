/**
 * Curated background images for worship slides
 * Using Unsplash for high-quality free images
 */

export interface BackgroundImage {
  id: string;
  name: string;
  url: string;
  category: 'mountains' | 'nature' | 'water' | 'sky' | 'abstract' | 'light' | 'waves' | 'clouds' | 'cross' | 'worship';
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
    id: 'mountain-2',
    name: 'Snowy Mountain Peaks',
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Blue/white tones',
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
    id: 'mountain-4',
    name: 'Mountain Lake Dusk',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Blue/purple tones',
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
  {
    id: 'mountain-6',
    name: 'Blue Hour Mountains',
    url: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1920&q=80',
    category: 'mountains',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Deep blue tones',
  },

  // Nature - Peaceful & Green (Forests, fields, trees only)
  {
    id: 'nature-1',
    name: 'Forest Path Sunlight',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80',
    category: 'nature',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'nature-2',
    name: 'Green Meadow Field',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80',
    category: 'nature',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'nature-3',
    name: 'Forest Trees',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80',
    category: 'nature',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'nature-4',
    name: 'Sunlit Green Leaves',
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80',
    category: 'nature',
    textColor: 'dark',
    mood: 'joyful',
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
  {
    id: 'waves-4',
    name: 'Calm Blue Waters',
    url: 'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Blue/teal',
  },
  {
    id: 'waves-5',
    name: 'Ocean Horizon',
    url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Teal/blue',
  },
  {
    id: 'waves-6',
    name: 'Deep Sea Blue',
    url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1920&q=80',
    category: 'waves',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Deep blue',
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
    id: 'clouds-2',
    name: 'Wispy Cloud Layers',
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    category: 'clouds',
    textColor: 'dark',
    mood: 'joyful',
    palette: 'Blue/white',
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
    mood: 'joyful',
    palette: 'Light blue/white',
  },
  {
    id: 'clouds-5',
    name: 'Serene Sky View',
    url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=1920&q=80',
    category: 'clouds',
    textColor: 'dark',
    mood: 'peaceful',
    palette: 'Blue/white',
  },
  {
    id: 'clouds-6',
    name: 'Peaceful Cloud Cover',
    url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80',
    category: 'clouds',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Blue/gray/white',
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
