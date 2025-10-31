import { useState, useEffect } from 'react';
import { X, CheckCircle, RotateCcw, XCircle } from 'lucide-react';
import { ChorusDuplicationDialog } from './ChorusDuplicationDialog';

interface GenerationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  generatedSong: {
    title: string;
    artist: string;
    slides: any[];
    analysis: {
      mood: string;
      energy: number;
      themes: string[];
    };
    themePack: string;
    structureDetection?: {
      hasChorus: boolean;
      chorusStartIndex?: number;
      chorusEndIndex?: number;
      recommendedDuplications?: number;
    };
  } | null;
  onAccept: () => void;
  onRegenerate: () => void;
}

export function GenerationPreviewModal({
  isOpen,
  onClose,
  generatedSong,
  onAccept,
  onRegenerate,
}: GenerationPreviewModalProps) {
  const [slides, setSlides] = useState<any[]>([]);
  const [showChorusDialog, setShowChorusDialog] = useState(false);
  const [chorusSlides, setChorusSlides] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen && generatedSong) {
      setSlides(generatedSong.slides);
      
      // Check for chorus detection
      if (generatedSong.structureDetection?.hasChorus) {
        const { chorusStartIndex, chorusEndIndex } = generatedSong.structureDetection;
        
        if (chorusStartIndex !== undefined && chorusEndIndex !== undefined) {
          const chorus = generatedSong.slides
            .slice(chorusStartIndex, chorusEndIndex + 1)
            .map((slide, idx) => ({
              slideNumber: chorusStartIndex + idx + 1,
              content: slide.visualData?.elements[0]?.content || '',
            }));
          
          setChorusSlides(chorus);
          
          // Auto-show dialog after 1 second
          setTimeout(() => setShowChorusDialog(true), 1000);
        }
      }
    }
  }, [isOpen, generatedSong]);

  const handleChorusDuplication = (count: number) => {
    if (count === 0 || !generatedSong?.structureDetection) {
      setShowChorusDialog(false);
      return;
    }
    
    const { chorusStartIndex, chorusEndIndex } = generatedSong.structureDetection;
    
    if (chorusStartIndex === undefined || chorusEndIndex === undefined) {
      setShowChorusDialog(false);
      return;
    }
    
    const chorusSlidesToDuplicate = slides.slice(chorusStartIndex, chorusEndIndex + 1);
    
    // Insert duplicates after original chorus
    const updatedSlides = [...slides];
    for (let i = 0; i < count; i++) {
      const insertPosition = chorusEndIndex + 1 + (i * chorusSlidesToDuplicate.length);
      updatedSlides.splice(
        insertPosition,
        0,
        ...chorusSlidesToDuplicate.map(slide => ({
          ...slide,
          id: `${slide.id}_dup_${i + 1}`,
        }))
      );
    }
    
    setSlides(updatedSlides);
    if (generatedSong) {
      generatedSong.slides = updatedSlides;
    }
    setShowChorusDialog(false);
  };

  const handleAccept = () => {
    // Update the generatedSong with potentially duplicated slides
    if (generatedSong) {
      generatedSong.slides = slides;
    }
    onAccept();
  };

  if (!isOpen || !generatedSong) return null;

  const { title, artist, analysis, themePack } = generatedSong;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[90vh] flex flex-col">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-brand-skyBlue to-brand-periwinkle text-brand-charcoal p-6 rounded-t-xl">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">Preview Generated Slides</h2>
                <p className="text-brand-deepBrown">
                  Generated {slides.length} slides for "{title}" by {artist}
                </p>
                <p className="text-brand-umber text-sm mt-1">
                  Theme: {themePack.charAt(0).toUpperCase() + themePack.slice(1)} • 
                  Mood: {analysis.mood} • Energy: {analysis.energy}/10
                </p>
              </div>
              <button onClick={onClose} className="text-brand-charcoal hover:bg-brand-warmGray rounded p-2">
                <X size={24} />
              </button>
            </div>
          </div>

          {/* SLIDE GRID */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Background Note */}
            <div className="mb-4 p-3 bg-brand-mistyBlue border border-brand-powderBlue rounded-lg">
              <p className="text-sm text-brand-deepBrown">
                <span className="font-semibold">Note:</span> Real backgrounds from your theme pack will be applied when you accept. 
                The preview shows gradient placeholders.
              </p>
            </div>
            
            {/* Warning for too many slides */}
            {slides.length > 25 && (
              <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-orange-800">
                  <span className="font-semibold">⚠️ {slides.length} slides detected.</span> This is quite long! 
                  Consider using "Regenerate" to try again, or manually edit slides after importing.
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-4 gap-4">
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border-2 border-brand-warmGray rounded-lg overflow-hidden hover:border-brand-skyBlue transition-colors"
                >
                  {/* Thumbnail Preview */}
                  <div className="bg-gray-100 aspect-video relative">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: slide.visualData?.background?.imageUrl 
                          ? `url(${slide.visualData.background.imageUrl})` 
                          : 'linear-gradient(135deg, #A8C5DD 0%, #C5D9E8 100%)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center p-4">
                        <p
                          className="text-white font-bold text-center text-xs leading-tight"
                          style={{
                            fontSize: `${(slide.visualData?.elements[0]?.style?.fontSize || 64) / 12}px`,
                            textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
                          }}
                        >
                          {slide.visualData?.elements[0]?.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Slide Info */}
                  <div className="p-2 bg-white">
                    <p className="text-center text-sm font-semibold text-gray-800">
                      Slide {index + 1}
                    </p>
                    <p className="text-center text-xs text-gray-500 truncate">
                      {slide.visualData?.elements[0]?.content?.split('\n')[0]}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FOOTER */}
          <div className="border-t border-brand-warmGray p-6 flex justify-between items-center bg-brand-offWhite rounded-b-xl">
            <p className="text-sm text-gray-600">
              Review the slides above. You can accept them or regenerate with a different theme.
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-brand-warmGray rounded-lg hover:bg-brand-warmGray flex items-center gap-2 text-brand-charcoal"
              >
                <XCircle size={20} />
                Cancel
              </button>
              <button
                onClick={onRegenerate}
                className="px-4 py-2 bg-brand-clay text-white rounded-lg hover:bg-brand-umber flex items-center gap-2"
              >
                <RotateCcw size={20} />
                Regenerate
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <CheckCircle size={20} />
                Accept & Add to Library
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Chorus Duplication Dialog */}
      <ChorusDuplicationDialog
        isOpen={showChorusDialog}
        onClose={() => setShowChorusDialog(false)}
        chorusSlides={chorusSlides}
        onDuplicate={handleChorusDuplication}
        recommendedCount={generatedSong?.structureDetection?.recommendedDuplications || 2}
      />
    </>
  );
}
