import { v4 as uuidv4 } from 'uuid';
import type { Song, CreateSongInput, DesignTemplate } from '../types';

// Use localStorage for persistent browser storage
import * as storage from '../utils/localStorage';

// Templates (not stored in localStorage yet - keeping in memory)
const mockTemplates: DesignTemplate[] = [
  {
    id: '1',
    name: 'Minimal Light',
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    templateData: {
      backgroundColor: '#F5F3F0',
      textColor: '#3A3532',
      textShadow: 'none',
      fontFamily: 'Inter',
      fontSize: '48px',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    id: '2',
    name: 'Modern Blue',
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    templateData: {
      backgroundColor: '#1e3a8a',
      backgroundGradient: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      textColor: '#ffffff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      fontFamily: 'Outfit',
      fontSize: '52px',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    id: '3',
    name: 'Traditional Earth',
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    templateData: {
      backgroundColor: '#8B7355',
      textColor: '#FFFFFF',
      textShadow: '3px 3px 6px rgba(0,0,0,0.5)',
      fontFamily: 'Outfit',
      fontSize: '50px',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    id: '4',
    name: 'Nature Calm',
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    templateData: {
      backgroundColor: '#2d5016',
      backgroundGradient: 'linear-gradient(to bottom, #2d5016 0%, #4a7c2c 100%)',
      textColor: '#f0f4f0',
      textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
      fontFamily: 'Outfit',
      fontSize: '48px',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
  {
    id: '5',
    name: 'Celebration Vibrant',
    isAiGenerated: false,
    createdAt: new Date().toISOString(),
    templateData: {
      backgroundColor: '#7c2d12',
      backgroundGradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #fb923c 100%)',
      textColor: '#ffffff',
      textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
      fontFamily: 'Outfit',
      fontSize: '54px',
      textAlign: 'center',
      overlayOpacity: 0,
    },
  },
];

/**
 * Mock Electron API for browser development
 * This allows the app to work in dev mode without Electron
 */
export const mockElectronAPI = {
  database: {
    getSongs: async (): Promise<Song[]> => {
      const songs = storage.getAllSongs();
      console.log('💾 localStorage: Getting songs:', songs.length);
      return Promise.resolve(songs);
    },

    getSongById: async (id: string): Promise<Song | null> => {
      const song = storage.getSongById(id) || null;
      console.log('💾 localStorage: Getting song by ID:', id, !!song);
      return Promise.resolve(song);
    },

    createSong: async (input: CreateSongInput): Promise<Song> => {
      const newSong: Song = {
        ...input,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      storage.saveSong(newSong);
      console.log('💾 localStorage: Created song:', newSong.title);
      return Promise.resolve(newSong);
    },

    updateSong: async (id: string, data: Partial<CreateSongInput>): Promise<Song> => {
      const existing = storage.getSongById(id);
      if (!existing) throw new Error('Song not found');
      
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      storage.saveSong(updated);
      console.log('💾 localStorage: Updated song:', updated.title);
      return Promise.resolve(updated);
    },

    deleteSong: async (id: string): Promise<void> => {
      storage.deleteSong(id);
      console.log('💾 localStorage: Deleted song:', id);
      return Promise.resolve();
    },

    getDesignTemplates: async (): Promise<DesignTemplate[]> => {
      console.log('📦 MOCK: Getting templates:', mockTemplates.length);
      return Promise.resolve([...mockTemplates]);
    },

    getAnnouncements: async () => Promise.resolve([]),
    createAnnouncement: async (data: any) => Promise.resolve(data),
    
    getServices: async () => {
      const services = storage.getAllServices();
      console.log('💾 localStorage: Getting services:', services.length);
      console.log('💾 localStorage: Services data:', services);
      
      // Debug: Check raw localStorage
      const rawServices = localStorage.getItem('churchSlides_services');
      console.log('💾 localStorage: RAW services string:', rawServices);
      
      return Promise.resolve(services);
    },
    
    getServiceById: async (id: string) => {
      const service = storage.getServiceById(id) || null;
      console.log('💾 localStorage: Getting service by ID:', id, !!service);
      return Promise.resolve(service);
    },
    
    createService: async (data: any) => {
      console.log('🔵 createService called with data:', data);
      const newService = {
        ...data,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      console.log('💾 localStorage: About to save service:', newService);
      storage.saveService(newService);
      console.log('💾 localStorage: Service saved!');
      
      // Verify it was saved
      const allServices = storage.getAllServices();
      console.log('💾 localStorage: Total services after save:', allServices.length);
      console.log('💾 localStorage: All services:', allServices);
      
      return Promise.resolve(newService);
    },
    
    updateService: async (id: string, data: any) => {
      const existing = storage.getServiceById(id);
      if (!existing) throw new Error('Service not found');
      
      const updated = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      storage.saveService(updated);
      console.log('💾 localStorage: Updated service:', updated.name);
      return Promise.resolve(updated);
    },
    
    deleteService: async (id: string) => {
      storage.deleteService(id);
      console.log('💾 localStorage: Deleted service:', id);
      return Promise.resolve();
    },
    
    getSettings: async () => Promise.resolve({}),
    updateSettings: async (data: any) => Promise.resolve(data),
  },
  presentation: {
    start: async () => Promise.resolve(),
    navigate: async () => Promise.resolve(),
    blank: async () => Promise.resolve(),
    exit: async () => Promise.resolve(),
  },
};
