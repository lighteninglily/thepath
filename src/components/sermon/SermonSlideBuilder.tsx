import { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
import { SermonSlideNavigator } from './SermonSlideNavigator';
import { SermonSlideEditor } from './SermonSlideEditor';
import { SermonTemplateGallery } from './SermonTemplateGallery';
import { analyzeSlideContent, applyTemplateToContent } from '../../utils/sermonTemplateMatcher';
import { SERMON_TEMPLATES } from '../../config/sermonTemplates';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: any;
  order: number;
  aiFormatted?: boolean;
}

interface SermonSlideBuilderProps {
  sermonTitle?: string;
  initialSlides?: SermonSlide[];
  onSave: (slides: SermonSlide[]) => void;
  onClose: () => void;
  onOpenVisualEditor?: (slide: SermonSlide, index: number) => void;
}

export function SermonSlideBuilder({
  sermonTitle = 'New Sermon',
  initialSlides,
  onSave,
  onClose,
  onOpenVisualEditor,
}: SermonSlideBuilderProps) {
  const [slides, setSlides] = useState<SermonSlide[]>(
    initialSlides || [
      {
        id: `slide-${Date.now()}`,
        content: '',
        order: 0,
      },
    ]
  );
  const [isAutoFormatting, setIsAutoFormatting] = useState(false);
  const [autoFormatTimeouts, setAutoFormatTimeouts] = useState<Map<number, NodeJS.Timeout>>(new Map());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<SermonTemplate | null>(null);

  const currentSlide = slides[currentSlideIndex];

  // Analyze current slide content for template suggestions
  const analysis = currentSlide.content 
    ? analyzeSlideContent(currentSlide.content, currentSlideIndex)
    : null;

  // AI Auto-format function using Electron IPC
  const autoFormatSlide = useCallback(async (content: string, slideIndex: number) => {
    if (!content || content.trim().length < 5) return; // Skip empty/short content
    
    setIsAutoFormatting(true);
    
    try {
      console.log('🤖 AI formatting slide', slideIndex + 1, ':', content.substring(0, 50));
      
      // Use Electron IPC AI API
      const result = await window.electron.ai.formatSermon(content);
      
      if (result.error || !result.templateId) {
        console.warn('❌ AI format error:', result.error || 'No template selected');
        return;
      }
      
      // Find template
      const template = SERMON_TEMPLATES.find(t => t.id === result.templateId);
      if (!template) {
        console.warn('❌ Template not found:', result.templateId);
        return;
      }
      
      console.log('✨ AI selected template:', template.name, '(confidence:', result.confidence, ')');
      console.log('📊 Extracted placeholders:', result.placeholders);
      console.log('💡 Reasoning:', result.reasoning);
      
      // Apply template with AI-extracted placeholders
      const visualData = applyTemplateToContent(template, content, result);
      
      // Update slide
      setSlides(currentSlides => {
        const newSlides = [...currentSlides];
        newSlides[slideIndex] = {
          ...newSlides[slideIndex],
          templateId: template.id,
          visualData,
          aiFormatted: true
        };
        return newSlides;
      });
      
      // Update selected template if it's the current slide
      if (slideIndex === currentSlideIndex) {
        setSelectedTemplate(template);
      }
      
    } catch (error) {
      console.error('❌ AI format error:', error);
    } finally {
      setIsAutoFormatting(false);
    }
  }, [currentSlideIndex]);

  // Update current slide content with AI auto-formatting
  const handleUpdateContent = (content: string) => {
    const newSlides = [...slides];
    newSlides[currentSlideIndex] = { ...currentSlide, content };
    setSlides(newSlides);
    
    // Clear existing timeout for this slide
    const existingTimeout = autoFormatTimeouts.get(currentSlideIndex);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }
    
    // Set new timeout for auto-formatting (800ms debounce)
    const timeout = setTimeout(() => {
      autoFormatSlide(content, currentSlideIndex);
      setAutoFormatTimeouts(prev => {
        const next = new Map(prev);
        next.delete(currentSlideIndex);
        return next;
      });
    }, 800);
    
    setAutoFormatTimeouts(prev => {
      const next = new Map(prev);
      next.set(currentSlideIndex, timeout);
      return next;
    });
  };

  // Navigate between slides
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (direction === 'next' && currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Add new slide
  const handleAddSlide = () => {
    const newSlide: SermonSlide = {
      id: `slide-${Date.now()}`,
      content: '',
      order: slides.length,
    };
    setSlides([...slides, newSlide]);
    setCurrentSlideIndex(slides.length);
  };

  // Duplicate slide
  const handleDuplicateSlide = (index: number) => {
    const slideToDuplicate = slides[index];
    const newSlide: SermonSlide = {
      ...slideToDuplicate,
      id: `slide-${Date.now()}`,
      order: index + 1,
    };

    const newSlides = [
      ...slides.slice(0, index + 1),
      newSlide,
      ...slides.slice(index + 1),
    ];

    setSlides(newSlides);
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

    if (currentSlideIndex >= slides.length - 1) {
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };

  // Reorder slides (drag & drop)
  const handleReorderSlides = (startIndex: number, endIndex: number) => {
    const newSlides = Array.from(slides);
    const [removed] = newSlides.splice(startIndex, 1);
    newSlides.splice(endIndex, 0, removed);

    setSlides(newSlides);
    setCurrentSlideIndex(endIndex);
  };

  // Apply template to current slide
  const handleSelectTemplate = (template: SermonTemplate) => {
    console.log('🎨 Applying template:', template.name, 'to slide', currentSlideIndex + 1);
    setSelectedTemplate(template);
    
    const visualData = applyTemplateToContent(
      template,
      currentSlide.content,
      analysis || undefined
    );

    console.log('📊 Generated visualData:', {
      background: visualData.background,
      elementCount: visualData.elements?.length || 0,
    });

    const newSlides = [...slides];
    newSlides[currentSlideIndex] = {
      ...currentSlide,
      templateId: template.id,
      visualData,
    };
    setSlides(newSlides);
    
    console.log('✅ Template applied. Slide now has:', {
      templateId: template.id,
      hasVisualData: !!visualData,
    });
  };

  // Open Visual Editor for current slide
  const handleOpenVisualEditor = () => {
    if (onOpenVisualEditor && currentSlide.visualData) {
      onOpenVisualEditor(currentSlide, currentSlideIndex);
    }
  };

  // Save sermon
  const handleSave = () => {
    const updatedSlides = slides.map((slide, index) => ({
      ...slide,
      order: index,
    }));

    onSave(updatedSlides);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in textarea
      if (e.target instanceof HTMLTextAreaElement) return;

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
        }
      } else {
        switch (e.key) {
          case 'ArrowLeft':
            e.preventDefault();
            handleNavigate('prev');
            break;
          case 'ArrowRight':
            e.preventDefault();
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
  }, [currentSlideIndex, slides]);

  // Get applied template for current slide
  const appliedTemplate = currentSlide.templateId 
    ? SERMON_TEMPLATES.find(t => t.id === currentSlide.templateId) || null
    : null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[95vw] h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Sermon Builder</h2>
            <p className="text-sm text-gray-600 mt-0.5">{sermonTitle}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              <Save size={18} />
              Save Sermon
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
          <SermonSlideNavigator
            slides={slides}
            currentSlideIndex={currentSlideIndex}
            onSelectSlide={setCurrentSlideIndex}
            onReorderSlides={handleReorderSlides}
            onDuplicateSlide={handleDuplicateSlide}
            onDeleteSlide={handleDeleteSlide}
            onAddSlide={handleAddSlide}
          />

          {/* Center: Slide Editor */}
          <SermonSlideEditor
            slide={currentSlide}
            slideIndex={currentSlideIndex}
            totalSlides={slides.length}
            appliedTemplate={appliedTemplate}
            onUpdateContent={handleUpdateContent}
            onNavigate={handleNavigate}
            onOpenVisualEditor={handleOpenVisualEditor}
            isAutoFormatting={isAutoFormatting}
            onManualReformat={() => autoFormatSlide(currentSlide.content, currentSlideIndex)}
          />

          {/* Right: Template Gallery */}
          <SermonTemplateGallery
            selectedTemplate={selectedTemplate}
            onSelectTemplate={handleSelectTemplate}
          />
        </div>

        {/* Footer Status */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div>
              {slides.length} {slides.length === 1 ? 'slide' : 'slides'}
            </div>
            <div className="text-xs text-gray-500">
              Shortcuts: Ctrl+S Save • Ctrl+N New Slide • Arrow Keys Navigate • Esc Close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
