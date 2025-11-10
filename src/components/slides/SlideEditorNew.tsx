import { useState, useEffect } from 'react';
import { X, Save, Sparkles } from 'lucide-react';
import { SlideNavigator } from './SlideNavigator';
import { SlideEditorPanel } from './SlideEditorPanel';
import { LyricsPanel } from './LyricsPanel';
import { refreshBrandingOnSlides, isBrandingConfigured } from '../../utils/brandProfile';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';

interface SlideEditorNewProps {
  slides: Slide[];
  backgrounds: (BackgroundImage | null)[];
  layouts: LayoutType[];
  onSave: (slides: Slide[], backgrounds: (BackgroundImage | null)[], layouts: LayoutType[]) => void;
  onClose: () => void;
  songTitle?: string;
  songArtist?: string;
}

export function SlideEditorNew({
  slides: initialSlides,
  backgrounds: initialBackgrounds,
  layouts: initialLayouts,
  onSave,
  onClose,
  songTitle = '',
  songArtist = '',
}: SlideEditorNewProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [backgrounds, setBackgrounds] = useState<(BackgroundImage | null)[]>(initialBackgrounds);
  const [layouts, setLayouts] = useState<LayoutType[]>(initialLayouts);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [fullLyrics, setFullLyrics] = useState('');

  // Initialize full lyrics from slides
  useEffect(() => {
    const allText = initialSlides
      .map(slide => slide.content)
      .join('\n\n');
    setFullLyrics(allText);
  }, [initialSlides]);

  const currentSlide = slides[currentSlideIndex];
  const currentBackground = backgrounds[currentSlideIndex];
  const currentLayout = layouts[currentSlideIndex];

  // Update current slide
  const handleUpdateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, ...updates };
    setSlides(newSlides);
  };

  // Navigate between slides
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Change background for current slide
  const handleChangeBackground = (background: BackgroundImage) => {
    console.log('🎨 Changing background for slide', currentSlideIndex + 1, 'to:', background.name);
    const newBackgrounds = [...backgrounds];
    newBackgrounds[currentSlideIndex] = background;
    setBackgrounds(newBackgrounds);
    console.log('✅ Background updated. All backgrounds:', newBackgrounds.map(b => b?.name || 'none'));
  };

  // Change layout for current slide
  const handleChangeLayout = (layout: LayoutType) => {
    const newLayouts = [...layouts];
    newLayouts[currentSlideIndex] = layout;
    setLayouts(newLayouts);
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'custom',
      content: '',
      order: slides.length,
    };
    setSlides([...slides, newSlide]);
    setBackgrounds([...backgrounds, backgrounds[backgrounds.length - 1] || null]);
    setLayouts([...layouts, 'full-bleed']);
    setCurrentSlideIndex(slides.length); // Navigate to new slide
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide: Slide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`,
      order: index + 1,
    };

    const newSlides = [
      ...slides.slice(0, index + 1),
      newSlide,
      ...slides.slice(index + 1),
    ];
    const newBackgrounds = [
      ...backgrounds.slice(0, index + 1),
      backgrounds[index],
      ...backgrounds.slice(index + 1),
    ];
    const newLayouts = [
      ...layouts.slice(0, index + 1),
      layouts[index],
      ...layouts.slice(index + 1),
    ];

    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
    setCurrentSlideIndex(index + 1);
  };

  // Delete slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length === 1) {
      alert('Cannot delete the last slide');
      return;
    }

    if (!confirm('Delete this slide?')) return;

    setSlides(slides.filter((_, i) => i !== index));
    setBackgrounds(backgrounds.filter((_, i) => i !== index));
    setLayouts(layouts.filter((_, i) => i !== index));

    // Adjust current index if needed
    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };

  // Split slide into two
  const handleSplitSlide = () => {
    const lines = currentSlide.content.split('\n');
    if (lines.length < 2) {
      alert('Cannot split a single-line slide');
      return;
    }

    const midPoint = Math.ceil(lines.length / 2);
    const firstHalf = lines.slice(0, midPoint).join('\n');
    const secondHalf = lines.slice(midPoint).join('\n');

    // Update current slide with first half
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, content: firstHalf };

    // Create new slide with second half
    const newSlide: Slide = {
      ...currentSlide,
      id: `slide-${Date.now()}`,
      content: secondHalf,
      order: currentSlideIndex + 1,
    };

    // Insert new slide after current
    const finalSlides = [
      ...newSlides.slice(0, currentSlideIndex + 1),
      newSlide,
      ...newSlides.slice(currentSlideIndex + 1),
    ];

    const finalBackgrounds = [
      ...backgrounds.slice(0, currentSlideIndex + 1),
      backgrounds[currentSlideIndex],
      ...backgrounds.slice(currentSlideIndex + 1),
    ];

    const finalLayouts = [
      ...layouts.slice(0, currentSlideIndex + 1),
      layouts[currentSlideIndex],
      ...layouts.slice(currentSlideIndex + 1),
    ];

    setSlides(finalSlides);
    setBackgrounds(finalBackgrounds);
    setLayouts(finalLayouts);
  };

  // Merge with next slide
  const handleMergeWithNext = () => {
    if (currentSlideIndex >= slides.length - 1) {
      alert('No next slide to merge with');
      return;
    }

    const currentContent = currentSlide.content;
    const nextContent = slides[currentSlideIndex + 1].content;
    const mergedContent = `${currentContent}\n${nextContent}`;

    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, content: mergedContent };

    setSlides(newSlides.filter((_, i) => i !== currentSlideIndex + 1));
    setBackgrounds(backgrounds.filter((_, i) => i !== currentSlideIndex + 1));
    setLayouts(layouts.filter((_, i) => i !== currentSlideIndex + 1));
  };

  // Reorder slides (for drag & drop)
  const handleReorderSlides = (startIndex: number, endIndex: number) => {
    const newSlides = Array.from(slides);
    const [removed] = newSlides.splice(startIndex, 1);
    newSlides.splice(endIndex, 0, removed);

    const newBackgrounds = Array.from(backgrounds);
    const [removedBg] = newBackgrounds.splice(startIndex, 1);
    newBackgrounds.splice(endIndex, 0, removedBg);

    const newLayouts = Array.from(layouts);
    const [removedLayout] = newLayouts.splice(startIndex, 1);
    newLayouts.splice(endIndex, 0, removedLayout);

    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
    setCurrentSlideIndex(endIndex);
  };

  // Paste lyrics to current slide
  const handlePasteToSlide = (text: string) => {
    handleUpdateSlide({ content: text });
  };

  // Update full lyrics (and optionally update slides)
  const handleLyricsChange = (lyrics: string) => {
    setFullLyrics(lyrics);
  };

  // Refresh branding on all slides
  const handleRefreshBranding = () => {
    if (!isBrandingConfigured()) {
      alert('No branding is configured. Please set up your brand settings first.');
      return;
    }
    
    console.log('🔄 Refreshing branding on all slides...');
    const updatedSlides = refreshBrandingOnSlides(slides, 'songs');
    setSlides(updatedSlides);
    console.log('✅ Branding refreshed!');
  };

  // Save changes
  const handleSave = () => {
    console.log('💾 SlideEditorNew - Saving slides...');
    const updatedSlides = slides.map((slide, index) => ({
      ...slide,
      order: index,
    }));

    console.log('📊 Saving', updatedSlides.length, 'slides');
    console.log('🎨 Saving', backgrounds.length, 'backgrounds:', backgrounds.map(b => b?.name || 'none'));
    console.log('📐 Saving', layouts.length, 'layouts');

    onSave(updatedSlides, backgrounds, layouts);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept keyboard events when user is typing in an input field
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'n':
            e.preventDefault();
            handleAddSlide();
            break;
          case 'd':
            e.preventDefault();
            handleDuplicateSlide(currentSlideIndex);
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (currentSlideIndex > 0) {
              handleReorderSlides(currentSlideIndex, currentSlideIndex - 1);
            }
            break;
          case 'ArrowDown':
            e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
              handleReorderSlides(currentSlideIndex, currentSlideIndex + 1);
            }
            break;
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            handleNavigate('prev');
            break;
          case 'ArrowRight':
            handleNavigate('next');
            break;
          case 'Escape':
            onClose();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides, backgrounds, layouts]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Slides</h2>
            {(songTitle || songArtist) && (
              <p className="text-sm text-gray-600 mt-0.5">
                {songTitle} {songArtist && `• ${songArtist}`}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {isBrandingConfigured() && (
              <button
                onClick={handleRefreshBranding}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg
                  hover:bg-purple-700 transition-colors font-medium shadow-sm"
                title="Update all slides with current brand settings"
              >
                <Sparkles size={18} />
                Refresh Branding
              </button>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Save size={18} />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-200 transition-colors"
              title="Close (Esc)"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Slide Navigator */}
          <SlideNavigator
            slides={slides}
            backgrounds={backgrounds}
            layouts={layouts}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={setCurrentSlideIndex}
            onReorderSlides={handleReorderSlides}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onAddSlide={handleAddSlide}
          />

          {/* Center: Slide Editor */}
          {currentSlide && (
            <SlideEditorPanel
              slide={currentSlide}
              slideIndex={currentSlideIndex}
              totalSlides={slides.length}
              background={currentBackground || null}
              layout={currentLayout}
              onUpdate={handleUpdateSlide}
              onChangeBackground={handleChangeBackground}
              onChangeLayout={handleChangeLayout}
              onNavigate={handleNavigate}
              onSplitSlide={handleSplitSlide}
              onMergeWithNext={handleMergeWithNext}
            />
          )}

          {/* Right: Lyrics Panel */}
          <LyricsPanel
            fullLyrics={fullLyrics}
            onLyricsChange={handleLyricsChange}
            onPasteToSlide={handlePasteToSlide}
            currentSlideContent={currentSlide?.content}
          />
        </div>
      </div>
    </div>
  );
}
