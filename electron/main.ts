import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';
import { initializeDatabase, closeDatabase } from './database/db';
import { SongService } from './database/songService';
import { TemplateService } from './database/templateService';
// @ts-ignore - No types available for genius-lyrics-api
import { getLyrics, searchSong } from 'genius-lyrics-api';
import Anthropic from '@anthropic-ai/sdk';

let mainWindow: BrowserWindow | null = null;
let presentationWindow: BrowserWindow | null = null;

// ===== SERVICE STORAGE HELPERS =====
// Simple JSON file storage for services (temporary until proper DB implementation)
function getServicesFilePath(): string {
  const userDataPath = app.getPath('userData');
  if (!existsSync(userDataPath)) {
    mkdirSync(userDataPath, { recursive: true });
  }
  return path.join(userDataPath, 'services.json');
}

function loadServices(): any[] {
  try {
    const filePath = getServicesFilePath();
    if (!existsSync(filePath)) {
      return [];
    }
    const data = readFileSync(filePath, 'utf-8');
    const services = JSON.parse(data);
    console.log('📂 Loaded services from file:', services.length);
    return services;
  } catch (error) {
    console.error('❌ Error loading services:', error);
    return [];
  }
}

function saveServices(services: any[]): void {
  try {
    const filePath = getServicesFilePath();
    writeFileSync(filePath, JSON.stringify(services, null, 2), 'utf-8');
    console.log('💾 Saved services to file:', services.length);
  } catch (error) {
    console.error('❌ Error saving services:', error);
  }
}

// Initialize database (async now with sql.js)
async function initDatabase() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
}

async function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'The Path - Church Presentation Software',
  });

  // Try to load from Vite dev server first, fall back to built files
  const devServerUrl = 'http://localhost:5173';
  
  try {
    // Check if dev server is running
    const response = await fetch(devServerUrl);
    if (response.ok) {
      console.log('✅ Loading from Vite dev server');
      mainWindow.loadURL(devServerUrl);
      // DevTools can be opened manually with F12 or Ctrl+Shift+I if needed
      // mainWindow.webContents.openDevTools();
    } else {
      throw new Error('Dev server not responding');
    }
  } catch (error) {
    // Dev server not available, load from built files
    console.log('📦 Loading from built files');
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Add keyboard shortcut to toggle DevTools (F12 or Ctrl+Shift+I)
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || 
        (input.control && input.shift && input.key === 'I')) {
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
    }
  });
}

function createPresentationWindow() {
  if (presentationWindow) {
    presentationWindow.focus();
    return;
  }

  presentationWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    frame: true,  // Show frame so user can drag it
    fullscreen: false,  // Not full-screen initially, user can press F11
    title: 'Audience View - Drag to Projector',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load Audience View (full screen projection)
  const startURL = process.env.ELECTRON_START_URL || 'http://localhost:5173';
  
  if (startURL.startsWith('http')) {
    // Development mode
    presentationWindow.loadURL(`${startURL}/#/audience`);
    console.log('📺 Loading audience view from:', `${startURL}/#/audience`);
  } else {
    // Production mode
    presentationWindow.loadFile(path.join(__dirname, '../dist/index.html'), {
      hash: 'audience',
    });
  }

  presentationWindow.on('closed', () => {
    presentationWindow = null;
  });

  // Log any errors from the audience window
  presentationWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('❌ Audience window failed to load:', errorCode, errorDescription);
  });

  presentationWindow.webContents.on('crashed', (event) => {
    console.error('❌ Audience window crashed:', event);
  });

  // Open DevTools in development to see errors
  if (process.env.ELECTRON_START_URL) {
    presentationWindow.webContents.openDevTools();
  }

  console.log('🎭 Presentation window (Audience View) created');
}

function closePresentationWindow() {
  if (presentationWindow) {
    presentationWindow.close();
    presentationWindow = null;
    console.log('🛑 Presentation window closed');
  }
}

// App lifecycle
app.whenReady().then(async () => {
  // Initialize database first
  await initDatabase();
  
  await createMainWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  console.log('💾 Closing database before quit...');
  closeDatabase();
});

// IPC Handlers - Database operations connected to SongService

ipcMain.handle('db:getSongs', async () => {
  try {
    return SongService.getAllSongs();
  } catch (error) {
    console.error('Error getting songs:', error);
    return [];
  }
});

ipcMain.handle('db:getSongById', async (_event, id: string) => {
  try {
    return SongService.getSongById(id);
  } catch (error) {
    console.error('Error getting song:', error);
    return null;
  }
});

ipcMain.handle('db:createSong', async (_event, song) => {
  try {
    return SongService.createSong(song);
  } catch (error) {
    console.error('Error creating song:', error);
    throw error;
  }
});

ipcMain.handle('db:updateSong', async (_event, id: string, data) => {
  try {
    return SongService.updateSong(id, data);
  } catch (error) {
    console.error('Error updating song:', error);
    throw error;
  }
});

ipcMain.handle('db:deleteSong', async (_event, id: string) => {
  try {
    SongService.deleteSong(id);
  } catch (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
});

ipcMain.handle('db:getAnnouncements', async () => {
  // TODO: Implement later
  return [];
});

ipcMain.handle('db:createAnnouncement', async (_event, announcement) => {
  // TODO: Implement later
  return announcement;
});

ipcMain.handle('db:getServices', async () => {
  console.log('📋 db:getServices called');
  const services = loadServices();
  console.log('📋 Returning services:', services.length);
  return services;
});

ipcMain.handle('db:getServiceById', async (_event, id: string) => {
  console.log('📋 db:getServiceById called:', id);
  const services = loadServices();
  const service = services.find((s: any) => s.id === id);
  console.log('📋 Found service:', !!service);
  return service || null;
});

ipcMain.handle('db:createService', async (_event, serviceData) => {
  console.log('✨ db:createService called with:', serviceData);
  
  // Create service with ID and timestamps
  const newService = {
    ...serviceData,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  console.log('✨ Created service object with ID:', newService.id);
  
  // Load existing services
  const services = loadServices();
  
  // Add new service
  services.push(newService);
  
  // Save back to file
  saveServices(services);
  
  console.log('✅ Service saved! Total services:', services.length);
  
  return newService;
});

ipcMain.handle('db:updateService', async (_event, serviceId: string, serviceData: any) => {
  console.log('✏️ db:updateService called:', serviceId);
  
  const services = loadServices();
  const index = services.findIndex((s: any) => s.id === serviceId);
  
  if (index === -1) {
    console.error('❌ Service not found:', serviceId);
    throw new Error('Service not found');
  }
  
  // Update service with new data and timestamp
  const updatedService = {
    ...services[index],
    ...serviceData,
    id: serviceId, // Preserve ID
    updatedAt: new Date().toISOString(),
  };
  
  services[index] = updatedService;
  saveServices(services);
  
  console.log('✅ Service updated successfully!');
  
  return updatedService;
});

ipcMain.handle('db:deleteService', async (_event, serviceId: string) => {
  console.log('🗑️ db:deleteService called:', serviceId);
  
  const services = loadServices();
  const filtered = services.filter((s: any) => s.id !== serviceId);
  
  if (services.length === filtered.length) {
    console.error('❌ Service not found:', serviceId);
    throw new Error('Service not found');
  }
  
  saveServices(filtered);
  
  console.log('✅ Service deleted! Remaining:', filtered.length);
  
  return true;
});

ipcMain.handle('db:getDesignTemplates', async () => {
  try {
    return TemplateService.getAllTemplates();
  } catch (error) {
    console.error('Error getting templates:', error);
    return [];
  }
});

ipcMain.handle('db:getSettings', async () => {
  // TODO: Implement in Stage 7
  return {};
});

ipcMain.handle('db:updateSettings', async (_event, settings) => {
  // TODO: Implement in Stage 7
  return settings;
});

// Lyrics search handler - Genius API
const GENIUS_API_KEY = 'bLIFf3kyKQ9-ASEXy1sMMEDE-AONyvk82yp3G1aGTifYqk46bQzuoNTxGfjms8no';

ipcMain.handle('lyrics:search', async (_event, trackName: string, artistName?: string) => {
  try {
    const searchQuery = artistName 
      ? `${artistName} ${trackName}`
      : trackName;
    
    console.log('🎵 Searching Genius API:', searchQuery);
    
    const options = {
      apiKey: GENIUS_API_KEY,
      title: trackName,
      artist: artistName || '',
      optimizeQuery: true,
    };
    
    // Search for the song
    const lyrics = await getLyrics(options);
    
    if (!lyrics) {
      throw new Error('Song lyrics not found. Try a different spelling or artist name.');
    }
    
    // Also get song details for better metadata
    const searchResults = await searchSong(options);
    
    const data = {
      title: searchResults?.title || trackName,
      artist: searchResults?.artist || artistName || 'Unknown Artist',
      lyrics: lyrics,
      source: 'Genius',
      album: searchResults?.album || undefined,
      year: searchResults?.year || undefined,
      id: searchResults?.id?.toString() || undefined,
    };
    
    console.log('✅ Lyrics found:', data.title, 'by', data.artist);
    
    return data;
  } catch (error) {
    console.error('❌ Lyrics search error:', error);
    // Provide more helpful error message
    if (error instanceof Error) {
      throw new Error(`Could not find lyrics: ${error.message}`);
    }
    throw new Error('Song lyrics not found. Please try a different search or enter lyrics manually.');
  }
});

// Presentation control handlers
ipcMain.handle('presentation:start', async () => {
  console.log('🎭 presentation:start called');
  createPresentationWindow();
  return true;
});

ipcMain.handle('presentation:close', async () => {
  console.log('🛑 presentation:close called');
  closePresentationWindow();
  return true;
});

// Sync presentation state to audience window
ipcMain.handle('presentation:syncState', async (_event, state: any) => {
  console.log('🔄 Syncing presentation state to audience window');
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.send('presentation:stateUpdate', state);
    return true;
  }
  return false;
});

ipcMain.handle('presentation:navigate', async (_event, direction: string, slideIndex?: number) => {
  // Navigation is handled by the presenter view, not here
  console.log('Navigate:', direction, slideIndex);
  return true;
});

ipcMain.handle('presentation:blank', async () => {
  if (presentationWindow && !presentationWindow.isDestroyed()) {
    presentationWindow.webContents.send('blank-screen');
  }
  return true;
});

ipcMain.handle('presentation:exit', async () => {
  closePresentationWindow();
  return true;
});

// AI Sermon Formatting handler - Claude API
function getAnthropicApiKey(): string {
  try {
    const credentialsPath = path.join(__dirname, '..', 'docs', 'credentials.json');
    if (existsSync(credentialsPath)) {
      const credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
      return credentials.anthropic?.apiKey || '';
    }
  } catch (error) {
    console.error('❌ Error loading Anthropic API key from credentials:', error);
  }
  return '';
}

ipcMain.handle('ai:formatSermon', async (_event, content: string) => {
  try {
    if (!content || content.trim().length < 3) {
      return { 
        error: 'Content too short',
        templateId: null 
      };
    }

    console.log('🤖 AI formatting sermon content:', content.substring(0, 50));

    const apiKey = getAnthropicApiKey();
    if (!apiKey) {
      return {
        error: 'Anthropic API key not found in credentials',
        templateId: null
      };
    }

    const anthropic = new Anthropic({
      apiKey: apiKey
    });

    const prompt = `Analyze this sermon slide content and return formatting instructions.

Content: """
${content}
"""

Available templates (ALL support title + subtitle if content has multiple lines):
- title-hero-bold: Large centered title with optional subtitle (for opening slides, main topics)
- title-elegant-center: Refined centered title with serif font and italic subtitle
- scripture-classic-center: Bible reference + verse text in traditional layout
- scripture-modern-split: Contemporary scripture design with split layout
- point-numbered-bold: Numbered/lettered point with title and body (1., 2., A., etc.)
- point-split: Split design point with dark/light sections
- multi-point-columns: 2-3 bullet points in columns
- quote-elegant: Centered quote with attribution
- transition-bold: Section divider text
- question-bold: Large question text

Return ONLY valid JSON (no markdown, no code blocks):
{
  "templateId": "point-numbered-bold",
  "confidence": 0.95,
  "placeholders": {
    "pointNumber": "1",
    "pointTitle": "Faith Requires Action",
    "pointBody": "We must step out in faith even when we don't see the path",
    "emphasis": ["Faith", "Action"]
  },
  "reasoning": "Detected numbered point with clear title and supporting text"
}

Detection Rules:
1. Scripture references (John 3:16, James 2:14-17, Psalm 23, etc.) → scripture-classic-center or scripture-modern-split
   - IMPORTANT: Extract the reference (e.g. "John 3:16") separately from the verse text
   - Example: "Scripture John 3:16 - For God so loved the world"
     → scriptureReference: "John 3:16"
     → scriptureText: "For God so loved the world"
2. Numbering (1., 2., A., I., etc.) at start → point-numbered-bold
3. Questions (ends with ?) → question-bold
4. Quote marks ("
...", '...') → quote-elegant
5. Short text (<20 chars) without punctuation → title-hero-bold
6. Multi-line text (2+ lines) without special formatting → title-elegant-center (supports subtitle!)
7. Multiple bullet points (•, -, *) → multi-point-columns
8. Section headings (Part 1, Section A, etc.) → transition-bold
9. Default fallback → title-elegant-center

Extract all relevant placeholders (split multi-line content intelligently):
- title: First line or main heading (REQUIRED)
- subtitle: Second line or supporting text (extract if multiple lines exist)
- scriptureReference: Bible verse reference ONLY (e.g., "John 3:16", "Psalm 23:1-3")
- scriptureText: The actual verse text WITHOUT the reference (e.g., "For God so loved the world")
- pointNumber: Number/letter (1, 2, A, I)
- pointTitle: Main point heading
- pointBody: Supporting text
- quoteText: Quote content
- author: Quote attribution
- question: Question text
- emphasis: Array of 1-3 key words to emphasize

IMPORTANT: If content has multiple lines, always extract both title AND subtitle!
Example:
Content: "Hello everyone\nwe are going through John"
→ Extract: { "title": "Hello everyone", "subtitle": "we are going through John" }

Scripture parsing example:
Content: "Scripture John 3:16 - For God so loved the world"
→ Extract: { 
  "scriptureReference": "John 3:16",
  "scriptureText": "For God so loved the world"
}

Content: "John 3:16\nFor God so loved the world that he gave his only begotten son"
→ Extract: {
  "scriptureReference": "John 3:16",
  "scriptureText": "For God so loved the world that he gave his only begotten son"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const responseText = (message.content[0] as any).text;
    console.log('🤖 Claude response:', responseText);
    
    // Clean response (remove markdown if present)
    const cleanedResponse = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const formatted = JSON.parse(cleanedResponse);
    
    console.log('✅ AI formatted:', {
      templateId: formatted.templateId,
      confidence: formatted.confidence
    });
    
    return formatted;
    
  } catch (error) {
    console.error('❌ AI format error:', error);
    return { 
      error: 'AI formatting failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      templateId: null 
    };
  }
});
