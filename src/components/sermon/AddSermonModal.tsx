import { useState } from 'react';
import { X } from 'lucide-react';
import { SermonSlideBuilder } from './SermonSlideBuilder';
import { SlideDesigner } from '../designer/SlideDesigner';
import type { VisualSlide } from '../../types/designer';

interface SermonSlide {
  id: string;
  content: string;
  templateId?: string;
  visualData?: any;
  order: number;
}

interface AddSermonModalProps {
  onClose: () => void;
  onSave: (sermon: { title: string; slides: SermonSlide[] }) => void;
}

export function AddSermonModal({ onClose, onSave }: AddSermonModalProps) {
  const [step, setStep] = useState<'details' | 'builder' | 'visual-editor'>('details');
  const [sermonTitle, setSermonTitle] = useState('');
  const [sermonDate, setSermonDate] = useState('');
  const [sermonSpeaker, setSermonSpeaker] = useState('');
  const [scripture, setScripture] = useState('');
  const [sermonSlides, setSermonSlides] = useState<SermonSlide[]>([]);
  const [editingSlideIndex, setEditingSlideIndex] = useState<number>(0);

  const handleStartBuilder = () => {
    if (!sermonTitle.trim()) {
      alert('Please enter a sermon title');
      return;
    }
    setStep('builder');
  };

  const handleSaveSermon = (slides: SermonSlide[]) => {
    onSave({
      title: sermonTitle,
      slides,
    });
  };

  const handleOpenVisualEditor = (slide: SermonSlide, index: number) => {
    console.log('Opening Visual Editor for slide', index + 1);
    setSermonSlides(slides => {
      const updated = [...slides];
      updated[index] = slide;
      return updated;
    });
    setEditingSlideIndex(index);
    setStep('visual-editor');
  };

  const handleSaveFromVisualEditor = (visualSlides: VisualSlide[]) => {
    console.log('Saving from Visual Editor:', visualSlides);
    if (visualSlides.length > 0) {
      const updatedSlide = visualSlides[0];
      
      // Convert elements back from pixels to percentages for template storage
      const convertedElements = updatedSlide.elements.map((el: any) => ({
        ...el,
        x: el.x / 19.2, // pixels to %
        y: el.y / 10.8,
        width: el.width / 19.2,
        height: el.height / 10.8,
      }));
      
      const newSlides = [...sermonSlides];
      newSlides[editingSlideIndex] = {
        ...newSlides[editingSlideIndex],
        visualData: {
          background: updatedSlide.background,
          elements: convertedElements,
        },
      };
      setSermonSlides(newSlides);
    }
    setStep('builder');
  };

  if (step === 'visual-editor') {
    // Convert sermon slide to Visual Editor format
    const currentSlide = sermonSlides[editingSlideIndex];
    
    // Convert template elements (percentage-based) to Visual Editor format (pixel-based)
    const convertedElements = (currentSlide.visualData?.elements || []).map((el: any, idx: number) => {
      // Convert percentage coordinates to pixels (1920x1080 canvas)
      const pixelX = (el.x || 0) * 19.2; // % to pixels
      const pixelY = (el.y || 0) * 10.8;
      const pixelWidth = (el.width || 100) * 19.2;
      const pixelHeight = (el.height || 20) * 10.8;
      
      return {
        id: el.id || `element_${Date.now()}_${idx}`,
        type: el.type || 'text',
        content: el.content || '',
        x: pixelX,
        y: pixelY,
        width: pixelWidth,
        height: pixelHeight,
        rotation: el.rotation || 0,
        opacity: el.opacity !== undefined ? el.opacity : 1,
        zIndex: el.zIndex || 10,
        locked: false,
        visible: true,
        style: {
          fontSize: el.style?.fontSize || 48,
          fontFamily: el.style?.fontFamily || 'Inter',
          fontWeight: el.style?.fontWeight || 400,
          color: el.style?.color || '#000000',
          textAlign: el.style?.textAlign || 'left',
          backgroundColor: el.style?.backgroundColor || 'transparent',
          borderRadius: el.style?.borderRadius || 0,
          padding: el.style?.padding || 0,
          lineHeight: el.style?.lineHeight || 1.2,
          letterSpacing: el.style?.letterSpacing || 0,
          textTransform: el.style?.textTransform || 'none',
        },
      };
    });
    
    const visualSlide: VisualSlide = {
      id: currentSlide.id,
      content: currentSlide.content,
      order: editingSlideIndex,
      elements: convertedElements,
      background: currentSlide.visualData?.background || { type: 'color', value: '#000000' },
      aspectRatio: '16:9',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      isVisualMode: true,
      templateId: currentSlide.templateId,
    };

    return (
      <SlideDesigner
        slides={[visualSlide]}
        onSave={handleSaveFromVisualEditor}
        onClose={() => setStep('builder')}
      />
    );
  }

  if (step === 'builder') {
    return (
      <SermonSlideBuilder
        sermonTitle={sermonTitle}
        initialSlides={sermonSlides.length > 0 ? sermonSlides : undefined}
        onSave={(slides) => {
          setSermonSlides(slides);
          handleSaveSermon(slides);
        }}
        onClose={onClose}
        onOpenVisualEditor={handleOpenVisualEditor}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Sermon</h2>
            <p className="text-sm text-gray-600 mt-1">
              Add sermon details to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {/* Sermon Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sermon Title *
              </label>
              <input
                type="text"
                value={sermonTitle}
                onChange={(e) => setSermonTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Walking in Faith"
                autoFocus
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date (optional)
              </label>
              <input
                type="date"
                value={sermonDate}
                onChange={(e) => setSermonDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Speaker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Speaker (optional)
              </label>
              <input
                type="text"
                value={sermonSpeaker}
                onChange={(e) => setSermonSpeaker(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Pastor John Smith"
              />
            </div>

            {/* Main Scripture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Scripture (optional)
              </label>
              <input
                type="text"
                value={scripture}
                onChange={(e) => setScripture(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Hebrews 11:1"
              />
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">
                What's Next?
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Add slides one by one</li>
                <li>• AI will suggest templates based on your content</li>
                <li>• Choose from beautiful pre-designed layouts</li>
                <li>• Customize further in Visual Editor if needed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300
              text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartBuilder}
            disabled={!sermonTitle.trim()}
            className="px-6 py-2 rounded-lg bg-blue-600 text-white
              hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-medium
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Slides
          </button>
        </div>
      </div>
    </div>
  );
}
