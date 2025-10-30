/**
 * Slide Converter - Migrate between simple and visual slide formats
 * 
 * Maintains backward compatibility while enabling visual editing
 */

import { Slide } from '../types';
import { VisualSlide, TextElement, VisualBackground, VisualElement } from '../types/designer';
import { v4 as uuidv4 } from 'uuid';

/**
 * Convert a simple Slide to a VisualSlide
 * Creates a centered text element with the slide content
 * If the slide has visualData, use that instead!
 */
export function simpleToVisualSlide(simpleSlide: Slide): VisualSlide {
  // If slide already has visualData, return it!
  if (simpleSlide.visualData) {
    console.log('✅ Using stored visual data for slide', simpleSlide.id);
    return simpleSlide.visualData;
  }
  
  console.log('🔄 Converting simple slide to visual for', simpleSlide.id);
  // Create a centered text element
  const textElement: TextElement = {
    id: uuidv4(),
    type: 'text',
    content: simpleSlide.content,
    
    // Centered on 1920x1080 canvas
    position: { x: 160, y: 390 },      // Left margin, vertically centered
    size: { width: 1600, height: 300 }, // Leave margins
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    
    locked: false,
    visible: true,
    
    style: {
      // Default text styling
      fontFamily: 'Inter',
      fontSize: 56,
      fontWeight: 600,
      fontStyle: 'normal',
      textAlign: 'center',
      textTransform: 'none',
      textDecoration: 'none',
      lineHeight: 1.3,
      letterSpacing: 0,
      
      // White text with shadow for readability
      color: '#ffffff',
      textShadowOffsetX: 2,
      textShadowOffsetY: 2,
      textShadowBlur: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
    },
  };
  
  // Create background
  const background: VisualBackground = simpleSlide.backgroundId
    ? {
        type: 'image',
        imageUrl: simpleSlide.backgroundId,
        overlay: {
          enabled: true,
          color: '#000000',
          opacity: 20,
          blendMode: 'normal',
        },
      }
    : {
        type: 'solid',
        color: '#1a202c',
      };
  
  return {
    id: simpleSlide.id,
    content: simpleSlide.content,
    order: simpleSlide.order,
    
    elements: [textElement],
    background,
    
    aspectRatio: '16:9',
    padding: { top: 100, right: 160, bottom: 100, left: 160 },
    
    isVisualMode: true,
    templateId: undefined,
  };
}

/**
 * Convert a VisualSlide back to a simple Slide
 * Extracts text content from all text elements
 */
export function visualToSimpleSlide(visualSlide: VisualSlide): Slide {
  // Combine all text elements into content
  const textElements = visualSlide.elements.filter(
    (el): el is TextElement => el.type === 'text'
  );
  
  const content = textElements
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((el) => el.content)
    .join('\n\n');
  
  // Extract background
  let backgroundId: string | null = null;
  if (visualSlide.background.type === 'image' && visualSlide.background.imageUrl) {
    backgroundId = visualSlide.background.imageUrl;
  }
  
  return {
    id: visualSlide.id,
    type: 'verse',
    content: content || visualSlide.content,
    order: visualSlide.order,
    backgroundId,
    layout: 'full-bleed',
    // PRESERVE the complete visual data!
    visualData: visualSlide,
  };
}

/**
 * Check if slide needs migration to visual format
 */
export function needsMigration(slide: any): boolean {
  // If it has 'elements' array, it's already visual
  return !slide.elements;
}

/**
 * Create an empty visual slide
 */
export function createEmptyVisualSlide(order: number = 0): VisualSlide {
  return {
    id: uuidv4(),
    content: '',
    order,
    
    elements: [],
    background: {
      type: 'solid',
      color: '#1a202c',
    },
    
    aspectRatio: '16:9',
    padding: { top: 100, right: 160, bottom: 100, left: 160 },
    
    isVisualMode: true,
    templateId: undefined,
  };
}

/**
 * Create default text element (for adding new text to slide)
 */
export function createDefaultTextElement(content: string = 'New Text'): TextElement {
  return {
    id: uuidv4(),
    type: 'text',
    content,
    
    // Centered position
    position: { x: 660, y: 465 },      // Center of 1920x1080
    size: { width: 600, height: 150 },
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    
    locked: false,
    visible: true,
    
    style: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 600,
      fontStyle: 'normal',
      textAlign: 'center',
      textTransform: 'none',
      textDecoration: 'none',
      lineHeight: 1.2,
      letterSpacing: 0,
      
      color: '#ffffff',
      textShadowOffsetX: 2,
      textShadowOffsetY: 2,
      textShadowBlur: 6,
      textShadowColor: 'rgba(0, 0, 0, 0.6)',
    },
  };
}

/**
 * Validate visual slide structure
 */
export function validateVisualSlide(slide: any): slide is VisualSlide {
  return (
    slide &&
    typeof slide === 'object' &&
    typeof slide.id === 'string' &&
    Array.isArray(slide.elements) &&
    slide.background &&
    typeof slide.background.type === 'string'
  );
}

/**
 * Get total bounds of all elements (for auto-fit)
 */
export function getSlideContentBounds(slide: VisualSlide): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  if (slide.elements.length === 0) {
    return { minX: 0, minY: 0, maxX: 1920, maxY: 1080 };
  }
  
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  
  slide.elements.forEach((element) => {
    minX = Math.min(minX, element.position.x);
    minY = Math.min(minY, element.position.y);
    maxX = Math.max(maxX, element.position.x + element.size.width);
    maxY = Math.max(maxY, element.position.y + element.size.height);
  });
  
  return { minX, minY, maxX, maxY };
}

/**
 * Clone element (for duplicate action)
 */
export function cloneElement(element: VisualElement): VisualElement {
  return {
    ...element,
    id: uuidv4(),
    position: {
      x: element.position.x + 20,
      y: element.position.y + 20,
    },
  };
}

/**
 * Sort elements by zIndex
 */
export function sortElementsByZIndex(elements: VisualElement[]): VisualElement[] {
  return [...elements].sort((a, b) => a.zIndex - b.zIndex);
}

/**
 * Get next available zIndex
 */
export function getNextZIndex(elements: VisualElement[]): number {
  if (elements.length === 0) return 1;
  return Math.max(...elements.map((el) => el.zIndex)) + 1;
}
