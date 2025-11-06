/**
 * Title Slide Design Variants
 * 
 * 5 different professional title slide designs that AI randomly selects
 * Users can switch between designs in the slide editor
 */

export interface TitleSlideDesign {
  id: string;
  name: string;
  description: string;
  createVisualData: (title: string, artist: string, backgroundUrl: string) => any;
}

/**
 * Design A: Elegant Script (Original)
 * - Script font (Allura) for title
 * - Clean sans-serif (Outfit) for artist
 * - Center aligned, elegant and timeless
 */
const DESIGN_ELEGANT_SCRIPT: TitleSlideDesign = {
  id: 'elegant-script',
  name: 'Elegant Script',
  description: 'Beautiful script font, classic and timeless',
  createVisualData: (title: string, artist: string, backgroundUrl: string) => ({
    background: {
      type: 'image',
      imageUrl: backgroundUrl,
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 50,
        blendMode: 'normal' as const
      }
    },
    elements: [
      // Song Title - Beautiful script font (Allura)
      {
        id: `text_song_title_${Date.now()}`,
        type: 'text',
        content: title,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 350 },
        size: { width: 1600, height: 200 },
        style: {
          fontSize: 120,
          fontFamily: 'Allura',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: '4px 4px 20px rgba(0, 0, 0, 0.9)'
        }
      },
      // Artist Name - Clean modern font (Outfit)
      {
        id: `text_artist_name_${Date.now()}`,
        type: 'text',
        content: artist,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 580 },
        size: { width: 1600, height: 100 },
        style: {
          fontSize: 48,
          fontFamily: 'Outfit',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'
        }
      }
    ]
  })
};

/**
 * Design B: Bold Modern
 * - Ultra bold uppercase title (Inter)
 * - Light weight artist name
 * - Left aligned with accent bar
 */
const DESIGN_BOLD_MODERN: TitleSlideDesign = {
  id: 'bold-modern',
  name: 'Bold Modern',
  description: 'Ultra bold uppercase, contemporary and strong',
  createVisualData: (title: string, artist: string, backgroundUrl: string) => ({
    background: {
      type: 'image',
      imageUrl: backgroundUrl,
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 55,
        blendMode: 'normal' as const
      }
    },
    elements: [
      // Decorative accent bar
      {
        id: `accent_bar_${Date.now()}`,
        type: 'shape',
        visible: true,
        opacity: 1,
        zIndex: 8,
        rotation: 0,
        position: { x: 280, y: 360 },
        size: { width: 8, height: 300 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 4
        }
      },
      // Song Title - Ultra bold uppercase
      {
        id: `text_song_title_${Date.now()}`,
        type: 'text',
        content: title.toUpperCase(),
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 320, y: 360 },
        size: { width: 1280, height: 240 },
        style: {
          fontSize: 110,
          fontFamily: 'Inter',
          fontWeight: 900,
          color: '#ffffff',
          textAlign: 'left',
          lineHeight: 1.1,
          textTransform: 'uppercase',
          textShadow: '4px 4px 16px rgba(0, 0, 0, 0.95)'
        }
      },
      // Artist Name - Light weight
      {
        id: `text_artist_name_${Date.now()}`,
        type: 'text',
        content: artist,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 320, y: 620 },
        size: { width: 800, height: 60 },
        style: {
          fontSize: 44,
          fontFamily: 'Inter',
          fontWeight: 300,
          color: '#ffffff',
          textAlign: 'left',
          lineHeight: 1.2,
          textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'
        }
      }
    ]
  })
};

/**
 * Design C: Classic Serif
 * - Elegant serif font (Playfair Display) for title
 * - Clean sans-serif (Lato) for artist
 * - Center aligned with decorative divider
 */
const DESIGN_CLASSIC_SERIF: TitleSlideDesign = {
  id: 'classic-serif',
  name: 'Classic Serif',
  description: 'Elegant serif, traditional and refined',
  createVisualData: (title: string, artist: string, backgroundUrl: string) => ({
    background: {
      type: 'image',
      imageUrl: backgroundUrl,
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 50,
        blendMode: 'normal' as const
      }
    },
    elements: [
      // Song Title - Elegant serif
      {
        id: `text_song_title_${Date.now()}`,
        type: 'text',
        content: title,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 340 },
        size: { width: 1600, height: 220 },
        style: {
          fontSize: 100,
          fontFamily: 'Playfair Display',
          fontWeight: 700,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          fontStyle: 'italic',
          textShadow: '4px 4px 20px rgba(0, 0, 0, 0.95)'
        }
      },
      // Decorative divider line
      {
        id: `divider_${Date.now()}`,
        type: 'shape',
        visible: true,
        opacity: 0.6,
        zIndex: 9,
        rotation: 0,
        position: { x: 760, y: 580 },
        size: { width: 400, height: 2 },
        style: {
          backgroundColor: '#ffffff'
        }
      },
      // Artist Name - Clean sans-serif
      {
        id: `text_artist_name_${Date.now()}`,
        type: 'text',
        content: artist,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 610 },
        size: { width: 1600, height: 80 },
        style: {
          fontSize: 40,
          fontFamily: 'Lato',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          letterSpacing: '2px',
          textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'
        }
      }
    ]
  })
};

/**
 * Design D: Minimalist Clean
 * - Semi-bold sans-serif (Outfit)
 * - Bottom-aligned with breathing room
 * - Simple, modern, and clean
 */
const DESIGN_MINIMALIST_CLEAN: TitleSlideDesign = {
  id: 'minimalist-clean',
  name: 'Minimalist Clean',
  description: 'Simple and modern, breathable spacing',
  createVisualData: (title: string, artist: string, backgroundUrl: string) => ({
    background: {
      type: 'image',
      imageUrl: backgroundUrl,
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 45,
        blendMode: 'normal' as const
      }
    },
    elements: [
      // Song Title - Semi-bold, top spacing
      {
        id: `text_song_title_${Date.now()}`,
        type: 'text',
        content: title,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 480 },
        size: { width: 1600, height: 180 },
        style: {
          fontSize: 88,
          fontFamily: 'Outfit',
          fontWeight: 600,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: '4px 4px 16px rgba(0, 0, 0, 0.9)'
        }
      },
      // Artist Name - Regular weight, subtle
      {
        id: `text_artist_name_${Date.now()}`,
        type: 'text',
        content: artist,
        visible: true,
        opacity: 0.9,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 680 },
        size: { width: 1600, height: 60 },
        style: {
          fontSize: 36,
          fontFamily: 'Outfit',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.3,
          textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9)'
        }
      }
    ]
  })
};

/**
 * Design E: Dynamic Stacked
 * - Condensed uppercase title (Bebas Neue)
 * - Regular sans-serif (Inter) for artist
 * - Center aligned with card background
 */
const DESIGN_DYNAMIC_STACKED: TitleSlideDesign = {
  id: 'dynamic-stacked',
  name: 'Dynamic Stacked',
  description: 'Bold condensed uppercase, energetic and impactful',
  createVisualData: (title: string, artist: string, backgroundUrl: string) => ({
    background: {
      type: 'image',
      imageUrl: backgroundUrl,
      overlay: {
        enabled: true,
        color: '#000000',
        opacity: 50,
        blendMode: 'normal' as const
      }
    },
    elements: [
      // Semi-transparent card background
      {
        id: `card_bg_${Date.now()}`,
        type: 'shape',
        visible: true,
        opacity: 0.15,
        zIndex: 8,
        rotation: 0,
        position: { x: 260, y: 320 },
        size: { width: 1400, height: 440 },
        style: {
          backgroundColor: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }
      },
      // Song Title - Condensed uppercase
      {
        id: `text_song_title_${Date.now()}`,
        type: 'text',
        content: title.toUpperCase(),
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 340 },
        size: { width: 1600, height: 260 },
        style: {
          fontSize: 130,
          fontFamily: 'Bebas Neue',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.0,
          letterSpacing: '4px',
          textTransform: 'uppercase',
          textShadow: '5px 5px 20px rgba(0, 0, 0, 0.95)'
        }
      },
      // Artist Name - Regular weight
      {
        id: `text_artist_name_${Date.now()}`,
        type: 'text',
        content: artist,
        visible: true,
        opacity: 1,
        zIndex: 10,
        rotation: 0,
        position: { x: 160, y: 640 },
        size: { width: 1600, height: 80 },
        style: {
          fontSize: 38,
          fontFamily: 'Inter',
          fontWeight: 400,
          color: '#ffffff',
          textAlign: 'center',
          lineHeight: 1.2,
          textShadow: '3px 3px 12px rgba(0, 0, 0, 0.9)'
        }
      }
    ]
  })
};

/**
 * All available title slide designs
 */
export const TITLE_SLIDE_DESIGNS: TitleSlideDesign[] = [
  DESIGN_ELEGANT_SCRIPT,
  DESIGN_BOLD_MODERN,
  DESIGN_CLASSIC_SERIF,
  DESIGN_MINIMALIST_CLEAN,
  DESIGN_DYNAMIC_STACKED
];

/**
 * Get a title slide design by ID
 */
export function getTitleSlideDesign(designId: string): TitleSlideDesign | undefined {
  return TITLE_SLIDE_DESIGNS.find(d => d.id === designId);
}

/**
 * Get a random title slide design
 */
export function getRandomTitleSlideDesign(): TitleSlideDesign {
  const randomIndex = Math.floor(Math.random() * TITLE_SLIDE_DESIGNS.length);
  return TITLE_SLIDE_DESIGNS[randomIndex];
}

/**
 * Apply a title slide design to create visualData
 */
export function applyTitleSlideDesign(
  design: TitleSlideDesign,
  title: string,
  artist: string,
  backgroundUrl: string
): any {
  console.log(`🎨 Applying title slide design: ${design.name}`);
  return design.createVisualData(title, artist, backgroundUrl);
}
