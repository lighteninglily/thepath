import { GripVertical, Music, BookOpen, Image as ImageIcon, Megaphone, MessageSquare, DollarSign, Check, Trash2, Edit, Clock, ChevronUp, ChevronDown } from 'lucide-react';
import type { ServiceItem } from '../../types/service';

interface ServiceItemCardProps {
  item: ServiceItem;
  index: number;
  allItems?: ServiceItem[]; // All items in service for auto-numbering
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isDragging?: boolean;
}

export function ServiceItemCard({ item, index, allItems, onEdit, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown, isDragging }: ServiceItemCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'song': return <Music size={20} />;
      case 'scripture': return <BookOpen size={20} />;
      case 'welcome': return <ImageIcon size={20} />;
      case 'announcement': return <Megaphone size={20} />;
      case 'sermon': return <MessageSquare size={20} />;
      case 'offering': return <DollarSign size={20} />;
      case 'closing': return <Check size={20} />;
      default: return <ImageIcon size={20} />;
    }
  };

  const getColor = () => {
    switch (item.type) {
      case 'song': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'scripture': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'welcome': return 'bg-green-100 text-green-700 border-green-300';
      case 'announcement': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'sermon': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'offering': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'closing': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-brand-warmGray text-brand-umber border-brand-warmGray';
    }
  };

  const getTitle = () => {
    // Songs show their title
    if (item.songTitle) return item.songTitle;
    
    // Scripture shows reference
    if (item.scriptureReference) return item.scriptureReference;
    
    // Announcements get auto-numbered if no custom title
    if (item.type === 'announcement') {
      if (allItems) {
        // Count how many announcements come before this one
        const announcementNumber = allItems
          .slice(0, index)
          .filter(i => i.type === 'announcement').length + 1;
        
        if (item.title && item.title !== 'Announcement') {
          return `Announcement ${announcementNumber}: ${item.title}`;
        }
        return `Announcement ${announcementNumber}`;
      }
      return item.title || 'Announcement';
    }
    
    // Sermons get numbered if no custom title
    if (item.type === 'sermon') {
      if (allItems) {
        const sermonNumber = allItems
          .slice(0, index)
          .filter(i => i.type === 'sermon').length + 1;
        
        if (item.title && item.title !== 'Sermon') {
          return `Sermon ${sermonNumber}: ${item.title}`;
        }
        return `Sermon ${sermonNumber}`;
      }
      return item.title || 'Sermon';
    }
    
    // Everything else shows title or type
    if (item.title) return item.title;
    return item.type.charAt(0).toUpperCase() + item.type.slice(1);
  };

  return (
    <div
      className={`group relative bg-white rounded-lg border-2 transition-all ${
        isDragging ? 'opacity-50 rotate-2' : 'hover:shadow-md'
      } ${getColor()}`}
    >
      {/* Drag Handle */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={20} className="text-brand-umber/50" />
      </div>

      {/* Content */}
      <div className="pl-10 pr-4 py-4 flex items-center gap-4">
        {/* Order Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center font-bold text-sm">
          {index + 1}
        </div>

        {/* Icon */}
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{getTitle()}</h3>
          {/* Show scripture preview */}
          {item.type === 'scripture' && item.content && (() => {
            try {
              const data = JSON.parse(item.content);
              const verseText = data.elements?.find((el: any) => el.id?.includes('verse'))?.content || '';
              return verseText ? (
                <p className="text-sm opacity-75 truncate italic">"{verseText.slice(0, 80)}..."</p>
              ) : null;
            } catch {
              return item.scriptureText ? (
                <p className="text-sm opacity-75 truncate italic">"{item.scriptureText.slice(0, 60)}..."</p>
              ) : null;
            }
          })()}
          {/* Show other content */}
          {item.type !== 'scripture' && item.content && !item.content.startsWith('{') && (
            <p className="text-sm opacity-75 truncate">{item.content}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs opacity-60">
            {item.duration && (
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {item.duration} min
              </span>
            )}
            {item.notes && (
              <span className="truncate">📝 {item.notes.slice(0, 30)}...</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Move Up/Down */}
          {onMoveUp && onMoveDown && (
            <div className="flex flex-col">
              <button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                className="p-1 rounded hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move up"
              >
                <ChevronUp size={14} />
              </button>
              <button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                className="p-1 rounded hover:bg-white/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                title="Move down"
              >
                <ChevronDown size={14} />
              </button>
            </div>
          )}
          
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-white/50 transition-colors"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
