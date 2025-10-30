import { getDatabase } from './db';
import { v4 as uuidv4 } from 'uuid';
import type { Song, CreateSongInput, UpdateSongInput } from '../types';

export class SongService {
  /**
   * Get all songs from the database
   */
  static getAllSongs(): Song[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM songs 
      ORDER BY created_at DESC
    `);
    
    const rows = stmt.all() as Array<{
      id: string;
      title: string;
      artist: string | null;
      lyrics: string;
      slides_data: string | null;
      design_theme: string | null;
      ccli_number: string | null;
      key: string | null;
      tempo: number | null;
      tags: string | null;
      created_at: string;
      updated_at: string;
    }>;

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      lyrics: row.lyrics,
      slidesData: row.slides_data ? JSON.parse(row.slides_data) : null,
      designTheme: row.design_theme ? JSON.parse(row.design_theme) : null,
      ccliNumber: row.ccli_number,
      key: row.key,
      tempo: row.tempo,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  /**
   * Get a single song by ID
   */
  static getSongById(id: string): Song | null {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM songs WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      id: row.id,
      title: row.title,
      artist: row.artist,
      lyrics: row.lyrics,
      slidesData: row.slides_data ? JSON.parse(row.slides_data) : null,
      designTheme: row.design_theme ? JSON.parse(row.design_theme) : null,
      ccliNumber: row.ccli_number,
      key: row.key,
      tempo: row.tempo,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /**
   * Create a new song
   */
  static createSong(input: CreateSongInput): Song {
    const db = getDatabase();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO songs (
        id, title, artist, lyrics, slides_data, design_theme,
        ccli_number, key, tempo, tags, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      input.title,
      input.artist,
      input.lyrics,
      input.slidesData ? JSON.stringify(input.slidesData) : null,
      input.designTheme ? JSON.stringify(input.designTheme) : null,
      input.ccliNumber,
      input.key,
      input.tempo,
      JSON.stringify(input.tags || []),
      now,
      now
    );

    return {
      id,
      ...input,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };
  }

  /**
   * Update an existing song
   */
  static updateSong(id: string, input: UpdateSongInput): Song | null {
    const db = getDatabase();
    const existing = this.getSongById(id);
    
    if (!existing) return null;

    const now = new Date().toISOString();
    const updated = { ...existing, ...input, updatedAt: now };

    const stmt = db.prepare(`
      UPDATE songs SET
        title = ?, artist = ?, lyrics = ?, slides_data = ?,
        design_theme = ?, ccli_number = ?, key = ?, tempo = ?,
        tags = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      updated.title,
      updated.artist,
      updated.lyrics,
      updated.slidesData ? JSON.stringify(updated.slidesData) : null,
      updated.designTheme ? JSON.stringify(updated.designTheme) : null,
      updated.ccliNumber,
      updated.key,
      updated.tempo,
      JSON.stringify(updated.tags),
      now,
      id
    );

    return updated;
  }

  /**
   * Delete a song
   */
  static deleteSong(id: string): boolean {
    const db = getDatabase();
    const stmt = db.prepare('DELETE FROM songs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  /**
   * Search songs by title or artist
   */
  static searchSongs(query: string): Song[] {
    const db = getDatabase();
    const stmt = db.prepare(`
      SELECT * FROM songs 
      WHERE title LIKE ? OR artist LIKE ?
      ORDER BY created_at DESC
    `);
    
    const searchPattern = `%${query}%`;
    const rows = stmt.all(searchPattern, searchPattern) as any[];

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      artist: row.artist,
      lyrics: row.lyrics,
      slidesData: row.slides_data ? JSON.parse(row.slides_data) : null,
      designTheme: row.design_theme ? JSON.parse(row.design_theme) : null,
      ccliNumber: row.ccli_number,
      key: row.key,
      tempo: row.tempo,
      tags: row.tags ? JSON.parse(row.tags) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}
