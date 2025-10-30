import { useQuery } from '@tanstack/react-query';

// Helper to safely access window.electron
const getElectron = () => {
  if (typeof window !== 'undefined' && window.electron) {
    return window.electron;
  }
  throw new Error('Electron API not available');
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
