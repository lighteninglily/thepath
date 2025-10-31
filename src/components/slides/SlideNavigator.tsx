import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';

interface SlideNavigatorProps {
  slides: Slide[];
  backgrounds: (BackgroundImage | null)[];
  layouts: LayoutType[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onAddSlide: () => void;
}

export function SlideNavigator({
  slides,
  backgrounds,
  currentSlideIndex,
  onSelectSlide,
  onDuplicateSlide,
  onDeleteSlide,
  onAddSlide,
}: SlideNavigatorProps) {
  
  const getSlideLabel = (slide: Slide, index: number) => {
    if (index === 0 && slide.type === 'title') return 'Title';
    if (slide.type === 'chorus') return 'Chorus';
    if (slide.type === 'bridge') return 'Bridge';
    return 'Verse';
  };

  const getThumbnailText = (content: string) => {
    const lines = content.split('\n');
    return lines.slice(0, 3).join('\n');
  };

  return (
    <div className="w-56 border-r border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Slides</h3>
        <p className="text-xs text-gray-500 mt-0.5">{slides.length} total</p>
      </div>

      {/* Slide List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {slides.map((slide, index) => {
          const isActive = index === currentSlideIndex;
          const background = backgrounds[index];
          
          return (
            <div
              key={slide.id}
              onClick={() => onSelectSlide(index)}
              className={`
                relative group cursor-pointer rounded-lg border-2 transition-all
                ${isActive 
                  ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-200' 
                  : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow'
                }
              `}
            >
              {/* Drag Handle */}
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical size={16} className="text-gray-400 cursor-grab active:cursor-grabbing" />
              </div>

              {/* Slide Number & Type */}
              <div className="flex items-center justify-between p-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {index + 1}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    slide.type === 'title' ? 'bg-purple-100 text-purple-700' :
                    slide.type === 'chorus' ? 'bg-green-100 text-green-700' :
                    slide.type === 'bridge' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {getSlideLabel(slide, index)}
                  </span>
                </div>
                
                {/* Quick Actions (show on hover) */}
                <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateSlide(index);
                    }}
                    className="p-1 rounded hover:bg-blue-50 text-blue-600"
                    title="Duplicate"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSlide(index);
                    }}
                    className="p-1 rounded hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Thumbnail Preview */}
              <div 
                className="relative aspect-video overflow-hidden bg-gray-900"
                style={{
                  backgroundImage: background?.url ? `url(${background.url})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {/* Overlay for readability */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Text Preview */}
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  <p className="text-white text-[8px] leading-tight text-center line-clamp-3 font-medium">
                    {getThumbnailText(slide.content)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Slide Button */}
      <div className="p-2 border-t border-gray-200">
        <button
          onClick={onAddSlide}
          className="w-full flex items-center justify-center gap-2 p-2 
            border-2 border-dashed border-gray-300 rounded-lg
            hover:border-blue-400 hover:bg-blue-50 transition-colors
            text-gray-600 hover:text-blue-600 text-sm font-medium"
        >
          <Plus size={16} />
          New Slide
        </button>
      </div>
    </div>
  );
}
