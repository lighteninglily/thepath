import { X, Check } from 'lucide-react';
import { useState } from 'react';
import { getTemplatesByCategory, type SlideTemplate } from '../../config/slideTemplatesFixed';

interface TemplatePickerModalProps {
  isOpen: boolean;
  category: 'sermon' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'offering' | 'song' | 'generic';
  onClose: () => void;
  onSelectTemplate: (template: SlideTemplate) => void;
}

export function TemplatePickerModal({ 
  isOpen, 
  category, 
  onClose, 
  onSelectTemplate 
}: TemplatePickerModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SlideTemplate | null>(null);

  if (!isOpen) return null;

  const templates = getTemplatesByCategory(category);
  
  const getCategoryIcon = () => {
    switch (category) {
      case 'sermon': return '💬';
      case 'announcement': return '📢';
      case 'scripture': return '📖';
      case 'welcome': return '👋';
      case 'closing': return '✅';
      case 'song': return '🎵';
      case 'offering': return '💰';
      default: return '📝';
    }
  };

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getCategoryIcon()}</span>
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">
                Choose {category.charAt(0).toUpperCase() + category.slice(1)} Template
              </h2>
              <p className="text-sm text-brand-umber mt-0.5">
                {templates.length} beautiful designs to choose from
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {templates.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-brand-umber">No templates available yet for this category.</p>
              <p className="text-sm text-brand-umber/60 mt-2">More templates coming soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template)}
                  className={`group relative bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id
                      ? 'border-brand-skyBlue shadow-lg'
                      : 'border-brand-warmGray'
                  }`}
                >
                  {/* Thumbnail - Show actual template layout */}
                  <div 
                    className="aspect-video relative overflow-hidden"
                    style={{
                      background: template.visualData.backgroundGradient || template.visualData.backgroundColor || '#2a2a2a'
                    }}
                  >
                    {/* Render mini version of actual template elements */}
                    <div className="absolute inset-0" style={{ transform: 'scale(0.15)', transformOrigin: 'top left', width: '666%', height: '666%' }}>
                      {template.visualData.elements?.map((element, idx) => (
                        <div
                          key={idx}
                          style={{
                            position: 'absolute',
                            left: `${element.position.x}px`,
                            top: `${element.position.y}px`,
                            width: `${element.size.width}px`,
                            height: `${element.size.height}px`,
                            backgroundColor: element.type === 'shape' ? element.backgroundColor : undefined,
                            borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
                            opacity: element.opacity ?? 1,
                            zIndex: element.zIndex ?? 0,
                            fontSize: element.fontSize ? `${element.fontSize}px` : undefined,
                            fontFamily: element.fontFamily,
                            fontWeight: element.fontWeight,
                            color: element.color,
                            textAlign: element.textAlign as any,
                            whiteSpace: 'pre-wrap',
                            overflow: 'hidden',
                            pointerEvents: 'none'
                          }}
                        >
                          {element.type === 'text' ? element.content : ''}
                        </div>
                      ))}
                    </div>
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-50">
                      <span className="text-white font-medium">Select Template</span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-brand-charcoal mb-1">
                      {template.name}
                    </h3>
                    <p className="text-xs text-brand-umber line-clamp-2">
                      {template.description}
                    </p>
                  </div>

                  {/* Selected Indicator */}
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-3 right-3 w-8 h-8 bg-brand-skyBlue rounded-full flex items-center justify-center shadow-lg">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <div className="text-sm text-brand-umber">
            {selectedTemplate ? (
              <>Selected: <span className="font-semibold">{selectedTemplate.name}</span></>
            ) : (
              'Select a template to continue'
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-brand-charcoal hover:bg-brand-warmGray rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate}
              className="flex items-center gap-2 px-6 py-2 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              <Check size={18} />
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
