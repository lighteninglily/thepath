import { X, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import type { ServiceItem } from '../../types/service';

interface EditItemModalProps {
  item: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ServiceItem) => void;
}

export function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [duration, setDuration] = useState(2);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setContent(item.content || '');
      setDuration(item.duration || 2);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSave = () => {
    const updatedItem: ServiceItem = {
      ...item,
      title,
      content,
      duration,
    };
    onSave(updatedItem);
    onClose();
  };

  const getIcon = () => {
    switch (item.type) {
      case 'announcement': return '📢';
      case 'sermon': return '💬';
      case 'offering': return '💰';
      case 'welcome': return '👋';
      case 'closing': return '✅';
      default: return '📝';
    }
  };

  const getColor = () => {
    switch (item.type) {
      case 'announcement': return 'yellow';
      case 'sermon': return 'orange';
      case 'offering': return 'emerald';
      case 'welcome': return 'green';
      case 'closing': return 'gray';
      default: return 'brand';
    }
  };

  const color = getColor();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{getIcon()}</span>
            <div>
              <h2 className="text-xl font-bold text-brand-charcoal">
                Edit {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
              </h2>
              <p className="text-sm text-brand-umber mt-0.5">
                Customize this service item
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${item.type} title`}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
              autoFocus
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter additional details (optional)"
              rows={4}
              className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue resize-none"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 0)}
              min="0"
              max="60"
              className="w-24 px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
            />
          </div>

          {/* Preview */}
          <div className={`p-4 bg-${color}-50 border border-${color}-200 rounded-lg`}>
            <h3 className="font-semibold text-brand-charcoal mb-2">Preview</h3>
            <div className="space-y-1">
              <p className="text-lg font-bold text-brand-charcoal">
                {title || '(No title)'}
              </p>
              {content && (
                <p className="text-sm text-brand-umber whitespace-pre-wrap">
                  {content}
                </p>
              )}
              <p className="text-xs text-brand-umber">
                {duration} minute{duration !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <button
            onClick={onClose}
            className="px-4 py-2 text-brand-charcoal hover:bg-brand-warmGray rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex items-center gap-2 px-6 py-2 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
