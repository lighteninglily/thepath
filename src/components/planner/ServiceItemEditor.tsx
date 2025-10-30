import { useState } from 'react';
import { X, Save, Image, FileText } from 'lucide-react';
import { BackgroundPicker } from '../backgrounds/BackgroundPicker';
import type { ServiceItem, ServiceItemType } from '../../types/service';
import type { BackgroundImage } from '../../assets/backgrounds';

interface ServiceItemEditorProps {
  item?: ServiceItem | null;
  type: ServiceItemType;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: Partial<ServiceItem>) => void;
}

export function ServiceItemEditor({ item, type, isOpen, onClose, onSave }: ServiceItemEditorProps) {
  const [formData, setFormData] = useState({
    title: item?.title || '',
    content: item?.content || '',
    scriptureReference: item?.scriptureReference || '',
    scriptureText: item?.scriptureText || '',
    scriptureVersion: item?.scriptureVersion || 'NIV',
    backgroundId: item?.backgroundId || undefined,
    textColor: item?.textColor || 'light' as const,
    duration: item?.duration || 5,
    notes: item?.notes || '',
  });

  const [selectedBackground, setSelectedBackground] = useState<BackgroundImage | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      type,
      backgroundId: selectedBackground?.id || formData.backgroundId,
    });
    onClose();
  };

  const getTitle = () => {
    switch (type) {
      case 'scripture': return 'Add Scripture';
      case 'welcome': return 'Add Welcome Slide';
      case 'announcement': return 'Add Announcement';
      case 'sermon': return 'Add Sermon Title';
      case 'offering': return 'Add Offering Slide';
      case 'closing': return 'Add Closing Slide';
      case 'custom': return 'Add Custom Slide';
      default: return 'Add Item';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-brand-warmGray flex items-center justify-between">
          <h2 className="text-2xl font-bold text-brand-charcoal">{getTitle()}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-umber hover:text-brand-charcoal transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Scripture-specific fields */}
          {type === 'scripture' && (
            <>
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Scripture Reference
                </label>
                <input
                  type="text"
                  value={formData.scriptureReference}
                  onChange={(e) => setFormData({ ...formData, scriptureReference: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                  placeholder="e.g., John 3:16-17, Psalm 23"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Scripture Text
                </label>
                <textarea
                  value={formData.scriptureText}
                  onChange={(e) => setFormData({ ...formData, scriptureText: e.target.value })}
                  rows={8}
                  className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue font-serif"
                  placeholder="Paste the scripture text here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Bible Version
                </label>
                <select
                  value={formData.scriptureVersion}
                  onChange={(e) => setFormData({ ...formData, scriptureVersion: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                >
                  <option value="NIV">NIV</option>
                  <option value="ESV">ESV</option>
                  <option value="KJV">KJV</option>
                  <option value="NKJV">NKJV</option>
                  <option value="NLT">NLT</option>
                  <option value="MSG">The Message</option>
                </select>
              </div>
            </>
          )}

          {/* Title field for non-scripture slides */}
          {type !== 'scripture' && type !== 'blank' && (
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                placeholder={`Enter ${type} title...`}
                required
              />
            </div>
          )}

          {/* Content field for custom/announcement slides */}
          {(type === 'custom' || type === 'announcement') && (
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                placeholder="Enter content..."
              />
            </div>
          )}

          {/* Background Selection */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              <Image size={16} className="inline mr-2" />
              Background Image
            </label>
            <BackgroundPicker
              selectedBackground={selectedBackground}
              onSelectBackground={setSelectedBackground}
            />
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Text Color
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="light"
                  checked={formData.textColor === 'light'}
                  onChange={() => setFormData({ ...formData, textColor: 'light' })}
                  className="text-brand-skyBlue focus:ring-brand-skyBlue"
                />
                <span className="text-sm">Light (White)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="dark"
                  checked={formData.textColor === 'dark'}
                  onChange={() => setFormData({ ...formData, textColor: 'dark' })}
                  className="text-brand-skyBlue focus:ring-brand-skyBlue"
                />
                <span className="text-sm">Dark (Black)</span>
              </label>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              min="1"
              max="60"
              className="w-32 px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
            />
          </div>

          {/* Presenter Notes */}
          <div>
            <label className="block text-sm font-medium text-brand-charcoal mb-2">
              <FileText size={16} className="inline mr-2" />
              Presenter Notes (optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue text-sm"
              placeholder="Add notes for presenters..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-brand-warmGray flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-brand-warmGray text-brand-umber hover:bg-brand-warmGray/20 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-brand-skyBlue text-white hover:bg-brand-skyBlue/90 transition-colors flex items-center gap-2"
          >
            <Save size={18} />
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
}
