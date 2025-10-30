// Core type definitions for The Path

export interface Song {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string;
  slidesData: Slide[] | null;
  designTheme: DesignTheme | null;
  backgroundId?: string | null;
  ccliNumber: string | null;
  key: string | null;
  tempo: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  id: string;
  type: 'title' | 'verse' | 'chorus' | 'bridge' | 'custom';
  content: string;
  order: number;
  backgroundId?: string | null;
  layout?: string | null;
  // Visual editor data (if slide was edited visually)
  visualData?: any; // Stores the complete VisualSlide structure
}

export interface DesignTheme {
  backgroundColor: string;
  backgroundGradient?: string;
  backgroundImage?: string;
  textColor: string;
  textShadow: string;
  fontFamily: string;
  fontSize: string;
  textAlign: 'left' | 'center' | 'right';
  overlayOpacity: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string | null;
  designData: DesignTheme | null;
  imagePath: string | null;
  createdAt: string;
  updatedAt: string;
}

// Import and re-export Service types from dedicated service module
import type { Service, ServiceItem, ServiceItemType, BibleVerse, CreateServiceInput as CreateServiceInputFromService } from './service';
export type { Service, ServiceItem, ServiceItemType, BibleVerse };
export type CreateServiceInput = CreateServiceInputFromService;

export interface DesignTemplate {
  id: string;
  name: string;
  templateData: DesignTheme;
  isAiGenerated: boolean;
  createdAt: string;
}

export interface AppSettings {
  churchName: string;
  primaryColor: string;
  secondaryColor: string;
  defaultPresentationDisplay: number;
  keyboardShortcuts: KeyboardShortcuts;
  autoSaveInterval: number;
}

export interface KeyboardShortcuts {
  nextSlide: string;
  previousSlide: string;
  exitPresentation: string;
  blankScreen: string;
  gotoSlide: string;
}

// Database operation types
export type CreateSongInput = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSongInput = Partial<CreateSongInput>;

export type CreateAnnouncementInput = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

// Electron IPC types
export interface ElectronAPI {
  database: {
    getSongs: () => Promise<Song[]>;
    getSongById: (id: string) => Promise<Song | null>;
    createSong: (song: CreateSongInput) => Promise<Song>;
    updateSong: (id: string, data: UpdateSongInput) => Promise<Song>;
    deleteSong: (id: string) => Promise<void>;
    
    getAnnouncements: () => Promise<Announcement[]>;
    createAnnouncement: (announcement: CreateAnnouncementInput) => Promise<Announcement>;
    
    getServices: () => Promise<Service[]>;
    getServiceById: (id: string) => Promise<Service | null>;
    createService: (service: CreateServiceInput) => Promise<Service>;
    
    getDesignTemplates: () => Promise<DesignTemplate[]>;
    
    getSettings: () => Promise<AppSettings>;
    updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  };
  presentation: {
    start: (serviceId?: string, songId?: string) => Promise<void>;
    close: () => Promise<void>;
    syncState: (state: any) => Promise<void>;
    onStateUpdate: (callback: (state: any) => void) => () => void;
    navigate: (direction: 'next' | 'previous' | 'goto', slideIndex?: number) => Promise<void>;
    blank: () => Promise<void>;
    exit: () => Promise<void>;
  };
  lyrics: {
    search: (trackName: string, artistName?: string) => Promise<{
      title: string;
      artist: string;
      lyrics: string;
      source: string;
    }>;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
