/**
 * Pure functions for calculating slide element positions
 * All positioning logic centralized here
 */

import { CANVAS, LAYOUT, FONT_SIZES, TEXT_DEFAULTS } from '../constants/canvas';
import type { Position, Size, TextStyle, VisualData } from '../types/visual';

/**
 * Calculate font size based on content line count
 */
export function calculateFontSize(lineCount: number): number {
  if (lineCount <= 2) return FONT_SIZES.MAX;
  if (lineCount <= 4) return FONT_SIZES.LARGE;
  if (lineCount <= 6) return FONT_SIZES.MEDIUM;
  return FONT_SIZES.SMALL;
}

/**
 * Calculate text position that matches flexbox centering
 * Accounts for padding and 80% max-width constraint
 */
export function calculateTextPosition(): { position: Position; size: Size } {
  // Available space after padding
  const availableWidth = CANVAS.WIDTH - LAYOUT.PADDING_HORIZONTAL_TOTAL;
  const availableHeight = CANVAS.HEIGHT - LAYOUT.PADDING_VERTICAL_TOTAL;
  
  // Text takes 80% of available width
  const textWidth = Math.floor(availableWidth * LAYOUT.TEXT_MAX_WIDTH_PERCENT);
  
  // Center the text container horizontally
  const textX = (CANVAS.WIDTH - textWidth) / 2;
  
  // Approximate vertical centering (flexbox items-center behavior)
  // Use ~1/3 from top for typical text content
  const textHeight = Math.floor(availableHeight * 0.6); // Generous height
  const textY = Math.floor((CANVAS.HEIGHT - textHeight) / 2);
  
  return {
    position: { x: textX, y: textY },
    size: { width: textWidth, height: textHeight },
  };
}

/**
 * Convert slide content to visual data format
 * This is the single source of truth for how slides become visual data
 */
export function contentToVisualData(
  content: string,
  backgroundId?: string,
  backgroundUrl?: string
): VisualData {
  console.log('🎨 UNIFIED SYSTEM: contentToVisualData() called');
  console.log('📝 Content:', content.substring(0, 50));
  
  const lines = content.split('\n').filter(l => l.trim());
  const lineCount = lines.length;
  const fontSize = calculateFontSize(lineCount);
  const { position, size } = calculateTextPosition();
  
  console.log('📐 UNIFIED POSITIONING:');
  console.log('  - Position:', position);
  console.log('  - Size:', size);
  console.log('  - Font size:', fontSize);
  
  const textStyle: TextStyle = {
    fontSize,
    fontWeight: TEXT_DEFAULTS.FONT_WEIGHT,
    color: TEXT_DEFAULTS.COLOR,
    textAlign: TEXT_DEFAULTS.TEXT_ALIGN,
    fontFamily: TEXT_DEFAULTS.FONT_FAMILY,
    lineHeight: TEXT_DEFAULTS.LINE_HEIGHT,
    textShadow: TEXT_DEFAULTS.TEXT_SHADOW,
  };
  
  const visualData: VisualData = {
    elements: [
      {
        id: 'text-1',
        type: 'text' as const,
        content,
        position,
        size,
        style: textStyle,
      },
    ],
    backgroundImage: backgroundUrl,
    backgroundColor: '#000000',
  };
  
  console.log('✅ UNIFIED SYSTEM: Created visualData:', visualData);
  return visualData;
}

/**
 * Convert percentage-based positioning to pixels
 * Used for responsive rendering
 */
export function percentToPixels(
  percent: number,
  dimension: 'width' | 'height'
): number {
  const base = dimension === 'width' ? CANVAS.WIDTH : CANVAS.HEIGHT;
  return Math.floor((percent / 100) * base);
}

/**
 * Convert pixels to percentage
 * Used for responsive rendering
 */
export function pixelsToPercent(
  pixels: number,
  dimension: 'width' | 'height'
): number {
  const base = dimension === 'width' ? CANVAS.WIDTH : CANVAS.HEIGHT;
  return (pixels / base) * 100;
}
