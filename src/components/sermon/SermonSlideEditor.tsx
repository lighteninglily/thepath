import { useState } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, Eye } from 'lucide-react';
import { VisualCanvas } from '../designer/VisualCanvas';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: any;
  order: number;
}

interface SermonSlideEditorProps {
  slide: SermonSlide;
  slideIndex: number;
  totalSlides: number;
  appliedTemplate: SermonTemplate | null;
  suggestedTemplates?: SermonTemplate[];
  onUpdateContent: (content: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onAIPickTemplate: () => void;
  onOpenVisualEditor: () => void;
}

export function SermonSlideEditor({
  slide,
  slideIndex,
  totalSlides,
  appliedTemplate,
  suggestedTemplates = [],
  onUpdateContent,
  onNavigate,
  onAIPickTemplate,
  onOpenVisualEditor,
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
                  <VisualCanvas
                    slide={{
                      id: slide.id,
                      content: slide.content,
                      order: slideIndex,
                      elements: slide.visualData?.elements || [],
                      background: slide.visualData?.background || { type: 'color', value: '#000000' },
                      aspectRatio: '16:9' as const,
                      padding: { top: 0, right: 0, bottom: 0, left: 0 },
                      isVisualMode: true,
                      templateId: slide.templateId,
                    }}
                    selectedElementId={null}
                    onSelectElement={() => {}}
                    onUpdateElement={() => {}}
                  />
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
            <div>
              <textarea
                value={slide.content}
                onChange={(e) => onUpdateContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  text-base leading-relaxed resize-none font-mono"
                rows={8}
                autoFocus
                placeholder="Type your content here...

Examples:
- Title slide: Sermon Title
- Scripture: John 3:16 For God so loved...
- Point: 1. First Main Point"
              />
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
            {/* AI Suggest Button */}
            {suggestedTemplates.length > 0 && (
              <button
                onClick={onAIPickTemplate}
                className="flex items-center justify-center gap-2 px-4 py-3
                  bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
                  hover:from-purple-700 hover:to-blue-700 transition-all
                  shadow-md hover:shadow-lg font-medium"
              >
                <Sparkles size={18} />
                AI Suggest
              </button>
            )}

            {/* Visual Editor Button */}
            <button
              onClick={onOpenVisualEditor}
              disabled={!hasTemplate}
              className="flex items-center justify-center gap-2 px-4 py-3
                bg-white border-2 border-blue-500 text-blue-600 rounded-lg
                hover:bg-blue-50 transition-colors font-medium
                disabled:opacity-40 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              title={!hasTemplate ? "Apply a template first" : "Open Visual Editor"}
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
