import { X, DollarSign, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { openaiService } from '../../services/openaiService';

interface AddOfferingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddOffering: (offering: {
    theme: string;
    aiGenerated: any;
  }) => void;
}

export function AddOfferingModal({ isOpen, onClose, onAddOffering }: AddOfferingModalProps) {
  const [theme, setTheme] = useState<'gratitude' | 'purpose' | 'joy' | 'stewardship'>('gratitude');
  const [includeScripture, setIncludeScripture] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setPreview(null);

    try {
      console.log('💰 Generating offering slide:', { theme, includeScripture });
      
      const result = await openaiService.generateOfferingSlide({
        theme,
        includeScripture
      });

      console.log('✅ Offering slide generated:', result);
      setPreview(result);

    } catch (err) {
      console.error('❌ Error generating offering slide:', err);
      setError('Failed to generate offering slide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      setError('Please generate slide first');
      return;
    }

    onAddOffering({
      theme,
      aiGenerated: preview
    });

    // Reset
    setTheme('gratitude');
    setIncludeScripture(true);
    setPreview(null);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setTheme('gratitude');
    setIncludeScripture(true);
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
            <DollarSign size={24} className="text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Offering Slide</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Create a graceful, meaningful offering message
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
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Message Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'gratitude' as const, label: 'Grateful Hearts', desc: 'Focus on thankfulness' },
                { value: 'purpose' as const, label: 'Kingdom Purpose', desc: 'Focus on mission' },
                { value: 'joy' as const, label: 'Joyful Giving', desc: 'Focus on cheerfulness' },
                { value: 'stewardship' as const, label: 'Faithful Stewardship', desc: 'Focus on responsibility' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    theme === option.value
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-brand-warmGray hover:border-emerald-200'
                  }`}
                  disabled={loading}
                >
                  <p className="font-semibold text-brand-charcoal">{option.label}</p>
                  <p className="text-xs text-brand-umber">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Include Scripture */}
          <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div>
              <p className="font-medium text-brand-charcoal">Include Scripture Verse</p>
              <p className="text-sm text-brand-umber">Add a relevant Bible verse</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeScripture}
                onChange={(e) => setIncludeScripture(e.target.checked)}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
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
              <p className="text-sm font-semibold text-green-800">✨ Offering Slide Generated!</p>
              
              <div className="p-4 bg-white rounded border">
                <p className="text-lg font-bold text-brand-charcoal mb-2">{preview.title}</p>
                <p className="text-brand-umber mb-3">{preview.message}</p>
                {preview.scripture && (
                  <p className="text-sm italic text-blue-700">"{preview.scripture}"</p>
                )}
              </div>
            </div>
          )}

          {/* Help Text */}
          {!preview && !loading && (
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg">
              <p className="text-sm text-brand-umber">
                💡 <strong>Tip:</strong> Choose a theme that fits your service. AI will create 
                a graceful offering message that emphasizes gratitude and purpose, never guilt.
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
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
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
