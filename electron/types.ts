// Shared types for Electron process
// This duplicates types from src/types/index.ts to avoid rootDir issues

export interface Song {
  id: string;
  title: string;
  artist: string | null;
  lyrics: string;
  slidesData: Slide[] | null;
  designTheme: DesignTheme | null;
  ccliNumber: string | null;
  key: string | null;
  tempo: number | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Slide {
  id: string;
  type: 'verse' | 'chorus' | 'bridge' | 'custom';
  content: string;
  order: number;
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

export interface Service {
  id: string;
  name: string;
  date: string | null;
  items: ServiceItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  type: 'song' | 'announcement';
  id: string;
  order: number;
}

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

export type CreateSongInput = Omit<Song, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSongInput = Partial<CreateSongInput>;

export type CreateAnnouncementInput = Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateAnnouncementInput = Partial<CreateAnnouncementInput>;

export type CreateServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateServiceInput = Partial<CreateServiceInput>;

export interface Display {
  id: number;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  size: { width: number; height: number };
  scaleFactor: number;
  rotation: number;
  isPrimary: boolean;
  isInternal: boolean;
}

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
    updateService: (id: string, data: any) => Promise<Service>;
    deleteService: (id: string) => Promise<boolean>;
    
    getDesignTemplates: () => Promise<DesignTemplate[]>;
    
    getSettings: () => Promise<AppSettings>;
    updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  };
  display: {
    getAll: () => Promise<Display[]>;
    getAudience: () => Promise<any>;
    onChanged: (callback: (displays: Display[]) => void) => () => void;
    onDisconnected: (callback: () => void) => () => void;
  };
  presentation: {
    start: (serviceId?: string, songId?: string) => Promise<any>;
    startWithPresenter: () => Promise<boolean>;
    close: () => Promise<void>;
    syncState: (state: any) => Promise<void>;
    syncToPresenter: (state: any) => Promise<void>;
    reloadAudience: () => Promise<boolean>;
    onStateUpdate: (callback: (state: any) => void) => () => void;
    onBlank: (callback: (type: string) => void) => () => void;
    onUnblank: (callback: () => void) => () => void;
    navigate: (direction: 'next' | 'previous' | 'goto', slideIndex?: number) => Promise<void>;
    blank: (type?: 'black' | 'white' | 'logo') => Promise<void>;
    unblank: () => Promise<void>;
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
  ai: {
    formatSermon: (content: string) => Promise<{
      templateId: string | null;
      confidence?: number;
      placeholders?: Record<string, any>;
      emphasis?: string[];
      reasoning?: string;
      error?: string;
      message?: string;
    }>;
  };
  invoke: (channel: string, ...args: any[]) => Promise<any>;
}
