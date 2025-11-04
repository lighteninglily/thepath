import { useState, useEffect } from 'react';
import { Monitor, X, Play } from 'lucide-react';

interface Display {
  id: number;
  label: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  primary: boolean;
}

interface DisplaySelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (presenterDisplayId: number, audienceDisplayId: number, targetDuration?: number) => void;
}

/**
 * Display selection dialog shown before starting presentation
 * Allows user to choose which monitor for presenter and audience views
 * Also allows setting target duration for timer
 */
export function DisplaySelectionDialog({
  isOpen,
  onClose,
  onStart,
}: DisplaySelectionDialogProps) {
  const [displays, setDisplays] = useState<Display[]>([]);
  const [presenterDisplay, setPresenterDisplay] = useState<number>(0);
  const [audienceDisplay, setAudienceDisplay] = useState<number>(1);
  const [targetDuration, setTargetDuration] = useState<string>(''); // in minutes
  const [loading, setLoading] = useState(true);

  // Load display information
  useEffect(() => {
    if (!isOpen) return;

    const loadDisplays = async () => {
      setLoading(true);
      
      // Check if Electron API is available
      if (window.electron?.presentation?.getDisplays) {
        try {
          const displayList = await window.electron.presentation.getDisplays();
          setDisplays(displayList);
          
          // Auto-select: Primary for presenter, external for audience
          const primaryDisplay = displayList.find((d: Display) => d.primary);
          const externalDisplay = displayList.find((d: Display) => !d.primary);
          
          if (primaryDisplay) {
            setPresenterDisplay(primaryDisplay.id);
          }
          if (externalDisplay) {
            setAudienceDisplay(externalDisplay.id);
          } else if (displayList.length > 0) {
            // Single display - use same for both
            setAudienceDisplay(displayList[0].id);
          }
        } catch (error) {
          console.error('Failed to get displays:', error);
          // Fallback: assume 2 displays with IDs 0 and 1
          setDisplays([
            { id: 0, label: 'Display 1', bounds: { x: 0, y: 0, width: 1920, height: 1080 }, primary: true },
            { id: 1, label: 'Display 2', bounds: { x: 1920, y: 0, width: 1920, height: 1080 }, primary: false },
          ]);
        }
      } else {
        // Not in Electron - use mock displays for development
        setDisplays([
          { id: 0, label: 'Display 1 (Primary)', bounds: { x: 0, y: 0, width: 1920, height: 1080 }, primary: true },
        ]);
        setPresenterDisplay(0);
        setAudienceDisplay(0);
      }
      
      setLoading(false);
    };

    loadDisplays();
  }, [isOpen]);

  const handleStart = () => {
    const durationSeconds = targetDuration
      ? parseInt(targetDuration) * 60
      : undefined;
    
    onStart(presenterDisplay, audienceDisplay, durationSeconds);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl mx-4">
        {/* Header */}
        <div className="border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Monitor size={24} className="text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Start Presentation</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-white">Detecting displays...</div>
            </div>
          ) : (
            <>
              {/* Display Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Presenter View (You)
                  </label>
                  <select
                    value={presenterDisplay}
                    onChange={(e) => setPresenterDisplay(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {displays.map((display) => (
                      <option key={display.id} value={display.id}>
                        {display.primary ? '⭐ ' : ''}
                        {display.label || `Display ${display.id + 1}`} - {display.bounds.width}×{display.bounds.height}
                        {display.primary ? ' (Primary)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    Usually your laptop screen
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audience View (Projector/TV)
                  </label>
                  <select
                    value={audienceDisplay}
                    onChange={(e) => setAudienceDisplay(parseInt(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {displays.map((display) => (
                      <option key={display.id} value={display.id}>
                        {display.primary ? '⭐ ' : ''}
                        {display.label || `Display ${display.id + 1}`} - {display.bounds.width}×{display.bounds.height}
                        {display.primary ? ' (Primary)' : ''}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    External display for congregation
                  </p>
                </div>
              </div>

              {/* Target Duration (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target Duration (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={targetDuration}
                    onChange={(e) => setTargetDuration(e.target.value)}
                    placeholder="60"
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                  <span className="text-gray-300">minutes</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Timer will show warnings as you approach this duration
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                <div className="text-sm text-blue-200">
                  <div className="font-medium mb-2">💡 Tips:</div>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li>Presenter view shows controls and next slide</li>
                    <li>Audience view shows only the current slide</li>
                    <li>Press <kbd className="px-1 py-0.5 bg-blue-800 rounded">H</kbd> during presentation for keyboard shortcuts</li>
                    <li>Press <kbd className="px-1 py-0.5 bg-blue-800 rounded">ESC</kbd> to exit presentation</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Play size={20} />
            Start Presentation
          </button>
        </div>
      </div>
    </div>
  );
}
