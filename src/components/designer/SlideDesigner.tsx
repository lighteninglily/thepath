/**
 * Slide Designer - Main visual editor component
 * 
 * Canva-style editor for creating and editing slides visually.
 * Phase 1: Basic canvas with text element positioning
 */

import { useState, useCallback, useEffect } from 'react';
import { X, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { VisualSlide, VisualElement, TextElement } from '../../types/designer';
import { VisualCanvas } from './VisualCanvas';
import { createDefaultTextElement, sortElementsByZIndex } from '../../utils/slideConverter';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';
import type { BackgroundImage } from '../../assets/backgrounds';

interface SlideDesignerProps {
  slides: VisualSlide[];
  initialSlideIndex?: number;
  onSave: (slides: VisualSlide[]) => void;
  onClose: () => void;
}

export function SlideDesigner({ slides: initialSlides, initialSlideIndex = 0, onSave, onClose }: SlideDesignerProps) {
  const [slides, setSlides] = useState<VisualSlide[]>(initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  
  const currentSlide = slides[currentSlideIndex];
  
  // Get selected element
  const selectedElement = currentSlide.elements.find((el) => el.id === selectedElementId) || null;
  
  // Update element
  const handleUpdateElement = useCallback(
    (elementId: string, updates: Partial<VisualElement>) => {
      setSlides((prevSlides) => 
        prevSlides.map((slide, idx) => 
          idx === currentSlideIndex
            ? {
                ...slide,
                elements: slide.elements.map((el) =>
                  el.id === elementId ? { ...el, ...updates } : el
                ),
              }
            : slide
        )
      );
    },
    [currentSlideIndex]
  );
  
  // Add new text element
  const handleAddText = () => {
    const newElement = createDefaultTextElement('New Text');
    setSlides((prevSlides) =>
      prevSlides.map((slide, idx) =>
        idx === currentSlideIndex
          ? { ...slide, elements: [...slide.elements, newElement] }
          : slide
      )
    );
    setSelectedElementId(newElement.id);
  };
  
  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    
    setSlides((prevSlides) =>
      prevSlides.map((slide, idx) =>
        idx === currentSlideIndex
          ? { ...slide, elements: slide.elements.filter((el) => el.id !== selectedElementId) }
          : slide
      )
    );
    setSelectedElementId(null);
  };
  
  // Update selected text element content
  const handleUpdateTextContent = (content: string) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    handleUpdateElement(selectedElementId!, { content });
  };
  
  // Update text style
  const handleUpdateTextStyle = (styleUpdates: Partial<TextElement['style']>) => {
    if (!selectedElement || selectedElement.type !== 'text') return;
    
    const textElement = selectedElement as TextElement;
    handleUpdateElement(selectedElementId!, {
      style: { ...textElement.style, ...styleUpdates },
    });
  };
  
  // Update background
  const handleUpdateBackground = (background: BackgroundImage) => {
    console.log('🎨 VISUAL EDITOR: Changing background to', background.name);
    setSlides((prevSlides) =>
      prevSlides.map((slide, idx) =>
        idx === currentSlideIndex
          ? {
              ...slide,
              background: {
                type: 'image' as const,
                imageUrl: background.id,
              },
            }
          : slide
      )
    );
  };
  
  // Navigation
  const handlePreviousSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
      setSelectedElementId(null);
    }
  }, [currentSlideIndex]);
  
  const handleNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
      setSelectedElementId(null);
    }
  }, [currentSlideIndex, slides.length]);
  
  // Save and close
  const handleSave = () => {
    onSave(slides);
    onClose();
  };
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Arrow keys for navigation (only if not typing in an input)
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePreviousSlide();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, slides.length]);
  
  return (
    <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col">
      {/* Top Bar */}
      <div className="h-16 bg-slate-800 border-b border-slate-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Visual Slide Editor</h2>
          
          {/* Slide Navigation */}
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={handlePreviousSlide}
              disabled={currentSlideIndex === 0}
              className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <div className="text-sm text-slate-300 min-w-[100px] text-center">
              Slide {currentSlideIndex + 1} of {slides.length}
            </div>
            
            <button
              onClick={handleNextSlide}
              disabled={currentSlideIndex === slides.length - 1}
              className="p-2 text-slate-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              title="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <button
            onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
            className="px-3 py-1 text-sm text-slate-300 hover:text-white"
          >
            −
          </button>
          <span className="text-sm text-slate-300 w-16 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(Math.min(2, zoom + 0.25))}
            className="px-3 py-1 text-sm text-slate-300 hover:text-white"
          >
            +
          </button>
          
          <div className="w-px h-6 bg-slate-600 mx-2" />
          
          {/* Save & Close */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        <div className="w-64 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Add Elements</h3>
              <button
                onClick={handleAddText}
                className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-md text-sm"
              >
                + Add Text
              </button>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Background</h3>
              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                {WORSHIP_BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleUpdateBackground(bg)}
                    className={`relative aspect-video rounded overflow-hidden border-2 transition-all ${
                      currentSlide.background.type === 'image' && currentSlide.background.imageUrl === bg.id
                        ? 'border-blue-500 ring-2 ring-blue-400'
                        : 'border-transparent hover:border-slate-500'
                    }`}
                    title={bg.name}
                  >
                    <img 
                      src={bg.url} 
                      alt={bg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Layers</h3>
              <div className="space-y-1">
                {sortElementsByZIndex(currentSlide.elements).map((element) => (
                  <div
                    key={element.id}
                    onClick={() => setSelectedElementId(element.id)}
                    className={`px-3 py-2 rounded cursor-pointer text-sm ${
                      element.id === selectedElementId
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {element.type === 'text'
                      ? (element as TextElement).content.substring(0, 20) || 'Empty text'
                      : element.type}
                  </div>
                ))}
                {currentSlide.elements.length === 0 && (
                  <div className="text-sm text-slate-500 text-center py-4">
                    No elements yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Center - Canvas */}
        <VisualCanvas
          slide={currentSlide}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          zoom={zoom}
        />
        
        {/* Right Sidebar - Properties */}
        <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
          {selectedElement ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300">Properties</h3>
                <button
                  onClick={handleDeleteElement}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs"
                >
                  Delete
                </button>
              </div>
              
              {selectedElement.type === 'text' && (
                <TextElementProperties
                  element={selectedElement as TextElement}
                  onUpdateContent={handleUpdateTextContent}
                  onUpdateStyle={handleUpdateTextStyle}
                  onUpdatePosition={(position) =>
                    handleUpdateElement(selectedElementId!, { position })
                  }
                  onUpdateSize={(size) =>
                    handleUpdateElement(selectedElementId!, { size })
                  }
                />
              )}
            </div>
          ) : (
            <div className="text-sm text-slate-500 text-center py-8">
              Select an element to edit its properties
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Text Element Properties Panel
 */
interface TextElementPropertiesProps {
  element: TextElement;
  onUpdateContent: (content: string) => void;
  onUpdateStyle: (style: Partial<TextElement['style']>) => void;
  onUpdatePosition: (position: { x: number; y: number }) => void;
  onUpdateSize: (size: { width: number; height: number }) => void;
}

function TextElementProperties({
  element,
  onUpdateContent,
  onUpdateStyle,
  onUpdatePosition,
  onUpdateSize,
}: TextElementPropertiesProps) {
  return (
    <div className="space-y-4">
      {/* Content */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Text Content
        </label>
        <textarea
          value={element.content}
          onChange={(e) => onUpdateContent(e.target.value)}
          className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          rows={3}
        />
      </div>
      
      {/* Font Size */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Font Size: {element.style.fontSize}px
        </label>
        <input
          type="range"
          min="12"
          max="200"
          value={element.style.fontSize}
          onChange={(e) => onUpdateStyle({ fontSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      
      {/* Font Weight */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Font Weight
        </label>
        <select
          value={element.style.fontWeight}
          onChange={(e) => onUpdateStyle({ fontWeight: parseInt(e.target.value) as any })}
          className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
        >
          <option value="300">Light (300)</option>
          <option value="400">Regular (400)</option>
          <option value="600">Semibold (600)</option>
          <option value="700">Bold (700)</option>
          <option value="800">Extra Bold (800)</option>
        </select>
      </div>
      
      {/* Text Color */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Text Color
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={element.style.color}
            onChange={(e) => onUpdateStyle({ color: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            value={element.style.color}
            onChange={(e) => onUpdateStyle({ color: e.target.value })}
            className="flex-1 px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
          />
        </div>
      </div>
      
      {/* Text Align */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1">
          Text Align
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['left', 'center', 'right'].map((align) => (
            <button
              key={align}
              onClick={() => onUpdateStyle({ textAlign: align as any })}
              className={`px-3 py-2 rounded text-sm ${
                element.style.textAlign === align
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {align.charAt(0).toUpperCase() + align.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      {/* Position */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Position
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">X</label>
            <input
              type="number"
              value={Math.round(element.position.x)}
              onChange={(e) =>
                onUpdatePosition({ ...element.position, x: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Y</label>
            <input
              type="number"
              value={Math.round(element.position.y)}
              onChange={(e) =>
                onUpdatePosition({ ...element.position, y: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Size */}
      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">
          Size
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Width</label>
            <input
              type="number"
              value={Math.round(element.size.width)}
              onChange={(e) =>
                onUpdateSize({ ...element.size, width: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Height</label>
            <input
              type="number"
              value={Math.round(element.size.height)}
              onChange={(e) =>
                onUpdateSize({ ...element.size, height: parseInt(e.target.value) || 0 })
              }
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
