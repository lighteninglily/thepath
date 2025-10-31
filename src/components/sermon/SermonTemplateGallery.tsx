import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { SERMON_TEMPLATES, SermonTemplateCategory, getAllCategories } from '../../config/sermonTemplates';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface SermonTemplateGalleryProps {
  selectedTemplate: SermonTemplate | null;
  suggestedTemplates?: SermonTemplate[];
  onSelectTemplate: (template: SermonTemplate) => void;
  onAIPick?: () => void;
}

const CATEGORY_LABELS: Record<SermonTemplateCategory, string> = {
  title: 'Title Slides',
  scripture: 'Scripture',
  point: 'Points',
  'multi-point': 'Multi-Point',
  quote: 'Quotes',
  transition: 'Transitions',
  question: 'Questions',
};

export function SermonTemplateGallery({
  selectedTemplate,
  suggestedTemplates = [],
  onSelectTemplate,
  onAIPick,
}: SermonTemplateGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<SermonTemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = getAllCategories();

  // Filter templates
  const filteredTemplates = SERMON_TEMPLATES.filter(template => {
    const matchesCategory = activeCategory === 'all' || template.category === activeCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-72 border-l border-gray-200 bg-gray-50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Templates</h3>
        
        {/* AI Pick Button */}
        {onAIPick && suggestedTemplates.length > 0 && (
          <button
            onClick={onAIPick}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 mb-3
              bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg
              hover:from-purple-700 hover:to-blue-700 transition-all shadow-md hover:shadow-lg
              font-medium text-sm"
          >
            <Sparkles size={16} />
            AI Pick Template
          </button>
        )}

        {/* Search */}
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex px-2 py-1 gap-1 min-w-max">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                activeCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {CATEGORY_LABELS[category]}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Templates (if AI detected) */}
      {suggestedTemplates.length > 0 && activeCategory === 'all' && !searchQuery && (
        <div className="p-3 bg-purple-50 border-b border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={14} className="text-purple-600" />
            <span className="text-xs font-semibold text-purple-700">Suggested for You</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {suggestedTemplates.slice(0, 2).map(template => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-purple-500 ring-2 ring-purple-200'
                    : 'border-purple-200 hover:border-purple-400'
                }`}
              >
                <div className="aspect-video bg-white flex items-center justify-center p-2">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="p-1.5 bg-white border-t border-purple-100">
                  <p className="text-xs font-medium text-gray-800 truncate">{template.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No templates found
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map(template => (
              <button
                key={template.id}
                onClick={() => onSelectTemplate(template)}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 ring-2 ring-blue-200 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:shadow'
                }`}
                title={template.description}
              >
                {/* Template Thumbnail */}
                <div className="aspect-video bg-white flex items-center justify-center p-2">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Template Info */}
                <div className="p-2 bg-white border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-800 truncate">
                    {template.name}
                  </p>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">
                    {template.style}
                  </p>
                </div>

                {/* Selected Indicator */}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full
                    flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-500 text-center">
          {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}
