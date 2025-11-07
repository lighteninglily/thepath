/**
 * Sermon Slide Builders
 * Generate slides for scriptures and sermon points
 */

import type { SermonPoint } from '../services/claudeService';
import type { Slide } from '../types';

export interface ScriptureSlideOptions {
  reference: string;
  text: string;
  version: string;
  template?: 'modern' | 'classic' | 'elegant';
}

export interface PointSlideOptions {
  point: SermonPoint;
  template?: 'bold' | 'clean' | 'minimal';
}

/**
 * Create slides for a scripture passage
 * Automatically splits long passages across multiple slides
 */
export async function createScriptureSlides(
  options: ScriptureSlideOptions
): Promise<Slide[]> {
  const { reference, text, version } = options;
  const slides: Slide[] = [];

  console.log(`📖 Creating scripture slides for ${reference}`);

  // Determine if text needs splitting
  const wordCount = text.split(/\s+/).length;
  const shouldSplit = wordCount > 80;

  if (shouldSplit) {
    // Split into multiple slides
    const parts = splitTextIntoSlides(text, 80);
    console.log(`  Split into ${parts.length} slides`);

    parts.forEach((part, index) => {
      slides.push(createScriptureSlide({
        reference: `${reference} (${index + 1}/${parts.length})`,
        text: part,
        version,
        order: index
      }));
    });
  } else {
    // Single slide
    slides.push(createScriptureSlide({
      reference,
      text,
      version,
      order: 0
    }));
  }

  return slides;
}

/**
 * Create a single scripture slide with visualData
 */
function createScriptureSlide(params: {
  reference: string;
  text: string;
  version: string;
  order: number;
}): Slide {
  const { reference, text, version, order } = params;

  return {
    id: `scripture_${Date.now()}_${order}`,
    content: text,
    type: 'custom',
    order,
    visualData: {
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)'
      },
      elements: [
        // Reference header
        {
          id: `ref_${Date.now()}`,
          type: 'text',
          content: reference,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 200 },
          size: { width: 1600, height: 60 },
          style: {
            fontSize: 32,
            fontFamily: 'Inter',
            fontWeight: 600,
            color: '#ffffff',
            textAlign: 'center',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)'
          }
        },
        // Scripture text
        {
          id: `text_${Date.now()}`,
          type: 'text',
          content: `"${text}"`,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 200, y: 300 },
          size: { width: 1520, height: 400 },
          style: {
            fontSize: 42,
            fontFamily: 'Georgia',
            fontWeight: 400,
            fontStyle: 'italic',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.5,
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
          }
        },
        // Version label
        {
          id: `version_${Date.now()}`,
          type: 'text',
          content: version,
          visible: true,
          opacity: 0.8,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 760 },
          size: { width: 1600, height: 40 },
          style: {
            fontSize: 24,
            fontFamily: 'Inter',
            fontWeight: 400,
            color: '#ffffff',
            textAlign: 'center',
            textShadow: '1px 1px 4px rgba(0, 0, 0, 0.5)'
          }
        }
      ]
    }
  };
}

/**
 * Create slides for a sermon point
 */
export function createPointSlide(options: PointSlideOptions): Slide {
  const { point } = options;

  return {
    id: `point_${Date.now()}_${point.number}`,
    content: point.title,
    type: 'custom',
    order: 0,
    visualData: {
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      elements: [
        // Point number label
        {
          id: `label_${Date.now()}`,
          type: 'text',
          content: `POINT ${point.number}`,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 250 },
          size: { width: 1600, height: 50 },
          style: {
            fontSize: 28,
            fontFamily: 'Inter',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            letterSpacing: '3px',
            textTransform: 'uppercase',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)'
          }
        },
        // Point title
        {
          id: `title_${Date.now()}`,
          type: 'text',
          content: point.title.toUpperCase(),
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 340 },
          size: { width: 1600, height: 280 },
          style: {
            fontSize: 92,
            fontFamily: 'Inter',
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '4px 4px 16px rgba(0, 0, 0, 0.9)'
          }
        },
        // Associated scripture (if any)
        ...(point.scripture ? [{
          id: `scripture_${Date.now()}`,
          type: 'text' as const,
          content: point.scripture,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 680 },
          size: { width: 1600, height: 60 },
          style: {
            fontSize: 32,
            fontFamily: 'Georgia',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.7)'
          }
        }] : [])
      ]
    }
  };
}

/**
 * Create a sermon title slide
 */
export function createSermonTitleSlide(title: string, scripture?: string): Slide {
  return {
    id: `sermon_title_${Date.now()}`,
    content: title,
    type: 'custom',
    order: 0,
    visualData: {
      background: {
        type: 'gradient',
        gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
      },
      elements: [
        // Label
        {
          id: `label_${Date.now()}`,
          type: 'text',
          content: 'SERMON',
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 280 },
          size: { width: 1600, height: 40 },
          style: {
            fontSize: 24,
            fontFamily: 'Inter',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            textShadow: '2px 2px 8px rgba(0, 0, 0, 0.5)'
          }
        },
        // Title
        {
          id: `title_${Date.now()}`,
          type: 'text',
          content: title,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 360 },
          size: { width: 1600, height: 240 },
          style: {
            fontSize: 88,
            fontFamily: 'Inter',
            fontWeight: 900,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.1,
            textShadow: '4px 4px 20px rgba(0, 0, 0, 0.95)'
          }
        },
        // Scripture reference (if provided)
        ...(scripture ? [{
          id: `scripture_ref_${Date.now()}`,
          type: 'text' as const,
          content: scripture,
          visible: true,
          opacity: 1,
          zIndex: 10,
          rotation: 0,
          position: { x: 160, y: 640 },
          size: { width: 1600, height: 80 },
          style: {
            fontSize: 36,
            fontFamily: 'Georgia',
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            textShadow: '2px 2px 12px rgba(0, 0, 0, 0.8)'
          }
        }] : [])
      ]
    }
  };
}

/**
 * Split text into multiple slides based on word count
 */
function splitTextIntoSlides(text: string, maxWordsPerSlide: number = 80): string[] {
  const words = text.split(/\s+/);
  const parts: string[] = [];
  
  let currentPart: string[] = [];
  let currentWordCount = 0;

  for (const word of words) {
    currentPart.push(word);
    currentWordCount++;

    // Check if we should start a new slide
    if (currentWordCount >= maxWordsPerSlide) {
      // Try to break at a sentence boundary
      const partText = currentPart.join(' ');
      const lastPeriod = partText.lastIndexOf('.');
      const lastQuestion = partText.lastIndexOf('?');
      const lastExclamation = partText.lastIndexOf('!');
      const lastSentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

      if (lastSentenceEnd > partText.length * 0.6) {
        // Good break point found
        parts.push(partText.substring(0, lastSentenceEnd + 1).trim());
        currentPart = partText.substring(lastSentenceEnd + 1).trim().split(/\s+/).filter(w => w);
        currentWordCount = currentPart.length;
      } else {
        // No good break point, just split here
        parts.push(partText.trim());
        currentPart = [];
        currentWordCount = 0;
      }
    }
  }

  // Add remaining words
  if (currentPart.length > 0) {
    parts.push(currentPart.join(' ').trim());
  }

  return parts.filter(part => part.length > 0);
}
