import type { ServiceItem } from '../types/service';

/**
 * Visual Data Validator
 * 
 * Validates service items for correct visual data structure and completeness.
 * Used for debugging, migration, and quality assurance.
 * 
 * Created: Phase 3 of presentation system overhaul
 */

export interface ValidationResult {
  isValid: boolean;
  hasVisualData: boolean;
  errors: string[];
  warnings: string[];
  itemType: string;
  itemTitle: string;
}

export interface VisualDataStructure {
  background?: {
    type?: string;
    imageUrl?: string;
    imageId?: string;
    color?: string;
    gradient?: string;
    overlay?: {
      enabled?: boolean;
      opacity?: number;
    };
  };
  elements?: Array<{
    id: string;
    type: 'text' | 'shape' | 'image';
    position: { x: number; y: number };
    size: { width: number; height: number };
    visible?: boolean;
    zIndex?: number;
    content?: string;
    [key: string]: any;
  }>;
  backgroundColor?: string;
  backgroundType?: string;
  backgroundImage?: string;
}

/**
 * Validate a service item's visual data
 * 
 * @param item - Service item to validate
 * @returns Validation result with errors and warnings
 */
export function validateServiceItem(item: ServiceItem): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    hasVisualData: false,
    errors: [],
    warnings: [],
    itemType: item.type,
    itemTitle: item.title || item.songTitle || `${item.type} item`
  };

  // Songs are handled differently (they have slidesData)
  if (item.type === 'song') {
    result.warnings.push('Song items are validated separately via slidesData');
    return result;
  }

  // Check if item has content
  if (!item.content) {
    result.errors.push('Item has no content field');
    result.isValid = false;
    return result;
  }

  // Check if content is JSON (visual data)
  if (!item.content.trim().startsWith('{')) {
    result.warnings.push('Item content is plain text, not visual data (this is okay for legacy items)');
    return result;
  }

  // Try to parse visual data
  let visualData: VisualDataStructure;
  try {
    visualData = JSON.parse(item.content);
    result.hasVisualData = true;
  } catch (error) {
    result.errors.push(`Failed to parse visual data JSON: ${(error as Error).message}`);
    result.isValid = false;
    return result;
  }

  // Validate background
  if (!visualData.background && !visualData.backgroundType) {
    result.warnings.push('No background definition found');
  } else if (visualData.background) {
    validateBackground(visualData.background, result);
  }

  // Validate elements array
  if (!visualData.elements) {
    result.errors.push('No elements array in visual data');
    result.isValid = false;
  } else if (!Array.isArray(visualData.elements)) {
    result.errors.push('Elements is not an array');
    result.isValid = false;
  } else {
    validateElements(visualData.elements, result);
  }

  return result;
}

/**
 * Validate background configuration
 */
function validateBackground(background: any, result: ValidationResult): void {
  if (!background.type) {
    result.warnings.push('Background has no type specified');
  }

  if (background.type === 'image') {
    if (!background.imageUrl && !background.imageId) {
      result.errors.push('Image background has no imageUrl or imageId');
      result.isValid = false;
    }
  }

  if (background.type === 'gradient') {
    if (!background.gradient) {
      result.errors.push('Gradient background has no gradient value');
      result.isValid = false;
    }
  }

  if (background.type === 'solid' || !background.type) {
    if (!background.color && !background.backgroundColor) {
      result.warnings.push('Solid background has no color specified');
    }
  }
}

/**
 * Validate elements array
 */
function validateElements(elements: any[], result: ValidationResult): void {
  if (elements.length === 0) {
    result.warnings.push('Elements array is empty (slide will be blank)');
  }

  elements.forEach((element, index) => {
    // Check required fields
    if (!element.id) {
      result.warnings.push(`Element ${index} has no id`);
    }

    if (!element.type) {
      result.errors.push(`Element ${index} has no type`);
      result.isValid = false;
    } else if (!['text', 'shape', 'image'].includes(element.type)) {
      result.errors.push(`Element ${index} has invalid type: ${element.type}`);
      result.isValid = false;
    }

    // Check position
    if (!element.position) {
      result.errors.push(`Element ${index} has no position`);
      result.isValid = false;
    } else {
      if (typeof element.position.x !== 'number') {
        result.errors.push(`Element ${index} position.x is not a number`);
        result.isValid = false;
      }
      if (typeof element.position.y !== 'number') {
        result.errors.push(`Element ${index} position.y is not a number`);
        result.isValid = false;
      }
    }

    // Check size
    if (!element.size) {
      result.errors.push(`Element ${index} has no size`);
      result.isValid = false;
    } else {
      if (typeof element.size.width !== 'number') {
        result.errors.push(`Element ${index} size.width is not a number`);
        result.isValid = false;
      }
      if (typeof element.size.height !== 'number') {
        result.errors.push(`Element ${index} size.height is not a number`);
        result.isValid = false;
      }
    }

    // Type-specific validation
    if (element.type === 'text') {
      if (!element.content && element.content !== '') {
        result.warnings.push(`Text element ${index} has no content`);
      }
    }

    if (element.type === 'image') {
      if (!element.content && !element.imageUrl && !element.src) {
        result.errors.push(`Image element ${index} has no content/imageUrl/src`);
        result.isValid = false;
      }
    }
  });
}

/**
 * Validate multiple service items and return summary
 * 
 * @param items - Array of service items to validate
 * @returns Summary of validation results
 */
export function validateServiceItems(items: ServiceItem[]): {
  totalItems: number;
  validItems: number;
  itemsWithVisualData: number;
  itemsWithErrors: number;
  itemsWithWarnings: number;
  results: ValidationResult[];
} {
  const results = items.map(validateServiceItem);

  return {
    totalItems: items.length,
    validItems: results.filter(r => r.isValid).length,
    itemsWithVisualData: results.filter(r => r.hasVisualData).length,
    itemsWithErrors: results.filter(r => r.errors.length > 0).length,
    itemsWithWarnings: results.filter(r => r.warnings.length > 0).length,
    results
  };
}

/**
 * Get a human-readable validation report
 * 
 * @param result - Validation result
 * @returns Formatted report string
 */
export function getValidationReport(result: ValidationResult): string {
  const lines: string[] = [];
  
  lines.push(`=== Validation Report for ${result.itemTitle} (${result.itemType}) ===`);
  lines.push(`Status: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
  lines.push(`Has Visual Data: ${result.hasVisualData ? 'Yes' : 'No'}`);
  
  if (result.errors.length > 0) {
    lines.push('\n❌ ERRORS:');
    result.errors.forEach(error => lines.push(`  - ${error}`));
  }
  
  if (result.warnings.length > 0) {
    lines.push('\n⚠️ WARNINGS:');
    result.warnings.forEach(warning => lines.push(`  - ${warning}`));
  }
  
  if (result.isValid && result.errors.length === 0 && result.warnings.length === 0) {
    lines.push('\n✨ No issues found!');
  }
  
  return lines.join('\n');
}

/**
 * Check if an item needs migration (has plain text instead of visual data)
 * 
 * @param item - Service item to check
 * @returns True if item needs migration to visual data format
 */
export function needsMigration(item: ServiceItem): boolean {
  if (item.type === 'song') return false; // Songs handled separately
  if (!item.content) return false; // Nothing to migrate
  if (item.content.trim().startsWith('{')) {
    // Has JSON, but verify it's valid visual data
    try {
      const data = JSON.parse(item.content);
      return !data.elements || !data.background;
    } catch {
      return true; // Invalid JSON needs migration
    }
  }
  return true; // Plain text needs migration
}
