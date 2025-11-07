// Utility functions for applying sermon slide designs to visualData

import type { Slide } from '../types';
import type { SermonSlideDesign } from '../config/sermonSlideDesigns';
import { getSermonDesignById, getDefaultSermonDesign } from '../config/sermonSlideDesigns';

export interface SermonDesignCustomization {
  backgroundColor?: string;
  titleFontFamily?: string;
  bodyFontFamily?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
  scriptureFontSize?: number;
}

/**
 * Detect slide type based on content
 */
export function detectSermonSlideType(slide: Slide): 'title' | 'scripture' | 'point' | 'generic' {
  const content = slide.content || '';
  
  // Title slide: Usually first slide, shorter content
  if (slide.order === 0 || content.split('\n').length <= 2) {
    return 'title';
  }
  
  // Scripture slide: Contains verse references or longer passages
  if (content.match(/\d+:\d+/) || content.length > 200) {
    return 'scripture';
  }
  
  // Point slide: Contains "POINT" keyword or numbered points
  if (content.toUpperCase().includes('POINT') || content.match(/^\d+\./m)) {
    return 'point';
  }
  
  return 'generic';
}

/**
 * Parse slide content to extract title, body, and scripture reference
 */
export function parseSermonSlideContent(slide: Slide) {
  const lines = (slide.content || '').split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return { title: '', body: '', scriptureRef: '' };
  }
  
  // Check for scripture reference (usually at the end)
  const lastLine = lines[lines.length - 1];
  let scriptureRef = '';
  let contentLines = lines;
  
  // If last line looks like a verse reference, extract it
  if (lastLine.match(/^[A-Z][a-z]+\s+\d+:\d+/) || lastLine.match(/^\([A-Z]/)) {
    scriptureRef = lastLine.trim();
    contentLines = lines.slice(0, -1);
  }
  
  // First line (or first few) is title, rest is body
  if (contentLines.length === 1) {
    return {
      title: contentLines[0],
      body: '',
      scriptureRef
    };
  } else if (contentLines.length === 2) {
    return {
      title: contentLines[0],
      body: contentLines[1],
      scriptureRef
    };
  } else {
    // Multiple lines: first 1-2 lines are title, rest is body
    const titleLines = contentLines.slice(0, 2).join('\n');
    const bodyLines = contentLines.slice(2).join('\n');
    return {
      title: titleLines,
      body: bodyLines,
      scriptureRef
    };
  }
}

/**
 * Apply design template to a single slide
 */
export function applyDesignToSlide(
  slide: Slide,
  designId: string,
  customizations?: SermonDesignCustomization
): Slide {
  const design = getSermonDesignById(designId) || getDefaultSermonDesign();
  const { title, body, scriptureRef } = parseSermonSlideContent(slide);
  
  // Determine background
  let backgroundStyle: any = {};
  if (customizations?.backgroundColor) {
    backgroundStyle = {
      type: 'solid',
      color: customizations.backgroundColor
    };
  } else if (design.background.type === 'gradient' && design.background.gradient) {
    backgroundStyle = {
      type: 'gradient',
      gradient: `linear-gradient(${design.background.gradient.angle || 135}deg, ${design.background.gradient.from}, ${design.background.gradient.to})`
    };
  } else {
    backgroundStyle = {
      type: 'solid',
      color: design.background.color || '#667eea'
    };
  }
  
  // Build elements array
  const elements: any[] = [];
  let yOffset = 350; // Starting Y position
  
  // Title element
  if (title) {
    elements.push({
      id: `title_${Date.now()}`,
      type: 'text',
      content: title,
      visible: true,
      opacity: 1,
      zIndex: 10,
      rotation: 0,
      position: { x: 160, y: yOffset },
      size: { width: 1600, height: 200 },
      style: {
        fontSize: customizations?.titleFontSize || design.titleStyle.fontSize,
        fontFamily: customizations?.titleFontFamily || design.titleStyle.fontFamily,
        fontWeight: design.titleStyle.fontWeight,
        color: design.titleStyle.color,
        textAlign: design.titleStyle.textAlign,
        textShadow: design.titleStyle.textShadow,
        letterSpacing: design.titleStyle.letterSpacing
      }
    });
    yOffset += 220;
  }
  
  // Body element
  if (body) {
    elements.push({
      id: `body_${Date.now()}_1`,
      type: 'text',
      content: body,
      visible: true,
      opacity: 1,
      zIndex: 10,
      rotation: 0,
      position: { x: 160, y: yOffset },
      size: { width: 1600, height: 300 },
      style: {
        fontSize: customizations?.bodyFontSize || design.bodyStyle.fontSize,
        fontFamily: customizations?.bodyFontFamily || design.bodyStyle.fontFamily,
        fontWeight: design.bodyStyle.fontWeight,
        color: design.bodyStyle.color,
        textAlign: design.bodyStyle.textAlign,
        textShadow: design.bodyStyle.textShadow,
        lineHeight: design.bodyStyle.lineHeight
      }
    });
    yOffset += 320;
  }
  
  // Scripture reference element
  if (scriptureRef) {
    elements.push({
      id: `scripture_ref_${Date.now()}`,
      type: 'text',
      content: scriptureRef,
      visible: true,
      opacity: 1,
      zIndex: 10,
      rotation: 0,
      position: { x: 160, y: yOffset },
      size: { width: 1600, height: 80 },
      style: {
        fontSize: customizations?.scriptureFontSize || design.scriptureRefStyle.fontSize,
        fontFamily: design.scriptureRefStyle.fontFamily,
        fontWeight: design.scriptureRefStyle.fontWeight,
        color: design.scriptureRefStyle.color,
        fontStyle: design.scriptureRefStyle.fontStyle,
        textAlign: 'center',
        textShadow: design.scriptureRefStyle.textShadow
      }
    });
  }
  
  // Return updated slide with visualData
  return {
    ...slide,
    visualData: {
      background: backgroundStyle,
      elements
    }
  };
}

/**
 * Apply design to all slides in array
 */
export function applyDesignToAllSlides(
  slides: Slide[],
  designId: string,
  customizations?: SermonDesignCustomization
): Slide[] {
  return slides.map(slide => applyDesignToSlide(slide, designId, customizations));
}

/**
 * Extract current design from a slide
 */
export function extractDesignFromSlide(slide: Slide): {
  backgroundColor?: string;
  titleFontSize?: number;
  bodyFontSize?: number;
  scriptureFontSize?: number;
  titleFontFamily?: string;
  bodyFontFamily?: string;
} {
  if (!slide.visualData?.elements) {
    return {};
  }
  
  const titleElement = slide.visualData.elements.find((el: any) => el.id?.includes('title'));
  const bodyElement = slide.visualData.elements.find((el: any) => el.id?.includes('body'));
  const scriptureElement = slide.visualData.elements.find((el: any) => el.id?.includes('scripture'));
  
  return {
    backgroundColor: slide.visualData.background?.color,
    titleFontSize: titleElement?.style?.fontSize,
    bodyFontSize: bodyElement?.style?.fontSize,
    scriptureFontSize: scriptureElement?.style?.fontSize,
    titleFontFamily: titleElement?.style?.fontFamily,
    bodyFontFamily: bodyElement?.style?.fontFamily
  };
}
