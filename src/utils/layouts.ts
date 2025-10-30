import type { BackgroundImage } from '../assets/backgrounds';

export type LayoutType = 
  | 'full-bleed'      // Full background image with text overlay
  | 'split-dark-light' // Dark left, light right (like example 1)
  | 'split-light-dark' // Light left, dark right
  | 'centered-mask'    // Image in shape, solid color around
  | 'gradient-overlay' // Gradient over image
  | 'solid-color'      // Just solid color
  | 'minimal';         // Clean & simple

export interface SlideLayout {
  type: LayoutType;
  name: string;
  description: string;
  
  // Layout configuration
  textPosition?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  textAlign?: 'left' | 'center' | 'right';
  imagePlacement?: 'full' | 'left' | 'right' | 'background' | 'masked';
  maskShape?: 'oval' | 'circle' | 'rounded-rect' | 'none';
  
  // Styling
  overlayColor?: string;
  overlayOpacity?: number;
  textShadow?: string;
  padding?: string;
}

/**
 * Available layout templates
 */
export const SLIDE_LAYOUTS: SlideLayout[] = [
  {
    type: 'full-bleed',
    name: 'Full Photo',
    description: 'Photo fills entire slide with text overlay',
    textPosition: 'center',
    textAlign: 'left',
    imagePlacement: 'full',
    overlayOpacity: 0.3,
    textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
  },
  {
    type: 'split-dark-light',
    name: 'Split: Dark/Light',
    description: 'Dark left with bold text, light right with body text',
    textPosition: 'left',
    textAlign: 'left',
    imagePlacement: 'left',
    overlayOpacity: 0,
  },
  {
    type: 'split-light-dark',
    name: 'Split: Light/Dark',
    description: 'Light left, dark right - opposite of above',
    textPosition: 'right',
    textAlign: 'left',
    imagePlacement: 'right',
    overlayOpacity: 0,
  },
  {
    type: 'centered-mask',
    name: 'Centered Mask',
    description: 'Image in oval/circle with solid background',
    textPosition: 'center',
    textAlign: 'center',
    imagePlacement: 'masked',
    maskShape: 'oval',
    overlayOpacity: 0,
  },
  {
    type: 'gradient-overlay',
    name: 'Gradient Overlay',
    description: 'Photo with gradient overlay for better text readability',
    textPosition: 'center',
    textAlign: 'center',
    imagePlacement: 'background',
    overlayOpacity: 0.5,
    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
  },
  {
    type: 'solid-color',
    name: 'Solid Color',
    description: 'Clean solid color background',
    textPosition: 'center',
    textAlign: 'center',
    imagePlacement: 'background',
    overlayOpacity: 0,
  },
  {
    type: 'minimal',
    name: 'Minimal',
    description: 'Simple and clean with subtle styling',
    textPosition: 'center',
    textAlign: 'center',
    imagePlacement: 'background',
    overlayOpacity: 0,
  },
];

/**
 * Get layout by type
 */
export function getLayout(type: LayoutType): SlideLayout | undefined {
  return SLIDE_LAYOUTS.find(layout => layout.type === type);
}

/**
 * Randomly assign layouts to slides for variety
 */
export function assignRandomLayouts(slideCount: number): LayoutType[] {
  const layouts: LayoutType[] = [];
  const availableTypes: LayoutType[] = ['full-bleed', 'split-dark-light', 'gradient-overlay', 'minimal'];
  
  for (let i = 0; i < slideCount; i++) {
    // Add variety - don't repeat same layout consecutively
    const previousLayout = layouts[i - 1];
    let available = availableTypes.filter(t => t !== previousLayout);
    
    if (available.length === 0) available = availableTypes;
    
    const randomLayout = available[Math.floor(Math.random() * available.length)];
    layouts.push(randomLayout);
  }
  
  return layouts;
}
