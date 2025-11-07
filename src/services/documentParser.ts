/**
 * Document Parser Service
 * Parses TXT, DOCX, and PDF files into plain text for AI analysis
 */

import mammoth from 'mammoth';
// @ts-ignore - pdf-parse doesn't have proper TypeScript types
import * as pdfParse from 'pdf-parse';

export interface ParsedDocument {
  text: string;
  wordCount: number;
  characterCount: number;
  success: boolean;
  error?: string;
  fileType: 'txt' | 'docx' | 'pdf';
}

/**
 * Parse a document file into plain text
 */
export async function parseDocument(
  filePath: string,
  fileType: 'txt' | 'docx' | 'pdf'
): Promise<ParsedDocument> {
  console.log(`📄 Parsing ${fileType.toUpperCase()} file:`, filePath);

  try {
    let text: string;

    switch (fileType) {
      case 'txt':
        text = await parseTXT(filePath);
        break;
      case 'docx':
        text = await parseDOCX(filePath);
        break;
      case 'pdf':
        text = await parsePDF(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
    
    // Revoke the temporary URL
    URL.revokeObjectURL(filePath);

    // Clean up the text
    text = cleanText(text);

    const wordCount = countWords(text);
    const characterCount = text.length;

    console.log(`✅ Parsed successfully: ${wordCount} words, ${characterCount} characters`);

    return {
      text,
      wordCount,
      characterCount,
      success: true,
      fileType
    };

  } catch (error) {
    console.error(`❌ Error parsing ${fileType} file:`, error);
    return {
      text: '',
      wordCount: 0,
      characterCount: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown parsing error',
      fileType
    };
  }
}

/**
 * Parse TXT file
 */
async function parseTXT(filePath: string): Promise<string> {
  // Use Electron's fs module via IPC
  if ((window as any).electron?.readFile) {
    const buffer = await (window as any).electron.readFile(filePath);
    return buffer.toString('utf-8');
  }
  
  // Fallback for web
  const response = await fetch(filePath);
  return await response.text();
}

/**
 * Parse DOCX file
 */
async function parseDOCX(filePath: string): Promise<string> {
  // Use Electron's fs module via IPC
  if ((window as any).electron?.readFile) {
    const buffer = await (window as any).electron.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    
    if (result.messages.length > 0) {
      console.warn('⚠️ DOCX parsing warnings:', result.messages);
    }
    
    return result.value;
  }
  
  // Fallback for web
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

/**
 * Parse PDF file
 */
async function parsePDF(filePath: string): Promise<string> {
  // Get the actual file data from the blob URL
  const response = await fetch(filePath);
  const arrayBuffer = await response.arrayBuffer();
  
  // Convert ArrayBuffer to Uint8Array (works in browser)
  const uint8Array = new Uint8Array(arrayBuffer);
  
  // @ts-ignore - pdf-parse type issues
  const pdf = pdfParse.default || pdfParse;
  const data = await pdf(uint8Array);
  return data.text;
}

/**
 * Clean and normalize text
 */
function cleanText(text: string): string {
  return text
    // Remove excessive whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    // Trim lines
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Trim overall
    .trim();
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

/**
 * Detect file type from extension
 */
export function detectFileType(fileName: string): 'txt' | 'docx' | 'pdf' | null {
  const extension = fileName.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'txt':
      return 'txt';
    case 'doc':
    case 'docx':
      return 'docx';
    case 'pdf':
      return 'pdf';
    default:
      return null;
  }
}

/**
 * Validate file size (max 5MB)
 */
export function validateFileSize(fileSizeBytes: number): boolean {
  const maxSizeBytes = 5 * 1024 * 1024; // 5MB
  return fileSizeBytes <= maxSizeBytes;
}
