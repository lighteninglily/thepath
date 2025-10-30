-- The Path Database Schema
-- SQLite database for local storage

-- Songs table: Core song library
CREATE TABLE IF NOT EXISTS songs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT,
  lyrics TEXT NOT NULL,
  slides_data TEXT, -- JSON array
  design_theme TEXT, -- JSON object
  ccli_number TEXT,
  key TEXT,
  tempo INTEGER,
  tags TEXT, -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Indexes for songs
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);

-- Announcements table
CREATE TABLE IF NOT EXISTS announcements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  design_data TEXT, -- JSON object
  image_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for announcements
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);

-- Services table: Service orders/setlists
CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  date TEXT,
  items TEXT NOT NULL, -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Index for services
CREATE INDEX IF NOT EXISTS idx_services_date ON services(date DESC);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at DESC);

-- Design templates table
CREATE TABLE IF NOT EXISTS design_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  template_data TEXT NOT NULL, -- JSON object
  is_ai_generated INTEGER DEFAULT 0, -- Boolean: 0 or 1
  created_at TEXT NOT NULL
);

-- Settings table: Application configuration
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL, -- JSON-encoded value
  updated_at TEXT NOT NULL
);

-- Insert default design templates
INSERT OR IGNORE INTO design_templates (id, name, template_data, is_ai_generated, created_at) VALUES
(
  'minimal-light',
  'Minimal Light',
  json('{"backgroundColor":"#F5F3F0","textColor":"#3A3532","textShadow":"none","fontFamily":"Inter","fontSize":"48px","textAlign":"center","overlayOpacity":0}'),
  0,
  datetime('now')
),
(
  'modern-blue',
  'Modern Blue',
  json('{"backgroundColor":"#A8C5DD","backgroundGradient":"linear-gradient(135deg, #A8C5DD 0%, #C5D9E8 100%)","textColor":"#FFFFFF","textShadow":"2px 2px 8px rgba(0,0,0,0.3)","fontFamily":"Outfit","fontSize":"52px","textAlign":"center","overlayOpacity":0}'),
  0,
  datetime('now')
),
(
  'traditional-earth',
  'Traditional Earth',
  json('{"backgroundColor":"#3A3532","textColor":"#D4C4B0","textShadow":"1px 1px 4px rgba(0,0,0,0.5)","fontFamily":"Georgia","fontSize":"46px","textAlign":"center","overlayOpacity":0}'),
  0,
  datetime('now')
),
(
  'nature-calm',
  'Nature Calm',
  json('{"backgroundColor":"#C9B8A8","backgroundGradient":"linear-gradient(to bottom, #D4C4B0 0%, #B8A394 100%)","textColor":"#3A3532","textShadow":"1px 1px 2px rgba(255,255,255,0.5)","fontFamily":"Outfit","fontSize":"50px","textAlign":"center","overlayOpacity":0}'),
  0,
  datetime('now')
),
(
  'celebration-vibrant',
  'Celebration Vibrant',
  json('{"backgroundColor":"#B8D4E8","backgroundGradient":"linear-gradient(135deg, #B8D4E8 0%, #D4E4F0 50%, #C5D9E8 100%)","textColor":"#3A3532","textShadow":"2px 2px 6px rgba(255,255,255,0.8)","fontFamily":"Outfit","fontSize":"54px","textAlign":"center","overlayOpacity":0}'),
  0,
  datetime('now')
);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value, updated_at) VALUES
(
  'app_settings',
  json('{"churchName":"The Way","primaryColor":"#A8C5DD","secondaryColor":"#C9B8A8","defaultPresentationDisplay":1,"keyboardShortcuts":{"nextSlide":"Space","previousSlide":"Backspace","exitPresentation":"Escape","blankScreen":"b","gotoSlide":"g"},"autoSaveInterval":30000}'),
  datetime('now')
);
