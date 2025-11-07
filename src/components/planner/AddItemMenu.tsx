import { Plus, Music, BookOpen, Image, Megaphone, MessageSquare, DollarSign, Check, FileText, Sparkles } from 'lucide-react';
import { useState } from 'react';
import type { ServiceItemType } from '../../types/service';

interface AddItemMenuProps {
  onAddItem: (type: ServiceItemType) => void;
}

export function AddItemMenu({ onAddItem }: AddItemMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { type: 'song' as const, icon: Music, label: 'Song', color: 'skyBlue' },
    { type: 'scripture' as const, icon: BookOpen, label: 'Scripture', color: 'blue' },
    { type: 'welcome' as const, icon: Image, label: 'Welcome', color: 'green' },
    { type: 'announcement' as const, icon: Megaphone, label: 'Announcement', color: 'yellow' },
    { type: 'sermon' as const, icon: MessageSquare, label: 'Sermon', color: 'orange' },
    { type: 'sermon-slides' as const, icon: Sparkles, label: 'Sermon Slides', color: 'purple' },
    { type: 'offering' as const, icon: DollarSign, label: 'Offering', color: 'emerald' },
    { type: 'closing' as const, icon: Check, label: 'Closing', color: 'gray' },
    { type: 'custom' as const, icon: FileText, label: 'Custom', color: 'brand-skyBlue' },
  ];

  return (
    <div className="relative">
      {/* Main Add Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-3 rounded-lg bg-brand-skyBlue text-white hover:bg-brand-skyBlue/90 transition-colors flex items-center justify-center gap-2 font-medium shadow-md"
      >
        <Plus size={20} />
        Add Item to Service
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border-2 border-brand-warmGray z-20 overflow-hidden">
            <div className="p-2 grid grid-cols-2 gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => {
                      onAddItem(item.type);
                      setIsOpen(false);
                    }}
                    className={`p-3 rounded-lg border-2 transition-all hover:shadow-md text-left flex items-center gap-3
                      ${item.color === 'skyBlue' ? 'border-brand-powderBlue hover:bg-brand-mistyBlue' : ''}
                      ${item.color === 'blue' ? 'border-blue-200 hover:bg-blue-50' : ''}
                      ${item.color === 'green' ? 'border-green-200 hover:bg-green-50' : ''}
                      ${item.color === 'yellow' ? 'border-yellow-200 hover:bg-yellow-50' : ''}
                      ${item.color === 'orange' ? 'border-orange-200 hover:bg-orange-50' : ''}
                      ${item.color === 'purple' ? 'border-purple-200 hover:bg-purple-50' : ''}
                      ${item.color === 'emerald' ? 'border-emerald-200 hover:bg-emerald-50' : ''}
                      ${item.color === 'gray' ? 'border-gray-200 hover:bg-gray-50' : ''}
                      ${item.color === 'brand-skyBlue' ? 'border-brand-powderBlue hover:bg-brand-skyBlue/5' : ''}
                    `}
                  >
                    <Icon size={20} className={`
                      ${item.color === 'skyBlue' ? 'text-brand-skyBlue' : ''}
                      ${item.color === 'blue' ? 'text-blue-600' : ''}
                      ${item.color === 'green' ? 'text-green-600' : ''}
                      ${item.color === 'yellow' ? 'text-yellow-600' : ''}
                      ${item.color === 'orange' ? 'text-orange-600' : ''}
                      ${item.color === 'purple' ? 'text-purple-600' : ''}
                      ${item.color === 'emerald' ? 'text-emerald-600' : ''}
                      ${item.color === 'gray' ? 'text-gray-600' : ''}
                      ${item.color === 'brand-skyBlue' ? 'text-brand-skyBlue' : ''}
                    `} />
                    <span className="font-medium text-brand-charcoal">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
