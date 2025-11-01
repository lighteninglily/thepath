import { useState } from 'react';
import { ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react';
import { VisualCanvas } from '../designer/VisualCanvas';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: any;
  order: number;
  aiFormatted?: boolean;
}

interface SermonSlideEditorProps {
  slide: SermonSlide;
  slideIndex: number;
  totalSlides: number;
  appliedTemplate: SermonTemplate | null;
  onUpdateContent: (content: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onOpenVisualEditor: () => void;
  isAutoFormatting?: boolean;
  onManualReformat?: () => void;
}

export function SermonSlideEditor({
  slide,
  slideIndex,
  totalSlides,
  appliedTemplate,
  onUpdateContent,
  onNavigate,
  onOpenVisualEditor,
  isAutoFormatting = false,
  onManualReformat,
}: SermonSlideEditorProps) {
  const [isEditing, setIsEditing] = useState(false);

  const lineCount = slide.content.split('\n').length;
  const hasTemplate = !!appliedTemplate;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header with Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Slide {slideIndex + 1} of {totalSlides}
            </h3>
            {appliedTemplate && (
              <p className="text-sm text-gray-500 mt-0.5">
                Template: {appliedTemplate.name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              disabled={slideIndex === 0}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700 transition-colors"
              title="Previous slide (Left Arrow)"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => onNavigate('next')}
              disabled={slideIndex === totalSlides - 1}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed
                text-gray-700 transition-colors"
              title="Next slide (Right Arrow)"
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
          <div className="aspect-video bg-gray-50 flex items-center justify-center">
            {hasTemplate && slide.visualData ? (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <div className="w-full max-w-5xl aspect-video">
                  {(() => {
                    // Convert percentage-based template coordinates to pixel-based for VisualCanvas
                    const canvasWidth = 1920;
                    const canvasHeight = 1080;
                    
                    const convertedElements = (slide.visualData?.elements || [])
                      .filter((el: any) => {
                        // Skip elements with empty/placeholder content
                        const content = el.content || '';
                        return content && content !== 'Empty text' && !content.includes('{{');
                      })
                      .map((el: any) => {
                      // Template uses percentages (0-100), convert to pixels
                      const position = {
                        x: (el.x / 100) * canvasWidth,
                        y: (el.y / 100) * canvasHeight,
                      };
                      const size = {
                        width: (el.width / 100) * canvasWidth,
                        height: (el.height / 100) * canvasHeight,
                      };
                      
                      return {
                        id: el.id,
                        type: el.type,
                        content: el.content,
                        position,
                        size,
                        rotation: el.rotation || 0,
                        opacity: el.style?.opacity !== undefined ? el.style.opacity : 1,
                        zIndex: el.zIndex,
                        locked: false,
                        visible: true,
                        style: {
                          fontSize: el.style?.fontSize || 48,
                          fontFamily: el.style?.fontFamily || 'Inter',
                          fontWeight: el.style?.fontWeight || 400,
                          color: el.style?.color || '#FFFFFF',
                          textAlign: el.style?.textAlign || 'center',
                          backgroundColor: el.style?.backgroundColor || 'transparent',
                          borderRadius: el.style?.borderRadius || 0,
                          padding: el.style?.padding || 0,
                          lineHeight: el.style?.lineHeight || 1.2,
                          letterSpacing: el.style?.letterSpacing || 0,
                          textTransform: el.style?.textTransform || 'none',
                        },
                      };
                    });
                    
                    // Convert background format
                    const originalBg = slide.visualData?.background;
                    let convertedBackground: any;
                    
                    if (!originalBg) {
                      console.error('❌ PREVIEW: No background in visualData!');
                      convertedBackground = {
                        type: 'solid',
                        color: '#E8E3DC', // Default to beige, not black
                      };
                    } else if (originalBg.type === 'gradient' && originalBg.value) {
                      // Sermon template format: { type: 'gradient', value: 'linear-gradient(...)' }
                      console.log('✅ PREVIEW: Converting gradient:', originalBg.value);
                      convertedBackground = {
                        type: 'gradient',
                        gradient: originalBg.value,
                      };
                    } else if (originalBg.type === 'color' && originalBg.value) {
                      console.log('✅ PREVIEW: Converting color:', originalBg.value);
                      convertedBackground = {
                        type: 'solid',
                        color: originalBg.value,
                      };
                    } else if (originalBg.type === 'gradient' && originalBg.gradient) {
                      // Already in visual editor format
                      console.log('✅ PREVIEW: Already in editor format');
                      convertedBackground = originalBg;
                    } else if (originalBg.type === 'solid' && originalBg.color) {
                      // Already in visual editor format
                      console.log('✅ PREVIEW: Already in editor format (solid)');
                      convertedBackground = originalBg;
                    } else {
                      console.warn('⚠️ PREVIEW: Unknown background format:', originalBg);
                      convertedBackground = originalBg;
                    }
                    
                    console.log('🎨 SERMON PREVIEW - Rendering slide:', {
                      hasTemplate,
                      templateId: slide.templateId,
                      originalBackground: originalBg,
                      convertedBackground,
                      originalElements: slide.visualData?.elements,
                      convertedElements,
                    });
                    
                    return (
                      <VisualCanvas
                        slide={{
                          id: slide.id,
                          content: slide.content,
                          order: slideIndex,
                          elements: convertedElements,
                          background: convertedBackground,
                          aspectRatio: '16:9' as const,
                          padding: { top: 0, right: 0, bottom: 0, left: 0 },
                          isVisualMode: true,
                          templateId: slide.templateId,
                        }}
                        selectedElementId={null}
                        onSelectElement={() => {}}
                        onUpdateElement={() => {}}
                      />
                    );
                  })()}
                </div>
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-gray-400 text-sm mb-2">No template applied</p>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {slide.content || 'Type content below'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Content Editor */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Slide Content
              {lineCount > 8 && (
                <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                  {lineCount} lines (consider splitting)
                </span>
              )}
            </label>
            {!isEditing && slide.content && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Edit
              </button>
            )}
          </div>

          {isEditing || !slide.content ? (
            <div className="relative">
              <textarea
                value={slide.content}
                onChange={(e) => onUpdateContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-base leading-relaxed resize-none font-mono"
                rows={8}
                autoFocus
                placeholder="Type your content... (AI will format automatically)

Examples:
- Title slide: Sermon Title
- Scripture: John 3:16 For God so loved...
- Point: 1. First Main Point"
              />
              
              {/* AI Formatting Indicators */}
              {isAutoFormatting && (
                <div className="absolute top-2 right-2 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-xs">AI formatting...</span>
                </div>
              )}
              
              {slide.aiFormatted && !isAutoFormatting && (
                <div 
                  className="absolute top-2 right-2 flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
                  title="AI automatically selected template and formatted your slide"
                >
                  <Sparkles size={12} />
                  AI Formatted
                </div>
              )}
              
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-gray-500">
                  {lineCount} {lineCount === 1 ? 'line' : 'lines'}
                </span>
                {isEditing && slide.content && (
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg
                      hover:bg-blue-700 transition-colors"
                  >
                    Done
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg
              min-h-[120px] whitespace-pre-wrap text-sm text-gray-700 cursor-pointer
              hover:bg-gray-100 transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {slide.content}
            </div>
          )}
        </div>

        {/* Template Actions */}
        <div className="pt-4 border-t border-gray-200">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Template & Design
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Manual Reformat Button */}
            {onManualReformat && (
              <button
                onClick={onManualReformat}
                disabled={!slide.content || isAutoFormatting}
                className="flex items-center justify-center gap-2 px-4 py-3
                  bg-blue-600 text-white rounded-lg
                  hover:bg-blue-700 transition-colors font-medium
                  disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400"
                title={!slide.content ? "Type content first" : "Reformat with AI"}
              >
                <Sparkles size={18} />
                Reformat
              </button>
            )}
            
            {/* Visual Editor Button */}
            <button
              onClick={onOpenVisualEditor}
              disabled={!hasTemplate}
              className={`flex items-center justify-center gap-2 px-4 py-3
                bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 transition-colors font-medium
                disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-gray-400
                ${!onManualReformat ? 'col-span-2' : ''}`}
              title={!hasTemplate ? "Select a template first" : "Open Visual Editor"}
            >
              <Eye size={18} />
              Customize
            </button>
          </div>

          {!hasTemplate && slide.content && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                Select a template from the right panel to design this slide
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
