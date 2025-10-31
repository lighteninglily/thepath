import React, { useState } from 'react';
import { X, Sparkles, Check, AlertCircle, Zap, Mountain, Waves, Cloud, Trees } from 'lucide-react';
import { useQuickGenerate } from '../../hooks/useQuickGenerate';
import { GenerationResult } from '../../services/slideGeneratorService';
import { GenerationPreviewModal } from './GenerationPreviewModal';

interface QuickGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (result: GenerationResult) => void;
}

export const QuickGenerateModal: React.FC<QuickGenerateModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [selectedTheme, setSelectedTheme] = useState<'mountains' | 'waves' | 'clouds' | 'forest'>('waves');
  const { generateAsync, isGenerating, progress, error, availability } = useQuickGenerate();
  
  // Preview modal state
  const [previewData, setPreviewData] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) return;

    try {
      const result = await generateAsync({ title, artist, themePack: selectedTheme });
      
      // Show preview instead of immediately completing
      setPreviewData({
        title,
        artist,
        slides: result.slides,
        analysis: result.analysis,
        themePack: selectedTheme,
        metadata: result.metadata,
        structureDetection: result.structureDetection,
      });
      setShowPreview(true);
    } catch (err) {
      // Error handled by hook
      console.error('Generation error:', err);
    }
  };
  
  const handleAcceptPreview = () => {
    if (previewData) {
      onComplete({
        slides: previewData.slides,
        analysis: previewData.analysis,
        songInfo: {
          title: previewData.title,
          artist: previewData.artist,
          lyrics: '',
        },
        metadata: previewData.metadata,
        structureDetection: previewData.structureDetection,
      });
      setShowPreview(false);
      setPreviewData(null);
      onClose();
      
      // Reset form
      setTitle('');
      setArtist('');
      setSelectedTheme('waves');
    }
  };
  
  const handleRegeneratePreview = () => {
    // Close preview, let user change theme and regenerate
    setShowPreview(false);
    setPreviewData(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating && title.trim() && availability.canGenerate) {
      handleGenerate();
    }
  };

  if (!isOpen) return null;

  // Check if generation is possible
  const canGenerate = availability.canGenerate;
  const missingServices = [];
  if (!availability.genius) missingServices.push('Genius API (requires Electron)');
  if (!availability.openai) missingServices.push('OpenAI API');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-brand-skyBlue" />
            <h2 className="text-xl font-bold">Quick Create Song</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Availability Warning */}
        {!canGenerate && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-2 text-sm text-yellow-800">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">AI Generation Not Available</p>
                <p className="mt-1">Missing: {missingServices.join(', ')}</p>
                <p className="mt-2 text-xs">
                  Run in Electron mode and configure OpenAI API key in .env to use this feature.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!isGenerating && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Song Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Goodness of God"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                autoFocus
                disabled={!canGenerate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Artist (optional but recommended)
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., Bethel Music"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                disabled={!canGenerate}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Background Theme *
              </label>
              <div className="grid grid-cols-4 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('mountains')}
                  disabled={!canGenerate}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedTheme === 'mountains'
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Mountain className={`w-6 h-6 ${
                    selectedTheme === 'mountains' ? 'text-brand-skyBlue' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedTheme === 'mountains' ? 'text-brand-skyBlue' : 'text-gray-700'
                  }`}>Mountains</span>
                  <span className="text-xs text-gray-500">Powerful, majestic</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme('waves')}
                  disabled={!canGenerate}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedTheme === 'waves'
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Waves className={`w-6 h-6 ${
                    selectedTheme === 'waves' ? 'text-brand-skyBlue' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedTheme === 'waves' ? 'text-brand-skyBlue' : 'text-gray-700'
                  }`}>Ocean Waves</span>
                  <span className="text-xs text-gray-500">Joyful, flowing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme('clouds')}
                  disabled={!canGenerate}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedTheme === 'clouds'
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Cloud className={`w-6 h-6 ${
                    selectedTheme === 'clouds' ? 'text-brand-skyBlue' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedTheme === 'clouds' ? 'text-brand-skyBlue' : 'text-gray-700'
                  }`}>Clouds</span>
                  <span className="text-xs text-gray-500">Peaceful, reflective</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTheme('forest')}
                  disabled={!canGenerate}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition ${
                    selectedTheme === 'forest'
                      ? 'border-brand-skyBlue bg-brand-skyBlue/10'
                      : 'border-gray-200 hover:border-gray-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Trees className={`w-6 h-6 ${
                    selectedTheme === 'forest' ? 'text-brand-skyBlue' : 'text-gray-600'
                  }`} />
                  <span className={`text-sm font-medium ${
                    selectedTheme === 'forest' ? 'text-brand-skyBlue' : 'text-gray-700'
                  }`}>Forests</span>
                  <span className="text-xs text-gray-500">Calm, grounded</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{(error as Error).message || 'Generation failed. Please try again.'}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!title.trim() || !canGenerate}
              className="w-full bg-brand-skyBlue hover:bg-brand-powderBlue text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <Sparkles className="w-5 h-5" />
              Generate Slides
            </button>

            <p className="text-xs text-gray-500 text-center">
              Automatically fetches lyrics, analyzes the song, and creates beautiful slides in ~30 seconds
            </p>
          </div>
        )}

        {/* Progress */}
        {isGenerating && progress && (
          <div className="space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{progress.message}</span>
                <span>{Math.round(progress.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-brand-skyBlue h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              <ProgressStep
                label="Fetch lyrics from Genius"
                completed={progress.step > 1}
                active={progress.step === 1}
              />
              <ProgressStep
                label="Analyze song with AI"
                completed={progress.step > 2}
                active={progress.step === 2}
              />
              <ProgressStep
                label="Break into slides"
                completed={progress.step > 3}
                active={progress.step === 3}
              />
              <ProgressStep
                label="Create beautiful slides"
                completed={progress.step > 4}
                active={progress.step === 4}
              />
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-600 pt-4">
              <div className="animate-spin h-4 w-4 border-2 border-brand-skyBlue border-t-transparent rounded-full" />
              <span>Creating slides...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Preview Modal */}
      <GenerationPreviewModal
        isOpen={showPreview}
        onClose={() => {
          setShowPreview(false);
          setPreviewData(null);
        }}
        generatedSong={previewData}
        onAccept={handleAcceptPreview}
        onRegenerate={handleRegeneratePreview}
      />
    </div>
  );
};

const ProgressStep: React.FC<{
  label: string;
  completed: boolean;
  active: boolean;
}> = ({ label, completed, active }) => (
  <div className="flex items-center gap-2">
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center ${
        completed
          ? 'bg-green-500'
          : active
          ? 'bg-brand-skyBlue animate-pulse'
          : 'bg-gray-200'
      }`}
    >
      {completed && <Check className="w-3 h-3 text-white" />}
    </div>
    <span
      className={`text-sm ${
        completed ? 'text-green-600' : active ? 'text-brand-skyBlue font-medium' : 'text-gray-400'
      }`}
    >
      {label}
    </span>
  </div>
);
