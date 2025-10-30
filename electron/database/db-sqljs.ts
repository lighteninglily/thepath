/**
 * SQLite Database using sql.js (pure JavaScript, no native modules)
 * Drop-in replacement for better-sqlite3
 */

// @ts-ignore - sql.js doesn't have types
import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { app } from 'electron';

type SqlJsDatabase = any;

let db: SqlJsDatabase | null = null;
let SQL: any = null;
let dbPath: string;

/**
 * Initialize sql.js database
 */
export async function initializeDatabase() {
  try {
    const userDataPath = app.getPath('userData');
    dbPath = path.join(userDataPath, 'the_path.db');
    
    console.log('Database path:', dbPath);
    console.log('Using sql.js (pure JavaScript SQLite)');
    
    // Initialize sql.js
    SQL = await initSqlJs({
      // Load the wasm file from node_modules
      locateFile: (file: string) => {
        return path.join(__dirname, '../../node_modules/sql.js/dist', file);
      }
    });
    
    // Load existing database or create new one
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath);
      db = new SQL.Database(buffer);
      console.log('✅ Loaded existing database');
    } else {
      db = new SQL.Database();
      console.log('✅ Created new database');
    }
    
    // Create tables
    createTables();
    
    // Save initial database
    saveDatabase();
    
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Create database tables from schema
 */
function createTables() {
  if (!db) throw new Error('Database not initialized');
  
  try {
    // Inline schema to avoid file reading issues
    const schema = `
      -- Songs table
      CREATE TABLE IF NOT EXISTS songs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        artist TEXT,
        lyrics TEXT NOT NULL,
        slides_data TEXT,
        design_theme TEXT,
        ccli_number TEXT,
        key TEXT,
        tempo INTEGER,
        tags TEXT,
        background_id TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
      CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
      
      -- Announcements table
      CREATE TABLE IF NOT EXISTS announcements (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT,
        design_data TEXT,
        image_path TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
      
      -- Services table
      CREATE TABLE IF NOT EXISTS services (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        date TEXT,
        items TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      
      CREATE INDEX IF NOT EXISTS idx_services_date ON services(date DESC);
      CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);
      
      -- Design templates table
      CREATE TABLE IF NOT EXISTS design_templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        template_data TEXT NOT NULL,
        is_ai_generated INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      );
      
      -- Settings table
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `;
    
    // Execute schema as a whole (sql.js can handle multi-statement)
    try {
      db!.exec(schema);
    } catch (err) {
      // If exec fails, try running statements individually
      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));
      
      statements.forEach(statement => {
        try {
          db!.run(statement);
        } catch (statementErr) {
          // Ignore table/index already exists errors
          const errorStr = statementErr instanceof Error ? statementErr.message : String(statementErr);
          if (!errorStr.includes('already exists') && !errorStr.includes('no such table')) {
            console.error('Error executing statement:', statement, statementErr);
          }
        }
      });
    }
    
    console.log('✅ Database tables created/verified');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
}

/**
 * Save database to disk
 */
function saveDatabase() {
  if (!db) return;
  
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  } catch (error) {
    console.error('Error saving database:', error);
  }
}

/**
 * Get database instance with better-sqlite3 compatible interface
 */
export function getDatabase() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  // Return an object with better-sqlite3-compatible methods
  return {
    prepare: (sql: string) => {
      const stmt = db!.prepare(sql);
      
      return {
        run: (...params: any[]) => {
          stmt.bind(params);
          stmt.step();
          stmt.reset();
          saveDatabase(); // Auto-save after modifications
          
          return {
            changes: db!.getRowsModified(),
            lastInsertRowid: 0 // sql.js doesn't easily provide this
          };
        },
        
        get: (...params: any[]) => {
          stmt.bind(params);
          const result = stmt.step() ? stmt.getAsObject() : undefined;
          stmt.reset();
          return result;
        },
        
        all: (...params: any[]) => {
          stmt.bind(params);
          const results: any[] = [];
          
          while (stmt.step()) {
            results.push(stmt.getAsObject());
          }
          
          stmt.reset();
          return results;
        },
        
        finalize: () => {
          stmt.free();
        }
      };
    },
    
    exec: (sql: string) => {
      db!.exec(sql);
      saveDatabase();
    },
    
    close: () => {
      if (db) {
        saveDatabase();
        db.close();
        db = null;
      }
    }
  };
}

/**
 * Close database and save
 */
export function closeDatabase() {
  if (db) {
    console.log('💾 Closing database...');
    saveDatabase();
    db.close();
    db = null;
  }
}
