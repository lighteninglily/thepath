import { X } from 'lucide-react';
import { ANNOUNCEMENT_TEMPLATES, type AnnouncementTemplate } from '../../assets/announcementTemplates';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  itemType: 'scripture' | 'announcement' | 'sermon' | 'offering' | 'welcome' | 'closing' | 'generic';
  onClose: () => void;
  onSelectTemplate: (template: AnnouncementTemplate | null) => void;
}

export function TemplateSelectorModal({ isOpen, itemType, onClose, onSelectTemplate }: TemplateSelectorModalProps) {
  if (!isOpen) return null;

  // Filter templates by item type
  const templates = ANNOUNCEMENT_TEMPLATES.filter(t => 
    t.serviceType === itemType || t.serviceType === 'generic'
  );

  const typeNames: Record<string, string> = {
    'scripture': 'Scripture',
    'announcement': 'Announcement',
    'sermon': 'Sermon',
    'offering': 'Offering',
    'welcome': 'Welcome',
    'closing': 'Closing',
    'generic': 'Item',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Choose {typeNames[itemType]} Template
            </h2>
            <p className="text-sm text-brand-umber mt-1">
              Select a pre-designed template or start from scratch
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Templates */}
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template);
                  onClose();
                }}
                className="group relative bg-white rounded-lg border-2 border-brand-warmGray hover:border-brand-skyBlue transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-brand-charcoal text-left">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-xs text-brand-umber mt-1 text-left">
                      {template.description}
                    </p>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-brand-skyBlue/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </button>
            ))}

            {/* Blank option */}
            <button
              onClick={() => {
                onSelectTemplate(null);
                onClose();
              }}
              className="group relative bg-white rounded-lg border-2 border-dashed border-brand-warmGray hover:border-brand-skyBlue transition-all overflow-hidden"
            >
              <div className="aspect-video bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">✨</div>
                  <p className="text-sm font-medium text-brand-umber">
                    Start from Scratch
                  </p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-brand-charcoal text-left">
                  Blank Slide
                </h3>
                <p className="text-xs text-brand-umber mt-1 text-left">
                  Build your own design
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <button
            onClick={onClose}
            className="px-4 py-2 text-brand-umber hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
