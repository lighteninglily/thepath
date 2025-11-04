/**
 * Strict type definitions for visual data
 * Eliminates 'any' types throughout the codebase
 */

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextStyle {
  fontSize: number;
  fontWeight: string;
  color: string;
  textAlign: 'left' | 'center' | 'right';
  fontFamily: string;
  lineHeight: number;
  textShadow: string;
}

export interface VisualElement {
  id: string;
  type: 'text' | 'image';
  content: string;
  position: Position;
  size: Size;
  style: TextStyle;
  visible?: boolean; // Optional - defaults to true if not specified
  zIndex?: number;
  opacity?: number;
}

export interface VisualData {
  elements: VisualElement[];
  backgroundImage?: string;
  backgroundColor: string;
}

export interface SlideContent {
  id: string;
  content: string;
  backgroundId?: string;
  visualData?: VisualData;
}
