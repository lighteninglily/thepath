import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockElectronAPI } from './useMockElectron';
import type { Song, CreateSongInput, UpdateSongInput } from '../types';

// Helper to safely access window.electron
const getElectron = () => {
  if (typeof window !== 'undefined' && window.electron) {
    console.log('✅ Using real Electron API');
    return window.electron;
  }
  // Use mock API for browser development
  console.log('🔧 Using MOCK Electron API (browser mode)');
  return mockElectronAPI;
};

/**
 * Hook to fetch all songs
 */
export function useSongs() {
  return useQuery({
    queryKey: ['songs'],
    queryFn: async () => {
      const electron = getElectron();
      return electron.database.getSongs();
    },
  });
}

/**
 * Hook to fetch a single song by ID
 */
export function useSong(id: string) {
  return useQuery({
    queryKey: ['songs', id],
    queryFn: async () => {
      const electron = getElectron();
      return electron.database.getSongById(id);
    },
    enabled: !!id,
  });
}

/**
 * Hook to create a new song
 */
export function useCreateSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateSongInput) => {
      const electron = getElectron();
      return electron.database.createSong(input);
    },
    onSuccess: () => {
      // Invalidate and refetch songs list
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
}

/**
 * Hook to update an existing song
 */
export function useUpdateSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSongInput }) => {
      const electron = getElectron();
      return electron.database.updateSong(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate both the song detail and the list
      queryClient.invalidateQueries({ queryKey: ['songs'] });
      queryClient.invalidateQueries({ queryKey: ['songs', variables.id] });
    },
  });
}

/**
 * Hook to delete a song
 */
export function useDeleteSong() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const electron = getElectron();
      await electron.database.deleteSong(id);
    },
    onSuccess: () => {
      // Invalidate songs list
      queryClient.invalidateQueries({ queryKey: ['songs'] });
    },
  });
}
