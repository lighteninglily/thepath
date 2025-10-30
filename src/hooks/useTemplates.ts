import { useQuery } from '@tanstack/react-query';
import { mockElectronAPI } from './useMockElectron';
import type { DesignTemplate } from '../types';

// Helper to safely access window.electron
const getElectron = () => {
  if (typeof window !== 'undefined' && window.electron) {
    return window.electron;
  }
  // Use mock API for browser development
  return mockElectronAPI;
};

/**
 * Hook to fetch all design templates
 */
export function useTemplates() {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const electron = getElectron();
      return electron.database.getDesignTemplates();
    },
  });
}
