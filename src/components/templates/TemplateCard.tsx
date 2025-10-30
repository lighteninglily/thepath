import { Check } from 'lucide-react';
import type { DesignTemplate } from '../../types';

interface TemplateCardProps {
  template: DesignTemplate;
  isSelected?: boolean;
  onSelect: (template: DesignTemplate) => void;
}

export function TemplateCard({ template, isSelected, onSelect }: TemplateCardProps) {
  const design = template.templateData;

  return (
    <button
      onClick={() => onSelect(template)}
      className={`
        relative rounded-lg overflow-hidden border-2 transition-all
        ${isSelected ? 'border-brand-skyBlue shadow-lg' : 'border-brand-warmGray hover:border-brand-powderBlue'}
      `}
    >
      {/* Template Preview */}
      <div
        className="aspect-video relative"
        style={{
          background: design.backgroundGradient || design.backgroundColor,
        }}
      >
        {/* Sample Text */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div
            style={{
              color: design.textColor,
              textShadow: design.textShadow,
              fontFamily: design.fontFamily,
              fontSize: 'clamp(12px, 1.5vw, 24px)',
              textAlign: design.textAlign,
            }}
          >
            Amazing Grace
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-skyBlue flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>
        )}
      </div>

      {/* Template Name */}
      <div className="p-3 bg-white">
        <p className="text-sm font-medium text-brand-charcoal text-center">
          {template.name}
        </p>
      </div>
    </button>
  );
}
