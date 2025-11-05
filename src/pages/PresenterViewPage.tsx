import { useEffect, useState, useCallback } from 'react';
import { useServicePresentationStore } from '../store/servicePresentationStore';
import { ChevronLeft, ChevronRight, X, Monitor } from 'lucide-react';

export function PresenterViewPage() {
  const {
    service,
    currentSlideIndex,
    currentSlide,
    isPresenting,
    nextSlide,
    previousSlide,
    goToSlide,
    endPresentation,
  } = useServicePresentationStore();

  const [displays, setDisplays] = useState<any[]>([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer
  useEffect(() => {
    if (!isTimerRunning) return;
    
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (isPresenting && !isTimerRunning) {
      setIsTimerRunning(true);
    }
  }, [isPresenting]);

  // Fetch displays
  useEffect(() => {
    const fetchDisplays = async () => {
      try {
        // @ts-ignore - Display API from Electron
        if (window.electron?.display?.getAll) {
          // @ts-ignore
          const displays = await window.electron.display.getAll();
          setDisplays(displays);
        }
      } catch (error) {
        console.log('Display API not available:', error);
      }
    };
    fetchDisplays();
  }, []);

  // Keyboard shortcuts
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault();
        nextSlide();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        previousSlide();
        break;
      case 'Escape':
        endPresentation();
        break;
      case 'b':
      case 'B':
        e.preventDefault();
        // @ts-ignore
        window.electron?.presentation?.blank?.('black');
        break;
      case 'w':
      case 'W':
        e.preventDefault();
        // @ts-ignore
        window.electron?.presentation?.blank?.('white');
        break;
      case 'Home':
        e.preventDefault();
        goToSlide(0);
        break;
      case 'End':
        e.preventDefault();
        goToSlide(99); // Max slide
        break;
    }
  }, [nextSlide, previousSlide, endPresentation, goToSlide]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!service) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center">
          <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p className="text-xl">No service loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col text-white">
      {/* Header */}
      <div className="bg-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-700">
        <div>
          <h1 className="text-xl font-bold">{service.name}</h1>
          <p className="text-sm text-gray-400">
            Slide {currentSlideIndex + 1} • {formatTime(elapsedTime)} elapsed
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-400 mr-4">
            {displays.length} display{displays.length !== 1 ? 's' : ''} connected
          </div>
          <button
            onClick={() => {
              // @ts-ignore
              window.electron?.presentation?.blank?.('black');
            }}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors text-sm"
          >
            Blank (B)
          </button>
          <button
            onClick={endPresentation}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors flex items-center gap-2"
          >
            <X size={18} />
            End Presentation
          </button>
        </div>
      </div>

      {/* Main Content - Two Pane Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Current Slide - Large */}
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-300">Current Slide</h2>
            <p className="text-sm text-gray-500">
              {currentSlide && 'itemTitle' in currentSlide ? currentSlide.itemTitle : ''}
            </p>
          </div>
          <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-green-500">
            {currentSlide && (
              <div className="w-full h-full flex items-center justify-center p-8">
                <div className="text-center">
                  <pre className="text-3xl font-medium whitespace-pre-wrap">
                    {currentSlide.content}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Next Slide Preview - Medium */}
        <div className="w-1/3 flex flex-col p-6 border-l border-gray-700">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-gray-300">Next Slide</h2>
            <p className="text-sm text-gray-500">Preview</p>
          </div>
          <div className="flex-1 bg-black rounded-lg overflow-hidden shadow-lg border border-gray-600">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p>Next slide preview</p>
            </div>
          </div>

          {/* Notes Section */}
          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Notes</h3>
            <p className="text-sm text-gray-300">
              {/* Add slide notes here in future */}
              Press → or Space for next slide
              <br />
              Press ← for previous slide
              <br />
              Press B to blank screen
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={previousSlide}
              disabled={currentSlideIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              onClick={nextSlide}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Current Slide Indicator */}
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-blue-600 rounded font-mono text-white">
              {currentSlideIndex + 1}
            </div>
          </div>

          {/* Timer */}
          <div className="text-right">
            <div className="text-2xl font-mono font-bold">{formatTime(elapsedTime)}</div>
            <div className="text-xs text-gray-400">Elapsed Time</div>
          </div>
        </div>
      </div>
    </div>
  );
}
