/**
 * Validation utilities for song editing
 * Ensures data integrity before save operations
 */

import type { CreateSongInput } from '../types';
import type { SlideWithMetadata, ValidationResult } from '../types/song';

/**
 * Validate song data before saving
 */
export function validateSongData(data: CreateSongInput): ValidationResult {
  const errors: string[] = [];

  // Title is required
  if (!data.title?.trim()) {
    errors.push('Song title is required');
  }

  // Either lyrics or slides must be provided
  if (!data.lyrics?.trim() && (!data.slidesData || data.slidesData.length === 0)) {
    errors.push('Either lyrics or slides must be provided');
  }

  // If slides exist, validate each one
  if (data.slidesData && data.slidesData.length > 0) {
    data.slidesData.forEach((slide, index) => {
      if (!slide.id) {
        errors.push(`Slide ${index + 1} is missing an ID`);
      }
      if (!slide.content && !slide.visualData) {
        errors.push(`Slide ${index + 1} has no content`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate slides before saving
 */
export function validateSlides(slides: SlideWithMetadata[]): ValidationResult {
  const errors: string[] = [];

  if (slides.length === 0) {
    errors.push('At least one slide is required');
  }

  slides.forEach((slide, index) => {
    if (!slide.id) {
      errors.push(`Slide ${index + 1} is missing an ID`);
    }

    if (!slide.content?.trim() && !slide.visualData) {
      errors.push(`Slide ${index + 1} has no content`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Validate string length
 */
export function validateLength(
  value: string,
  min: number,
  max: number
): { valid: boolean; error?: string } {
  const length = value.length;

  if (length < min) {
    return {
      valid: false,
      error: `Must be at least ${min} characters`,
    };
  }

  if (length > max) {
    return {
      valid: false,
      error: `Must be no more than ${max} characters`,
    };
  }

  return { valid: true };
}
