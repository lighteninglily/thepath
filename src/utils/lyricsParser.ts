import { v4 as uuidv4 } from 'uuid';
import type { Slide } from '../types';

/**
 * Parse lyrics text into structured slides
 * Splits by double newline (blank lines between sections)
 */
export function parseLyricsIntoSlides(lyrics: string): Slide[] {
  if (!lyrics || lyrics.trim().length === 0) {
    return [];
  }

  // Split by double newlines (blank lines) first
  let sections = lyrics
    .split(/\n\s*\n/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log('📝 Initial sections from blank lines:', sections.length);

  // Smart processing: enforce max lines per slide and handle overflow
  const MAX_LINES_PER_SLIDE = 6;
  const processedSections: string[] = [];

  sections.forEach(section => {
    const lines = section.split('\n').filter(l => l.trim().length > 0);
    
    // If section has too many lines, split it
    if (lines.length > MAX_LINES_PER_SLIDE) {
      console.log(`⚠️ Section has ${lines.length} lines (max ${MAX_LINES_PER_SLIDE}), splitting...`);
      
      // Split into chunks of MAX_LINES_PER_SLIDE
      for (let i = 0; i < lines.length; i += MAX_LINES_PER_SLIDE) {
        const chunk = lines.slice(i, i + MAX_LINES_PER_SLIDE);
        processedSections.push(chunk.join('\n'));
      }
    } else {
      processedSections.push(section);
    }
  });

  console.log('✅ After processing:', processedSections.length, 'sections');

  // Create slides
  const slides: Slide[] = [];
  
  processedSections.forEach((section, index) => {
    const lowerSection = section.toLowerCase();
    let type: Slide['type'] = 'custom';
    
    // Detect section type
    if (index === 0 || lowerSection.includes('verse')) {
      type = 'verse';
    } else if (
      lowerSection.includes('chorus') || 
      lowerSection.includes('refrain') ||
      lowerSection.includes('yeah') ||
      lowerSection.includes('oh,') ||
      lowerSection.match(/(.+)\n\1/) // Repeated line = chorus
    ) {
      type = 'chorus';
    } else if (lowerSection.includes('bridge')) {
      type = 'bridge';
    }

    const lineCount = section.split('\n').length;
    
    slides.push({
      id: uuidv4(),
      type,
      content: section,
      order: index,
    });

    console.log(`  Slide ${index + 1}: ${type}, ${lineCount} lines`);
  });

  console.log(`🎵 Created ${slides.length} slides total`);

  return slides;
}

/**
 * Format slide content for display (limit lines if needed)
 */
export function formatSlideContent(content: string, maxLines = 8): string {
  const lines = content.split('\n');
  if (lines.length <= maxLines) {
    return content;
  }
  
  return lines.slice(0, maxLines).join('\n') + '\n...';
}
