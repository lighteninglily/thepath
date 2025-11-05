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
    url: './backgrounds/mountain-1.jpg',
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Blue/teal tones',
  },
  {
    id: 'mountain-3',
    name: 'Misty Mountain Range',
    url: './backgrounds/mountain-3.jpg',
    category: 'mountains',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Blue/gray tones',
  },
  {
    id: 'mountain-5',
    name: 'Alpine Mountain Vista',
    url: './backgrounds/mountain-5.jpg',
    category: 'mountains',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Blue/purple tones',
  },

  // Nature - Peaceful & Green (Forests, fields, trees only)
  {
    id: 'forest-1',
    name: 'Sunrays Through Trees',
    url: './backgrounds/forest-1.jpg',
    category: 'forest',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'forest-3',
    name: 'Dense Forest Trees',
    url: './backgrounds/forest-3.jpg',
    category: 'forest',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'forest-8',
    name: 'Forest Road with Sunrays',
    url: './backgrounds/forest-8.jpg',
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
    url: './backgrounds/waves-1.jpg',
    category: 'waves',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Deep blue/teal',
  },
  {
    id: 'waves-2',
    name: 'Turquoise Sea Surface',
    url: './backgrounds/waves-2.jpg',
    category: 'waves',
    textColor: 'light',
    mood: 'peaceful',
    palette: 'Turquoise/teal',
  },
  {
    id: 'waves-3',
    name: 'Rolling Ocean Tides',
    url: './backgrounds/waves-3.jpg',
    category: 'waves',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Deep blue/teal',
  },

  // Water - Lakes & Rivers (kept for variety)
  {
    id: 'water-1',
    name: 'Calm Lake Mirror',
    url: './backgrounds/water-1.jpg',
    category: 'water',
    textColor: 'dark',
    mood: 'reflective',
  },
  {
    id: 'water-2',
    name: 'Beach Sunrise',
    url: './backgrounds/water-2.jpg',
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
    url: './backgrounds/clouds-1.jpg',
    category: 'clouds',
    textColor: 'dark',
    mood: 'peaceful',
    palette: 'Light blue/white',
  },
  {
    id: 'clouds-3',
    name: 'Gentle Sky Clouds',
    url: './backgrounds/clouds-3.jpg',
    category: 'clouds',
    textColor: 'dark',
    mood: 'peaceful',
    palette: 'Soft blue/white',
  },
  {
    id: 'clouds-4',
    name: 'Heavenly Cloud Formations',
    url: './backgrounds/clouds-4.jpg',
    category: 'clouds',
    textColor: 'dark',
    mood: 'reflective',
    palette: 'Light blue/white',
  },

  // Sky - General (kept for variety)
  {
    id: 'sky-1',
    name: 'Sunset Sky',
    url: './backgrounds/sky-1.jpg',
    category: 'sky',
    textColor: 'light',
    mood: 'peaceful',
  },

  // Abstract - Modern & Artistic (Contemporary art & design)
  {
    id: 'abstract-1',
    name: 'Light Bokeh Blur',
    url: './backgrounds/abstract-1.jpg',
    category: 'abstract',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'abstract-2',
    name: 'Color Gradient Flow',
    url: './backgrounds/abstract-2.jpg',
    category: 'abstract',
    textColor: 'light',
    mood: 'powerful',
  },
  {
    id: 'abstract-3',
    name: 'Soft Pastel Colors',
    url: './backgrounds/abstract-3.jpg',
    category: 'abstract',
    textColor: 'dark',
    mood: 'peaceful',
  },
  {
    id: 'abstract-4',
    name: 'Modern Color Waves',
    url: './backgrounds/abstract-4.jpg',
    category: 'abstract',
    textColor: 'light',
    mood: 'joyful',
  },

  // Light - Bright & Hopeful (Sunlight & bright scenes)
  {
    id: 'light-1',
    name: 'Sun Rays Through Trees',
    url: './backgrounds/light-1.jpg',
    category: 'light',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'light-2',
    name: 'Golden Hour Glow',
    url: './backgrounds/light-2.jpg',
    category: 'light',
    textColor: 'light',
    mood: 'peaceful',
  },
  {
    id: 'light-3',
    name: 'Bright Sunshine Sky',
    url: './backgrounds/light-3.jpg',
    category: 'light',
    textColor: 'dark',
    mood: 'joyful',
  },
  {
    id: 'light-4',
    name: 'Sunrise Light Beams',
    url: './backgrounds/light-4.jpg',
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
    url: './backgrounds/cross-1.jpg',
    category: 'cross',
    textColor: 'light',
    mood: 'reflective',
    palette: 'Dark/purple sky',
  },
  {
    id: 'cross-2',
    name: 'Cross Under Stars',
    url: './backgrounds/cross-2.jpg',
    category: 'cross',
    textColor: 'light',
    mood: 'powerful',
    palette: 'Night sky',
  },
  {
    id: 'cross-3',
    name: 'Wooden Cross Silhouette',
    url: './backgrounds/cross-3.jpg',
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
