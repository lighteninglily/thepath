import { X, Plus, Clock, Music, Play, BookOpen, Megaphone, MessageSquare, DollarSign, Hand, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ServiceItemCard } from '../planner/ServiceItemCard';
import { EditItemModal } from './EditItemModal';
import { VisualItemEditorModal } from './VisualItemEditorModal';
import { PresenterPage } from '../../pages/PresenterPage';
import { useServicePresentationStore } from '../../store/servicePresentationStore';
import type { Service, ServiceItem } from '../../types/service';

interface ServiceEditorModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  onAddSong: () => void;
  onAddItem: (type: string) => void;
}

export function ServiceEditorModal({ 
  service, 
  isOpen, 
  onClose, 
  onSave,
  onAddSong,
  onAddItem 
}: ServiceEditorModalProps) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [initialItems, setInitialItems] = useState<ServiceItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [visualEditingItem, setVisualEditingItem] = useState<ServiceItem | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  
  const { startPresentation } = useServicePresentationStore();

  useEffect(() => {
    if (service && isOpen) {
      console.log('📖 Loading service into editor:', {
        name: service.name,
        itemCount: service.items?.length || 0,
        items: service.items?.map(i => ({ id: i.id, type: i.type, title: i.title }))
      });
      setItems(service.items || []);
    }
  }, [service, isOpen]);

  useEffect(() => {
    // Only set initial items when modal first opens
    if (service && isOpen) {
      setInitialItems(service.items || []);
    }
  }, [isOpen]); // Only depend on isOpen, not service

  // Detect changes by comparing current items with initial items
  const hasChanges = JSON.stringify(items) !== JSON.stringify(initialItems);

  // 🔥 AUTOSAVE: Save changes automatically 1 second after editing stops
  useEffect(() => {
    if (!service || !isOpen || !hasChanges) return;

    console.log('💾 Autosave: Changes detected, scheduling save...');
    
    const timer = setTimeout(() => {
      const updatedService: Service = {
        ...service,
        items,
        updatedAt: new Date().toISOString(),
      };
      console.log('✅ Autosave: Saving service with items:', {
        name: updatedService.name,
        itemCount: updatedService.items.length,
        items: updatedService.items.map(i => ({
          id: i.id,
          type: i.type,
          title: i.title,
          hasContent: !!i.content,
          contentLength: i.content?.length || 0
        }))
      });
      onSave(updatedService);
      setInitialItems(items); // Update baseline to prevent re-saving
    }, 1000); // Wait 1 second after last change

    return () => clearTimeout(timer);
  }, [items, service, isOpen, hasChanges, onSave]);

  if (!isOpen || !service) return null;

  const handleDeleteItem = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleEditItem = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      // Check if item has visual data (template-based)
      if (item.content && item.content.startsWith('{')) {
        try {
          const data = JSON.parse(item.content);
          if (data.elements) {
            // Has visual data - open visual editor
            setVisualEditingItem(item);
            return;
          }
        } catch (e) {
          // Not JSON or invalid - use regular editor
        }
      }
      // Regular item - open text editor
      setEditingItem(item);
    }
  };

  const handleSaveEditedItem = (updatedItem: ServiceItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
  };

  const handleSaveVisualItem = (updatedItem: ServiceItem) => {
    console.log('📝 handleSaveVisualItem called:', {
      itemId: updatedItem.id,
      title: updatedItem.title,
      type: updatedItem.type,
      contentPreview: updatedItem.content?.substring(0, 100) + '...'
    });
    
    setItems(prev => {
      const newItems = prev.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      console.log('✅ Items updated, autosave will trigger in 1 second');
      return newItems;
    });
    setVisualEditingItem(null);
  };

  const handleMoveItemUp = (itemId: string) => {
    setItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index <= 0) return prev; // Already at top or not found
      
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems;
    });
  };

  const handleMoveItemDown = (itemId: string) => {
    setItems(prev => {
      const index = prev.findIndex(item => item.id === itemId);
      if (index === -1 || index >= prev.length - 1) return prev; // At bottom or not found
      
      const newItems = [...prev];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      return newItems;
    });
  };

  // Manual save function removed - now using autosave

  const getTotalDuration = () => {
    return items.reduce((total, item) => total + (item.duration || 0), 0);
  };

  const handleStartPresentation = async () => {
    // Create service object with current items
    const presentationService: Service = {
      ...service,
      items
    };
    
    // Start presentation in dual-screen mode
    startPresentation(presentationService, 'dual');
    console.log('🎭 Starting presentation for:', presentationService.name);
    
    // Open audience window (projection screen)
    if (window.electron?.presentation?.start) {
      try {
        await window.electron.presentation.start();
        console.log('✅ Audience window opened');
      } catch (error) {
        console.error('❌ Failed to open audience window:', error);
      }
    }
    
    // IMPORTANT: Set presentation mode AFTER opening window
    // This ensures the PresenterPage mounts and triggers initial sync
    setIsPresentationMode(true);
  };

  const handleClosePresentation = async () => {
    setIsPresentationMode(false);
    
    // Close audience window
    if (window.electron?.presentation?.close) {
      try {
        await window.electron.presentation.close();
        console.log('✅ Audience window closed');
      } catch (error) {
        console.error('❌ Failed to close audience window:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-brand-charcoal">{service.name}</h2>
            <p className="text-sm text-brand-umber mt-1">
              {service.date ? new Date(service.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'No date set'}
            </p>
          </div>
          
          {/* Duration Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-brand-skyBlue/10 rounded-lg mr-4">
            <Clock size={20} className="text-brand-skyBlue" />
            <div>
              <div className="text-sm font-semibold text-brand-skyBlue">{getTotalDuration()} min</div>
              <div className="text-xs text-brand-umber">Total Duration</div>
            </div>
          </div>

          {/* Present Button */}
          <button
            onClick={handleStartPresentation}
            disabled={items.length === 0}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mr-4"
          >
            <Play size={20} />
            Present
          </button>

          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Items Toolbar */}
          <div className="flex gap-2 mb-6 pb-4 border-b border-brand-warmGray">
            <button
              onClick={onAddSong}
              className="flex items-center gap-2 px-4 py-2 bg-brand-mistyBlue text-brand-skyBlue rounded-lg hover:bg-brand-powderBlue transition-colors font-medium"
            >
              <Music size={18} />
              Add Song
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-warmGray text-brand-charcoal rounded-lg hover:bg-brand-clay hover:text-white transition-colors font-medium"
              >
                <Plus size={18} />
                Add Item
              </button>
              
              {/* Dropdown menu */}
              {showAddMenu && (
                <div className="absolute left-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-brand-warmGray z-10 min-w-[200px]">
                  <button
                    onClick={() => { onAddItem('scripture'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 text-brand-charcoal first:rounded-t-lg flex items-center gap-3 group"
                  >
                    <BookOpen size={18} className="text-blue-600 group-hover:scale-110 transition-transform" />
                    <span>Scripture Reading</span>
                  </button>
                  <button
                    onClick={() => { onAddItem('announcement'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-brand-charcoal flex items-center gap-3 group"
                  >
                    <Megaphone size={18} className="text-yellow-600 group-hover:scale-110 transition-transform" />
                    <span>Announcement</span>
                  </button>
                  <button
                    onClick={() => { onAddItem('sermon'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-orange-50 text-brand-charcoal flex items-center gap-3 group"
                  >
                    <MessageSquare size={18} className="text-orange-600 group-hover:scale-110 transition-transform" />
                    <span>Sermon</span>
                  </button>
                  <button
                    onClick={() => { onAddItem('offering'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-emerald-50 text-brand-charcoal flex items-center gap-3 group"
                  >
                    <DollarSign size={18} className="text-emerald-600 group-hover:scale-110 transition-transform" />
                    <span>Offering</span>
                  </button>
                  <button
                    onClick={() => { onAddItem('welcome'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 text-brand-charcoal flex items-center gap-3 group"
                  >
                    <Hand size={18} className="text-green-600 group-hover:scale-110 transition-transform" />
                    <span>Welcome</span>
                  </button>
                  <button
                    onClick={() => { onAddItem('closing'); setShowAddMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-brand-charcoal last:rounded-b-lg flex items-center gap-3 group"
                  >
                    <Check size={18} className="text-gray-600 group-hover:scale-110 transition-transform" />
                    <span>Closing</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Service Items List */}
          {items.length === 0 ? (
            <div className="text-center py-16 bg-brand-warmGray/20 rounded-lg">
              <Music size={48} className="mx-auto text-brand-umber/40 mb-4" />
              <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                No Items Yet
              </h3>
              <p className="text-brand-umber text-sm">
                Add songs and other items to build your service
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <ServiceItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  allItems={items}
                  onEdit={() => handleEditItem(item.id)}
                  onDelete={() => handleDeleteItem(item.id)}
                  onMoveUp={() => handleMoveItemUp(item.id)}
                  onMoveDown={() => handleMoveItemDown(item.id)}
                  canMoveUp={index > 0}
                  canMoveDown={index < items.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <div className="text-sm text-brand-umber">
            {items.length} {items.length === 1 ? 'item' : 'items'}
            {hasChanges ? (
              <span className="ml-2 text-orange-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                Saving...
              </span>
            ) : (
              <span className="ml-2 text-green-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                All changes saved
              </span>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="px-6 py-2 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay transition-colors font-medium shadow-md"
          >
            Close
          </button>
        </div>
      </div>

      {/* Edit Item Modal */}
      <EditItemModal
        item={editingItem}
        isOpen={editingItem !== null}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveEditedItem}
      />

      {/* Visual Item Editor Modal */}
      <VisualItemEditorModal
        item={visualEditingItem}
        allItems={items}
        itemIndex={visualEditingItem ? items.findIndex(i => i.id === visualEditingItem.id) : undefined}
        isOpen={visualEditingItem !== null}
        onClose={() => setVisualEditingItem(null)}
        onSave={handleSaveVisualItem}
      />

      {/* Presentation Mode */}
      {isPresentationMode && (
        <div className="fixed inset-0 z-[100]">
          <PresenterPage onClose={handleClosePresentation} />
        </div>
      )}
    </div>
  );
}
