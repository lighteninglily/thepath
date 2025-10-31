import { useState } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Scissors, Merge } from 'lucide-react';
import { AdvancedSlidePreview } from './AdvancedSlidePreview';
import { BackgroundPicker } from '../backgrounds/BackgroundPicker';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';
import { SLIDE_LAYOUTS } from '../../utils/layouts';

interface SlideEditorPanelProps {
  slide: Slide;
  slideIndex: number;
  totalSlides: number;
  background: BackgroundImage | null;
  layout: LayoutType;
  onUpdate: (updates: Partial<Slide>) => void;
  onChangeBackground: (background: BackgroundImage) => void;
  onChangeLayout: (layout: LayoutType) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onSplitSlide: () => void;
  onMergeWithNext: () => void;
}

export function SlideEditorPanel({
  slide,
  slideIndex,
  totalSlides,
  background,
  layout,
  onUpdate,
  onChangeBackground,
  onChangeLayout,
  onNavigate,
  onSplitSlide,
  onMergeWithNext,
}: SlideEditorPanelProps) {
  const [isEditingText, setIsEditingText] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);

  const handleTextChange = (newContent: string) => {
    onUpdate({ content: newContent });
  };

  const lineCount = slide.content.split('\n').length;
  const isLongSlide = lineCount > 6;
  const canMerge = slideIndex < totalSlides - 1;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header with Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Slide {slideIndex + 1} of {totalSlides}
            </h3>
            <p className="text-sm text-gray-500">
              {slide.type === 'title' ? 'Title Slide' :
               slide.type === 'chorus' ? 'Chorus' :
               slide.type === 'bridge' ? 'Bridge' : 'Verse'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              disabled={slideIndex === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700 transition-colors"
              title="Previous slide (←)"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onNavigate('next')}
              disabled={slideIndex === totalSlides - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700 transition-colors"
              title="Next slide (→)"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* Large Preview */}
        <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-lg">
          <div className="aspect-video">
            <AdvancedSlidePreview
              slide={slide}
              background={background}
              layout={layout}
            />
          </div>
        </div>

        {/* Text Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Slide Content {isLongSlide && (
                <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  Long ({lineCount} lines)
                </span>
              )}
            </label>
            {!isEditingText && (
              <button
                onClick={() => setIsEditingText(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit Text
              </button>
            )}
          </div>

          {isEditingText ? (
            <div>
              <textarea
                value={slide.content}
                onChange={(e) => handleTextChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-base font-mono leading-relaxed resize-none"
                rows={8}
                autoFocus
                placeholder="Enter slide text..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                </span>
                <button
                  onClick={() => setIsEditingText(false)}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg
                    hover:bg-blue-700 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
              min-h-[120px] whitespace-pre-wrap text-sm text-gray-700 cursor-pointer
              hover:bg-gray-100 transition-colors"
              onClick={() => setIsEditingText(true)}
            >
              {slide.content || (
                <span className="text-gray-400 italic">Click to add text...</span>
              )}
            </div>
          )}
        </div>

        {/* Layout Selector */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Layout Style
          </label>
          <select
            value={layout}
            onChange={(e) => onChangeLayout(e.target.value as LayoutType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {SLIDE_LAYOUTS.map(l => (
              <option key={l.type} value={l.type}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {/* Background Picker Button */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Background
          </label>
          <button
            onClick={() => setShowBackgroundPicker(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-3
              bg-blue-50 text-blue-700 rounded-lg border-2 border-blue-200
              hover:bg-blue-100 hover:border-blue-300 transition-colors font-medium"
          >
            <ImageIcon size={18} />
            {background ? 'Change Background' : 'Add Background'}
          </button>
        </div>

        {/* Slide Actions */}
        <div className="pt-4 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Slide Actions
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onSplitSlide}
              disabled={lineCount < 2}
              className="flex items-center justify-center gap-2 px-4 py-2
                bg-white border border-gray-300 rounded-lg
                hover:bg-gray-50 transition-colors text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700"
              title="Split this slide into two slides"
            >
              <Scissors size={16} />
              Split Slide
            </button>
            <button
              onClick={onMergeWithNext}
              disabled={!canMerge}
              className="flex items-center justify-center gap-2 px-4 py-2
                bg-white border border-gray-300 rounded-lg
                hover:bg-gray-50 transition-colors text-sm font-medium
                disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700"
              title="Merge with next slide"
            >
              <Merge size={16} />
              Merge Next
            </button>
          </div>
        </div>
      </div>

      {/* Background Picker Modal */}
      {showBackgroundPicker && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Choose Background
              </h3>
              <button
                onClick={() => setShowBackgroundPicker(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <BackgroundPicker
              selectedBackground={background}
              onSelectBackground={(bg) => {
                onChangeBackground(bg);
                setShowBackgroundPicker(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
