import { useState, useRef } from 'react';
import { Copy, Check, FileText } from 'lucide-react';

interface LyricsPanelProps {
  fullLyrics: string;
  onLyricsChange: (lyrics: string) => void;
  onPasteToSlide: (text: string) => void;
  currentSlideContent?: string;
}

export function LyricsPanel({ fullLyrics, onLyricsChange, onPasteToSlide }: LyricsPanelProps) {
  const [selectedText, setSelectedText] = useState('');
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = fullLyrics.substring(start, end);
      setSelectedText(selected);
    }
  };

  const handleSelectAll = () => {
    if (textareaRef.current) {
      textareaRef.current.select();
      setSelectedText(fullLyrics);
    }
  };

  const handleCopy = async () => {
    const textToCopy = selectedText || fullLyrics;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePaste = () => {
    const textToPaste = selectedText || fullLyrics;
    onPasteToSlide(textToPaste);
  };


  return (
    <div className="w-64 border-l border-gray-200 bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-700">Full Lyrics</h3>
        </div>
        <p className="text-xs text-gray-500">
          Select text to copy or paste to slides
        </p>
      </div>

      {/* Lyrics Text Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <textarea
          ref={textareaRef}
          value={fullLyrics}
          onChange={(e) => onLyricsChange(e.target.value)}
          onSelect={handleSelect}
          className="flex-1 w-full p-4 text-xs font-mono leading-relaxed
            bg-white border-0 focus:outline-none focus:ring-0
            resize-none"
          placeholder="Full song lyrics will appear here..."
          spellCheck={false}
        />
      </div>

      {/* Action Buttons */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        <button
          onClick={handleSelectAll}
          className="w-full px-3 py-2 text-xs font-medium text-gray-700
            bg-white border border-gray-300 rounded-lg
            hover:bg-gray-50 transition-colors"
        >
          Select All
        </button>
        
        <button
          onClick={handleCopy}
          disabled={copied}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium
            bg-blue-600 text-white rounded-lg
            hover:bg-blue-700 transition-colors
            disabled:bg-green-600 disabled:cursor-default"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={14} />
              Copy {selectedText ? 'Selection' : 'All'}
            </>
          )}
        </button>

        {selectedText && (
          <button
            onClick={handlePaste}
            className="w-full px-3 py-2 text-xs font-medium
              bg-green-600 text-white rounded-lg
              hover:bg-green-700 transition-colors"
          >
            Paste to Current Slide
          </button>
        )}

        {selectedText && (
          <div className="text-xs text-gray-500 text-center pt-1">
            {selectedText.split('\n').length} lines selected
          </div>
        )}
      </div>
    </div>
  );
}
