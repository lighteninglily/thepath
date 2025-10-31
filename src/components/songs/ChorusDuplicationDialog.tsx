import { useState } from 'react';
import { Copy, X } from 'lucide-react';

interface ChorusDuplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  chorusSlides: Array<{
    slideNumber: number;
    content: string;
  }>;
  onDuplicate: (count: number) => void;
  recommendedCount: number;
}

export function ChorusDuplicationDialog({
  isOpen,
  onClose,
  chorusSlides,
  onDuplicate,
  recommendedCount,
}: ChorusDuplicationDialogProps) {
  const [duplicateCount, setDuplicateCount] = useState(recommendedCount);

  if (!isOpen) return null;

  const handleApply = () => {
    onDuplicate(duplicateCount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-brand-skyBlue to-brand-periwinkle text-brand-charcoal p-6 rounded-t-xl">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-1">Chorus Detected!</h3>
              <p className="text-brand-deepBrown text-sm">
                We found a chorus in your song. How many times should we repeat it?
              </p>
            </div>
            <button onClick={onClose} className="text-brand-charcoal hover:bg-brand-warmGray rounded p-2">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CHORUS PREVIEW */}
        <div className="p-6 border-b border-brand-warmGray">
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Chorus Content (Slides {chorusSlides[0]?.slideNumber} - {chorusSlides[chorusSlides.length - 1]?.slideNumber}):
          </p>
          <div className="bg-brand-offWhite rounded-lg p-4 max-h-[200px] overflow-y-auto">
            {chorusSlides.map((slide, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <p className="text-xs font-medium text-gray-500 mb-1">Slide {slide.slideNumber}</p>
                <p className="text-sm text-gray-800 whitespace-pre-line">
                  {slide.content}
                </p>
                {index < chorusSlides.length - 1 && <hr className="my-3 border-brand-warmGray" />}
              </div>
            ))}
          </div>
        </div>

        {/* DUPLICATION OPTIONS */}
        <div className="p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Additional Repetitions:
          </label>
          <div className="grid grid-cols-5 gap-3">
            {[0, 1, 2, 3, 4].map((count) => (
              <button
                key={count}
                onClick={() => setDuplicateCount(count)}
                className={`
                  px-4 py-3 rounded-lg border-2 font-semibold transition-all
                  ${duplicateCount === count
                    ? 'border-brand-skyBlue bg-brand-mistyBlue text-brand-charcoal'
                    : 'border-brand-warmGray hover:border-brand-skyBlue text-brand-charcoal'
                  }
                  ${count === recommendedCount ? 'ring-2 ring-brand-powderBlue' : ''}
                `}
              >
                {count === 0 ? 'None' : `${count}x`}
                {count === recommendedCount && (
                  <span className="block text-xs text-brand-skyBlue mt-1 font-semibold">Recommended</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">
            {duplicateCount === 0
              ? 'Chorus will appear once in the song.'
              : `Chorus will be duplicated ${duplicateCount} additional time${duplicateCount > 1 ? 's' : ''} (total: ${duplicateCount + 1} times).` 
            }
          </p>
        </div>

        {/* FOOTER */}
        <div className="border-t border-brand-warmGray p-6 flex justify-end gap-3 bg-brand-offWhite rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-brand-warmGray rounded-lg hover:bg-brand-warmGray text-brand-charcoal"
          >
            Skip
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-brand-skyBlue text-white rounded-lg hover:bg-brand-powderBlue flex items-center gap-2"
          >
            <Copy size={18} />
            Apply Duplication
          </button>
        </div>

      </div>
    </div>
  );
}
