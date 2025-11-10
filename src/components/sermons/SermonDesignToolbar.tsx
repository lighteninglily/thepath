import { useState } from 'react';
import { Palette, Type, Globe, FileText } from 'lucide-react';
import { 
  SERMON_SLIDE_DESIGNS, 
  SERMON_COLOR_PALETTE,
  SERMON_FONT_COMBINATIONS
} from '../../config/sermonSlideDesigns';

interface SermonDesignToolbarProps {
  currentDesignId: string;
  onSelectDesign: (designId: string) => void;
  onChangeBackgroundColor: (color: string) => void;
  onChangeFontSize: (type: 'title' | 'body' | 'scripture', size: number) => void;
  onChangeFontFamily: (titleFont: string, bodyFont: string) => void;
  globalMode: boolean;
  onToggleGlobalMode: (enabled: boolean) => void;
  currentBackgroundColor?: string;
  currentTitleSize?: number;
  currentBodySize?: number;
  currentScriptureSize?: number;
}

export function SermonDesignToolbar({
  currentDesignId,
  onSelectDesign,
  onChangeBackgroundColor,
  onChangeFontSize,
  onChangeFontFamily,
  globalMode,
  onToggleGlobalMode,
  currentBackgroundColor,
  currentTitleSize,
  currentBodySize,
  currentScriptureSize
}: SermonDesignToolbarProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);

  const handleGlobalToggle = () => {
    if (!globalMode) {
      const confirmed = confirm(
        'Apply current design to ALL sermon slides?\n\n' +
        'This will update the background color, fonts, and sizes for every slide in this sermon.'
      );
      if (!confirmed) return;
    }
    onToggleGlobalMode(!globalMode);
  };

  return (
    <div className="border-b border-gray-200 bg-white">
      {/* Template Selector */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={16} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Slide Templates</span>
        </div>
        <div className="flex gap-2">
          {SERMON_SLIDE_DESIGNS.map((design) => (
            <button
              key={design.id}
              onClick={() => onSelectDesign(design.id)}
              className={`
                relative px-4 py-2 rounded-lg border-2 transition-all
                ${currentDesignId === design.id 
                  ? 'border-blue-500 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300 bg-white'
                }
              `}
            >
              <div className="text-sm font-medium text-gray-900">{design.name}</div>
              {/* Preview swatch */}
              <div 
                className="mt-1 h-2 rounded-full"
                style={{
                  background: design.background.type === 'gradient' && design.background.gradient
                    ? `linear-gradient(${design.background.gradient.angle || 135}deg, ${design.background.gradient.from}, ${design.background.gradient.to})`
                    : design.background.color || '#667eea'
                }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Customization Controls */}
      <div className="px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Background Color */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowFontPicker(false);
              setShowSizePicker(false);
            }}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Palette size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Background</span>
            <div 
              className="w-6 h-6 rounded border-2 border-white shadow-sm"
              style={{ backgroundColor: currentBackgroundColor || '#667eea' }}
            />
          </button>

          {/* Color Picker Dropdown */}
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-20">
              <div className="grid grid-cols-5 gap-2 w-[220px]">
                {SERMON_COLOR_PALETTE.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      onChangeBackgroundColor(color);
                      setShowColorPicker(false);
                    }}
                    className="w-10 h-10 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              setShowColorPicker(false);
              setShowSizePicker(false);
            }}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Type size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Font Style</span>
          </button>

          {/* Font Picker Dropdown */}
          {showFontPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20 min-w-[200px]">
              {SERMON_FONT_COMBINATIONS.map((combo) => (
                <button
                  key={combo.id}
                  onClick={() => {
                    onChangeFontFamily(combo.title, combo.body);
                    setShowFontPicker(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
                >
                  <div className="text-sm font-medium text-gray-900">{combo.label}</div>
                  <div className="text-xs text-gray-500">{combo.title}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Adjuster */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSizePicker(!showSizePicker);
              setShowColorPicker(false);
              setShowFontPicker(false);
            }}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Type size={16} className="text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Font Size</span>
          </button>

          {/* Size Picker Dropdown */}
          {showSizePicker && (
            <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-20 min-w-[280px]">
              <div className="space-y-3">
                {/* Title Size */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Title Size: {currentTitleSize || 72}px
                  </label>
                  <input
                    type="range"
                    min="40"
                    max="120"
                    step="2"
                    value={currentTitleSize || 72}
                    onChange={(e) => onChangeFontSize('title', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Body Size */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Body Size: {currentBodySize || 42}px
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="72"
                    step="2"
                    value={currentBodySize || 42}
                    onChange={(e) => onChangeFontSize('body', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Scripture Size */}
                <div>
                  <label className="text-xs font-medium text-gray-700 block mb-1">
                    Scripture Ref Size: {currentScriptureSize || 32}px
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="56"
                    step="2"
                    value={currentScriptureSize || 32}
                    onChange={(e) => onChangeFontSize('scripture', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gray-300" />

        {/* Global Mode Toggle */}
        <button
          onClick={handleGlobalToggle}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
            ${globalMode 
              ? 'border-green-500 bg-green-50 text-green-700' 
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          <Globe size={16} />
          <span className="text-sm font-medium">
            {globalMode ? 'Apply to All Slides' : 'This Slide Only'}
          </span>
        </button>

        {globalMode && (
          <span className="text-xs text-green-600 font-medium">
            ✓ Changes will apply to all slides
          </span>
        )}
      </div>

      {/* Click outside to close dropdowns */}
      {(showColorPicker || showFontPicker || showSizePicker) && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => {
            setShowColorPicker(false);
            setShowFontPicker(false);
            setShowSizePicker(false);
          }}
        />
      )}
    </div>
  );
}
