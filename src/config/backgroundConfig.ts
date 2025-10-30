/**
 * Background Configuration
 * 
 * This file controls which backgrounds are available for AI generation.
 * 
 * HOW TO USE:
 * 1. Set enabled: false to hide a background from AI
 * 2. Change the URL to replace an image
 * 3. The background stays in the system but won't be used
 */

export interface BackgroundConfig {
  id: string;
  enabled: boolean;  // Set to false to disable
  name: string;
  url: string;  // Change this to use a different image
  category: 'mountains' | 'waves' | 'clouds' | 'nature' | 'abstract' | 'light';
  notes?: string;  // Why disabled, or notes about the image
}

/**
 * MOUNTAINS PACK (6 backgrounds)
 * Use for: Powerful, majestic worship songs
 */
export const MOUNTAINS_CONFIG: BackgroundConfig[] = [
  {
    id: 'mountain-1',
    enabled: true,
    name: 'Majestic Blue Mountains',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
  },
  {
    id: 'mountain-2',
    enabled: false,
    name: 'Snowy Mountain Peaks',
    url: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1920&q=80',
    category: 'mountains',
    notes: 'DISABLED - User feedback: Take out'
  },
  {
    id: 'mountain-3',
    enabled: true,
    name: 'Misty Mountain Range',
    url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80',
    category: 'mountains',
  },
  {
    id: 'mountain-4',
    enabled: true,
    name: 'Mountain Lake Dusk',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
  },
  {
    id: 'mountain-5',
    enabled: true,
    name: 'Alpine Mountain Vista',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80',
    category: 'mountains',
  },
  {
    id: 'mountain-6',
    enabled: false,
    name: 'Blue Hour Mountains',
    url: 'https://images.unsplash.com/photo-1507041957456-9c397ce39c97?w=1920&q=80',
    category: 'mountains',
    notes: 'DISABLED - User feedback: This is a forest image'
  },
  {
    id: 'mountain-7',
    enabled: true,
    name: 'Rocky Mountain Peaks',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80',
    category: 'mountains',
    notes: 'ADDED - Replacement for removed mountains'
  },
  {
    id: 'mountain-8',
    enabled: true,
    name: 'Dramatic Mountain Landscape',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    category: 'mountains',
    notes: 'ADDED - Replacement for removed mountains'
  },
];

/**
 * WAVES PACK (6 backgrounds)
 * Use for: Joyful, flowing worship songs
 */
export const WAVES_CONFIG: BackgroundConfig[] = [
  {
    id: 'waves-1',
    enabled: true,
    name: 'Deep Blue Ocean Waves',
    url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80',
    category: 'waves',
    notes: 'Dark blue waves, very peaceful'
  },
  {
    id: 'waves-2',
    enabled: true,
    name: 'Turquoise Sea Surface',
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&q=80',
    category: 'waves',
    notes: 'Bright turquoise, tropical feel'
  },
  {
    id: 'waves-3',
    enabled: true,
    name: 'Rolling Ocean Tides',
    url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80',
    category: 'waves',
    notes: 'Dynamic wave action'
  },
  {
    id: 'waves-4',
    enabled: false,
    name: 'Aerial Ocean View',
    url: 'https://images.unsplash.com/photo-7vHr9SPJXws?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User feedback: 404 error'
  },
  {
    id: 'waves-5',
    enabled: false,
    name: 'Blue Sea Water',
    url: 'https://images.unsplash.com/photo-2FEE6BR343k?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User feedback: 404 error'
  },
  {
    id: 'waves-6',
    enabled: false,
    name: 'Crystal Clear Waters',
    url: 'https://images.unsplash.com/photo-zOy5lCccdec?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User feedback: 404 error'
  },
  {
    id: 'waves-7',
    enabled: false,
    name: 'Beach Shore Waters',
    url: 'https://images.unsplash.com/photo-9K9ipjhDdks?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-8',
    enabled: false,
    name: 'Close-Up Water Surface',
    url: 'https://images.unsplash.com/photo-0gZ1JLxqdus?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-9',
    enabled: false,
    name: 'Aerial Ocean Waves',
    url: 'https://images.unsplash.com/photo-SaO_koXXy_s?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-10',
    enabled: false,
    name: 'Wave Close-Up Photography',
    url: 'https://images.unsplash.com/photo-Z1jyU-1ixXE?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-11',
    enabled: false,
    name: 'White and Blue Ocean',
    url: 'https://images.unsplash.com/photo-0QEG_xOoY7Y?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-12',
    enabled: false,
    name: 'Waves During Daytime',
    url: 'https://images.unsplash.com/photo--djS1aPrSr4?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-13',
    enabled: false,
    name: 'Birds Eye Seashore',
    url: 'https://images.unsplash.com/photo-Ai2TRdvI6gM?w=1920&q=80',
    category: 'waves',
    notes: 'Disabled - keeping 6 best waves for consistency'
  },
  {
    id: 'waves-14',
    enabled: false,
    name: 'Calm Blue Ocean',
    url: 'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User wants to stick with original waves only'
  },
  {
    id: 'waves-15',
    enabled: false,
    name: 'Ocean Sunset Waves',
    url: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User wants to stick with original waves only'
  },
  {
    id: 'waves-16',
    enabled: false,
    name: 'Crystal Blue Water',
    url: 'https://images.unsplash.com/photo-1549171596-39f6f43d6e90?w=1920&q=80',
    category: 'waves',
    notes: 'DISABLED - User wants to stick with original waves only'
  },
];

/**
 * FOREST PACK (9 backgrounds)
 * Use for: Natural, earthy, peaceful worship songs
 * NOTE: Not currently used by AI, but available for manual selection
 */
export const FOREST_CONFIG: BackgroundConfig[] = [
  {
    id: 'forest-1',
    enabled: true,
    name: 'Sunrays Through Trees',
    url: 'https://images.unsplash.com/photo-sp-p7uuT0tw?w=1920&q=80',
    category: 'nature',
    notes: 'Forest with sun rays'
  },
  {
    id: 'forest-2',
    enabled: true,
    name: 'Aerial Forest View',
    url: 'https://images.unsplash.com/photo-QsWG0kjPQRY?w=1920&q=80',
    category: 'nature',
    notes: 'Aerial photography of forest'
  },
  {
    id: 'forest-3',
    enabled: true,
    name: 'Dense Forest Trees',
    url: 'https://images.unsplash.com/photo-BFJgf6sRmw8?w=1920&q=80',
    category: 'nature',
    notes: 'Dense forest of trees'
  },
  {
    id: 'forest-4',
    enabled: true,
    name: 'Green Tree Canopy',
    url: 'https://images.unsplash.com/photo-ugnrXk1129g?w=1920&q=80',
    category: 'nature',
    notes: 'Aerial view of green trees'
  },
  {
    id: 'forest-5',
    enabled: true,
    name: 'Tall Trees Daytime',
    url: 'https://images.unsplash.com/photo-MMJx78V7xS8?w=1920&q=80',
    category: 'nature',
    notes: 'Photography of tall trees'
  },
  {
    id: 'forest-6',
    enabled: true,
    name: 'Lush Green Forest',
    url: 'https://images.unsplash.com/photo-Zj8cfvy5ylk?w=1920&q=80',
    category: 'nature',
    notes: 'Aerial view of lush forest'
  },
  {
    id: 'forest-7',
    enabled: true,
    name: 'Lake Surrounded by Pines',
    url: 'https://images.unsplash.com/photo-ESkw2ayO2As?w=1920&q=80',
    category: 'nature',
    notes: 'Water surrounded by pine trees'
  },
  {
    id: 'forest-8',
    enabled: true,
    name: 'Forest Road with Sunrays',
    url: 'https://images.unsplash.com/photo-3Kv48NS4WUU?w=1920&q=80',
    category: 'nature',
    notes: 'Road through forest with sun rays'
  },
  {
    id: 'forest-9',
    enabled: true,
    name: 'Green Pine Forest',
    url: 'https://images.unsplash.com/photo-d6kSvT2xZQo?w=1920&q=80',
    category: 'nature',
    notes: 'Green pine trees'
  },
];

/**
 * CLOUDS PACK (6 backgrounds)
 * Use for: Peaceful, reflective worship songs
 */
export const CLOUDS_CONFIG: BackgroundConfig[] = [
  {
    id: 'clouds-1',
    enabled: true,
    name: 'Soft Blue Sky Clouds',
    url: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80',
    category: 'clouds',
  },
  {
    id: 'clouds-2',
    enabled: false,
    name: 'Wispy Cloud Layers',
    url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80',
    category: 'clouds',
    notes: 'DISABLED - User feedback: Night sky, move'
  },
  {
    id: 'clouds-3',
    enabled: true,
    name: 'Gentle Sky Clouds',
    url: 'https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=1920&q=80',
    category: 'clouds',
  },
  {
    id: 'clouds-4',
    enabled: true,
    name: 'Heavenly Cloud Formations',
    url: 'https://images.unsplash.com/photo-1501630834273-4b5604d2ee31?w=1920&q=80',
    category: 'clouds',
  },
  {
    id: 'clouds-5',
    enabled: true,
    name: 'Serene Sky View',
    url: 'https://images.unsplash.com/photo-1536514498073-50e69d39c6cf?w=1920&q=80',
    category: 'clouds',
  },
  {
    id: 'clouds-6',
    enabled: true,
    name: 'Peaceful Cloud Cover',
    url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?w=1920&q=80',
    category: 'clouds',
  },
  {
    id: 'clouds-7',
    enabled: true,
    name: 'Bright Daytime Clouds',
    url: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?w=1920&q=80',
    category: 'clouds',
    notes: 'FIXED - Peaceful daytime clouds'
  },
];

/**
 * Get all enabled backgrounds for a category
 */
export function getEnabledBackgrounds(category: 'mountains' | 'waves' | 'clouds' | 'forest'): BackgroundConfig[] {
  const configs = {
    mountains: MOUNTAINS_CONFIG,
    waves: WAVES_CONFIG,
    clouds: CLOUDS_CONFIG,
    forest: FOREST_CONFIG,
  };
  
  return configs[category].filter(bg => bg.enabled);
}

/**
 * Get all backgrounds (enabled and disabled) for management UI
 */
export function getAllBackgrounds(category: 'mountains' | 'waves' | 'clouds' | 'forest'): BackgroundConfig[] {
  const configs = {
    mountains: MOUNTAINS_CONFIG,
    waves: WAVES_CONFIG,
    clouds: CLOUDS_CONFIG,
    forest: FOREST_CONFIG,
  };
  
  return configs[category];
}

/**
 * INSTRUCTIONS FOR MANAGING BACKGROUNDS
 * 
 * TO DISABLE A BACKGROUND:
 * 1. Find the background above (e.g., waves-3)
 * 2. Change enabled: true → enabled: false
 * 3. Add a note explaining why (optional)
 * 4. Save the file
 * 5. Restart the app
 * 
 * EXAMPLE - Disable waves-3:
 * {
 *   id: 'waves-3',
 *   enabled: false,  ← Changed to false
 *   name: 'Rolling Ocean Tides',
 *   url: '...',
 *   category: 'waves',
 *   notes: 'Too busy, prefer calmer waves'  ← Added note
 * }
 * 
 * TO REPLACE A BACKGROUND IMAGE:
 * 1. Find a new image on Unsplash.com
 * 2. Copy the URL (add ?w=1920&q=80 at the end)
 * 3. Replace the url: '...' with your new URL
 * 4. Save and restart
 * 
 * EXAMPLE - Replace waves-2 image:
 * {
 *   id: 'waves-2',
 *   enabled: true,
 *   name: 'Turquoise Sea Surface',
 *   url: 'https://images.unsplash.com/photo-YOURNEWID?w=1920&q=80',  ← New URL
 *   category: 'waves',
 *   notes: 'Replaced with better turquoise image'
 * }
 * 
 * TO ADD A NEW BACKGROUND:
 * 1. Copy an existing background object
 * 2. Change the id (e.g., waves-7)
 * 3. Add your image URL from Unsplash
 * 4. Give it a descriptive name
 * 5. Save and restart
 * 
 * FINDING NEW IMAGES:
 * 1. Go to https://unsplash.com
 * 2. Search for "ocean waves" or "mountains" or "clouds"
 * 3. Click on an image you like
 * 4. Right-click the image → Copy Image Address
 * 5. The URL should look like: https://images.unsplash.com/photo-...
 * 6. Add ?w=1920&q=80 to the end for optimal quality
 */
