import { create } from 'zustand';
import type { Service, ServiceItem } from '../types/service';

interface ServicePresentationState {
  // Core state
  isPresenting: boolean;
  service: Service | null;
  currentItemIndex: number;
  currentSlideIndex: number;
  currentSongData: any | null; // Song data for current item if it's a song
  
  // Display state
  isBlank: boolean;
  displayMode: 'single' | 'dual';
  
  // Timer
  startTime: number | null;
  elapsedTime: number;
  
  // Actions
  startPresentation: (service: Service, mode?: 'single' | 'dual') => void;
  stopPresentation: () => void;
  nextSlide: () => void;
  previousSlide: () => void;
  jumpToItem: (itemIndex: number) => void;
  toggleBlank: () => void;
  resetTimer: () => void;
  updateElapsedTime: () => void;
}

export const useServicePresentationStore = create<ServicePresentationState>((set, get) => ({
  // Initial state
  isPresenting: false,
  service: null,
  currentItemIndex: 0,
  currentSlideIndex: 0,
  currentSongData: null,
  isBlank: false,
  displayMode: 'single',
  startTime: null,
  elapsedTime: 0,

  // Start presentation
  startPresentation: (service: Service, mode: 'single' | 'dual' = 'single') => {
    console.log('🎭 Starting presentation:', service.name, 'Mode:', mode);
    set({
      isPresenting: true,
      service,
      currentItemIndex: 0,
      currentSlideIndex: 0,
      currentSongData: null,
      isBlank: false,
      displayMode: mode,
      startTime: Date.now(),
      elapsedTime: 0,
    });
  },

  // Stop presentation
  stopPresentation: () => {
    console.log('🛑 Stopping presentation');
    set({
      isPresenting: false,
      service: null,
      currentItemIndex: 0,
      currentSlideIndex: 0,
      currentSongData: null,
      isBlank: false,
      startTime: null,
      elapsedTime: 0,
    });
  },

  // Next slide
  nextSlide: () => {
    const { service, currentItemIndex } = get();
    if (!service) return;
    
    // Check if current item is a song with multiple slides
    // Note: Song data will be loaded separately by the presenter
    // For now, we'll assume songs have slides that need tracking
    
    // Move to next item (songs will be handled by presenter checking slide count)
    if (currentItemIndex < service.items.length - 1) {
      set({ 
        currentItemIndex: currentItemIndex + 1,
        currentSlideIndex: 0
      });
      console.log('➡️ Next item:', currentItemIndex + 1);
    } else {
      console.log('⚠️ Already at last slide');
    }
  },

  // Previous slide
  previousSlide: () => {
    const { service, currentItemIndex, currentSlideIndex } = get();
    if (!service) return;

    // If not at first slide of current item, go back within item
    if (currentSlideIndex > 0) {
      set({ currentSlideIndex: currentSlideIndex - 1 });
      console.log('⬅️ Previous slide within item:', currentSlideIndex - 1);
      return;
    }
    
    // Move to previous item
    if (currentItemIndex > 0) {
      set({ 
        currentItemIndex: currentItemIndex - 1,
        currentSlideIndex: 0
      });
      console.log('⬅️ Previous item:', currentItemIndex - 1);
    } else {
      console.log('⚠️ Already at first slide');
    }
  },

  // Jump to specific item
  jumpToItem: (itemIndex: number) => {
    const { service } = get();
    if (!service || itemIndex < 0 || itemIndex >= service.items.length) return;
    
    set({ 
      currentItemIndex: itemIndex,
      currentSlideIndex: 0
    });
    console.log('⏭️ Jumped to item:', itemIndex);
  },

  // Toggle blank screen
  toggleBlank: () => {
    const { isBlank } = get();
    set({ isBlank: !isBlank });
    console.log('⬛ Blank screen:', !isBlank);
  },

  // Reset timer
  resetTimer: () => {
    set({ 
      startTime: Date.now(),
      elapsedTime: 0
    });
    console.log('⏱️ Timer reset');
  },

  // Update elapsed time
  updateElapsedTime: () => {
    const { startTime } = get();
    if (startTime) {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      set({ elapsedTime: elapsed });
    }
  },
}));

// Helper function to get next slide info
export function getNextSlideInfo(
  service: Service | null,
  currentItemIndex: number,
  _currentSlideIndex: number
): { nextItem: ServiceItem | null; nextSlideIndex: number } {
  if (!service) return { nextItem: null, nextSlideIndex: 0 };

  // For now, most items are single slides
  // TODO: Handle multi-slide items (songs) when song data is loaded
  
  // Next item
  const nextItem = service.items[currentItemIndex + 1];
  return {
    nextItem: nextItem || null,
    nextSlideIndex: 0
  };
}
