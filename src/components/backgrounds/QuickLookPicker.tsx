import { Sparkles, Check } from 'lucide-react';
import { QUICK_LOOKS } from '../../assets/quickLooks';
import type { QuickLook } from '../../assets/quickLooks';

interface QuickLookPickerProps {
  selectedLook?: QuickLook | null;
  onSelectLook: (look: QuickLook) => void;
}

export function QuickLookPicker({ selectedLook, onSelectLook }: QuickLookPickerProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-brand-skyBlue/10 to-brand-powderBlue/10 rounded-lg p-4 border border-brand-skyBlue/20">
        <div className="flex items-start gap-3">
          <Sparkles className="text-brand-skyBlue mt-0.5" size={20} />
          <div>
            <h3 className="text-lg font-bold text-brand-charcoal mb-1">
              Quick Looks - Instant Professional Design
            </h3>
            <p className="text-sm text-brand-umber">
              Pre-designed combinations of backgrounds and layouts. Just pick one and go!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {QUICK_LOOKS.map(look => (
          <button
            key={look.id}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelectLook(look);
            }}
            className={`relative p-4 rounded-lg border-2 transition-all text-left group hover:shadow-lg ${
              selectedLook?.id === look.id
                ? 'border-brand-skyBlue bg-brand-skyBlue/10 shadow-md'
                : 'border-brand-warmGray hover:border-brand-skyBlue/50'
            }`}
          >
            {/* Checkmark if selected */}
            {selectedLook?.id === look.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-brand-skyBlue flex items-center justify-center shadow-md">
                <Check size={14} className="text-white" />
              </div>
            )}

            {/* Look info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{look.icon}</span>
                <h4 className="font-bold text-brand-charcoal text-base">
                  {look.name}
                </h4>
              </div>
              <p className="text-xs text-brand-umber mb-2">
                {look.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {look.recommendedFor.slice(0, 2).map(tag => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full bg-brand-skyBlue/20 text-brand-skyBlue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Preview thumbnails */}
            <div className="grid grid-cols-3 gap-1 mb-2">
              {look.backgroundPack.backgrounds.slice(0, 3).map((bg) => (
                <div
                  key={bg.id}
                  className="aspect-video rounded overflow-hidden ring-1 ring-brand-warmGray/50"
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

            <div className="text-xs text-brand-umber/70">
              {look.backgroundPack.backgrounds.length} backgrounds • {look.layoutStyle} layout
            </div>
          </button>
        ))}
      </div>

      {selectedLook && (
        <div className="bg-brand-skyBlue/10 border border-brand-skyBlue/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{selectedLook.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-brand-charcoal mb-1">
                {selectedLook.name} Selected
              </p>
              <p className="text-sm text-brand-umber mb-2">
                {selectedLook.preview}
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded bg-white text-brand-charcoal">
                  ✨ {selectedLook.backgroundPack.backgrounds.length} varied backgrounds
                </span>
                <span className="px-2 py-1 rounded bg-white text-brand-charcoal">
                  📐 {selectedLook.layoutStyle} layout style
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
