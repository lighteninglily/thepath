/**
 * Canvas and slide rendering constants
 * Single source of truth for all dimensions and styling
 */

export const CANVAS = {
  WIDTH: 1920,
  HEIGHT: 1080,
  ASPECT_RATIO: '16/9',
} as const;

export const LAYOUT = {
  PADDING: 48, // p-12 in Tailwind = 3rem = 48px
  PADDING_HORIZONTAL_TOTAL: 96, // 48 * 2
  PADDING_VERTICAL_TOTAL: 96, // 48 * 2
  TEXT_MAX_WIDTH_PERCENT: 0.8, // 80% of available width
} as const;

export const TEXT_DEFAULTS = {
  FONT_FAMILY: 'Inter',
  FONT_WEIGHT: '700', // Bold for better readability
  COLOR: '#FFFFFF',
  TEXT_ALIGN: 'center' as const, // CENTER ALIGNED!
  LINE_HEIGHT: 1.4,
  TEXT_SHADOW: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.8)',
  LINE_MARGIN_BOTTOM: 8, // mb-2 = 0.5rem = 8px
} as const;

export const FONT_SIZES = {
  MAX: 80,
  LARGE: 72,
  MEDIUM: 60,
  SMALL: 52,
  MIN: 48,
} as const;

export const BACKGROUND = {
  OVERLAY_OPACITY: 0.5, // bg-black/50
  DEFAULT_COLOR: '#000000',
} as const;
