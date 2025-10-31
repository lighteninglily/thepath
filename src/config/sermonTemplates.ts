// Sermon Slide Templates
// Pre-designed layouts for quick sermon creation

export type SermonTemplateCategory = 
  | 'title' 
  | 'scripture' 
  | 'point' 
  | 'multi-point'
  | 'quote' 
  | 'transition'
  | 'question';

export type SermonTemplateStyle = 
  | 'modern' 
  | 'classic' 
  | 'bold' 
  | 'elegant' 
  | 'minimal';

export interface SermonTemplate {
  id: string;
  name: string;
  category: SermonTemplateCategory;
  style: SermonTemplateStyle;
  description: string;
  thumbnail: string; // Data URL or path
  visualData: {
    background: {
      type: 'gradient' | 'color' | 'image';
      value: string;
      overlay?: {
        enabled: boolean;
        color: string;
        opacity: number;
      };
    };
    elements: Array<{
      id: string;
      type: 'text' | 'shape';
      role?: 'title' | 'subtitle' | 'body' | 'reference' | 'decoration';
      content: string;
      x: number;
      y: number;
      width: number;
      height: number;
      zIndex: number;
      style: {
        fontSize?: number;
        fontFamily?: string;
        fontWeight?: number;
        color?: string;
        textAlign?: 'left' | 'center' | 'right';
        lineHeight?: number;
        letterSpacing?: number;
        textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
        fontStyle?: 'normal' | 'italic';
        backgroundColor?: string;
        borderRadius?: number;
        padding?: number;
        opacity?: number;
      };
    }>;
  };
}

// ============================================================================
// TITLE TEMPLATES
// ============================================================================

export const SERMON_TEMPLATES: SermonTemplate[] = [
  // TITLE TEMPLATE 1: Hero with Bold Text
  {
    id: 'title-hero-bold',
    name: 'Hero Bold',
    category: 'title',
    style: 'bold',
    description: 'Large bold title with background image',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjI0IiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkhlcm88L3RleHQ+PC9zdmc+',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{TITLE}}',
          x: 10,
          y: 30,
          width: 80,
          height: 30,
          zIndex: 10,
          style: {
            fontSize: 96,
            fontFamily: 'Outfit',
            fontWeight: 800,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.1,
            textTransform: 'uppercase',
            letterSpacing: -2,
          },
        },
        {
          id: 'subtitle',
          type: 'text',
          role: 'subtitle',
          content: '{{SUBTITLE}}',
          x: 10,
          y: 65,
          width: 80,
          height: 10,
          zIndex: 10,
          style: {
            fontSize: 32,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            opacity: 0.9,
          },
        },
      ],
    },
  },

  // TITLE TEMPLATE 2: Elegant Centered
  {
    id: 'title-elegant-center',
    name: 'Elegant Center',
    category: 'title',
    style: 'elegant',
    description: 'Refined centered title with serif font',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iI2Y1ZjVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjIwIiBmaWxsPSIjMzMzIiBmb250LWZhbWlseT0ic2VyaWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkVsZWdhbnQ8L3RleHQ+PC9zdmc+',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #e0c3a8 0%, #d4b5a0 100%)',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{TITLE}}',
          x: 15,
          y: 35,
          width: 70,
          height: 30,
          zIndex: 10,
          style: {
            fontSize: 72,
            fontFamily: 'Georgia',
            fontWeight: 400,
            color: '#2a2a2a',
            textAlign: 'center',
            lineHeight: 1.3,
          },
        },
      ],
    },
  },

  // ============================================================================
  // SCRIPTURE TEMPLATES
  // ============================================================================

  // SCRIPTURE TEMPLATE 1: Classic Centered
  {
    id: 'scripture-classic-center',
    name: 'Scripture Classic',
    category: 'scripture',
    style: 'classic',
    description: 'Centered scripture with elegant typography',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzRhNGE0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgZm9udC1mYW1pbHk9InNlcmlmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TY3JpcHR1cmU8L3RleHQ+PC9zdmc+',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%)',
      },
      elements: [
        {
          id: 'verse-text',
          type: 'text',
          role: 'body',
          content: '{{SCRIPTURE_TEXT}}',
          x: 15,
          y: 25,
          width: 70,
          height: 40,
          zIndex: 10,
          style: {
            fontSize: 48,
            fontFamily: 'Georgia',
            fontWeight: 400,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.6,
          },
        },
        {
          id: 'reference',
          type: 'text',
          role: 'reference',
          content: '{{SCRIPTURE_REFERENCE}}',
          x: 15,
          y: 70,
          width: 70,
          height: 8,
          zIndex: 10,
          style: {
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
          },
        },
      ],
    },
  },

  // SCRIPTURE TEMPLATE 2: Modern Split
  {
    id: 'scripture-modern-split',
    name: 'Scripture Modern',
    category: 'scripture',
    style: 'modern',
    description: 'Split layout with title and verse',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzJhNWE4YSIvPjxyZWN0IHg9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(90deg, #1e3a5f 0%, #1e3a5f 50%, #f5f5f0 50%, #f5f5f0 100%)',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: "TODAY'S SCRIPTURE",
          x: 5,
          y: 40,
          width: 40,
          height: 20,
          zIndex: 10,
          style: {
            fontSize: 52,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 1,
          },
        },
        {
          id: 'verse-text',
          type: 'text',
          role: 'body',
          content: '{{SCRIPTURE_TEXT}}',
          x: 55,
          y: 30,
          width: 35,
          height: 30,
          zIndex: 10,
          style: {
            fontSize: 24,
            fontFamily: 'Georgia',
            fontWeight: 400,
            color: '#2a2a2a',
            textAlign: 'left',
            lineHeight: 1.6,
          },
        },
        {
          id: 'reference',
          type: 'text',
          role: 'reference',
          content: '{{SCRIPTURE_REFERENCE}}',
          x: 55,
          y: 65,
          width: 35,
          height: 8,
          zIndex: 10,
          style: {
            fontSize: 18,
            fontFamily: 'Inter',
            fontWeight: 600,
            color: '#1e3a5f',
            textAlign: 'left',
            textTransform: 'uppercase',
          },
        },
      ],
    },
  },

  // ============================================================================
  // POINT TEMPLATES
  // ============================================================================

  // POINT TEMPLATE 1: Numbered Bold
  {
    id: 'point-numbered-bold',
    name: 'Point Numbered',
    category: 'point',
    style: 'bold',
    description: 'Large number with title and body text',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzJhMmEyYSIvPjx0ZXh0IHg9IjIwIiB5PSI2MCIgZm9udC1zaXplPSI2MCIgZmlsbD0iI2VlZWVlZSIgZm9udC13ZWlnaHQ9ImJvbGQiPjEuPC90ZXh0Pjwvc3ZnPg==',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      },
      elements: [
        {
          id: 'number',
          type: 'text',
          role: 'decoration',
          content: '{{POINT_NUMBER}}.',
          x: 5,
          y: 15,
          width: 20,
          height: 25,
          zIndex: 5,
          style: {
            fontSize: 120,
            fontFamily: 'Outfit',
            fontWeight: 900,
            color: '#444444',
            textAlign: 'left',
          },
        },
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{POINT_TITLE}}',
          x: 28,
          y: 35,
          width: 65,
          height: 15,
          zIndex: 10,
          style: {
            fontSize: 56,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'left',
            textTransform: 'uppercase',
            letterSpacing: -1,
          },
        },
        {
          id: 'body',
          type: 'text',
          role: 'body',
          content: '{{POINT_BODY}}',
          x: 28,
          y: 55,
          width: 65,
          height: 30,
          zIndex: 10,
          style: {
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#CCCCCC',
            textAlign: 'left',
            lineHeight: 1.5,
          },
        },
      ],
    },
  },

  // POINT TEMPLATE 2: Split Image
  {
    id: 'point-split-image',
    name: 'Point Split',
    category: 'point',
    style: 'modern',
    description: 'Half image, half text layout',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzU1NTU1NSIvPjxyZWN0IHg9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMTIiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(90deg, #4a4a4a 0%, #4a4a4a 50%, #f5f5f0 50%, #f5f5f0 100%)',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{POINT_TITLE}}',
          x: 55,
          y: 35,
          width: 40,
          height: 15,
          zIndex: 10,
          style: {
            fontSize: 52,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#2a2a2a',
            textAlign: 'left',
            textTransform: 'uppercase',
          },
        },
        {
          id: 'body',
          type: 'text',
          role: 'body',
          content: '{{POINT_BODY}}',
          x: 55,
          y: 55,
          width: 38,
          height: 25,
          zIndex: 10,
          style: {
            fontSize: 24,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#4a4a4a',
            textAlign: 'left',
            lineHeight: 1.5,
          },
        },
      ],
    },
  },

  // ============================================================================
  // MULTI-POINT TEMPLATE
  // ============================================================================

  {
    id: 'multi-point-columns',
    name: 'Multi-Point Columns',
    category: 'multi-point',
    style: 'modern',
    description: 'Two-column layout for multiple points',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzJhMmEyYSIvPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjMzMzMzMzIi8+PHJlY3QgeD0iMTA4IiB5PSIxMCIgd2lkdGg9IjgyIiBoZWlnaHQ9IjQyIiBmaWxsPSIjMzMzMzMzIi8+PC9zdmc+',
    visualData: {
      background: {
        type: 'color',
        value: '#1a1a1a',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{TITLE}}',
          x: 10,
          y: 15,
          width: 80,
          height: 15,
          zIndex: 10,
          style: {
            fontSize: 64,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            textTransform: 'uppercase',
          },
        },
        {
          id: 'point1-title',
          type: 'text',
          role: 'subtitle',
          content: '{{POINT1_TITLE}}',
          x: 8,
          y: 38,
          width: 42,
          height: 10,
          zIndex: 10,
          style: {
            fontSize: 36,
            fontFamily: 'Outfit',
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
          },
        },
        {
          id: 'point1-body',
          type: 'text',
          role: 'body',
          content: '{{POINT1_BODY}}',
          x: 8,
          y: 52,
          width: 42,
          height: 25,
          zIndex: 10,
          style: {
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#CCCCCC',
            textAlign: 'center',
            lineHeight: 1.4,
          },
        },
        {
          id: 'point2-title',
          type: 'text',
          role: 'subtitle',
          content: '{{POINT2_TITLE}}',
          x: 50,
          y: 38,
          width: 42,
          height: 10,
          zIndex: 10,
          style: {
            fontSize: 36,
            fontFamily: 'Outfit',
            fontWeight: 600,
            color: '#FFFFFF',
            textAlign: 'center',
          },
        },
        {
          id: 'point2-body',
          type: 'text',
          role: 'body',
          content: '{{POINT2_BODY}}',
          x: 50,
          y: 52,
          width: 42,
          height: 25,
          zIndex: 10,
          style: {
            fontSize: 20,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#CCCCCC',
            textAlign: 'center',
            lineHeight: 1.4,
          },
        },
      ],
    },
  },

  // ============================================================================
  // QUOTE TEMPLATE
  // ============================================================================

  {
    id: 'quote-elegant',
    name: 'Quote Elegant',
    category: 'quote',
    style: 'elegant',
    description: 'Beautiful quote with attribution',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iI2Y1ZjVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNDUlIiBmb250LXNpemU9IjE4IiBmaWxsPSIjMzMzIiBmb250LWZhbWlseT0ic2VyaWYiIGZvbnQtc3R5bGU9Iml0YWxpYyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UXVvdGU8L3RleHQ+PC9zdmc+',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #e8d5c4 0%, #d4c4b0 100%)',
      },
      elements: [
        {
          id: 'quote',
          type: 'text',
          role: 'body',
          content: '{{QUOTE_TEXT}}',
          x: 15,
          y: 30,
          width: 70,
          height: 35,
          zIndex: 10,
          style: {
            fontSize: 48,
            fontFamily: 'Georgia',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#2a2a2a',
            textAlign: 'center',
            lineHeight: 1.5,
          },
        },
        {
          id: 'attribution',
          type: 'text',
          role: 'reference',
          content: '{{AUTHOR}}',
          x: 15,
          y: 72,
          width: 70,
          height: 8,
          zIndex: 10,
          style: {
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: 600,
            color: '#5a5a5a',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
          },
        },
      ],
    },
  },

  // ============================================================================
  // TRANSITION TEMPLATE
  // ============================================================================

  {
    id: 'transition-minimal',
    name: 'Transition Minimal',
    category: 'transition',
    style: 'minimal',
    description: 'Clean section break',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMzMzIiBmb250LXdlaWdodD0iYm9sZCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2VjdGlvbjwvdGV4dD48L3N2Zz4=',
    visualData: {
      background: {
        type: 'color',
        value: '#f5f5f0',
      },
      elements: [
        {
          id: 'title',
          type: 'text',
          role: 'title',
          content: '{{SECTION_TITLE}}',
          x: 20,
          y: 42,
          width: 60,
          height: 16,
          zIndex: 10,
          style: {
            fontSize: 64,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#2a2a2a',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: 2,
          },
        },
      ],
    },
  },

  // ============================================================================
  // QUESTION TEMPLATE
  // ============================================================================

  {
    id: 'question-bold',
    name: 'Question Bold',
    category: 'question',
    style: 'bold',
    description: 'Engaging question slide',
    thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjExMiIgZmlsbD0iIzRhNGE0YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjMyIiBmaWxsPSJ3aGl0ZSIgZm9udC13ZWlnaHQ9ImJvbGQiIHRleHQtYW5jaG9yPSJtaWRkbGUiPj88L3RleHQ+PC9zdmc+',
    visualData: {
      background: {
        type: 'gradient',
        value: 'linear-gradient(135deg, #5a4a7a 0%, #3a2a5a 100%)',
      },
      elements: [
        {
          id: 'question',
          type: 'text',
          role: 'title',
          content: '{{QUESTION}}',
          x: 10,
          y: 35,
          width: 80,
          height: 30,
          zIndex: 10,
          style: {
            fontSize: 68,
            fontFamily: 'Outfit',
            fontWeight: 700,
            color: '#FFFFFF',
            textAlign: 'center',
            lineHeight: 1.2,
          },
        },
      ],
    },
  },
];

// Helper function to get templates by category
export function getTemplatesByCategory(category: SermonTemplateCategory): SermonTemplate[] {
  return SERMON_TEMPLATES.filter(t => t.category === category);
}

// Helper function to get template by ID
export function getTemplateById(id: string): SermonTemplate | undefined {
  return SERMON_TEMPLATES.find(t => t.id === id);
}

// Get all categories
export function getAllCategories(): SermonTemplateCategory[] {
  return ['title', 'scripture', 'point', 'multi-point', 'quote', 'transition', 'question'];
}
