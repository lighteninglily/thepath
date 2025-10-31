import { Plus, Copy, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from 'react';

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: any;
  order: number;
}

interface SermonSlideNavigatorProps {
  slides: SermonSlide[];
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  onReorderSlides: (startIndex: number, endIndex: number) => void;
  onDuplicateSlide: (index: number) => void;
  onDeleteSlide: (index: number) => void;
  onAddSlide: () => void;
}

// Sortable Slide Item
interface SortableSlideItemProps {
  slide: SermonSlide;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function SortableSlideItem({
  slide,
  index,
  isActive,
  onSelect,
  onDuplicate,
  onDelete,
}: SortableSlideItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getThumbnailText = (content: string) => {
    const lines = content.split('\n');
    return lines.slice(0, 3).join('\n');
  };

  const getSlideType = (content: string, index: number) => {
    if (index === 0) return 'Title';
    if (/^\d+\./.test(content)) return 'Point';
    if (/\b\d?\s*[A-Z][a-z]+\s+\d+:\d+/i.test(content)) return 'Scripture';
    if (/\?$/.test(content)) return 'Question';
    return 'Slide';
  };

  const slideType = getSlideType(slide.content, index);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative group rounded-lg border-2 transition-all
        ${isDragging ? 'z-50 shadow-2xl scale-105' : ''}
        ${isActive 
          ? 'border-blue-500 bg-white shadow-md ring-2 ring-blue-200' 
          : 'border-gray-200 hover:border-blue-300 bg-white hover:shadow'
        }
      `}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-2 top-1/2 -translate-y-1/2 p-1.5 cursor-grab active:cursor-grabbing
          bg-white rounded-md border-2 border-gray-300 shadow-md
          hover:border-blue-400 hover:bg-blue-50 transition-all z-10"
        title="Drag to reorder"
      >
        <GripVertical size={16} className="text-gray-600" />
      </div>

      {/* Header - Draggable */}
      <div 
        {...attributes}
        {...listeners}
        className="flex items-center justify-between p-2 border-b border-gray-100 cursor-grab active:cursor-grabbing
          hover:bg-blue-50/50 transition-colors"
        title="Drag to reorder"
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
            {index + 1}
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
            slideType === 'Title' ? 'bg-purple-100 text-purple-700' :
            slideType === 'Scripture' ? 'bg-green-100 text-green-700' :
            slideType === 'Point' ? 'bg-blue-100 text-blue-700' :
            slideType === 'Question' ? 'bg-orange-100 text-orange-700' :
            'bg-gray-100 text-gray-700'
          }`}>
            {slideType}
          </span>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="p-1 rounded hover:bg-blue-50 text-blue-600"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
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
        onClick={onSelect}
        className="relative aspect-video overflow-hidden bg-gray-100 cursor-pointer"
      >
        {slide.visualData?.background ? (
          <div 
            className="absolute inset-0"
            style={{
              background: slide.visualData.background.type === 'gradient' 
                ? slide.visualData.background.value
                : slide.visualData.background.type === 'color'
                ? slide.visualData.background.value
                : '#f5f5f0',
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center p-2">
              <p className="text-gray-700 text-[8px] leading-tight text-center line-clamp-3 font-medium">
                {getThumbnailText(slide.content)}
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2 bg-white">
            <p className="text-gray-500 text-[8px] leading-tight text-center line-clamp-3">
              {getThumbnailText(slide.content) || 'Empty slide'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SermonSlideNavigator({
  slides,
  currentSlideIndex,
  onSelectSlide,
  onReorderSlides,
  onDuplicateSlide,
  onDeleteSlide,
  onAddSlide,
}: SermonSlideNavigatorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex(s => s.id === active.id);
      const newIndex = slides.findIndex(s => s.id === over.id);
      onReorderSlides(oldIndex, newIndex);
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeDragSlide = activeId ? slides.find(s => s.id === activeId) : null;
  const activeDragIndex = activeDragSlide ? slides.findIndex(s => s.id === activeId) : -1;

  return (
    <div className="w-56 border-r border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Slides</h3>
        <p className="text-xs text-gray-500 mt-0.5">{slides.length} total</p>
      </div>

      {/* Slide List with Drag & Drop */}
      <div className="flex-1 overflow-y-auto p-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <SortableContext items={slides.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {slides.map((slide, index) => (
                <SortableSlideItem
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={index === currentSlideIndex}
                  onSelect={() => onSelectSlide(index)}
                  onDuplicate={() => onDuplicateSlide(index)}
                  onDelete={() => onDeleteSlide(index)}
                />
              ))}
            </div>
          </SortableContext>

          {/* Drag Overlay */}
          <DragOverlay>
            {activeDragSlide ? (
              <div className="rounded-lg border-2 border-blue-500 bg-white shadow-2xl opacity-90 w-52">
                <div className="flex items-center justify-between p-2 border-b border-gray-100 bg-blue-50">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-600">
                      {activeDragIndex + 1}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-200 text-blue-800 font-medium">
                      Moving...
                    </span>
                  </div>
                </div>
                <div className="aspect-video bg-gray-100 flex items-center justify-center p-2">
                  <p className="text-gray-600 text-[8px] leading-tight text-center line-clamp-3">
                    {activeDragSlide.content.split('\n').slice(0, 3).join('\n')}
                  </p>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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
