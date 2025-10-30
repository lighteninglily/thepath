import { useState } from 'react';
import { X, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { AdvancedSlidePreview } from './AdvancedSlidePreview';
import { BackgroundPicker } from '../backgrounds/BackgroundPicker';
import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';
import { SLIDE_LAYOUTS } from '../../utils/layouts';

interface SlideEditorProps {
  slides: Slide[];
  backgrounds: (BackgroundImage | null)[];
  layouts: LayoutType[];
  onSave: (slides: Slide[], backgrounds: (BackgroundImage | null)[], layouts: LayoutType[]) => void;
  onClose: () => void;
}

export function SlideEditor({ slides: initialSlides, backgrounds: initialBackgrounds, layouts: initialLayouts, onSave, onClose }: SlideEditorProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [backgrounds, setBackgrounds] = useState<(BackgroundImage | null)[]>(initialBackgrounds);
  const [layouts, setLayouts] = useState<LayoutType[]>(initialLayouts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [backgroundPickerIndex, setBackgroundPickerIndex] = useState<number | null>(null);

  const handleEditText = (index: number, newContent: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], content: newContent };
    setSlides(updated);
  };

  const handleChangeBackground = (index: number, background: BackgroundImage) => {
    const updated = [...backgrounds];
    updated[index] = background;
    setBackgrounds(updated);
    setShowBackgroundPicker(false);
    setBackgroundPickerIndex(null);
  };

  const handleChangeLayout = (index: number, layout: LayoutType) => {
    const updated = [...layouts];
    updated[index] = layout;
    setLayouts(updated);
  };

  const handleDeleteSlide = (index: number) => {
    if (!confirm('Delete this slide?')) return;
    
    setSlides(slides.filter((_, i) => i !== index));
    setBackgrounds(backgrounds.filter((_, i) => i !== index));
    setLayouts(layouts.filter((_, i) => i !== index));
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'custom',
      content: 'New slide\nAdd your text here',
      order: slides.length,
    };
    setSlides([...slides, newSlide]);
    setBackgrounds([...backgrounds, backgrounds[backgrounds.length - 1] || null]);
    setLayouts([...layouts, 'full-bleed']);
  };

  const handleSave = () => {
    console.log('💾 Slide Editor - Saving changes...');
    console.log('Slides:', slides);
    console.log('Backgrounds:', backgrounds);
    console.log('Layouts:', layouts);
    
    // Update order
    const updatedSlides = slides.map((slide, index) => ({
      ...slide,
      order: index,
    }));
    
    console.log('Updated slides with order:', updatedSlides);
    console.log('Calling onSave callback...');
    
    onSave(updatedSlides, backgrounds, layouts);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-warmGray flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Edit Slides</h2>
            <p className="text-sm text-brand-umber mt-1">{slides.length} slides</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-brand-warmGray/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Slides Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="border-2 border-brand-warmGray rounded-lg p-4 hover:border-brand-skyBlue transition-colors"
              >
                {/* Slide Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <GripVertical size={16} className="text-brand-umber cursor-move" />
                    <span className="font-medium text-brand-charcoal">
                      Slide {index + 1}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-brand-skyBlue/10 text-brand-skyBlue">
                      {slide.type}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteSlide(index)}
                    className="p-1 rounded hover:bg-red-50 text-red-500"
                    title="Delete slide"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Preview */}
                <div className="mb-3 rounded-lg overflow-hidden border border-brand-warmGray">
                  <AdvancedSlidePreview
                    slide={slide}
                    background={backgrounds[index] || null}
                    layout={layouts[index]}
                  />
                </div>

                {/* Text Editor */}
                <div className="mb-3">
                  {editingIndex === index ? (
                    <>
                      <textarea
                        value={slide.content}
                        onChange={(e) => handleEditText(index, e.target.value)}
                        className="w-full px-3 py-2 border border-brand-warmGray rounded-lg
                          focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                          text-sm font-mono"
                        rows={4}
                      />
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="mt-2 px-3 py-1 text-xs bg-brand-skyBlue text-white rounded hover:bg-brand-powderBlue"
                      >
                        Done Editing
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditingIndex(index)}
                      className="w-full text-left px-3 py-2 border border-brand-warmGray rounded-lg
                        hover:border-brand-skyBlue transition-colors text-sm"
                    >
                      <div className="line-clamp-2 text-brand-umber">
                        {slide.content}
                      </div>
                      <div className="text-xs text-brand-skyBlue mt-1">Click to edit text</div>
                    </button>
                  )}
                </div>

                {/* Layout Selector */}
                <div className="mb-3">
                  <label className="text-xs font-medium text-brand-charcoal block mb-1">
                    Layout Style
                  </label>
                  <select
                    value={layouts[index]}
                    onChange={(e) => handleChangeLayout(index, e.target.value as LayoutType)}
                    className="w-full px-3 py-1.5 text-sm border border-brand-warmGray rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                  >
                    {SLIDE_LAYOUTS.map(layout => (
                      <option key={layout.type} value={layout.type}>
                        {layout.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Background Picker Button */}
                <button
                  onClick={() => {
                    setBackgroundPickerIndex(index);
                    setShowBackgroundPicker(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 
                    bg-brand-skyBlue/10 text-brand-skyBlue rounded-lg
                    hover:bg-brand-skyBlue/20 transition-colors text-sm"
                >
                  <ImageIcon size={16} />
                  {backgrounds[index] ? `Change Background` : 'Add Background'}
                </button>
              </div>
            ))}
          </div>

          {/* Add Slide Button */}
          <button
            onClick={handleAddSlide}
            className="mt-6 w-full border-2 border-dashed border-brand-warmGray rounded-lg
              p-6 hover:border-brand-skyBlue hover:bg-brand-skyBlue/5
              transition-colors flex items-center justify-center gap-2 text-brand-umber"
          >
            <Plus size={20} />
            Add New Slide
          </button>
        </div>

        {/* Background Picker Modal */}
        {showBackgroundPicker && backgroundPickerIndex !== null && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[80vh] overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-brand-charcoal">
                  Choose Background for Slide {backgroundPickerIndex + 1}
                </h3>
                <button
                  onClick={() => {
                    setShowBackgroundPicker(false);
                    setBackgroundPickerIndex(null);
                  }}
                  className="p-2 rounded-lg hover:bg-brand-warmGray/20"
                >
                  <X size={20} />
                </button>
              </div>
              <BackgroundPicker
                selectedBackground={backgrounds[backgroundPickerIndex]}
                onSelectBackground={(bg) => handleChangeBackground(backgroundPickerIndex, bg)}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-brand-warmGray flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-brand-warmGray
              text-brand-charcoal hover:bg-brand-warmGray/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-brand-skyBlue text-white
              hover:bg-brand-powderBlue transition-all shadow-md hover:shadow-lg font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
