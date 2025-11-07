// Sermon Slide Design Templates
// Provides 5 pre-designed templates for sermon slides with customization options

export interface SermonSlideDesign {
  id: string;
  name: string;
  background: {
    type: 'solid' | 'gradient' | 'image';
    color?: string;
    gradient?: {
      type: 'linear' | 'radial';
      from: string;
      to: string;
      angle?: number;
    };
    imageUrl?: string;
    overlay?: {
      color: string;
      opacity: number;
    };
  };
  titleStyle: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    textShadow?: string;
    letterSpacing?: number;
  };
  bodyStyle: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    textAlign: 'left' | 'center' | 'right';
    textShadow?: string;
    lineHeight?: number;
  };
  scriptureRefStyle: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number;
    color: string;
    fontStyle: 'normal' | 'italic';
    textShadow?: string;
  };
}

// TEMPLATE 1: Classic (Soft Blue Gradient)
export const DESIGN_CLASSIC: SermonSlideDesign = {
  id: 'classic',
  name: 'Classic',
  background: {
    type: 'gradient',
    gradient: {
      type: 'linear',
      from: '#667eea',
      to: '#764ba2',
      angle: 135
    }
  },
  titleStyle: {
    fontFamily: 'Inter',
    fontSize: 72,
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '2px 4px 12px rgba(0, 0, 0, 0.4)'
  },
  bodyStyle: {
    fontFamily: 'Inter',
    fontSize: 42,
    fontWeight: 400,
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.3)',
    lineHeight: 1.4
  },
  scriptureRefStyle: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: 400,
    color: '#e0e7ff',
    fontStyle: 'italic',
    textShadow: '1px 2px 6px rgba(0, 0, 0, 0.3)'
  }
};

// TEMPLATE 2: Modern (Teal & Blue Gradient)
export const DESIGN_MODERN: SermonSlideDesign = {
  id: 'modern',
  name: 'Modern',
  background: {
    type: 'gradient',
    gradient: {
      type: 'linear',
      from: '#56CCF2',
      to: '#2F80ED',
      angle: 45
    }
  },
  titleStyle: {
    fontFamily: 'Outfit',
    fontSize: 80,
    fontWeight: 800,
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '3px 5px 15px rgba(0, 0, 0, 0.5)',
    letterSpacing: -1
  },
  bodyStyle: {
    fontFamily: 'Outfit',
    fontSize: 44,
    fontWeight: 500,
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '2px 3px 10px rgba(0, 0, 0, 0.4)',
    lineHeight: 1.5
  },
  scriptureRefStyle: {
    fontFamily: 'Outfit',
    fontSize: 36,
    fontWeight: 600,
    color: '#fff5f5',
    fontStyle: 'italic',
    textShadow: '2px 2px 8px rgba(0, 0, 0, 0.4)'
  }
};

// TEMPLATE 3: Elegant (Soft Lavender)
export const DESIGN_ELEGANT: SermonSlideDesign = {
  id: 'elegant',
  name: 'Elegant',
  background: {
    type: 'gradient',
    gradient: {
      type: 'linear',
      from: '#a8edea',
      to: '#fed6e3',
      angle: 180
    }
  },
  titleStyle: {
    fontFamily: 'Playfair Display',
    fontSize: 76,
    fontWeight: 700,
    color: '#4a5568',
    textAlign: 'center',
    textShadow: '1px 2px 6px rgba(0, 0, 0, 0.15)',
    letterSpacing: 1
  },
  bodyStyle: {
    fontFamily: 'Georgia',
    fontSize: 40,
    fontWeight: 400,
    color: '#2d3748',
    textAlign: 'center',
    textShadow: '1px 1px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: 1.6
  },
  scriptureRefStyle: {
    fontFamily: 'Georgia',
    fontSize: 30,
    fontWeight: 400,
    color: '#4a5568',
    fontStyle: 'italic',
    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.1)'
  }
};

// TEMPLATE 4: Minimal (White Background)
export const DESIGN_MINIMAL: SermonSlideDesign = {
  id: 'minimal',
  name: 'Minimal',
  background: {
    type: 'solid',
    color: '#ffffff'
  },
  titleStyle: {
    fontFamily: 'Inter',
    fontSize: 70,
    fontWeight: 600,
    color: '#1a202c',
    textAlign: 'center'
  },
  bodyStyle: {
    fontFamily: 'Inter',
    fontSize: 38,
    fontWeight: 400,
    color: '#2d3748',
    textAlign: 'center',
    lineHeight: 1.5
  },
  scriptureRefStyle: {
    fontFamily: 'Inter',
    fontSize: 28,
    fontWeight: 500,
    color: '#4a5568',
    fontStyle: 'italic'
  }
};

// TEMPLATE 5: Bold (Black Background)
export const DESIGN_BOLD: SermonSlideDesign = {
  id: 'bold',
  name: 'Bold',
  background: {
    type: 'solid',
    color: '#000000'
  },
  titleStyle: {
    fontFamily: 'Outfit',
    fontSize: 84,
    fontWeight: 900,
    color: '#ffffff',
    textAlign: 'center',
    textShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
    letterSpacing: -2
  },
  bodyStyle: {
    fontFamily: 'Outfit',
    fontSize: 46,
    fontWeight: 600,
    color: '#f7fafc',
    textAlign: 'center',
    textShadow: '0 0 10px rgba(255, 255, 255, 0.2)',
    lineHeight: 1.4
  },
  scriptureRefStyle: {
    fontFamily: 'Outfit',
    fontSize: 34,
    fontWeight: 500,
    color: '#e2e8f0',
    fontStyle: 'italic',
    textShadow: '0 0 8px rgba(255, 255, 255, 0.2)'
  }
};

// All designs array
export const SERMON_SLIDE_DESIGNS: SermonSlideDesign[] = [
  DESIGN_CLASSIC,
  DESIGN_MODERN,
  DESIGN_ELEGANT,
  DESIGN_MINIMAL,
  DESIGN_BOLD
];

// Preset color palette (pastels + black & white)
export const SERMON_COLOR_PALETTE = [
  // Pastels
  '#667eea', // Soft blue
  '#f093fb', // Pink
  '#a8edea', // Mint
  '#fed6e3', // Rose
  '#ffeaa7', // Pale yellow
  '#74b9ff', // Sky blue
  '#a29bfe', // Lavender
  '#fd79a8', // Coral
  '#fdcb6e', // Peach
  '#55efc4', // Turquoise
  
  // Neutrals
  '#ffffff', // White
  '#f7fafc', // Off-white
  '#000000', // Black
  '#1a202c', // Near-black
  '#2d3748', // Dark gray
];

// Font combinations for dropdowns
export const SERMON_FONT_COMBINATIONS = [
  { id: 'inter', title: 'Inter', body: 'Inter', label: 'Modern Sans' },
  { id: 'outfit', title: 'Outfit', body: 'Outfit', label: 'Bold Sans' },
  { id: 'playfair', title: 'Playfair Display', body: 'Georgia', label: 'Elegant Serif' },
  { id: 'georgia', title: 'Georgia', body: 'Georgia', label: 'Classic Serif' },
  { id: 'roboto', title: 'Roboto', body: 'Roboto', label: 'Clean Sans' },
];

// Helper: Get design by ID
export function getSermonDesignById(id: string): SermonSlideDesign | undefined {
  return SERMON_SLIDE_DESIGNS.find(d => d.id === id);
}

// Helper: Get default design
export function getDefaultSermonDesign(): SermonSlideDesign {
  return DESIGN_CLASSIC;
}
