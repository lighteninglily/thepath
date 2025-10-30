import { ArrowLeft, ArrowRight, X, Eye, EyeOff } from 'lucide-react';
import { AdvancedSlidePreview } from '../slides/AdvancedSlidePreview';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';

interface ControlPanelProps {
  slides: Slide[];
  currentSlideIndex: number;
  slideBackgrounds: (BackgroundImage | null)[]; // Array of backgrounds, one per slide
  layouts: LayoutType[];
  isBlank: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onGoTo: (index: number) => void;
  onToggleBlank: () => void;
  onExit: () => void;
}

export function ControlPanel({
  slides,
  currentSlideIndex,
  slideBackgrounds,
  layouts,
  isBlank,
  onNext,
  onPrevious,
  onGoTo,
  onToggleBlank,
  onExit,
}: ControlPanelProps) {
  const currentSlide = slides[currentSlideIndex];
  const nextSlide = slides[currentSlideIndex + 1];
  const currentBackground = slideBackgrounds[currentSlideIndex];
  const nextBackground = slideBackgrounds[currentSlideIndex + 1];

  return (
    <div className="h-screen flex flex-col bg-brand-offWhite">
      {/* Header */}
      <div className="bg-brand-skyBlue text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Presentation Control</h1>
          <p className="text-sm opacity-90">
            Slide {currentSlideIndex + 1} of {slides.length}
          </p>
        </div>
        <button
          onClick={onExit}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          title="Exit Presentation (ESC)"
        >
          <X size={24} />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 bg-white border-b border-brand-warmGray">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentSlideIndex === 0}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-brand-skyBlue text-white
              hover:bg-brand-powderBlue
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all
            "
            title="Previous (←)"
          >
            <ArrowLeft size={20} />
            Previous
          </button>

          <button
            onClick={onToggleBlank}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all
              ${
                isBlank
                  ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                  : 'bg-brand-taupe text-white hover:bg-brand-clay'
              }
            `}
            title="Blank Screen (B)"
          >
            {isBlank ? <Eye size={20} /> : <EyeOff size={20} />}
            {isBlank ? 'Show' : 'Blank'}
          </button>

          <button
            onClick={onNext}
            disabled={currentSlideIndex === slides.length - 1}
            className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-brand-skyBlue text-white
              hover:bg-brand-powderBlue
              disabled:opacity-30 disabled:cursor-not-allowed
              transition-all
            "
            title="Next (→ or Space)"
          >
            Next
            <ArrowRight size={20} />
          </button>
        </div>

        <p className="text-xs text-brand-umber text-center mt-3">
          Use keyboard: <kbd className="px-2 py-1 bg-brand-warmGray rounded">Space</kbd> next,{' '}
          <kbd className="px-2 py-1 bg-brand-warmGray rounded">Backspace</kbd> previous,{' '}
          <kbd className="px-2 py-1 bg-brand-warmGray rounded">B</kbd> blank,{' '}
          <kbd className="px-2 py-1 bg-brand-warmGray rounded">ESC</kbd> exit
        </p>
      </div>

      {/* Preview Section */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Current Slide */}
          <div>
            <h3 className="text-sm font-medium text-brand-charcoal mb-2">
              Current Slide {isBlank && <span className="text-yellow-600">(Blanked)</span>}
            </h3>
            <div className="border-4 border-brand-skyBlue rounded-lg overflow-hidden">
              {isBlank ? (
                <div className="aspect-video bg-black" />
              ) : (
                <AdvancedSlidePreview 
                  slide={currentSlide} 
                  background={currentBackground}
                  layout={layouts[currentSlideIndex]}
                />
              )}
            </div>
          </div>

          {/* Next Slide */}
          <div>
            <h3 className="text-sm font-medium text-brand-charcoal mb-2">
              Next Slide {!nextSlide && <span className="text-brand-umber">(End)</span>}
            </h3>
            <div className="border-2 border-brand-warmGray rounded-lg overflow-hidden opacity-60">
              {nextSlide ? (
                <AdvancedSlidePreview 
                  slide={nextSlide} 
                  background={nextBackground}
                  layout={layouts[currentSlideIndex + 1]}
                />
              ) : (
                <div className="aspect-video bg-brand-warmGray flex items-center justify-center">
                  <p className="text-brand-umber">No more slides</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slide List */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-brand-charcoal mb-3">All Slides</h3>
          <div className="grid grid-cols-4 gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => onGoTo(index)}
                className={`
                  relative rounded-lg overflow-hidden border-2 transition-all
                  ${
                    index === currentSlideIndex
                      ? 'border-brand-skyBlue shadow-lg'
                      : 'border-brand-warmGray hover:border-brand-powderBlue'
                  }
                `}
              >
                <AdvancedSlidePreview 
                  slide={slide} 
                  background={slideBackgrounds[index]}
                  layout={layouts[index]}
                />
                <div className="absolute bottom-1 right-1 px-2 py-0.5 rounded bg-black/60 text-white text-xs">
                  {index + 1}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
