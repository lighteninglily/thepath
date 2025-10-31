import { X, BookOpen, Loader2, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { openaiService } from '../../services/openaiService';

interface AddSermonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSermon: (sermon: {
    title: string;
    scripture?: string;
    points?: string[];
    aiGenerated: any;
  }) => void;
}

export function AddSermonModal({ isOpen, onClose, onAddSermon }: AddSermonModalProps) {
  const [title, setTitle] = useState('');
  const [scripture, setScripture] = useState('');
  const [points, setPoints] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!title.trim()) {
      setError('Please enter a sermon title');
      return;
    }

    setLoading(true);
    setError('');
    setPreview(null);

    try {
      console.log('🎤 Generating sermon slides:', { title, scripture, points });
      
      const result = await openaiService.generateSermonSlides({
        title,
        scripture: scripture || undefined,
        points: points.filter(p => p.trim())
      });

      console.log('✅ Sermon slides generated:', result);
      setPreview(result);

    } catch (err) {
      console.error('❌ Error generating sermon slides:', err);
      setError('Failed to generate sermon slides. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      setError('Please generate slides first');
      return;
    }

    onAddSermon({
      title,
      scripture,
      points: points.filter(p => p.trim()),
      aiGenerated: preview
    });

    // Reset
    setTitle('');
    setScripture('');
    setPoints(['']);
    setPreview(null);
    setError('');
    onClose();
  };

  const addPoint = () => {
    setPoints([...points, '']);
  };

  const removePoint = (index: number) => {
    setPoints(points.filter((_, i) => i !== index));
  };

  const updatePoint = (index: number, value: string) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const handleClose = () => {
    setTitle('');
    setScripture('');
    setPoints(['']);
    setPreview(null);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-orange-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Sermon Slides</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                AI will create beautiful sermon slides for you
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
          {/* Sermon Title */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Sermon Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Walking in Faith"
              autoFocus
              disabled={loading}
            />
          </div>

          {/* Scripture Reference */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Main Scripture Reference (optional)
            </label>
            <input
              type="text"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="e.g., Hebrews 11:1-6"
              disabled={loading}
            />
          </div>

          {/* Key Points */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Key Points (optional)
            </label>
            <div className="space-y-2">
              {points.map((point, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={point}
                    onChange={(e) => updatePoint(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder={`Point ${index + 1}`}
                    disabled={loading}
                  />
                  {points.length > 1 && (
                    <button
                      onClick={() => removePoint(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
              {points.length < 5 && (
                <button
                  onClick={addPoint}
                  className="w-full px-4 py-2 border-2 border-dashed border-brand-warmGray rounded-lg text-brand-umber hover:border-orange-300 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  <Plus size={18} />
                  Add Point
                </button>
              )}
            </div>
            <p className="text-xs text-brand-umber mt-1">
              Leave blank and AI will suggest key points for you
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
              <p className="text-sm font-semibold text-green-800">✨ Slides Generated!</p>
              
              {/* Title Slide Preview */}
              <div className="p-3 bg-white rounded border">
                <p className="text-xs text-gray-500 mb-1">Slide 1: Title</p>
                <p className="font-bold text-brand-charcoal">{preview.titleSlide?.title}</p>
                <p className="text-sm text-brand-umber">{preview.titleSlide?.subtitle}</p>
              </div>

              {/* Points Slide Preview */}
              {preview.pointsSlide && (
                <div className="p-3 bg-white rounded border">
                  <p className="text-xs text-gray-500 mb-1">Slide 2: Key Points</p>
                  <p className="font-semibold text-brand-charcoal mb-2">{preview.pointsSlide?.title}</p>
                  <ul className="text-sm text-brand-umber space-y-1">
                    {preview.pointsSlide.points?.map((point: string, idx: number) => (
                      <li key={idx}>• {point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Closing Slide Preview */}
              <div className="p-3 bg-white rounded border">
                <p className="text-xs text-gray-500 mb-1">Slide {preview.pointsSlide ? 3 : 2}: Closing</p>
                <p className="font-bold text-brand-charcoal">{preview.closingSlide?.title}</p>
                <p className="text-sm text-brand-umber">{preview.closingSlide?.callToAction}</p>
              </div>
            </div>
          )}

          {/* Help Text */}
          {!preview && !loading && (
            <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-lg">
              <p className="text-sm text-brand-umber">
                💡 <strong>Tip:</strong> Enter your sermon title and optionally add scripture reference 
                and key points. AI will create beautiful, professional sermon slides in seconds!
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
              disabled={loading || !title.trim()}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Slides'
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
