import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from './types';

// Expose protected methods that allow the renderer process to use
// ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  database: {
    getSongs: () => ipcRenderer.invoke('db:getSongs'),
    getSongById: (id: string) => ipcRenderer.invoke('db:getSongById', id),
    createSong: (song) => ipcRenderer.invoke('db:createSong', song),
    updateSong: (id: string, data) => ipcRenderer.invoke('db:updateSong', id, data),
    deleteSong: (id: string) => ipcRenderer.invoke('db:deleteSong', id),
    
    getAnnouncements: () => ipcRenderer.invoke('db:getAnnouncements'),
    createAnnouncement: (announcement) =>
      ipcRenderer.invoke('db:createAnnouncement', announcement),
    
    getServices: () => ipcRenderer.invoke('db:getServices'),
    getServiceById: (id: string) => ipcRenderer.invoke('db:getServiceById', id),
    createService: (service) => ipcRenderer.invoke('db:createService', service),
    updateService: (id: string, data) => ipcRenderer.invoke('db:updateService', id, data),
    deleteService: (id: string) => ipcRenderer.invoke('db:deleteService', id),
    
    getDesignTemplates: () => ipcRenderer.invoke('db:getDesignTemplates'),
    
    getSettings: () => ipcRenderer.invoke('db:getSettings'),
    updateSettings: (settings) => ipcRenderer.invoke('db:updateSettings', settings),
  },
  presentation: {
    start: (serviceId?: string, songId?: string) =>
      ipcRenderer.invoke('presentation:start', serviceId, songId),
    close: () => ipcRenderer.invoke('presentation:close'),
    syncState: (state: any) =>
      ipcRenderer.invoke('presentation:syncState', state),
    onStateUpdate: (callback: (state: any) => void) => {
      const listener = (_event: any, state: any) => callback(state);
      ipcRenderer.on('presentation:stateUpdate', listener);
      return () => ipcRenderer.removeListener('presentation:stateUpdate', listener);
    },
    navigate: (direction: 'next' | 'previous' | 'goto', slideIndex?: number) =>
      ipcRenderer.invoke('presentation:navigate', direction, slideIndex),
    blank: () => ipcRenderer.invoke('presentation:blank'),
    exit: () => ipcRenderer.invoke('presentation:exit'),
  },
  lyrics: {
    search: (trackName: string, artistName?: string) =>
      ipcRenderer.invoke('lyrics:search', trackName, artistName),
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);
