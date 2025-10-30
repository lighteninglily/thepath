/**
 * Lyrics API Service - Genius API Integration
 * 
 * NOTE: This service fetches lyrics from external sources.
 * Ensure you have proper licensing (CCLI, LicenSing, etc.) before using.
 * Display CCLI numbers on slides as required by your license.
 * 
 * API Documentation: https://docs.genius.com/
 * Get your API key from: https://genius.com/api-clients
 */

export interface LyricsSearchResult {
  title: string;
  artist: string;
  lyrics: string;
  source: string;
  album?: string;
  year?: string;
  id?: string;
}

export interface LyricsError {
  error: string;
  message: string;
}

/**
 * Search for song lyrics using Genius API
 * Uses Electron backend for API calls
 */
export async function searchLyrics(
  trackName: string,
  artistName?: string
): Promise<LyricsSearchResult> {
  try {
    console.log('🎵 Searching lyrics via Genius API...');
    
    // Check if we're in Electron
    if (window.electron?.lyrics) {
      // Use Electron API
      const data = await window.electron.lyrics.search(trackName, artistName);
      
      console.log('✅ Lyrics found:', {
        title: data.title,
        artist: data.artist,
        lyricsLength: data.lyrics.length,
      });
      
      return data;
    } else {
      // Browser dev mode - show helpful error
      throw new Error(
        'Lyrics search requires Electron. Please run: npm run dev:electron'
      );
    }
  } catch (error) {
    console.error('❌ Lyrics search error:', error);
    throw error;
  }
}

/**
 * Validate lyrics result
 */
export function validateLyricsResult(result: LyricsSearchResult): boolean {
  return !!(
    result.title &&
    result.lyrics &&
    result.lyrics.length > 0
  );
}

/**
 * Clean lyrics text (remove extra whitespace, normalize line breaks)
 */
export function cleanLyrics(lyrics: string): string {
  return lyrics
    .trim()
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive line breaks
    .replace(/[ \t]+/g, ' '); // Normalize spaces
}
