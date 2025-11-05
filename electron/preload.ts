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
  display: {
    getAll: () => ipcRenderer.invoke('display:getAll'),
    getAudience: () => ipcRenderer.invoke('display:getAudience'),
    onChanged: (callback: (displays: any[]) => void) => {
      const listener = (_event: any, displays: any[]) => callback(displays);
      ipcRenderer.on('display:changed', listener);
      return () => ipcRenderer.removeListener('display:changed', listener);
    },
    onDisconnected: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('display:disconnected', listener);
      return () => ipcRenderer.removeListener('display:disconnected', listener);
    },
  },
  presentation: {
    start: (serviceId?: string, songId?: string) =>
      ipcRenderer.invoke('presentation:start', serviceId, songId),
    startWithPresenter: () => ipcRenderer.invoke('presentation:startWithPresenter'),
    close: () => ipcRenderer.invoke('presentation:close'),
    syncState: (state: any) =>
      ipcRenderer.invoke('presentation:syncState', state),
    syncToPresenter: (state: any) =>
      ipcRenderer.invoke('presentation:syncToPresenter', state),
    onStateUpdate: (callback: (state: any) => void) => {
      const listener = (_event: any, state: any) => callback(state);
      ipcRenderer.on('presentation:stateUpdate', listener);
      return () => ipcRenderer.removeListener('presentation:stateUpdate', listener);
    },
    onBlank: (callback: (type: string) => void) => {
      const listener = (_event: any, type: string) => callback(type);
      ipcRenderer.on('presentation:blank', listener);
      return () => ipcRenderer.removeListener('presentation:blank', listener);
    },
    onUnblank: (callback: () => void) => {
      const listener = () => callback();
      ipcRenderer.on('presentation:unblank', listener);
      return () => ipcRenderer.removeListener('presentation:unblank', listener);
    },
    navigate: (direction: 'next' | 'previous' | 'goto', slideIndex?: number) =>
      ipcRenderer.invoke('presentation:navigate', direction, slideIndex),
    blank: (type?: 'black' | 'white' | 'logo') => ipcRenderer.invoke('presentation:blank', type),
    unblank: () => ipcRenderer.invoke('presentation:unblank'),
    exit: () => ipcRenderer.invoke('presentation:exit'),
  },
  lyrics: {
    search: (trackName: string, artistName?: string) =>
      ipcRenderer.invoke('lyrics:search', trackName, artistName),
  },
  ai: {
    formatSermon: (content: string) =>
      ipcRenderer.invoke('ai:formatSermon', content),
  },
  invoke: (channel: string, ...args: any[]) =>
    ipcRenderer.invoke(channel, ...args),
};

contextBridge.exposeInMainWorld('electron', electronAPI);
