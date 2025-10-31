/**
 * Calculate optimal font size for slide text based on content
 * Ensures text fits within bounds and remains readable
 */

interface FontSizeConfig {
  minSize: number;  // Minimum font size (readability floor)
  maxSize: number;  // Maximum font size (aesthetic ceiling)
  targetWidth: number;  // Canvas text area width
  targetHeight: number; // Canvas text area height
}

const DEFAULT_CONFIG: FontSizeConfig = {
  minSize: 44,
  maxSize: 88,
  targetWidth: 1600,
  targetHeight: 400,
};

export function calculateOptimalFontSize(
  text: string,
  config: Partial<FontSizeConfig> = {}
): number {
  const { minSize, maxSize, targetWidth, targetHeight } = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  // Split into lines
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const lineCount = lines.length;
  
  // Find longest line
  const longestLine = Math.max(...lines.map(line => line.length));
  
  // Calculate line height multiplier (1.2 is typical for lyrics)
  const lineHeightMultiplier = 1.2;
  
  // STRATEGY 1: Adjust based on line count
  let fontSizeByLines: number;
  if (lineCount <= 3) {
    fontSizeByLines = maxSize; // Big and bold for short content
  } else if (lineCount <= 5) {
    fontSizeByLines = 72; // Standard size
  } else if (lineCount <= 7) {
    fontSizeByLines = 60; // Smaller for more lines
  } else if (lineCount <= 9) {
    fontSizeByLines = 52; // Even smaller
  } else {
    fontSizeByLines = minSize; // Minimum for very dense lyrics
  }
  
  // STRATEGY 2: Adjust based on character density
  let fontSizeByDensity: number;
  if (longestLine < 25) {
    fontSizeByDensity = maxSize; // Short lines = big text
  } else if (longestLine < 35) {
    fontSizeByDensity = 72;
  } else if (longestLine < 45) {
    fontSizeByDensity = 64;
  } else if (longestLine < 60) {
    fontSizeByDensity = 56;
  } else {
    fontSizeByDensity = minSize; // Very long lines = small text
  }
  
  // STRATEGY 3: Calculate height-based size
  // Formula: targetHeight / (lineCount * lineHeightMultiplier)
  const fontSizeByHeight = Math.floor(
    targetHeight / (lineCount * lineHeightMultiplier * 1.1)
  );
  
  // STRATEGY 4: Calculate width-based size (approximate)
  // Average character width is ~0.6x font size
  const avgCharWidth = 0.6;
  const fontSizeByWidth = Math.floor(
    (targetWidth / longestLine) / avgCharWidth
  );
  
  // FINAL: Take the minimum of all strategies (most conservative)
  const calculatedSize = Math.min(
    fontSizeByLines,
    fontSizeByDensity,
    fontSizeByHeight,
    fontSizeByWidth
  );
  
  // Clamp to min/max bounds
  const finalSize = Math.max(minSize, Math.min(maxSize, calculatedSize));
  
  console.log(`📏 Font Size Calculation:
    Lines: ${lineCount}, Longest: ${longestLine} chars
    By Lines: ${fontSizeByLines}px
    By Density: ${fontSizeByDensity}px
    By Height: ${fontSizeByHeight}px
    By Width: ${fontSizeByWidth}px
    → Final: ${finalSize}px
  `);
  
  return finalSize;
}

// Specialized function for song lyrics (accounts for worship song patterns)
export function calculateSongLyricsFontSize(text: string): number {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const lineCount = lines.length;
  
  // Worship songs often have:
  // - Short choruses (2-4 lines): Use large text (76-88px)
  // - Verses (4-8 lines): Use medium text (58-70px)
  // - Dense verses (8+ lines): Use smaller text (44-56px)
  
  if (lineCount <= 4) {
    // Likely chorus - make it BIG and impactful
    return calculateOptimalFontSize(text, {
      minSize: 64,
      maxSize: 88,
    });
  } else if (lineCount <= 8) {
    // Standard verse - balanced size
    return calculateOptimalFontSize(text, {
      minSize: 52,
      maxSize: 72,
    });
  } else {
    // Dense lyrics - prioritize fitting content
    return calculateOptimalFontSize(text, {
      minSize: 44,
      maxSize: 60,
    });
  }
}
