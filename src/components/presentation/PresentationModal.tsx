import { useState, useEffect, useCallback } from 'react';
import { ControlPanel } from './ControlPanel';
import { parseLyricsIntoSlides } from '../../utils/lyricsParser';
import { AdvancedSlidePreview } from '../slides/AdvancedSlidePreview';
import { assignRandomLayouts } from '../../utils/layouts';
import { getRandomBackground, WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';
import type { Song } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';

interface PresentationModalProps {
  song: Song;
  onClose: () => void;
}

export function PresentationModal({ song, onClose }: PresentationModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBlank, setIsBlank] = useState(false);

  // Get slides (parse if not already done)
  console.log('🎭 PRESENTATION DEBUG:');
  console.log('  Song:', song.title);
  console.log('  Has slidesData:', !!song.slidesData);
  console.log('  SlidesData length:', song.slidesData?.length || 0);
  if (song.slidesData) {
    song.slidesData.forEach((slide, idx) => {
      console.log(`  Slide ${idx + 1}:`, {
        hasVisualData: !!slide.visualData,
        backgroundId: slide.backgroundId,
        visualDataBg: slide.visualData?.background?.type
      });
    });
  }
  
  const slides = song.slidesData || parseLyricsIntoSlides(song.lyrics, song.title, song.artist || undefined);
  
  // Get or assign background and layouts
  // NEW: Check if slides have embedded background/layout data
  const [slideBackgrounds] = useState<(BackgroundImage | null)[]>(() => {
    return slides.map((slide, index) => {
      // If slide has a backgroundId, find and use it
      if (slide.backgroundId) {
        const bg = WORSHIP_BACKGROUNDS.find(b => b.id === slide.backgroundId);
        if (bg) {
          console.log(`✅ Slide ${index + 1} using saved background:`, bg.name);
          return bg;
        } else {
          // Background ID not found - find replacement by category
          console.warn(`⚠️ Background ${slide.backgroundId} not found, using fallback`);
          if (slide.backgroundId.startsWith('forest-') || slide.backgroundId.startsWith('nature-')) {
            return WORSHIP_BACKGROUNDS.find(b => b.category === 'forest') || null;
          } else if (slide.backgroundId.startsWith('waves-')) {
            return WORSHIP_BACKGROUNDS.find(b => b.category === 'waves') || null;
          } else if (slide.backgroundId.startsWith('mountain-')) {
            return WORSHIP_BACKGROUNDS.find(b => b.category === 'mountains') || null;
          } else if (slide.backgroundId.startsWith('clouds-') || slide.backgroundId.startsWith('sky-')) {
            return WORSHIP_BACKGROUNDS.find(b => b.category === 'clouds') || null;
          }
        }
      }
      // Otherwise use song's default background
      if (song.backgroundId) {
        const bg = WORSHIP_BACKGROUNDS.find(b => b.id === song.backgroundId);
        if (bg) return bg;
      }
      // Last resort: random
      return getRandomBackground();
    });
  });
  
  const [layouts] = useState<LayoutType[]>(() => {
    return slides.map((slide, index) => {
      // If slide has a saved layout, use it
      if (slide.layout) {
        console.log(`✅ Slide ${index + 1} using saved layout:`, slide.layout);
        return slide.layout as LayoutType;
      }
      // Otherwise assign random
      return assignRandomLayouts(1)[0];
    });
  });

  const goToNext = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlideIndex(index);
  }, []);

  const toggleBlank = useCallback(() => {
    setIsBlank((prev) => !prev);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          goToNext();
          break;
        case 'Backspace':
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          goToPrevious();
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          toggleBlank();
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, toggleBlank, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Control Panel (Left Side - 40%) */}
      <div className="w-2/5 border-r border-brand-warmGray">
        <ControlPanel
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          slideBackgrounds={slideBackgrounds}
          layouts={layouts}
          isBlank={isBlank}
          onNext={goToNext}
          onPrevious={goToPrevious}
          onGoTo={goToSlide}
          onToggleBlank={toggleBlank}
          onExit={onClose}
        />
      </div>

      {/* Presentation View (Right Side - 60%) */}
      <div className="flex-1 bg-black flex items-center justify-center">
        {slides.length === 0 ? (
          <p className="text-white text-xl">No slides to display</p>
        ) : isBlank ? (
          <div className="w-full h-full bg-black" />
        ) : (
          <div className="w-full h-full p-8">
            <div className="w-full h-full border-4 border-white/10 rounded-lg overflow-hidden">
              <AdvancedSlidePreview
                slide={slides[currentSlideIndex]}
                background={slideBackgrounds[currentSlideIndex]}
                layout={layouts[currentSlideIndex]}
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Song Info Overlay - Make More Prominent */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-2xl">
          <p className="text-xl font-bold tracking-wide">
            {song.title}
          </p>
          {song.artist && (
            <p className="text-sm opacity-90 text-center mt-1">
              {song.artist}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
