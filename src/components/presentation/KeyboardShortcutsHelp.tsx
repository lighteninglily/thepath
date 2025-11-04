import { X, Keyboard } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string[];
  description: string;
  category: 'navigation' | 'control' | 'utility';
}

const SHORTCUTS: Shortcut[] = [
  // Navigation
  { keys: ['Space', '→', '↓'], description: 'Next slide', category: 'navigation' },
  { keys: ['Backspace', '←', '↑'], description: 'Previous slide', category: 'navigation' },
  { keys: ['G'], description: 'Go to slide (type number)', category: 'navigation' },
  { keys: ['Home'], description: 'First slide', category: 'navigation' },
  { keys: ['End'], description: 'Last slide', category: 'navigation' },
  { keys: ['1-9'], description: 'Jump to slide 1-9', category: 'navigation' },
  
  // Control
  { keys: ['B'], description: 'Toggle blank screen', category: 'control' },
  { keys: ['Escape'], description: 'Exit presentation', category: 'control' },
  { keys: ['T'], description: 'Reset timer', category: 'control' },
  
  // Utility
  { keys: ['H', '?'], description: 'Show this help', category: 'utility' },
  { keys: ['F11'], description: 'Toggle fullscreen', category: 'utility' },
];

/**
 * Keyboard shortcuts help overlay
 * Press H or ? to show during presentation
 */
export function KeyboardShortcutsHelp({ isOpen, onClose }: KeyboardShortcutsHelpProps) {
  if (!isOpen) return null;

  const categories = {
    navigation: SHORTCUTS.filter(s => s.category === 'navigation'),
    control: SHORTCUTS.filter(s => s.category === 'control'),
    utility: SHORTCUTS.filter(s => s.category === 'utility'),
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-8"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Keyboard size={24} className="text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Keyboard Shortcuts</h2>
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
          {/* Navigation Section */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-3">🧭 Navigation</h3>
            <div className="space-y-2">
              {categories.navigation.map((shortcut, index) => (
                <ShortcutRow key={index} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* Control Section */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-3">🎮 Control</h3>
            <div className="space-y-2">
              {categories.control.map((shortcut, index) => (
                <ShortcutRow key={index} shortcut={shortcut} />
              ))}
            </div>
          </div>

          {/* Utility Section */}
          <div>
            <h3 className="text-lg font-semibold text-purple-400 mb-3">🛠️ Utility</h3>
            <div className="space-y-2">
              {categories.utility.map((shortcut, index) => (
                <ShortcutRow key={index} shortcut={shortcut} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 bg-gray-750">
          <div className="text-center text-gray-400 text-sm">
            <p>💡 Press <kbd className="px-2 py-1 bg-gray-700 rounded text-white">H</kbd> or <kbd className="px-2 py-1 bg-gray-700 rounded text-white">?</kbd> anytime to show this help</p>
            <p className="mt-2">Press <kbd className="px-2 py-1 bg-gray-700 rounded text-white">Escape</kbd> to close</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ shortcut }: { shortcut: Shortcut }) {
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-700/50 transition-colors">
      <span className="text-gray-300">{shortcut.description}</span>
      <div className="flex gap-2">
        {shortcut.keys.map((key, index) => (
          <kbd
            key={index}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white font-mono text-sm min-w-[40px] text-center"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}
