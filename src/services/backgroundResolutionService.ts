import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';

/**
 * Centralized service for resolving background images and configurations
 * Eliminates duplicate logic across presentation components
 */
export class BackgroundResolutionService {
  /**
   * Resolve a background ID or URL to an actual image URL
   * Handles: imageId, imageUrl, legacy IDs, category-based fallbacks
   * 
   * @param background - Background object with imageId/imageUrl/imageRef
   * @param slideBackgroundId - Optional fallback from slide.backgroundId
   * @returns Image URL or null if not found
   */
  static resolveBackgroundUrl(
    background: any,
    slideBackgroundId?: string
  ): string | null {
    // Priority 1: Try imageId or imageUrl from background object
    const bgRef = background?.imageId || background?.imageUrl;
    
    if (bgRef) {
      // If it's already a full URL, return it
      if (bgRef.startsWith('http://') || bgRef.startsWith('https://')) {
        console.log('✅ Background: Direct URL', bgRef);
        return bgRef;
      }
      
      // Try to find in WORSHIP_BACKGROUNDS by ID
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === bgRef);
      if (bg) {
        console.log('✅ Background: Resolved ID', bgRef, '→', bg.url);
        return bg.url;
      }
      
      // Not found - use category-based fallback
      console.warn('⚠️ Background ID not found:', bgRef, '- using category fallback');
      const fallback = this.getCategoryFallback(bgRef);
      if (fallback) {
        console.log('✅ Background: Category fallback', bgRef, '→', fallback);
        return fallback;
      }
    }
    
    // Priority 2: Try slide.backgroundId if provided
    if (slideBackgroundId) {
      console.log('🔍 Checking slide.backgroundId:', slideBackgroundId);
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === slideBackgroundId);
      if (bg) {
        console.log('✅ Background: From slide', slideBackgroundId, '→', bg.url);
        return bg.url;
      }
      
      // Slide background not found - category fallback
      const fallback = this.getCategoryFallback(slideBackgroundId);
      if (fallback) {
        console.log('✅ Background: Slide category fallback', slideBackgroundId, '→', fallback);
        return fallback;
      }
    }
    
    console.warn('⚠️ No background found - returning null');
    return null;
  }
  
  /**
   * Get category-based fallback for old/removed background IDs
   * Matches by prefix (forest-, waves-, mountain-, clouds-, etc.)
   */
  private static getCategoryFallback(backgroundId: string): string | null {
    if (backgroundId.startsWith('forest-') || backgroundId.startsWith('nature-')) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.category === 'forest');
      return bg?.url || null;
    }
    
    if (backgroundId.startsWith('waves-') || backgroundId.startsWith('ocean-')) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.category === 'waves');
      return bg?.url || null;
    }
    
    if (backgroundId.startsWith('mountain-')) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.category === 'mountains');
      return bg?.url || null;
    }
    
    if (backgroundId.startsWith('clouds-')) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.category === 'clouds');
      return bg?.url || null;
    }
    
    if (backgroundId.startsWith('sky-') || backgroundId.startsWith('sunset-') || backgroundId.startsWith('sunrise-')) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.category === 'sky');
      return bg?.url || null;
    }
    
    // No category match - return first available background as last resort
    return WORSHIP_BACKGROUNDS[0]?.url || null;
  }
  
  /**
   * Get CSS background style object ready for inline styles
   * 
   * @param background - Background configuration object
   * @param slideBackgroundId - Optional fallback background ID
   * @returns CSS properties object
   */
  static getBackgroundStyle(
    background: any,
    slideBackgroundId?: string
  ): React.CSSProperties {
    if (!background) {
      return { backgroundColor: '#000000' };
    }
    
    // Check for gradient
    if (background.gradient) {
      return { background: background.gradient };
    }
    
    // Check for solid color (supports both 'color' and 'backgroundColor' fields)
    const bgColor = background.color || background.backgroundColor;
    if (bgColor && background.type === 'solid') {
      return { backgroundColor: bgColor };
    }
    
    // Try to resolve image
    if (background.type === 'image') {
      const imageUrl = this.resolveBackgroundUrl(background, slideBackgroundId);
      if (imageUrl) {
        return {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        };
      }
    }
    
    // Fallback to color or black
    return { backgroundColor: bgColor || '#000000' };
  }
  
  /**
   * Calculate overlay opacity for image backgrounds
   * Song slides get overlay for text readability
   * Other slides (announcements, scripture) don't need overlay
   * 
   * @param background - Background configuration object
   * @param isSongSlide - Whether this is a song lyrics slide
   * @returns Opacity value between 0 and 1
   */
  static getOverlayOpacity(background: any, isSongSlide: boolean): number {
    // Only apply overlay to song slides with image backgrounds
    if (!isSongSlide || background?.type !== 'image') {
      return 0;
    }
    
    // Check if overlay is explicitly disabled
    if (background.overlay?.enabled === false) {
      return 0;
    }
    
    // Use configured opacity, or default to 0.5 (50%) for readability
    if (background.overlay?.opacity !== undefined) {
      // Convert from 0-100 to 0-1, with minimum of 0.5 for song slides
      return Math.max(background.overlay.opacity / 100, 0.5);
    }
    
    // Default: 50% overlay for song slides
    return 0.5;
  }
  
  /**
   * Get overlay color (usually black for darkening)
   */
  static getOverlayColor(background: any): string {
    return background?.overlay?.color || '#000000';
  }
  
  /**
   * Check if a background has an image
   */
  static hasImageBackground(background: any): boolean {
    if (!background) return false;
    if (background.type !== 'image') return false;
    return !!(background.imageId || background.imageUrl);
  }
  
  /**
   * Migrate old background format to new format
   * Old: { backgroundType, backgroundImage, backgroundColor }
   * New: { background: { type, imageUrl, color } }
   */
  static migrateBackgroundFormat(visualData: any): any {
    if (!visualData) return visualData;
    
    // Already has new format
    if (visualData.background) {
      return visualData;
    }
    
    // Convert old format
    if (visualData.backgroundType || visualData.backgroundImage || visualData.backgroundColor) {
      console.log('🔧 Migrating old background format to new format');
      return {
        ...visualData,
        background: {
          type: visualData.backgroundType || 'solid',
          imageUrl: visualData.backgroundImage,
          imageId: visualData.backgroundImage, // Might be an ID
          color: visualData.backgroundColor || '#E8E3DC',
          gradient: visualData.backgroundGradient,
        },
      };
    }
    
    // No background data - add default
    return {
      ...visualData,
      background: {
        type: 'solid',
        color: '#000000',
      },
    };
  }
}
