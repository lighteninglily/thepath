import { useState } from 'react';
import { Search } from 'lucide-react';
import { SERMON_TEMPLATES, SermonTemplateCategory, getAllCategories } from '../../config/sermonTemplates';
import { TemplatePreviewCard } from './TemplatePreviewCard';
import type { SermonTemplate } from '../../config/sermonTemplates';

interface SermonTemplateGalleryProps {
  selectedTemplate: SermonTemplate | null;
  onSelectTemplate: (template: SermonTemplate) => void;
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
  onSelectTemplate,
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
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="text-base font-bold text-gray-900 mb-3">Templates</h3>
        
        {/* Enhanced Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              transition-all"
          />
        </div>
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

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <Search className="text-gray-400" size={24} />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">No templates found</p>
            <p className="text-xs text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredTemplates.map(template => (
              <TemplatePreviewCard
                key={template.id}
                template={template}
                isSelected={selectedTemplate?.id === template.id}
                onClick={() => onSelectTemplate(template)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Footer */}
      <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-700">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''}
          </span>
          {activeCategory !== 'all' && (
            <span className="text-gray-500">
              in {CATEGORY_LABELS[activeCategory as SermonTemplateCategory]}
            </span>
          )}
        </div>
        {searchQuery && (
          <p className="text-[10px] text-gray-500 mt-1 text-center">
            Searching: "{searchQuery}"
          </p>
        )}
      </div>
    </div>
  );
}
