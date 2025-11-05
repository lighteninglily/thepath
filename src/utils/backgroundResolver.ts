import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';

/**
 * Background Resolver Utility
 * 
 * Single source of truth for resolving background styles from various formats.
 * Handles: gradients, solid colors, image URLs, image IDs, and fallbacks.
 * 
 * Created: Phase 2 of presentation system overhaul
 */

export interface BackgroundConfig {
  type?: 'image' | 'solid' | 'gradient';
  imageUrl?: string;
  imageId?: string;
  color?: string;
  backgroundColor?: string;
  gradient?: string;
  backgroundGradient?: string;
  // Legacy support
  backgroundImage?: string;
  backgroundType?: string;
}

export interface ResolvedBackground {
  style: React.CSSProperties;
  imageUrl: string | null;
  type: 'image' | 'gradient' | 'solid';
  hasError: boolean;
  errorMessage?: string;
}

/**
 * Resolve a background configuration to a CSS style object
 * 
 * Priority order:
 * 1. Gradient (if specified)
 * 2. Image URL (if type is 'image' and URL exists)
 * 3. Solid color (fallback)
 * 
 * @param background - Background configuration object
 * @param fallbackColor - Default color if nothing else resolves (default: '#1a1a2e')
 * @returns Resolved background with style, URL, type, and error status
 */
export function resolveBackground(
  background: BackgroundConfig | undefined | null,
  fallbackColor: string = '#1a1a2e'
): ResolvedBackground {
  
  if (!background) {
    return {
      style: { backgroundColor: fallbackColor },
      imageUrl: null,
      type: 'solid',
      hasError: false
    };
  }

  // Priority 1: Check for gradient (highest priority for visual appeal)
  const gradientValue = background.gradient || background.backgroundGradient;
  if (gradientValue) {
    return {
      style: { background: gradientValue },
      imageUrl: null,
      type: 'gradient',
      hasError: false
    };
  }

  // Priority 2: Image background
  // Check for explicit type OR presence of image fields
  const hasImageRef = !!(background.imageUrl || background.imageId || background.backgroundImage);
  const isImageType = background.type === 'image' || background.backgroundType === 'image';
  
  if (isImageType || hasImageRef) {
    const imageUrl = resolveBackgroundImageUrl(background);
    
    if (imageUrl) {
      return {
        style: {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        },
        imageUrl,
        type: 'image',
        hasError: false
      };
    } else if (isImageType || hasImageRef) {
      // Image was requested but not found - try color fallback first
      const color = background.color || background.backgroundColor;
      if (color) {
        console.warn('⚠️ Image not found, using color fallback:', color);
        return {
          style: { backgroundColor: color },
          imageUrl: null,
          type: 'solid',
          hasError: true,
          errorMessage: `Image not found: ${background.imageId || background.imageUrl || 'unknown'}, using color fallback`
        };
      }
      
      return {
        style: { backgroundColor: fallbackColor },
        imageUrl: null,
        type: 'image',
        hasError: true,
        errorMessage: `Image not found: ${background.imageId || background.imageUrl || 'unknown'}`
      };
    }
  }

  // Priority 3: Solid color
  const color = background.color || background.backgroundColor;
  if (color) {
    return {
      style: { backgroundColor: color },
      imageUrl: null,
      type: 'solid',
      hasError: false
    };
  }

  // Final fallback
  return {
    style: { backgroundColor: fallbackColor },
    imageUrl: null,
    type: 'solid',
    hasError: false
  };
}

/**
 * Resolve an image URL or ID to an actual image URL
 * 
 * Handles:
 * - Full URLs (http/https)
 * - Background IDs (lookup in WORSHIP_BACKGROUNDS)
 * - Legacy background IDs with category fallback
 * - Ultimate fallback to first available background
 * 
 * @param background - Background configuration
 * @returns Image URL or null if not found
 */
export function resolveBackgroundImageUrl(
  background: BackgroundConfig | undefined | null
): string | null {
  
  if (!background) return null;

  // Get the ID or URL from various possible fields
  const bgRef = background.imageId || background.imageUrl || background.backgroundImage;
  
  if (!bgRef) return null;

  // If it's already a full URL or relative path, return it as-is
  if (bgRef.startsWith('http://') || bgRef.startsWith('https://') || 
      bgRef.startsWith('./') || bgRef.startsWith('../') || bgRef.startsWith('/') ||
      bgRef.startsWith('file://') || bgRef.startsWith('blob:') || bgRef.startsWith('data:')) {
    return bgRef;
  }

  // Otherwise, treat it as a background ID - look it up in WORSHIP_BACKGROUNDS
  const matchedBackground = WORSHIP_BACKGROUNDS.find(b => b.id === bgRef);
  if (matchedBackground) {
    return matchedBackground.url;
  }

  // Background ID not found - use intelligent category fallback
  console.warn('⚠️ Background ID not found:', bgRef, '- using fallback');
  
  // Try category-based matching
  let fallbackBg = null;
  if (bgRef.startsWith('forest-') || bgRef.startsWith('nature-')) {
    fallbackBg = WORSHIP_BACKGROUNDS.find(b => b.category === 'forest');
  } else if (bgRef.startsWith('waves-') || bgRef.startsWith('water-')) {
    fallbackBg = WORSHIP_BACKGROUNDS.find(b => b.category === 'waves');
  } else if (bgRef.startsWith('mountain-')) {
    fallbackBg = WORSHIP_BACKGROUNDS.find(b => b.category === 'mountains');
  } else if (bgRef.startsWith('clouds-') || bgRef.startsWith('sky-')) {
    fallbackBg = WORSHIP_BACKGROUNDS.find(b => b.category === 'clouds');
  } else if (bgRef.startsWith('sunset-') || bgRef.startsWith('sunrise-')) {
    // Sunset/sunrise usually have sky backgrounds
    fallbackBg = WORSHIP_BACKGROUNDS.find(b => b.category === 'sky') || WORSHIP_BACKGROUNDS.find(b => b.category === 'light');
  }

  if (fallbackBg) {
    console.log('✅ Using category fallback:', fallbackBg.id, fallbackBg.url);
    return fallbackBg.url;
  }

  // Ultimate fallback: use first available background
  // Better to show *something* than a black screen
  if (WORSHIP_BACKGROUNDS.length > 0) {
    console.log('⚠️ Using first available background as last resort');
    return WORSHIP_BACKGROUNDS[0].url;
  }

  return null;
}

/**
 * Get a background style for inline CSS (React style prop)
 * This is a convenience wrapper around resolveBackground
 * 
 * @param background - Background configuration
 * @param fallbackColor - Default color if nothing else resolves
 * @returns CSS style object ready for React's style prop
 */
export function getBackgroundStyle(
  background: BackgroundConfig | undefined | null,
  fallbackColor: string = '#1a1a2e'
): React.CSSProperties {
  return resolveBackground(background, fallbackColor).style;
}
