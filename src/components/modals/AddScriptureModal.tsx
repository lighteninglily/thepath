import { X, BookOpen, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { openaiService } from '../../services/openaiService';

interface AddScriptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddScripture: (scripture: { 
    reference: string; 
    text: string; 
    version: string;
    parts?: string[];
    shouldSplit?: boolean;
  }) => void;
}

export function AddScriptureModal({ isOpen, onClose, onAddScripture }: AddScriptureModalProps) {
  const [reference, setReference] = useState('');
  const [version, setVersion] = useState('NIV');
  const [scriptureText, setScriptureText] = useState('');
  const [scriptureParts, setScriptureParts] = useState<string[]>([]);
  const [shouldSplit, setShouldSplit] = useState(false);
  const [selectedSlideCount, setSelectedSlideCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLookup = async () => {
    if (!reference.trim()) {
      setError('Please enter a scripture reference (e.g., John 3:16)');
      return;
    }

    setLoading(true);
    setError('');
    setScriptureText('');
    setScriptureParts([]);
    setShouldSplit(false);

    try {
      console.log('🔍 Looking up scripture:', reference, version);
      
      const result = await openaiService.lookupScripture(reference, version);

      // Check if response looks like an error message
      if (result.fullText.toLowerCase().includes('cannot find') || result.fullText.toLowerCase().includes('invalid')) {
        setError(result.fullText);
        return;
      }

      console.log('✅ Scripture found:', {
        wordCount: result.fullText.split(' ').length,
        shouldSplit: result.shouldSplit,
        partsCount: result.parts.length
      });
      
      setScriptureText(result.fullText);
      setScriptureParts(result.parts);
      setShouldSplit(result.shouldSplit);
      // Default to AI recommendation
      setSelectedSlideCount(result.parts.length);

    } catch (err) {
      console.error('❌ Error looking up scripture:', err);
      setError('Failed to look up scripture. Please check the reference and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to split scripture into N parts evenly
  const splitIntoNParts = (text: string, n: number): string[] => {
    if (n === 1) return [text];
    
    const words = text.split(' ');
    const wordsPerPart = Math.ceil(words.length / n);
    const parts: string[] = [];
    
    for (let i = 0; i < n; i++) {
      const start = i * wordsPerPart;
      const end = Math.min(start + wordsPerPart, words.length);
      parts.push(words.slice(start, end).join(' '));
    }
    
    return parts;
  };

  const handleAdd = () => {
    if (!scriptureText) {
      setError('Please look up a scripture first');
      return;
    }

    // Use selected slide count to re-split if needed
    const finalParts = selectedSlideCount && selectedSlideCount !== scriptureParts.length
      ? splitIntoNParts(scriptureText, selectedSlideCount)
      : scriptureParts;

    onAddScripture({
      reference,
      text: scriptureText,
      version,
      parts: finalParts,
      shouldSplit: finalParts.length > 1,
    });

    // Reset and close
    setReference('');
    setScriptureText('');
    setScriptureParts([]);
    setShouldSplit(false);
    setSelectedSlideCount(null);
    setError('');
    onClose();
  };

  const handleClose = () => {
    setReference('');
    setScriptureText('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <BookOpen size={24} className="text-blue-600" />
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">Add Scripture Reading</h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Type a reference and we'll look it up for you
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
          {/* Reference Input */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Scripture Reference
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., John 3:16 or Romans 8:28-30"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
                className="flex-1 px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                disabled={loading}
              />
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="px-3 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="NIV">NIV</option>
                <option value="ESV">ESV</option>
                <option value="KJV">KJV</option>
                <option value="NKJV">NKJV</option>
                <option value="NLT">NLT</option>
                <option value="NASB">NASB</option>
              </select>
              <button
                onClick={handleLookup}
                disabled={loading || !reference.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Looking up...
                  </>
                ) : (
                  'Look Up'
                )}
              </button>
            </div>
            <p className="text-xs text-brand-umber mt-1">
              Examples: "John 3:16", "Psalm 23:1-6", "Romans 8:28"
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Scripture Text */}
          {scriptureText && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-brand-charcoal">
                Scripture Text ({version})
              </label>
              
              {/* Split Notice with Slide Count Selector */}
              {shouldSplit && scriptureParts.length > 1 && selectedSlideCount && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-amber-800 font-medium">
                      📖 Split into slides:
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedSlideCount(Math.max(1, selectedSlideCount - 1))}
                        disabled={selectedSlideCount <= 1}
                        className="p-1 rounded hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Fewer slides"
                      >
                        <ChevronDown size={18} className="text-amber-700" />
                      </button>
                      <span className="text-lg font-bold text-amber-900 min-w-[2rem] text-center">
                        {selectedSlideCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setSelectedSlideCount(Math.min(scriptureParts.length, selectedSlideCount + 1))}
                        disabled={selectedSlideCount >= scriptureParts.length}
                        className="p-1 rounded hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="More slides"
                      >
                        <ChevronUp size={18} className="text-amber-700" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-1">
                    AI recommends {scriptureParts.length} slides. Use arrows to adjust (1-{scriptureParts.length})
                  </p>
                </div>
              )}
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg max-h-[300px] overflow-y-auto">
                {shouldSplit && scriptureParts.length > 1 ? (
                  // Show parts with labels
                  <div className="space-y-4">
                    {scriptureParts.map((part, index) => (
                      <div key={index} className="space-y-1">
                        <p className="text-xs font-semibold text-blue-700">
                          Part {index + 1} of {scriptureParts.length}:
                        </p>
                        <p className="text-brand-charcoal leading-relaxed whitespace-pre-wrap">
                          {part}
                        </p>
                        {index < scriptureParts.length - 1 && (
                          <hr className="my-2 border-blue-200" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show as single text
                  <p className="text-brand-charcoal leading-relaxed whitespace-pre-wrap">
                    {scriptureText}
                  </p>
                )}
              </div>
              <p className="text-xs text-brand-umber italic">
                ✓ Found! Click "Add to Service" to add this scripture.
              </p>
            </div>
          )}

          {/* Help Text */}
          {!scriptureText && !error && !loading && (
            <div className="p-4 bg-brand-warmGray/20 rounded-lg">
              <p className="text-sm text-brand-umber">
                💡 <strong>Tip:</strong> Type any Bible reference (like "John 3:16" or "Psalm 23") and click "Look Up". 
                We'll use AI to find the exact text for you!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-brand-charcoal hover:bg-brand-warmGray rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!scriptureText}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
          >
            <BookOpen size={18} />
            Add to Service
          </button>
        </div>
      </div>
    </div>
  );
}
