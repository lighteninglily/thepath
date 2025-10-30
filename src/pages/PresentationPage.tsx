import { useEffect, useState, useCallback } from 'react';
import { SlidePreview } from '../components/slides/SlidePreview';
import type { Slide, DesignTheme } from '../types';

interface PresentationPageProps {
  slides: Slide[];
  design: DesignTheme | null;
}

export function PresentationPage({ slides, design }: PresentationPageProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBlank, setIsBlank] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, slides.length - 1));
  }, [slides.length]);

  const goToPrevious = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const toggleBlank = useCallback(() => {
    setIsBlank((prev) => !prev);
  }, []);

  // Keyboard shortcuts
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
          // TODO: Exit presentation
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious, toggleBlank]);

  if (slides.length === 0) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <p className="text-white text-2xl">No slides to display</p>
      </div>
    );
  }

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="w-screen h-screen bg-black">
      {isBlank ? (
        <div className="w-full h-full bg-black" />
      ) : (
        <SlidePreview slide={currentSlide} design={design} className="w-full h-full" />
      )}

      {/* Slide Counter (hidden but for debugging) */}
      <div className="absolute bottom-4 right-4 text-white/20 text-sm">
        {currentSlideIndex + 1} / {slides.length}
      </div>
    </div>
  );
}
