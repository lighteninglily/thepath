import { create } from 'zustand';
import type { Song } from '../types';

interface PresentationState {
  isPresenting: boolean;
  currentSong: Song | null;
  currentSlideIndex: number;
  isBlank: boolean;
  
  // Actions
  startPresentation: (song: Song) => void;
  stopPresentation: () => void;
  setSlideIndex: (index: number) => void;
  nextSlide: () => void;
  previousSlide: () => void;
  toggleBlank: () => void;
}

export const usePresentationStore = create<PresentationState>((set, get) => ({
  isPresenting: false,
  currentSong: null,
  currentSlideIndex: 0,
  isBlank: false,

  startPresentation: (song: Song) => {
    set({
      isPresenting: true,
      currentSong: song,
      currentSlideIndex: 0,
      isBlank: false,
    });
  },

  stopPresentation: () => {
    set({
      isPresenting: false,
      currentSong: null,
      currentSlideIndex: 0,
      isBlank: false,
    });
  },

  setSlideIndex: (index: number) => {
    set({ currentSlideIndex: index });
  },

  nextSlide: () => {
    const { currentSong, currentSlideIndex } = get();
    if (!currentSong?.slidesData) return;
    
    const maxIndex = currentSong.slidesData.length - 1;
    if (currentSlideIndex < maxIndex) {
      set({ currentSlideIndex: currentSlideIndex + 1 });
    }
  },

  previousSlide: () => {
    const { currentSlideIndex } = get();
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1 });
    }
  },

  toggleBlank: () => {
    set((state) => ({ isBlank: !state.isBlank }));
  },
}));
