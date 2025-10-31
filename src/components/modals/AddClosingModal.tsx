import { X, Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { openaiService } from '../../services/openaiService';

interface AddClosingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClosing: (closing: {
    includeBenediction: boolean;
    nextWeekPreview?: string;
    aiGenerated: any;
  }) => void;
}

export function AddClosingModal({ isOpen, onClose, onAddClosing }: AddClosingModalProps) {
  const [includeBenediction, setIncludeBenediction] = useState(true);
  const [nextWeekPreview, setNextWeekPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPreview(null);

    try {
      console.log('✅ Generating closing slide:', { includeBenediction, nextWeekPreview });
      
      const result = await openaiService.generateClosingSlide({
        includeBenediction,
        nextWeekPreview: nextWeekPreview || undefined
      });

      console.log('✅ Closing slide generated:', result);
      setPreview(result);

    } catch (err) {
      console.error('❌ Error generating closing slide:', err);
      setError('Failed to generate closing slide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      setError('Please generate slide first');
      return;
    }

    onAddClosing({
      includeBenediction,
      nextWeekPreview,
      aiGenerated: preview
    });

    // Reset
    setIncludeBenediction(true);
    setNextWeekPreview('');
    setPreview(null);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setIncludeBenediction(true);
    setNextWeekPreview('');
    setPreview(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <Check size={24} className="text-gray-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Closing Slide</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Create a meaningful send-off message
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Include Benediction */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium text-brand-charcoal">Include Benediction</p>
              <p className="text-sm text-brand-umber">Add a scripture blessing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeBenediction}
                onChange={(e) => setIncludeBenediction(e.target.checked)}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Next Week Preview */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Next Week Preview (optional)
            </label>
            <input
              type="text"
              value={nextWeekPreview}
              onChange={(e) => setNextWeekPreview(e.target.value)}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="e.g., Join us next week for our special Easter service"
              disabled={loading}
            />
            <p className="text-xs text-brand-umber mt-1">
              Let people know what's coming up
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">✨ Closing Slide Generated!</p>
              
              <div className="p-4 bg-white rounded border space-y-3">
                <div>
                  <p className="text-xl font-bold text-brand-charcoal">{preview.title}</p>
                  <p className="text-brand-umber mt-2">{preview.message}</p>
                </div>
                
                {preview.benediction && (
                  <div className="pt-3 border-t">
                    <p className="text-sm italic text-blue-700">"{preview.benediction}"</p>
                  </div>
                )}
                
                {preview.nextWeek && (
                  <div className="pt-3 border-t">
                    <p className="text-sm font-semibold text-gray-700">Next Week:</p>
                    <p className="text-sm text-gray-600">{preview.nextWeek}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          {!preview && !loading && (
            <div className="p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
              <p className="text-sm text-brand-umber">
                💡 <strong>Tip:</strong> AI will create a warm closing that thanks attendees and 
                provides next steps. Perfect for ending your service on a positive note!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-brand-warmGray bg-brand-warmGray/10">
          <button
            onClick={handleClose}
            className="px-6 py-2 rounded-lg border-2 border-brand-warmGray text-brand-charcoal hover:bg-brand-warmGray transition-colors font-medium"
            disabled={loading}
          >
            Cancel
          </button>
          {!preview ? (
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Slide'
              )}
            </button>
          ) : (
            <button
              onClick={handleAdd}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Add to Service
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
