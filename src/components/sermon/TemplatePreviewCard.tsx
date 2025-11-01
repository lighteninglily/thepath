import { useMemo } from 'react';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface TemplatePreviewCardProps {
  template: SermonTemplate;
  isSelected: boolean;
  onClick: () => void;
}

export function TemplatePreviewCard({
  template,
  isSelected,
  onClick,
}: TemplatePreviewCardProps) {
  // Generate preview HTML with actual template styling
  const previewContent = useMemo(() => {
    const bg = template.visualData.background;
    let backgroundStyle = '';
    
    if (bg.type === 'gradient') {
      backgroundStyle = `background: ${bg.value}`;
    } else if (bg.type === 'color') {
      backgroundStyle = `background: ${bg.value}`;
    }
    
    // Get sample text for each element
    const getSampleText = (role?: string): string => {
      switch (role) {
        case 'title': return template.category === 'scripture' ? 'John 3:16' : 
                             template.category === 'point' ? '1.' :
                             template.category === 'question' ? 'What is Faith?' :
                             'SERMON TITLE';
        case 'subtitle': return 'Subtitle Text';
        case 'body': return template.category === 'scripture' ? 'For God so loved the world...' :
                            'Supporting text goes here';
        case 'reference': return 'John 3:16';
        default: return 'Text';
      }
    };
    
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            ...Object.fromEntries(backgroundStyle.split(';').filter(Boolean).map(s => s.split(':').map(x => x.trim()))),
          }}
        />
        
        {/* Elements */}
        {template.visualData.elements.slice(0, 3).map((element, idx) => {
          const sampleText = getSampleText(element.role);
          
          // Skip empty placeholders
          if (!sampleText || sampleText === 'Empty text') return null;
          
          const fontSize = Math.max(element.style.fontSize ? element.style.fontSize / 4 : 12, 6);
          
          return (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${element.x}%`,
                top: `${element.y}%`,
                width: `${element.width}%`,
                height: `${element.height}%`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: element.style.textAlign || 'center',
                color: element.style.color || '#FFFFFF',
                fontSize: `${fontSize}px`,
                fontWeight: element.style.fontWeight || 400,
                fontFamily: element.style.fontFamily || 'Inter',
                textAlign: element.style.textAlign || 'center',
                lineHeight: element.style.lineHeight || 1.2,
                textTransform: element.style.textTransform as any || 'none',
                opacity: element.style.opacity !== undefined ? element.style.opacity : 1,
                backgroundColor: element.style.backgroundColor || 'transparent',
                borderRadius: element.style.borderRadius ? `${element.style.borderRadius / 4}px` : 0,
                padding: element.style.padding ? `${element.style.padding / 4}px` : 0,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              }}
            >
              {sampleText}
            </div>
          );
        })}
      </div>
    );
  }, [template]);

  return (
    <button
      onClick={onClick}
      className={`group relative rounded-xl overflow-hidden border-2 transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-200 shadow-lg scale-105'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg hover:scale-105'
      }`}
      title={template.description}
    >
      {/* Template Preview */}
      <div className="aspect-video bg-gray-900 relative overflow-hidden">
        {previewContent}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
      </div>

      {/* Template Info */}
      <div className="p-2.5 bg-white border-t border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 truncate">
              {template.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium
                ${template.category === 'title' ? 'bg-purple-100 text-purple-700' :
                  template.category === 'scripture' ? 'bg-blue-100 text-blue-700' :
                  template.category === 'point' ? 'bg-green-100 text-green-700' :
                  template.category === 'quote' ? 'bg-amber-100 text-amber-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                {template.category}
              </span>
              <span className="text-[9px] text-gray-500 truncate">
                {template.style}
              </span>
            </div>
          </div>
          
          {/* Selected Indicator */}
          {isSelected && (
            <div className="flex-shrink-0 w-5 h-5 bg-blue-500 rounded-full
              flex items-center justify-center shadow-sm">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
