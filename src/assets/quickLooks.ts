import { BACKGROUND_PACKS } from './backgroundPacks';
import type { BackgroundPack } from './backgroundPacks';
import type { LayoutType } from '../utils/layouts';

/**
 * Quick Looks - Pre-designed combinations of background packs + layout styles
 * Inspired by Canva's quick templates
 */

export interface QuickLook {
  id: string;
  name: string;
  description: string;
  icon: string;
  backgroundPack: BackgroundPack;
  layoutStyle: 'varied' | 'minimal' | 'bold' | 'split' | 'modern';
  recommendedFor: string[];
  preview: string;
}

export const QUICK_LOOKS: QuickLook[] = [
  {
    id: 'mountain-powerful',
    name: 'Mountain Majesty',
    description: 'Bold text on majestic mountain backgrounds',
    icon: '🏔️',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'mountains')!,
    layoutStyle: 'bold',
    recommendedFor: ['Powerful worship', 'Victory songs', 'Declaration'],
    preview: 'Bold, centered text with mountain imagery',
  },
  {
    id: 'water-reflective',
    name: 'Peaceful Waters',
    description: 'Calming water scenes with gentle layouts',
    icon: '🌊',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'water')!,
    layoutStyle: 'minimal',
    recommendedFor: ['Reflective worship', 'Communion', 'Intimate songs'],
    preview: 'Clean, minimal text on peaceful water',
  },
  {
    id: 'nature-organic',
    name: 'Natural Beauty',
    description: 'Forest and nature with organic layouts',
    icon: '🌲',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'nature')!,
    layoutStyle: 'varied',
    recommendedFor: ['Creation themes', 'General worship', 'Thanksgiving'],
    preview: 'Varied layouts with natural backgrounds',
  },
  {
    id: 'sky-hopeful',
    name: 'Sky & Glory',
    description: 'Daytime clouds only - consistent cloud theme',
    icon: '☁️',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'sky')!,
    layoutStyle: 'split',
    recommendedFor: ['Hope songs', 'Future themes', 'Breakthrough'],
    preview: 'Modern split-screen with cloud backgrounds - NO stars!',
  },
  {
    id: 'abstract-modern',
    name: 'Modern Worship',
    description: 'Contemporary abstract designs',
    icon: '🎨',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'abstract')!,
    layoutStyle: 'modern',
    recommendedFor: ['Contemporary worship', 'Youth services', 'Modern songs'],
    preview: 'Bold modern layouts with abstract art',
  },
  {
    id: 'light-joyful',
    name: 'Light & Joy',
    description: 'Bright, celebratory with dynamic layouts',
    icon: '✨',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'light')!,
    layoutStyle: 'bold',
    recommendedFor: ['Celebration', 'Easter', 'Victory', 'Joy'],
    preview: 'Bright, energetic layouts',
  },
  {
    id: 'mixed-dynamic',
    name: 'Dynamic Mix',
    description: 'Maximum variety - different styles throughout',
    icon: '🎭',
    backgroundPack: BACKGROUND_PACKS.find(p => p.id === 'mixed-variety')!,
    layoutStyle: 'varied',
    recommendedFor: ['Long songs', 'Medleys', 'Any style'],
    preview: 'Mixed backgrounds and layouts for variety',
  },
];

/**
 * Get recommended layouts based on layout style
 */
export function getLayoutsForStyle(style: QuickLook['layoutStyle'], count: number): LayoutType[] {
  const layouts: LayoutType[] = [];
  
  switch (style) {
    case 'bold':
      // Bold: Use full-bleed and gradient overlay primarily
      for (let i = 0; i < count; i++) {
        layouts.push(i % 2 === 0 ? 'full-bleed' : 'gradient-overlay');
      }
      break;
      
    case 'minimal':
      // Minimal: Use centered mask and gradient overlay
      for (let i = 0; i < count; i++) {
        layouts.push(i % 2 === 0 ? 'centered-mask' : 'gradient-overlay');
      }
      break;
      
    case 'split':
      // Split: Alternate split-screen styles
      for (let i = 0; i < count; i++) {
        if (i % 3 === 0) layouts.push('split-dark-light');
        else if (i % 3 === 1) layouts.push('split-light-dark');
        else layouts.push('gradient-overlay');
      }
      break;
      
    case 'modern':
      // Modern: Mix of contemporary styles
      for (let i = 0; i < count; i++) {
        if (i % 4 === 0) layouts.push('full-bleed');
        else if (i % 4 === 1) layouts.push('split-dark-light');
        else if (i % 4 === 2) layouts.push('split-light-dark');
        else layouts.push('gradient-overlay');
      }
      break;
      
    case 'varied':
    default:
      // Varied: Use all layout types
      const allLayouts: LayoutType[] = [
        'full-bleed',
        'split-dark-light',
        'centered-mask',
        'gradient-overlay',
        'split-light-dark',
      ];
      for (let i = 0; i < count; i++) {
        layouts.push(allLayouts[i % allLayouts.length]);
      }
      break;
  }
  
  return layouts;
}

/**
 * Get a quick look by ID
 */
export function getQuickLookById(id: string): QuickLook | undefined {
  return QUICK_LOOKS.find(look => look.id === id);
}
