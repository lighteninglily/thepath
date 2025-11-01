// AI-powered template matching for sermon slides
// Analyzes slide content and suggests appropriate templates

import { SermonTemplate, SERMON_TEMPLATES, SermonTemplateCategory } from '../config/sermonTemplates';

// Scripture reference patterns
const SCRIPTURE_PATTERNS = [
  /\b\d?\s*[A-Z][a-z]+\s+\d+:\d+(-\d+)?\b/g, // John 3:16 or 1 John 3:16
  /\b[A-Z][a-z]+\s+\d+:\d+(-\d+)?\b/g, // Genesis 1:1
  /\b\d\s[A-Z][a-z]+\s+\d+:\d+/g, // 1 Corinthians 13:4
];

// Question patterns
const QUESTION_PATTERNS = [
  /\?$/,
  /^(what|who|when|where|why|how)/i,
];

// Point patterns
const POINT_PATTERNS = [
  /^\d+\./m, // 1. 2. 3.
  /^[A-Z]\./m, // A. B. C.
  /^•/m, // Bullet points
  /^-/m, // Dash points
];

export interface ContentAnalysis {
  category: SermonTemplateCategory;
  confidence: number;
  suggestedTemplates: SermonTemplate[];
  extractedData: {
    title?: string;
    scriptureReference?: string;
    scriptureText?: string;
    pointNumber?: string;
    pointTitle?: string;
    pointBody?: string;
    question?: string;
    quote?: string;
    author?: string;
  };
}

/**
 * Analyze slide content and determine the best template category
 */
export function analyzeSlideContent(content: string, slideIndex: number = 0): ContentAnalysis {
  const trimmedContent = content.trim();
  const lines = trimmedContent.split('\n').filter(l => l.trim());

  // First slide is usually a title
  if (slideIndex === 0 && lines.length <= 3) {
    return {
      category: 'title',
      confidence: 0.9,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'title'),
      extractedData: {
        title: lines[0] || '',
      },
    };
  }

  // Check for scripture
  const scriptureMatch = detectScripture(trimmedContent);
  if (scriptureMatch.isScripture) {
    return {
      category: 'scripture',
      confidence: scriptureMatch.confidence,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'scripture'),
      extractedData: {
        scriptureReference: scriptureMatch.reference,
        scriptureText: scriptureMatch.text,
      },
    };
  }

  // Check for question
  if (detectQuestion(trimmedContent)) {
    return {
      category: 'question',
      confidence: 0.85,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'question'),
      extractedData: {
        question: trimmedContent,
      },
    };
  }

  // Check for numbered/bulleted points
  const pointMatch = detectPoint(trimmedContent);
  if (pointMatch.isPoint) {
    // Check if multiple points in one slide
    const pointCount = (trimmedContent.match(/^\d+\./gm) || []).length;
    if (pointCount > 1) {
      return {
        category: 'multi-point',
        confidence: 0.8,
        suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'multi-point'),
        extractedData: extractMultiPoints(trimmedContent),
      };
    }

    return {
      category: 'point',
      confidence: pointMatch.confidence,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'point'),
      extractedData: {
        pointNumber: pointMatch.number,
        pointTitle: pointMatch.title,
        pointBody: pointMatch.body,
      },
    };
  }

  // Check for quote (has quotation marks)
  if (trimmedContent.includes('"') || trimmedContent.includes('"') || trimmedContent.includes('"')) {
    return {
      category: 'quote',
      confidence: 0.75,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'quote'),
      extractedData: extractQuote(trimmedContent),
    };
  }

  // Check for transition keywords
  if (detectTransition(trimmedContent)) {
    return {
      category: 'transition',
      confidence: 0.7,
      suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'transition'),
      extractedData: {
        title: trimmedContent,
      },
    };
  }

  // Default to point slide for general content
  return {
    category: 'point',
    confidence: 0.5,
    suggestedTemplates: SERMON_TEMPLATES.filter(t => t.category === 'point'),
    extractedData: {
      pointTitle: lines[0] || '',
      pointBody: lines.slice(1).join('\n'),
    },
  };
}

/**
 * Detect if content contains scripture
 */
function detectScripture(content: string): { 
  isScripture: boolean; 
  confidence: number; 
  reference?: string; 
  text?: string;
} {
  for (const pattern of SCRIPTURE_PATTERNS) {
    const matches = content.match(pattern);
    if (matches && matches.length > 0) {
      const reference = matches[0];
      const textWithoutRef = content.replace(reference, '').trim();
      
      return {
        isScripture: true,
        confidence: 0.95,
        reference: reference,
        text: textWithoutRef || content,
      };
    }
  }

  // Check for common bible keywords
  const bibleKeywords = ['lord', 'god', 'jesus', 'christ', 'faith', 'blessed', 'spirit'];
  const hasKeywords = bibleKeywords.some(kw => content.toLowerCase().includes(kw));
  
  if (hasKeywords && content.length > 50 && content.length < 500) {
    return {
      isScripture: true,
      confidence: 0.6,
      text: content,
    };
  }

  return { isScripture: false, confidence: 0 };
}

/**
 * Detect if content is a question
 */
function detectQuestion(content: string): boolean {
  return QUESTION_PATTERNS.some(pattern => pattern.test(content));
}

/**
 * Detect if content is a numbered/bulleted point
 */
function detectPoint(content: string): { 
  isPoint: boolean; 
  confidence: number; 
  number?: string;
  title?: string;
  body?: string;
} {
  for (const pattern of POINT_PATTERNS) {
    if (pattern.test(content)) {
      const lines = content.split('\n');
      const firstLine = lines[0] || '';
      
      // Extract number/bullet
      const numberMatch = firstLine.match(/^(\d+|[A-Z]|•|-)\.?\s*/);
      const number = numberMatch ? numberMatch[1] : '';
      
      // Extract title (rest of first line)
      const title = firstLine.replace(/^(\d+|[A-Z]|•|-)\.?\s*/, '').trim();
      
      // Extract body (remaining lines)
      const body = lines.slice(1).join('\n').trim();
      
      return {
        isPoint: true,
        confidence: 0.9,
        number,
        title,
        body,
      };
    }
  }

  return { isPoint: false, confidence: 0 };
}

/**
 * Detect transition slide
 */
function detectTransition(content: string): boolean {
  const transitionKeywords = [
    'final thoughts',
    'conclusion',
    'in closing',
    'let\'s reflect',
    'self-reflection',
    'application',
    'moving forward',
    'next steps',
  ];

  const lowerContent = content.toLowerCase();
  return transitionKeywords.some(kw => lowerContent.includes(kw)) && content.length < 100;
}

/**
 * Extract multi-point data
 */
function extractMultiPoints(content: string): any {
  const lines = content.split('\n');
  const points = [];
  
  let currentPoint: any = null;
  
  for (const line of lines) {
    if (/^\d+\./.test(line)) {
      if (currentPoint) {
        points.push(currentPoint);
      }
      const title = line.replace(/^\d+\.\s*/, '').trim();
      currentPoint = { title, body: '' };
    } else if (currentPoint && line.trim()) {
      currentPoint.body += (currentPoint.body ? '\n' : '') + line;
    }
  }
  
  if (currentPoint) {
    points.push(currentPoint);
  }

  return {
    title: points.length > 0 ? 'Key Points' : '',
    point1_title: points[0]?.title || '',
    point1_body: points[0]?.body || '',
    point2_title: points[1]?.title || '',
    point2_body: points[1]?.body || '',
  };
}

/**
 * Extract quote and author
 */
function extractQuote(content: string): any {
  // Remove quotes
  let quote = content.replace(/["'"'"]/g, '').trim();
  
  // Try to extract author (usually after a dash or "by")
  const authorMatch = quote.match(/[—–-]\s*(.+)$/m) || quote.match(/\bby\s+(.+)$/im);
  
  if (authorMatch) {
    const author = authorMatch[1].trim();
    quote = quote.replace(authorMatch[0], '').trim();
    return { quote_text: quote, author };
  }

  return { quote_text: quote };
}

/**
 * Apply template to slide content
 * Can accept either ContentAnalysis or AI result with placeholders
 */
export function applyTemplateToContent(
  template: SermonTemplate,
  content: string,
  analysisOrAIResult?: ContentAnalysis | { placeholders?: Record<string, any>; emphasis?: string[] }
): any {
  // Handle both ContentAnalysis and AI result formats
  let extractedData: Record<string, any> = {};
  let emphasisWords: string[] = [];
  
  if (analysisOrAIResult) {
    if ('extractedData' in analysisOrAIResult) {
      // ContentAnalysis format
      extractedData = analysisOrAIResult.extractedData || {};
    } else if ('placeholders' in analysisOrAIResult) {
      // AI result format
      extractedData = analysisOrAIResult.placeholders || {};
      emphasisWords = analysisOrAIResult.emphasis || [];
    }
  }
  
  console.log('🎨 Applying template to content:', {
    templateName: template.name,
    templateCategory: template.category,
    content: content.substring(0, 100),
    extractedData,
    emphasisWords
  });
  
  // Clone template visualData
  const visualData = JSON.parse(JSON.stringify(template.visualData));
  
  // Replace placeholders in template elements
  visualData.elements = visualData.elements.map((element: any) => {
    let newContent = element.content;
    
    console.log(`🔄 Processing element ${element.id} (${element.role}):`, {
      original: element.content,
      role: element.role
    });
    
    // Replace placeholders with actual content
    newContent = newContent
      .replace(/\{\{TITLE\}\}/g, extractedData.title || content.split('\n')[0] || '')
      .replace(/\{\{SUBTITLE\}\}/g, extractedData.subtitle || content.split('\n')[1] || '')
      .replace(/\{\{SCRIPTURE_REFERENCE\}\}/g, extractedData.scriptureReference || extractedData.reference || '')
      .replace(/\{\{SCRIPTURE_TEXT\}\}/g, extractedData.scriptureText || extractedData.text || content)
      .replace(/\{\{POINT_NUMBER\}\}/g, extractedData.pointNumber || '1')
      .replace(/\{\{POINT_TITLE\}\}/g, extractedData.pointTitle || content.split('\n')[0] || '')
      .replace(/\{\{POINT_BODY\}\}/g, extractedData.pointBody || content.split('\n').slice(1).join('\n'))
      .replace(/\{\{QUESTION\}\}/g, extractedData.question || content)
      .replace(/\{\{QUOTE_TEXT\}\}/g, extractedData.quoteText || extractedData.quote || content)
      .replace(/\{\{AUTHOR\}\}/g, extractedData.author || '')
      .replace(/\{\{SECTION_TITLE\}\}/g, extractedData.title || content)
      .replace(/\{\{POINT1_TITLE\}\}/g, extractedData.point1_title || '')
      .replace(/\{\{POINT1_BODY\}\}/g, extractedData.point1_body || '')
      .replace(/\{\{POINT2_TITLE\}\}/g, extractedData.point2_title || '')
      .replace(/\{\{POINT2_BODY\}\}/g, extractedData.point2_body || '');
    
    // Apply emphasis styling if AI provided emphasis words
    if (emphasisWords.length > 0 && newContent && element.type === 'text') {
      emphasisWords.forEach(word => {
        // Make emphasis words bold (using Unicode bold characters or just uppercase)
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        newContent = newContent.replace(regex, word.toUpperCase());
      });
    }
    
    console.log(`✅ Final content for ${element.id}:`, newContent.substring(0, 100));
    
    return { ...element, content: newContent };
  });
  
  console.log('✨ Template applied! Elements:', visualData.elements.map((el: any) => ({
    id: el.id,
    role: el.role,
    content: el.content.substring(0, 50)
  })));
  
  return visualData;
}

/**
 * Get the best matching template for content
 */
export function getBestTemplate(content: string, slideIndex: number = 0): SermonTemplate | null {
  const analysis = analyzeSlideContent(content, slideIndex);
  
  if (analysis.suggestedTemplates.length === 0) {
    return null;
  }
  
  // Return the first suggested template (highest confidence)
  return analysis.suggestedTemplates[0];
}
