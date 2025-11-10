import { useState, useRef } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { SlideNavigator } from '../slides/SlideNavigator';
import { SlideEditorPanel } from '../slides/SlideEditorPanel';
import { SermonDesignToolbar } from './SermonDesignToolbar';
import { applyDesignToSlide, applyDesignToAllSlides, extractDesignFromSlide } from '../../utils/sermonDesignApplier';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';
import type { SermonDesignCustomization } from '../../utils/sermonDesignApplier';

interface SermonSlideEditorProps {
  slides: Slide[];
  backgrounds: (BackgroundImage | null)[];
  layouts: LayoutType[];
  sermonNotes: string;
  onSave: (slides: Slide[], backgrounds: (BackgroundImage | null)[], layouts: LayoutType[]) => void;
  onClose: () => void;
  sermonTitle?: string;
}

export function SermonSlideEditor({
  slides: initialSlides,
  backgrounds: initialBackgrounds,
  layouts: initialLayouts,
  sermonNotes,
  onSave,
  onClose,
  sermonTitle = 'Sermon',
}: SermonSlideEditorProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [backgrounds, setBackgrounds] = useState<(BackgroundImage | null)[]>(initialBackgrounds);
  const [layouts, setLayouts] = useState<LayoutType[]>(initialLayouts);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Design state
  const [currentDesignId, setCurrentDesignId] = useState('classic');
  const [globalDesignMode, setGlobalDesignMode] = useState(false);
  const [designCustomizations, setDesignCustomizations] = useState<SermonDesignCustomization>({});

  const currentSlide = slides[currentSlideIndex];
  const currentBackground = backgrounds[currentSlideIndex];
  const currentLayout = layouts[currentSlideIndex];
  
  // Extract current design from slide
  const currentSlideDesign = currentSlide ? extractDesignFromSlide(currentSlide) : {};
  
  // Track if we're currently editing to prevent re-applying design during typing
  const isEditingRef = useRef(false);
  const editTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const designUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update current slide
  const handleUpdateSlide = (updates: Partial<Slide>) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, ...updates };
    setSlides(newSlides);
    
    // If content changed and slide has visualData, re-apply design after user stops typing
    if (updates.content !== undefined && currentSlide.visualData && currentSlide.type === 'custom') {
      isEditingRef.current = true;
      
      // Clear existing timeout
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
      
      // Re-apply design after 500ms of no typing (debounced)
      editTimeoutRef.current = setTimeout(() => {
        const slideToUpdate = { ...currentSlide, ...updates };
        const updatedSlide = applyDesignToSlide(slideToUpdate, currentDesignId, designCustomizations);
        const finalSlides = [...newSlides];
        finalSlides[currentSlideIndex] = updatedSlide;
        setSlides(finalSlides);
        isEditingRef.current = false;
      }, 500);
    }
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
      id: crypto.randomUUID(),
      content: '',
      type: 'custom',
      order: slides.length,
    };
    setSlides([...slides, newSlide]);
    setBackgrounds([...backgrounds, null]);
    setLayouts([...layouts, 'left-top' as LayoutType]);
    setCurrentSlideIndex(slides.length);
  };

  // Delete specific slide
  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return; // Keep at least one slide
    
    const newSlides = slides.filter((_, i) => i !== index);
    const newBackgrounds = backgrounds.filter((_, i) => i !== index);
    const newLayouts = layouts.filter((_, i) => i !== index);
    
    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
    
    // Adjust current index
    if (currentSlideIndex >= newSlides.length) {
      setCurrentSlideIndex(newSlides.length - 1);
    } else if (currentSlideIndex > index) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const newSlide: Slide = {
      ...slideToClone,
      id: crypto.randomUUID(),
      order: index + 1,
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, newSlide);
    
    const newBackgrounds = [...backgrounds];
    newBackgrounds.splice(index + 1, 0, backgrounds[index]);
    
    const newLayouts = [...layouts];
    newLayouts.splice(index + 1, 0, layouts[index]);
    
    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
    setCurrentSlideIndex(index + 1);
  };

  // Reorder slides
  const handleReorderSlides = (startIndex: number, endIndex: number) => {
    const newSlides = [...slides];
    const newBackgrounds = [...backgrounds];
    const newLayouts = [...layouts];
    
    const [movedSlide] = newSlides.splice(startIndex, 1);
    const [movedBg] = newBackgrounds.splice(startIndex, 1);
    const [movedLayout] = newLayouts.splice(startIndex, 1);
    
    newSlides.splice(endIndex, 0, movedSlide);
    newBackgrounds.splice(endIndex, 0, movedBg);
    newLayouts.splice(endIndex, 0, movedLayout);
    
    // Update order property
    newSlides.forEach((slide, idx) => {
      slide.order = idx;
    });
    
    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
    setCurrentSlideIndex(endIndex);
  };

  // Split slide
  const handleSplitSlide = () => {
    const content = currentSlide.content || '';
    const midpoint = Math.floor(content.length / 2);
    const splitPoint = content.lastIndexOf(' ', midpoint);
    
    if (splitPoint === -1) return; // Can't split
    
    const firstPart = content.substring(0, splitPoint).trim();
    const secondPart = content.substring(splitPoint).trim();
    
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, content: firstPart };
    
    const newSlide: Slide = {
      ...currentSlide,
      id: crypto.randomUUID(),
      content: secondPart,
      order: currentSlideIndex + 1,
    };
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    
    const newBackgrounds = [...backgrounds];
    newBackgrounds.splice(currentSlideIndex + 1, 0, backgrounds[currentSlideIndex]);
    
    const newLayouts = [...layouts];
    newLayouts.splice(currentSlideIndex + 1, 0, layouts[currentSlideIndex]);
    
    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
  };

  // Merge with next slide
  const handleMergeWithNext = () => {
    if (currentSlideIndex >= slides.length - 1) return; // No next slide
    
    const mergedContent = `${currentSlide.content || ''}\n\n${slides[currentSlideIndex + 1].content || ''}`.trim();
    
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, content: mergedContent };
    newSlides.splice(currentSlideIndex + 1, 1);
    
    const newBackgrounds = backgrounds.filter((_, i) => i !== currentSlideIndex + 1);
    const newLayouts = layouts.filter((_, i) => i !== currentSlideIndex + 1);
    
    setSlides(newSlides);
    setBackgrounds(newBackgrounds);
    setLayouts(newLayouts);
  };

  // Jump to specific slide
  const handleSelectSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // Design handlers
  const handleSelectDesign = (designId: string) => {
    console.log('🎨 handleSelectDesign called:', {
      designId,
      globalDesignMode,
      totalSlides: slides.length,
      currentSlideIndex
    });
    
    setCurrentDesignId(designId);
    
    if (globalDesignMode) {
      // Apply to all slides
      console.log('🌍 Global mode: Applying to all slides');
      const updatedSlides = applyDesignToAllSlides(slides, designId, designCustomizations);
      console.log('📝 Setting updated slides:', updatedSlides.length);
      setSlides(updatedSlides);
    } else {
      // Apply to current slide only
      console.log('📄 Single slide mode: Applying to current slide only');
      const updatedSlide = applyDesignToSlide(currentSlide, designId, designCustomizations);
      const newSlides = [...slides];
      newSlides[currentSlideIndex] = updatedSlide;
      setSlides(newSlides);
    }
  };
  
  const handleChangeBackgroundColor = (color: string) => {
    const newCustomizations = { ...designCustomizations, backgroundColor: color };
    setDesignCustomizations(newCustomizations);
    
    // Debounce design application (especially important for global mode)
    if (designUpdateTimeoutRef.current) {
      clearTimeout(designUpdateTimeoutRef.current);
    }
    
    designUpdateTimeoutRef.current = setTimeout(() => {
      if (globalDesignMode) {
        console.log('🌍 Applying color change to all slides (debounced)');
        const updatedSlides = applyDesignToAllSlides(slides, currentDesignId, newCustomizations);
        setSlides(updatedSlides);
      } else {
        const updatedSlide = applyDesignToSlide(currentSlide, currentDesignId, newCustomizations);
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = updatedSlide;
        setSlides(newSlides);
      }
    }, 300); // 300ms debounce for smoother interaction
  };
  
  const handleChangeFontSize = (type: 'title' | 'body' | 'scripture', size: number) => {
    const newCustomizations = { ...designCustomizations };
    if (type === 'title') newCustomizations.titleFontSize = size;
    if (type === 'body') newCustomizations.bodyFontSize = size;
    if (type === 'scripture') newCustomizations.scriptureFontSize = size;
    setDesignCustomizations(newCustomizations);
    
    // Debounce design application (especially important for global mode)
    if (designUpdateTimeoutRef.current) {
      clearTimeout(designUpdateTimeoutRef.current);
    }
    
    designUpdateTimeoutRef.current = setTimeout(() => {
      if (globalDesignMode) {
        console.log('🌍 Applying font size change to all slides (debounced)');
        const updatedSlides = applyDesignToAllSlides(slides, currentDesignId, newCustomizations);
        setSlides(updatedSlides);
      } else {
        const updatedSlide = applyDesignToSlide(currentSlide, currentDesignId, newCustomizations);
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = updatedSlide;
        setSlides(newSlides);
      }
    }, 300); // 300ms debounce for smoother slider interaction
  };
  
  const handleChangeFontFamily = (titleFont: string, bodyFont: string) => {
    const newCustomizations = {
      ...designCustomizations,
      titleFontFamily: titleFont,
      bodyFontFamily: bodyFont
    };
    setDesignCustomizations(newCustomizations);
    
    // Debounce design application (especially important for global mode)
    if (designUpdateTimeoutRef.current) {
      clearTimeout(designUpdateTimeoutRef.current);
    }
    
    designUpdateTimeoutRef.current = setTimeout(() => {
      if (globalDesignMode) {
        console.log('🌍 Applying font family change to all slides (debounced)');
        const updatedSlides = applyDesignToAllSlides(slides, currentDesignId, newCustomizations);
        setSlides(updatedSlides);
      } else {
        const updatedSlide = applyDesignToSlide(currentSlide, currentDesignId, newCustomizations);
        const newSlides = [...slides];
        newSlides[currentSlideIndex] = updatedSlide;
        setSlides(newSlides);
      }
    }, 300); // 300ms debounce
  };

  const handleSave = () => {
    console.log('💾 Saving sermon slides:', slides.length);
    onSave(slides, backgrounds, layouts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Slides</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {sermonTitle}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
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

        {/* Design Toolbar */}
        <SermonDesignToolbar
          currentDesignId={currentDesignId}
          onSelectDesign={handleSelectDesign}
          onChangeBackgroundColor={handleChangeBackgroundColor}
          onChangeFontSize={handleChangeFontSize}
          onChangeFontFamily={handleChangeFontFamily}
          globalMode={globalDesignMode}
          onToggleGlobalMode={setGlobalDesignMode}
          currentBackgroundColor={currentSlideDesign.backgroundColor || designCustomizations.backgroundColor}
          currentTitleSize={currentSlideDesign.titleFontSize || designCustomizations.titleFontSize}
          currentBodySize={currentSlideDesign.bodyFontSize || designCustomizations.bodyFontSize}
          currentScriptureSize={currentSlideDesign.scriptureFontSize || designCustomizations.scriptureFontSize}
        />

        {/* 3-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Slide Navigator */}
          <SlideNavigator
            slides={slides}
            backgrounds={backgrounds}
            layouts={layouts}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={handleSelectSlide}
            onAddSlide={handleAddSlide}
            onDeleteSlide={handleDeleteSlide}
            onDuplicateSlide={handleDuplicateSlide}
            onReorderSlides={handleReorderSlides}
          />

          {/* Center: Slide Editor */}
          {currentSlide && (
            <SlideEditorPanel
            slide={currentSlide}
            slideIndex={currentSlideIndex}
            totalSlides={slides.length}
            background={currentBackground}
            layout={currentLayout}
            onUpdate={handleUpdateSlide}
            onNavigate={handleNavigate}
            onChangeBackground={handleChangeBackground}
            onChangeLayout={handleChangeLayout}
            onSplitSlide={handleSplitSlide}
            onMergeWithNext={handleMergeWithNext}
          />
          )}

          {/* Right: Sermon Notes Panel */}
          <div className="w-96 bg-white border-l border-gray-300 flex flex-col overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <FileText size={18} />
                Original Sermon Notes
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Copy and paste content from here to your slides
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                {sermonNotes}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
