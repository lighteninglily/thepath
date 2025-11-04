/**
 * Slide helper utilities
 * Extracts duplicate code for slide operations
 */

import type { Slide } from '../types';
import type { SlideWithMetadata, LayoutType } from '../types/song';
import type { BackgroundImage } from '../assets/backgrounds';
import { LAYOUT_TYPES } from './constants';

/**
 * Resolve slide backgrounds from background IDs
 * Extracts duplicate background resolution logic
 */
export function resolveSlideBackgrounds(
  slides: Slide[],
  availableBackgrounds: BackgroundImage[]
): (BackgroundImage | null)[] {
  return slides.map(slide => {
    if (!slide.backgroundId) {
      return null;
    }

    const background = availableBackgrounds.find(bg => bg.id === slide.backgroundId);
    return background || null;
  });
}

/**
 * Extract layouts from slides
 */
export function extractSlideLayouts(slides: SlideWithMetadata[]): LayoutType[] {
  return slides.map(slide => slide.layout || LAYOUT_TYPES.FULL_BLEED as LayoutType);
}

/**
 * Apply backgrounds to slides
 */
export function applyBackgroundsToSlides(
  slides: Slide[],
  backgrounds: (BackgroundImage | null)[],
  layouts?: LayoutType[]
): SlideWithMetadata[] {
  return slides.map((slide, index) => ({
    ...slide,
    backgroundId: backgrounds[index]?.id || slide.backgroundId || null,
    layout: layouts ? layouts[index] : (slide as SlideWithMetadata).layout,
  }));
}

/**
 * Update visual data backgrounds
 */
export function updateVisualDataBackground(
  slide: SlideWithMetadata,
  background: BackgroundImage
): SlideWithMetadata {
  if (!slide.visualData) {
    return slide;
  }

  return {
    ...slide,
    visualData: {
      ...slide.visualData,
      background: {
        type: 'image' as const,
        imageId: background.id,
        imageUrl: background.id,
        overlay: {
          enabled: true,
          color: '#000000',
          opacity: 50,
          blendMode: 'normal' as const,
        },
      },
    },
  };
}

/**
 * Batch update slides with backgrounds and visual data
 */
export function batchUpdateSlideBackgrounds(
  slides: Slide[],
  backgrounds: (BackgroundImage | null)[],
  layouts: LayoutType[]
): SlideWithMetadata[] {
  return slides.map((slide, index) => {
    const background = backgrounds[index];
    let updatedSlide: SlideWithMetadata = {
      ...slide,
      backgroundId: background?.id || slide.backgroundId || null,
      layout: layouts[index] || LAYOUT_TYPES.FULL_BLEED as LayoutType,
    };

    // Update visual data if present and background exists
    if (background && slide.visualData) {
      updatedSlide = updateVisualDataBackground(updatedSlide, background);
    }

    return updatedSlide;
  });
}

/**
 * Deep clone using structuredClone (modern browsers)
 * Falls back to JSON method for older browsers
 */
export function deepClone<T>(obj: T): T {
  // Modern browsers support structuredClone
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj);
  }

  // Fallback to JSON (loses functions, dates, undefined)
  return JSON.parse(JSON.stringify(obj));
}
