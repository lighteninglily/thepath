/**
 * Browser localStorage wrapper for data persistence
 * Simple, works immediately, no native modules needed!
 */

import type { Song, Service } from '../types';

const KEYS = {
  SONGS: 'churchSlides_songs',
  SERVICES: 'churchSlides_services',
  SETTINGS: 'churchSlides_settings',
} as const;

// Generic localStorage helpers
function getFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
}

// ===== SONGS =====

export function getAllSongs(): Song[] {
  return getFromStorage<Song[]>(KEYS.SONGS) || [];
}

export function getSongById(id: string): Song | undefined {
  const songs = getAllSongs();
  return songs.find(song => song.id === id);
}

export function saveSong(song: Song): void {
  const songs = getAllSongs();
  const existingIndex = songs.findIndex(s => s.id === song.id);
  
  if (existingIndex >= 0) {
    // Update existing
    songs[existingIndex] = song;
  } else {
    // Add new
    songs.push(song);
  }
  
  saveToStorage(KEYS.SONGS, songs);
}

export function deleteSong(id: string): void {
  const songs = getAllSongs();
  const filtered = songs.filter(song => song.id !== id);
  saveToStorage(KEYS.SONGS, filtered);
}

// ===== SERVICES =====

export function getAllServices(): Service[] {
  return getFromStorage<Service[]>(KEYS.SERVICES) || [];
}

export function getServiceById(id: string): Service | undefined {
  const services = getAllServices();
  return services.find(service => service.id === id);
}

export function saveService(service: Service): void {
  const services = getAllServices();
  const existingIndex = services.findIndex(s => s.id === service.id);
  
  if (existingIndex >= 0) {
    services[existingIndex] = service;
  } else {
    services.push(service);
  }
  
  saveToStorage(KEYS.SERVICES, services);
}

export function deleteService(id: string): void {
  const services = getAllServices();
  const filtered = services.filter(service => service.id !== id);
  saveToStorage(KEYS.SERVICES, filtered);
}

// ===== SETTINGS =====

export function getSettings(): Record<string, unknown> {
  return getFromStorage(KEYS.SETTINGS) || {};
}

export function saveSettings(settings: Record<string, unknown>): void {
  saveToStorage(KEYS.SETTINGS, settings);
}

// ===== UTILITY =====

export function clearAllData(): void {
  if (window.confirm('⚠️ This will delete ALL your data. Are you sure?')) {
    localStorage.removeItem(KEYS.SONGS);
    localStorage.removeItem(KEYS.SERVICES);
    localStorage.removeItem(KEYS.SETTINGS);
    window.location.reload();
  }
}

export function exportData(): string {
  const data = {
    songs: getAllSongs(),
    services: getAllServices(),
    settings: getSettings(),
    exportedAt: new Date().toISOString(),
  };
  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.songs) saveToStorage(KEYS.SONGS, data.songs);
    if (data.services) saveToStorage(KEYS.SERVICES, data.services);
    if (data.settings) saveToStorage(KEYS.SETTINGS, data.settings);
    
    window.location.reload();
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    alert('❌ Failed to import data. Check the file format.');
    return false;
  }
}
