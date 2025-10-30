/**
 * Database Module - Uses sql.js (pure JavaScript, no native modules)
 * 
 * This module exports the same interface as better-sqlite3
 * but uses sql.js internally to avoid native module compilation issues
 */

export { initializeDatabase, getDatabase, closeDatabase } from './db-sqljs';
