import { X, Hand, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { openaiService } from '../../services/openaiService';

interface AddWelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWelcome: (welcome: {
    churchName: string;
    serviceType: string;
    aiGenerated: any;
  }) => void;
}

export function AddWelcomeModal({ isOpen, onClose, onAddWelcome }: AddWelcomeModalProps) {
  const [churchName, setChurchName] = useState('The Way Church');
  const [serviceType, setServiceType] = useState('Sunday Service');
  const [specialMessage, setSpecialMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!churchName.trim()) {
      setError('Please enter church name');
      return;
    }

    setLoading(true);
    setError('');
    setPreview(null);

    try {
      console.log('👋 Generating welcome slide:', { churchName, serviceType, specialMessage });
      
      const result = await openaiService.generateWelcomeSlide({
        churchName,
        serviceType,
        specialMessage: specialMessage || undefined
      });

      console.log('✅ Welcome slide generated:', result);
      setPreview(result);

    } catch (err) {
      console.error('❌ Error generating welcome slide:', err);
      setError('Failed to generate welcome slide. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      setError('Please generate slide first');
      return;
    }

    onAddWelcome({
      churchName,
      serviceType,
      aiGenerated: preview
    });

    // Reset
    setChurchName('The Way Church');
    setServiceType('Sunday Service');
    setSpecialMessage('');
    setPreview(null);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setChurchName('The Way Church');
    setServiceType('Sunday Service');
    setSpecialMessage('');
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
            <Hand size={24} className="text-green-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Welcome Slide</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Create a warm, inviting welcome message
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
          {/* Church Name */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Church Name
            </label>
            <input
              type="text"
              value={churchName}
              onChange={(e) => setChurchName(e.target.value)}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="The Way Church"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Service Type
            </label>
            <select
              value={serviceType}
              onChange={(e) => setServiceType(e.target.value)}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={loading}
            >
              <option>Sunday Service</option>
              <option>Sunday Morning</option>
              <option>Sunday Evening</option>
              <option>Midweek Service</option>
              <option>Prayer Meeting</option>
              <option>Youth Service</option>
              <option>Special Event</option>
            </select>
          </div>

          {/* Special Message */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Special Message (optional)
            </label>
            <input
              type="text"
              value={specialMessage}
              onChange={(e) => setSpecialMessage(e.target.value)}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g., First time visitors, we're glad you're here!"
              disabled={loading}
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 size={20} className="animate-spin text-green-600" />
                <p className="text-sm font-semibold text-green-800">AI is creating your welcome slide...</p>
              </div>
              <div className="space-y-1 text-xs text-green-700">
                <p>✨ Personalizing for your church</p>
                <p>🎨 Crafting warm, inviting message</p>
                <p>📝 Creating welcoming greeting</p>
              </div>
              <div className="mt-3 h-1 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-800 mb-1">Generation Failed</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={handleGenerate}
                  className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">✓</div>
                <p className="text-sm font-semibold text-green-800">Welcome Slide Generated Successfully!</p>
              </div>
              
              <div className="p-4 bg-white rounded border">
                <p className="text-2xl font-bold text-brand-charcoal mb-2">{preview.mainMessage}</p>
                <p className="text-lg text-brand-umber mb-2">{preview.subtitle}</p>
                <p className="text-brand-umber">{preview.greeting}</p>
              </div>
            </div>
          )}

          {/* Help Text */}
          {!preview && !loading && (
            <div className="p-4 bg-green-50/50 border border-green-200 rounded-lg">
              <p className="text-sm text-brand-umber">
                💡 <strong>Tip:</strong> AI will create a warm, inviting welcome message that makes 
                everyone feel at home. Perfect for the start of your service!
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
              disabled={loading || !churchName.trim()}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
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
