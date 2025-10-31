// Font Combination Presets for Visual Editor
// Professional, tested font pairings for church presentations

export interface FontCombination {
  id: string;
  name: string;
  description: string;
  heading: {
    fontFamily: string;
    fontWeight: number;
  };
  body: {
    fontFamily: string;
    fontWeight: number;
  };
  category: 'modern' | 'classic' | 'elegant' | 'bold' | 'friendly';
}

export const FONT_COMBINATIONS: FontCombination[] = [
  // Modern & Clean
  {
    id: 'modern-clean',
    name: 'Modern Clean',
    description: 'Contemporary and professional',
    heading: {
      fontFamily: 'Outfit',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: 400,
    },
    category: 'modern',
  },
  
  // Elegant & Sophisticated
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Traditional and refined',
    heading: {
      fontFamily: 'Playfair Display, Georgia, serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Lato, sans-serif',
      fontWeight: 400,
    },
    category: 'elegant',
  },
  
  // Script & Simple (Current song style)
  {
    id: 'script-simple',
    name: 'Script & Simple',
    description: 'Artistic titles with clean body',
    heading: {
      fontFamily: 'Allura, cursive',
      fontWeight: 400,
    },
    body: {
      fontFamily: 'Outfit',
      fontWeight: 400,
    },
    category: 'elegant',
  },
  
  // Bold Impact
  {
    id: 'bold-impact',
    name: 'Bold Impact',
    description: 'Strong and attention-grabbing',
    heading: {
      fontFamily: 'Bebas Neue, Impact, sans-serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Open Sans, sans-serif',
      fontWeight: 400,
    },
    category: 'bold',
  },
  
  // Warm Classic
  {
    id: 'warm-classic',
    name: 'Warm Classic',
    description: 'Timeless and approachable',
    heading: {
      fontFamily: 'Merriweather, Georgia, serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Source Sans Pro, sans-serif',
      fontWeight: 400,
    },
    category: 'classic',
  },
  
  // Friendly Rounded
  {
    id: 'friendly-rounded',
    name: 'Friendly Rounded',
    description: 'Warm and welcoming',
    heading: {
      fontFamily: 'Outfit',
      fontWeight: 600,
    },
    body: {
      fontFamily: 'Nunito, sans-serif',
      fontWeight: 400,
    },
    category: 'friendly',
  },
  
  // Modern Contrast
  {
    id: 'modern-contrast',
    name: 'Modern Contrast',
    description: 'Contemporary with high contrast',
    heading: {
      fontFamily: 'Outfit',
      fontWeight: 900,
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: 300,
    },
    category: 'modern',
  },
  
  // Classic Serif
  {
    id: 'classic-serif',
    name: 'Classic Serif',
    description: 'Traditional scripture style',
    heading: {
      fontFamily: 'Georgia, serif',
      fontWeight: 700,
    },
    body: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
    category: 'classic',
  },
  
  // Bold Modern
  {
    id: 'bold-modern',
    name: 'Bold Modern',
    description: 'Strong contemporary look',
    heading: {
      fontFamily: 'Outfit',
      fontWeight: 800,
    },
    body: {
      fontFamily: 'Outfit',
      fontWeight: 400,
    },
    category: 'bold',
  },
  
  // Elegant Script
  {
    id: 'elegant-script',
    name: 'Elegant Script',
    description: 'Formal and graceful',
    heading: {
      fontFamily: 'Playfair Display, Georgia, serif',
      fontWeight: 400,
    },
    body: {
      fontFamily: 'Inter',
      fontWeight: 400,
    },
    category: 'elegant',
  },
];

// Helper function to apply font combination to an element
export function applyFontCombination(
  element: any,
  combination: FontCombination,
  isHeading: boolean = true
): any {
  const fontStyle = isHeading ? combination.heading : combination.body;
  
  return {
    ...element,
    fontFamily: fontStyle.fontFamily,
    fontWeight: fontStyle.fontWeight,
    style: {
      ...element.style,
      fontFamily: fontStyle.fontFamily,
      fontWeight: fontStyle.fontWeight,
    },
  };
}

// Helper to detect if element is likely a heading (based on size/weight)
export function isLikelyHeading(element: any): boolean {
  const fontSize = element.fontSize || element.style?.fontSize || 16;
  const fontWeight = element.fontWeight || element.style?.fontWeight || 400;
  
  // Consider it a heading if font size > 40 or weight >= 700
  return fontSize > 40 || fontWeight >= 700;
}
