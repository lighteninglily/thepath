/**
 * Comprehensive type definitions for song editing system
 * Replaces all `any` types with proper interfaces
 */

import type { Slide } from './index';
import type { VisualSlide } from './designer';

// Layout types
export type LayoutType = 'full-bleed' | 'top-heavy' | 'bottom-heavy' | 'centered';

// Slide with additional metadata
export interface SlideWithMetadata extends Slide {
  layout?: LayoutType;
  backgroundId?: string | null;
  visualData?: VisualSlide;
}

// Song generation structures
export interface SongAnalysis {
  mood: string;
  energy: number;
  themes: string[];
}

export interface StructureDetection {
  hasChorus: boolean;
  chorusStartIndex?: number;
  chorusEndIndex?: number;
  recommendedDuplications?: number;
}

export interface GenerationMetadata {
  generatedAt: Date;
  themePack: string;
  version: string;
}

export interface GenerationResult {
  slides: SlideWithMetadata[];
  analysis: SongAnalysis;
  songInfo: {
    title: string;
    artist: string;
    lyrics: string;
  };
  metadata?: GenerationMetadata;
  structureDetection?: StructureDetection;
}

// Chorus duplication
export interface ChorusSlide {
  slideNumber: number;
  content: string;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Save status
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Editor state
export interface EditorState {
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  saveStatus: SaveStatus;
}
