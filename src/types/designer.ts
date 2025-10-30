/**
 * Visual Designer Types - Canva-style slide editor
 * 
 * These extend the existing Slide type to support visual element positioning,
 * layering, and rich styling without breaking backward compatibility.
 */

// ============================================================================
// VISUAL ELEMENTS
// ============================================================================

/**
 * Position in pixels on 1920x1080 canvas
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Size in pixels
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * Base visual element - can be text, shape, image, icon, etc.
 */
export interface VisualElement {
  id: string;
  type: 'text' | 'shape' | 'image' | 'icon' | 'divider';
  
  // Transform
  position: Position;
  size: Size;
  rotation: number;      // Degrees: 0-360
  opacity: number;       // 0-1
  zIndex: number;        // Layer order (higher = front)
  
  // State
  locked: boolean;       // Prevent editing
  visible: boolean;      // Show/hide
  
  // Type-specific content
  content?: string;      // For text elements
  imageUrl?: string;     // For image elements
  iconName?: string;     // For icon elements (Lucide icon name)
  shapeType?: ShapeType; // For shape elements
  
  // Styling
  style: ElementStyle;
}

/**
 * Text-specific element
 */
export interface TextElement extends VisualElement {
  type: 'text';
  content: string;
  style: TextStyle;
}

/**
 * Shape-specific element
 */
export interface ShapeElement extends VisualElement {
  type: 'shape';
  shapeType: ShapeType;
  style: ShapeStyle;
}

/**
 * Image-specific element
 */
export interface ImageElement extends VisualElement {
  type: 'image';
  imageUrl: string;
  style: ImageStyle;
}

// ============================================================================
// STYLING
// ============================================================================

/**
 * Base element styling
 */
export interface ElementStyle {
  // Colors
  color?: string;
  backgroundColor?: string;
  
  // Border
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
  
  // Shadow
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowBlur?: number;
  shadowColor?: string;
  
  // Blend
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
}

/**
 * Text-specific styling
 */
export interface TextStyle extends ElementStyle {
  // Font
  fontFamily: string;
  fontSize: number;        // Pixels
  fontWeight: 100 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  fontStyle: 'normal' | 'italic';
  
  // Text formatting
  textAlign: 'left' | 'center' | 'right' | 'justify';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  
  // Spacing
  lineHeight: number;      // Multiplier: 1.0 = normal, 1.5 = 1.5x
  letterSpacing: number;   // Pixels
  
  // Advanced
  textShadowOffsetX?: number;
  textShadowOffsetY?: number;
  textShadowBlur?: number;
  textShadowColor?: string;
  
  textStrokeWidth?: number;
  textStrokeColor?: string;
}

/**
 * Shape-specific styling
 */
export interface ShapeStyle extends ElementStyle {
  fillColor: string;
  strokeWidth?: number;
  strokeColor?: string;
}

/**
 * Image-specific styling
 */
export interface ImageStyle extends ElementStyle {
  // Filters
  blur?: number;           // 0-20px
  brightness?: number;     // 0-200%
  contrast?: number;       // 0-200%
  saturation?: number;     // 0-200%
  hue?: number;           // 0-360deg
  sepia?: number;         // 0-100%
  grayscale?: number;     // 0-100%
  
  // Fit
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
}

/**
 * Shape types
 */
export type ShapeType = 
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'star'
  | 'heart'
  | 'cross';

// ============================================================================
// BACKGROUNDS
// ============================================================================

/**
 * Enhanced background system
 */
export interface VisualBackground {
  type: 'solid' | 'gradient' | 'image';
  
  // Solid
  color?: string;
  
  // Gradient
  gradient?: Gradient;
  
  // Image
  imageUrl?: string;
  imageId?: string;  // Support for AI-generated slides
  imageFilters?: ImageFilters;
  
  // Overlay (for image backgrounds)
  overlay?: Overlay;
}

/**
 * Gradient definition
 */
export interface Gradient {
  type: 'linear' | 'radial';
  angle?: number;          // For linear: 0-360 degrees
  colors: string[];        // 2-5 colors
  stops?: number[];        // Color stop positions 0-100
}

/**
 * Image filters
 */
export interface ImageFilters {
  blur?: number;           // 0-20px
  brightness?: number;     // 0-200%
  contrast?: number;       // 0-200%
  saturation?: number;     // 0-200%
  hue?: number;           // 0-360deg
  sepia?: number;         // 0-100%
  grayscale?: number;     // 0-100%
}

/**
 * Overlay for backgrounds
 */
export interface Overlay {
  enabled: boolean;
  color: string;
  opacity: number;         // 0-100
  blendMode: 'normal' | 'multiply' | 'screen' | 'overlay';
}

// ============================================================================
// VISUAL SLIDE
// ============================================================================

/**
 * Enhanced slide with visual elements
 * Extends the basic Slide type with visual editing capabilities
 */
export interface VisualSlide {
  id: string;
  
  // Content (backward compatible with basic slides)
  content: string;         // Text content (for simple mode compatibility)
  order: number;
  
  // Visual system
  elements: VisualElement[];
  background: VisualBackground;
  
  // Canvas settings
  aspectRatio: '16:9' | '4:3' | '9:16';
  padding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // Metadata
  isVisualMode: boolean;   // True if using visual elements, false for simple text
  templateId?: string;     // If created from template
}

// ============================================================================
// DESIGNER STATE
// ============================================================================

/**
 * Designer component state
 */
export interface DesignerState {
  // Current slide being edited
  slide: VisualSlide;
  
  // Selection
  selectedElementId: string | null;
  
  // Canvas
  canvasZoom: number;      // 0.1-2.0
  canvasPosition: Position;
  showGrid: boolean;
  snapToGrid: boolean;
  gridSize: number;        // Pixels
  
  // UI
  leftSidebarTab: 'templates' | 'elements' | 'backgrounds' | 'uploads';
  rightSidebarTab: 'properties' | 'layers';
  
  // History (for undo/redo)
  history: VisualSlide[];
  historyIndex: number;
}

// ============================================================================
// TEMPLATES
// ============================================================================

/**
 * Design template
 */
export interface DesignTemplate {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  tags: string[];
  
  // Preview
  thumbnail: string;
  
  // Structure
  aspectRatio: '16:9' | '4:3';
  background: VisualBackground;
  elements: VisualElement[];
  
  // Metadata
  isPro: boolean;
  createdAt: string;
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Bounds for collision detection
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Export options
 */
export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf';
  quality?: number;        // For JPG: 0-100
  resolution: '1080p' | '4K';
}
