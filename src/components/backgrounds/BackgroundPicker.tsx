import { useState } from 'react';
import { Image, Shuffle } from 'lucide-react';
import { WORSHIP_BACKGROUNDS, getBackgroundsByCategory, getRandomBackground } from '../../assets/backgrounds';
import type { BackgroundImage } from '../../assets/backgrounds';

interface BackgroundPickerProps {
  selectedBackground?: BackgroundImage | null;
  onSelectBackground: (background: BackgroundImage) => void;
}

export function BackgroundPicker({ selectedBackground, onSelectBackground }: BackgroundPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const backgrounds = selectedCategory === 'all' 
    ? WORSHIP_BACKGROUNDS 
    : getBackgroundsByCategory(selectedCategory as any);

  const handleRandom = () => {
    const random = getRandomBackground();
    onSelectBackground(random);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image size={20} className="text-brand-skyBlue" />
          <h3 className="text-lg font-semibold text-brand-charcoal">
            Choose Background
          </h3>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleRandom();
          }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm
            bg-brand-skyBlue/10 text-brand-skyBlue
            hover:bg-brand-skyBlue/20 transition-colors"
        >
          <Shuffle size={16} />
          Random
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {['all', 'mountains', 'nature', 'water', 'sky', 'abstract', 'light'].map(cat => (
          <button
            key={cat}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              selectedCategory === cat
                ? 'bg-brand-skyBlue text-white'
                : 'bg-brand-warmGray/20 text-brand-umber hover:bg-brand-warmGray/30'
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Background grid */}
      <div className="grid grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
        {backgrounds.map(bg => (
          <button
            key={bg.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Background selected:', bg.name);
              onSelectBackground(bg);
            }}
            className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
              selectedBackground?.id === bg.id
                ? 'border-brand-skyBlue shadow-lg scale-105'
                : 'border-brand-warmGray hover:border-brand-powderBlue'
            }`}
          >
            <img 
              src={bg.url} 
              alt={bg.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            
            {/* Text color indicator */}
            <div className={`absolute top-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              bg.textColor === 'light' ? 'bg-white' : 'bg-black'
            }`} />
          </button>
        ))}
      </div>

      {selectedBackground && (
        <div className="text-xs text-brand-umber text-center">
          {selectedBackground.name} • {selectedBackground.mood}
        </div>
      )}
    </div>
  );
}
