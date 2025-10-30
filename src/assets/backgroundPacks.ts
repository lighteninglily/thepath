import { WORSHIP_BACKGROUNDS } from './backgrounds';
import type { BackgroundImage } from './backgrounds';

/**
 * Background packs - curated sets of 3-4 related backgrounds for variety
 */

export interface BackgroundPack {
  id: string;
  name: string;
  description: string;
  backgrounds: BackgroundImage[];
  textColor: 'light' | 'dark';
  mood: string;
}

export const BACKGROUND_PACKS: BackgroundPack[] = [
  // ═══════════════════════════════════════════════════════════
  // NEW COHESIVE PACKS - Consistent Color Palettes
  // ═══════════════════════════════════════════════════════════
  {
    id: 'mountains',
    name: '🏔️ Mountains',
    description: '6 majestic peaks - Blue/purple tones, consistent palette',
    textColor: 'light',
    mood: 'powerful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'mountains'),
  },
  {
    id: 'waves',
    name: '🌊 Ocean Waves',
    description: '6 ocean scenes - Teal/blue tones, consistent palette',
    textColor: 'light',
    mood: 'peaceful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'waves'),
  },
  {
    id: 'clouds',
    name: '☁️ Clouds',
    description: '6 sky scenes - Soft blue/white tones, consistent palette',
    textColor: 'dark',
    mood: 'peaceful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'clouds'),
  },
  
  // ═══════════════════════════════════════════════════════════
  // OTHER PACKS
  // ═══════════════════════════════════════════════════════════
  {
    id: 'nature',
    name: '🌲 Nature',
    description: '4 forest & field scenes - Green tones',
    textColor: 'light',
    mood: 'peaceful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'nature'),
  },
  {
    id: 'water',
    name: '🏞️ Lakes & Rivers',
    description: '2 calm water scenes - Mixed tones',
    textColor: 'light',
    mood: 'peaceful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'water'),
  },
  {
    id: 'abstract',
    name: '🎨 Abstract',
    description: '4 modern art designs - Contemporary style',
    textColor: 'light',
    mood: 'powerful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'abstract'),
  },
  {
    id: 'light',
    name: '✨ Light & Bright',
    description: '4 sunlight scenes - Bright & joyful',
    textColor: 'dark',
    mood: 'joyful',
    backgrounds: WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'light'),
  },
  {
    id: 'mixed-variety',
    name: '🎭 Mixed Variety',
    description: '10 backgrounds - Mountains, waves & nature mix',
    textColor: 'light',
    mood: 'powerful',
    backgrounds: [
      ...WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'mountains').slice(0, 4),
      ...WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'waves').slice(0, 4),
      ...WORSHIP_BACKGROUNDS.filter(bg => bg.category === 'nature').slice(0, 2),
    ],
  },
];

/**
 * Assign backgrounds from a pack to slides with automatic rotation
 */
export function assignBackgroundsFromPack(
  pack: BackgroundPack,
  slideCount: number
): BackgroundImage[] {
  const backgrounds: BackgroundImage[] = [];
  const packBackgrounds = pack.backgrounds;
  
  for (let i = 0; i < slideCount; i++) {
    // Rotate through pack backgrounds
    const bgIndex = i % packBackgrounds.length;
    backgrounds.push(packBackgrounds[bgIndex]);
  }
  
  return backgrounds;
}

/**
 * Get a pack by ID
 */
export function getPackById(id: string): BackgroundPack | undefined {
  return BACKGROUND_PACKS.find(pack => pack.id === id);
}
