import { Loader2, Sparkles } from 'lucide-react';
import { useTemplates } from '../../hooks/useTemplates';
import { TemplateCard } from './TemplateCard';
import type { DesignTemplate } from '../../types';

interface TemplateSelectorProps {
  selectedTemplateId?: string | null;
  onSelectTemplate: (template: DesignTemplate) => void;
}

export function TemplateSelector({ selectedTemplateId, onSelectTemplate }: TemplateSelectorProps) {
  const { data: templates, isLoading } = useTemplates();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-brand-skyBlue" />
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-brand-umber">No templates available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles size={20} className="text-brand-skyBlue" />
        <h3 className="text-lg font-semibold text-brand-charcoal">
          Choose a Design Template
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={template.id === selectedTemplateId}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>

      <p className="text-xs text-brand-umber mt-4 text-center">
        Select a template to preview how your slides will look
      </p>
    </div>
  );
}
