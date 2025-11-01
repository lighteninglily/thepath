import { useState } from 'react';
import { X } from 'lucide-react';
import { SermonSlideBuilder } from './SermonSlideBuilder';
import { VisualItemEditorModal } from '../modals/VisualItemEditorModal';
import type { ServiceItem } from '../../types/service';

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

  const handleSaveFromVisualEditor = (updatedItem: ServiceItem) => {
    console.log('💾 Saving from Visual Editor:', updatedItem);
    
    // Extract visualData from content field
    const visualEditorData = typeof updatedItem.content === 'string'
      ? JSON.parse(updatedItem.content)
      : updatedItem.content;
    
    console.log('💾 Visual editor data:', visualEditorData);
    
    // Convert back from visual editor format to sermon template format
    const convertBackToSermonFormat = (data: any) => {
      console.log('🔄 Converting from visual editor format:', data);
      console.log('🔄 Background received:', JSON.stringify(data.background, null, 2));
      
      // Convert background
      let convertedBackground: any;
      
      if (!data.background) {
        console.error('❌ No background in visual editor data!');
        convertedBackground = { type: 'color', value: '#000000' };
      } else if (data.background.type === 'gradient') {
        // Visual Editor format: { type: 'gradient', gradient: '...' }
        // Sermon format: { type: 'gradient', value: '...' }
        const gradientValue = data.background.gradient || data.background.value;
        console.log('✅ Converting gradient:', gradientValue);
        convertedBackground = {
          type: 'gradient',
          value: gradientValue,
        };
      } else if (data.background.type === 'solid') {
        // Visual Editor format: { type: 'solid', color: '...' }
        // Sermon format: { type: 'color', value: '...' }
        console.log('✅ Converting solid color:', data.background.color);
        convertedBackground = {
          type: 'color',
          value: data.background.color,
        };
      } else if (data.background.type === 'color') {
        // Already in sermon format
        console.log('✅ Already in sermon format (color)');
        convertedBackground = data.background;
      } else {
        console.warn('⚠️ Unknown background format, using as-is:', data.background);
        convertedBackground = data.background;
      }
      
      console.log('🔄 Converted background:', JSON.stringify(convertedBackground, null, 2));
      
      // Convert elements from pixels back to percentages
      const canvasWidth = 1920;
      const canvasHeight = 1080;
      
      const convertedElements = (data.elements || []).map((el: any) => ({
        id: el.id,
        type: el.type,
        role: el.role,
        content: el.content,
        x: (el.position.x / canvasWidth) * 100,
        y: (el.position.y / canvasHeight) * 100,
        width: (el.size.width / canvasWidth) * 100,
        height: (el.size.height / canvasHeight) * 100,
        zIndex: el.zIndex,
        rotation: el.rotation,
        style: {
          fontSize: el.style?.fontSize,
          fontFamily: el.style?.fontFamily,
          fontWeight: el.style?.fontWeight,
          color: el.style?.color,
          textAlign: el.style?.textAlign,
          backgroundColor: el.style?.backgroundColor,
          borderRadius: el.style?.borderRadius,
          padding: el.style?.padding,
          lineHeight: el.style?.lineHeight,
          letterSpacing: el.style?.letterSpacing,
          textTransform: el.style?.textTransform,
          opacity: el.opacity,
        },
      }));
      
      return {
        background: convertedBackground,
        elements: convertedElements,
      };
    };
    
    const convertedData = convertBackToSermonFormat(visualEditorData);
    console.log('💾 Converted back to sermon format:', JSON.stringify(convertedData, null, 2));
    
    const newSlides = [...sermonSlides];
    const updatedSlide = {
      ...newSlides[editingSlideIndex],
      visualData: convertedData,
    };
    console.log('💾 Updated slide:', JSON.stringify(updatedSlide, null, 2));
    newSlides[editingSlideIndex] = updatedSlide;
    setSermonSlides(newSlides);
    setStep('builder');
  };

  if (step === 'visual-editor') {
    // Convert sermon slide to ServiceItem format for VisualItemEditorModal
    const currentSlide = sermonSlides[editingSlideIndex];
    
    console.log('📖 OPENING VISUAL EDITOR');
    console.log('📖 Current slide:', JSON.stringify(currentSlide, null, 2));
    console.log('📖 Visual data:', JSON.stringify(currentSlide.visualData, null, 2));
    
    // Convert sermon template format to visual editor format
    const convertVisualData = (data: any) => {
      if (!data) {
        console.error('❌ No data provided to convertVisualData!');
        return {
          background: { type: 'solid', color: '#E8E3DC' },
          elements: [],
        };
      }
      
      console.log('📖 Converting visual data, input:', data);
      
      // Convert background format
      const originalBg = data.background || { type: 'color', value: '#E8E3DC' };
      console.log('📖 Original background:', JSON.stringify(originalBg, null, 2));
      
      let convertedBackground: any;
      
      if (originalBg.type === 'gradient' && originalBg.value) {
        console.log('✅ Converting gradient to editor format:', originalBg.value);
        convertedBackground = {
          type: 'gradient',
          gradient: originalBg.value,
        };
      } else if (originalBg.type === 'color' && originalBg.value) {
        console.log('✅ Converting color to solid:', originalBg.value);
        convertedBackground = {
          type: 'solid',
          color: originalBg.value,
        };
      } else {
        console.warn('⚠️ Using background as-is:', originalBg);
        convertedBackground = originalBg;
      }
      
      console.log('📖 Converted background:', JSON.stringify(convertedBackground, null, 2));
      
      // Convert element coordinates from percentages to pixels
      const canvasWidth = 1920;
      const canvasHeight = 1080;
      
      const convertedElements = (data.elements || [])
        .filter((el: any) => {
          // Skip empty placeholders
          const content = el.content || '';
          return content && content !== 'Empty text' && !content.includes('{{');
        })
        .map((el: any) => ({
          id: el.id,
          type: el.type,
          content: el.content,
          position: {
            x: (el.x / 100) * canvasWidth,
            y: (el.y / 100) * canvasHeight,
          },
          size: {
            width: (el.width / 100) * canvasWidth,
            height: (el.height / 100) * canvasHeight,
          },
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
        }));
      
      return {
        background: convertedBackground,
        elements: convertedElements,
      };
    };
    
    const serviceItem: any = {
      id: currentSlide.id,
      type: 'sermon',
      title: sermonTitle || 'Sermon Slide',
      duration: 5,
      order: editingSlideIndex,
      content: convertVisualData(currentSlide.visualData),
    };

    return (
      <VisualItemEditorModal
        item={serviceItem}
        isOpen={true}
        onClose={() => setStep('builder')}
        onSave={handleSaveFromVisualEditor}
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
