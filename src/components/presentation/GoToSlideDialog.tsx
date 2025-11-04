import { useState, useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';

interface GoToSlideDialogProps {
  isOpen: boolean;
  totalSlides: number;
  currentSlide: number;
  onClose: () => void;
  onGo: (slideNumber: number) => void;
}

/**
 * Quick navigation dialog - press G, type number, Enter to jump
 * Like PowerPoint's "Go to Slide" feature
 */
export function GoToSlideDialog({
  isOpen,
  totalSlides,
  currentSlide,
  onClose,
  onGo,
}: GoToSlideDialogProps) {
  const [slideNumber, setSlideNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isOpen]);

  // Reset when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSlideNumber('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const num = parseInt(slideNumber, 10);
    if (!isNaN(num) && num >= 1 && num <= totalSlides) {
      onGo(num - 1); // Convert to 0-indexed
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl p-6 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Go to Slide</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-2">
              Slide Number (1-{totalSlides})
            </label>
            <input
              ref={inputRef}
              type="number"
              min="1"
              max={totalSlides}
              value={slideNumber}
              onChange={(e) => setSlideNumber(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Current: ${currentSlide + 1}`}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-2xl font-mono focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Info */}
          <div className="mb-4 text-sm text-gray-400">
            <p>💡 Tip: Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Enter</kbd> to jump</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!slideNumber || parseInt(slideNumber) < 1 || parseInt(slideNumber) > totalSlides}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Go
              <ArrowRight size={18} />
            </button>
          </div>
        </form>

        {/* Quick Jump Buttons */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 mb-2">Quick Jump:</div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { onGo(0); onClose(); }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            >
              First
            </button>
            <button
              onClick={() => { onGo(totalSlides - 1); onClose(); }}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
            >
              Last
            </button>
            {currentSlide > 0 && (
              <button
                onClick={() => { onGo(currentSlide - 1); onClose(); }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Previous
              </button>
            )}
            {currentSlide < totalSlides - 1 && (
              <button
                onClick={() => { onGo(currentSlide + 1); onClose(); }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
