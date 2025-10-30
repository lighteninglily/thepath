import { Check } from 'lucide-react';
import { BACKGROUND_PACKS } from '../../assets/backgroundPacks';
import type { BackgroundPack } from '../../assets/backgroundPacks';

interface BackgroundPackPickerProps {
  selectedPack?: BackgroundPack | null;
  onSelectPack: (pack: BackgroundPack) => void;
}

export function BackgroundPackPicker({ selectedPack, onSelectPack }: BackgroundPackPickerProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
          Choose Background Theme
        </h3>
        <p className="text-sm text-brand-umber">
          Pick a theme and we'll automatically rotate 3-4 different backgrounds for visual variety
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BACKGROUND_PACKS.map(pack => (
          <button
            key={pack.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectPack(pack);
            }}
            className={`relative p-4 rounded-lg border-2 transition-all text-left ${
              selectedPack?.id === pack.id
                ? 'border-brand-skyBlue bg-brand-skyBlue/10 shadow-md'
                : 'border-brand-warmGray hover:border-brand-powderBlue'
            }`}
          >
            {/* Checkmark if selected */}
            {selectedPack?.id === pack.id && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-skyBlue flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}

            {/* Pack info */}
            <div className="mb-3">
              <h4 className="font-semibold text-brand-charcoal text-lg mb-1">
                {pack.name}
              </h4>
              <p className="text-xs text-brand-umber">
                {pack.description}
              </p>
              <p className="text-xs text-brand-skyBlue mt-1 font-medium">
                {pack.backgrounds.length} backgrounds
              </p>
            </div>

            {/* Preview thumbnails */}
            <div className="grid grid-cols-3 gap-1">
              {pack.backgrounds.slice(0, 3).map((bg) => (
                <div
                  key={bg.id}
                  className="aspect-video rounded overflow-hidden"
                >
                  <img
                    src={bg.url}
                    alt={bg.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {selectedPack && (
        <div className="bg-brand-skyBlue/10 border border-brand-skyBlue/20 rounded-lg p-3">
          <p className="text-sm text-brand-charcoal">
            <strong>Selected:</strong> {selectedPack.name}
            <br />
            <span className="text-xs text-brand-umber">
              We'll automatically rotate through {selectedPack.backgrounds.length} different backgrounds
              to add visual variety to your slides
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
