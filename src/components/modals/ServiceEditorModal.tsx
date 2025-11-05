import { X, Plus, Clock, Music, Play, BookOpen, Megaphone } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ServiceItemCard } from '../planner/ServiceItemCard';
import { EditItemModal } from './EditItemModal';
import { VisualItemEditorModal } from './VisualItemEditorModal';
import { PresenterPage } from '../../pages/PresenterPage';
import { useServicePresentationStore } from '../../store/servicePresentationStore';
import { useServiceImagePreloader } from '../../hooks/useServiceImagePreloader';
import type { Service, ServiceItem } from '../../types/service';

interface ServiceEditorModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
  onAddSong: () => void;
  onAddItem: (type: string) => void;
  autoOpenVisualEditorForItemId?: string | null;
  autoStartPresentation?: boolean;
  onPresentationStarted?: () => void;
}

export function ServiceEditorModal({ 
  service, 
  isOpen, 
  onClose, 
  onSave,
  onAddSong,
  onAddItem,
  autoOpenVisualEditorForItemId,
  autoStartPresentation,
  onPresentationStarted
}: ServiceEditorModalProps) {
  const [items, setItems] = useState<ServiceItem[]>([]);
  const [initialItems, setInitialItems] = useState<ServiceItem[]>([]);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [visualEditingItem, setVisualEditingItem] = useState<ServiceItem | null>(null);
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  
  const { 
    startPresentation, 
    service: presentationService, 
    currentSlideIndex, 
    currentItemIndex, 
    currentSongData 
  } = useServicePresentationStore();

  // Preload ALL custom images in service items (announcements, scripture, etc.)
  const { isReady: imagesReady, loadedImages, totalImages } = useServiceImagePreloader(
    isPresentationMode ? presentationService : null
  );

  // Auto-open visual editor for newly created AI items
  useEffect(() => {
    if (autoOpenVisualEditorForItemId && items.length > 0) {
      const itemToOpen = items.find(i => i.id === autoOpenVisualEditorForItemId);
      if (itemToOpen) {
        console.log('🎨 Auto-opening visual editor for:', itemToOpen.title);
        setVisualEditingItem(itemToOpen);
      }
    }
  }, [autoOpenVisualEditorForItemId, items]);

  // Log custom image preloading status
  useEffect(() => {
    if (isPresentationMode && totalImages > 0) {
      if (imagesReady) {
        console.log(`🎉 Preloaded ${totalImages} custom images (announcements/scripture)!`);
      } else {
        console.log(`⏳ Loading custom images: ${loadedImages}/${totalImages}...`);
      }
    }
  }, [isPresentationMode, imagesReady, loadedImages, totalImages]);

  // Preload ALL song data when presentation starts
  useEffect(() => {
    if (!isPresentationMode || !presentationService) return;
    
    const preloadAllSongs = async () => {
      console.log('🚀 Preloading all song data for instant navigation...');
      const songItems = presentationService.items.filter(item => item.type === 'song' && item.songId);
      
      const loadPromises = songItems.map(async (item) => {
        try {
          const song = await window.electron.database.getSongById(item.songId!);
          if (song) {
            useServicePresentationStore.getState().preloadSongData(item.songId!, song);
            console.log(`✅ Preloaded: ${song.title} (${song.slidesData?.length || 0} slides)`);
          }
        } catch (error) {
          console.error(`❌ Failed to preload song ${item.songId}:`, error);
        }
      });
      
      await Promise.all(loadPromises);
      console.log(`🎉 Preloaded ${songItems.length} songs!`);
    };
    
    preloadAllSongs();
  }, [isPresentationMode, presentationService]);

  // Update currentSongData when navigating (instant from cache!)
  useEffect(() => {
    if (!isPresentationMode || !presentationService) return;
    
    const currentItem = presentationService.items[currentItemIndex];
    if (!currentItem || currentItem.type !== 'song') {
      // Not a song, clear song data
      if (currentSongData !== null) {
        console.log('📭 Clearing song data (not a song)');
        useServicePresentationStore.setState({ currentSongData: null });
      }
      return;
    }
    
    // Use cached song data for instant loading!
    const cachedSong = useServicePresentationStore.getState().songDataCache[currentItem.songId!];
    if (cachedSong) {
      console.log('⚡ Using cached song data:', cachedSong.title);
      useServicePresentationStore.setState({ currentSongData: cachedSong });
    } else {
      console.warn('⚠️ Song not in cache, loading on-demand:', currentItem.songId);
      // Fallback to on-demand loading if not in cache
      const loadSongData = async () => {
        if (!currentItem.songId) return;
        try {
          const song = await window.electron.database.getSongById(currentItem.songId);
          if (song) {
            useServicePresentationStore.getState().preloadSongData(currentItem.songId, song);
            useServicePresentationStore.setState({ currentSongData: song });
          }
        } catch (error) {
          console.error('❌ Failed to load song:', error);
        }
      };
      loadSongData();
    }
  }, [isPresentationMode, presentationService, currentItemIndex]);

  // CRITICAL FIX: Send initial state when presentation FIRST starts
  useEffect(() => {
    if (!isPresentationMode || !presentationService || !window.electron?.presentation?.syncState) {
      return;
    }
    
    console.log('🚀 INITIAL PRESENTATION SYNC - Sending first state to audience');
    
    const sendInitialState = () => {
      const initialState = {
        service: presentationService,
        currentItemIndex: currentItemIndex || 0,
        currentSlideIndex: currentSlideIndex || 0,
        currentSongData: currentSongData || null,
        isPresenting: true,
        isBlank: false
      };
      
      console.log('📡 Initial state being sent:', {
        serviceName: presentationService.name,
        itemCount: presentationService.items.length,
        currentItemIndex: initialState.currentItemIndex,
        currentSlideIndex: initialState.currentSlideIndex,
        hasSongData: !!currentSongData,
        songTitle: currentSongData?.title || 'N/A'
      });
      
      window.electron.presentation.syncState(initialState).then(() => {
        console.log('✅ Initial state sent successfully to audience window');
      }).catch((error) => {
        console.error('❌ Failed to send initial state:', error);
      });
    };
    
    // Send immediately
    sendInitialState();
    
    // Also send after delays to ensure window is fully loaded
    const timeout1 = setTimeout(sendInitialState, 500);
    const timeout2 = setTimeout(sendInitialState, 1500);
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [isPresentationMode, presentationService?.id]); // Only when presentation starts AND service changes
  
  // Sync presentation state changes to audience window (subsequent updates)
  useEffect(() => {
    if (isPresentationMode && window.electron?.presentation?.syncState) {
      const state = {
        service: presentationService,
        currentItemIndex,
        currentSlideIndex,
        currentSongData,
        isPresenting: true
      };
      
      // Sync state to audience window
      window.electron.presentation.syncState(state).catch(console.error);
      console.log('📡 Synced state update to audience window:', {
        hasService: !!presentationService,
        currentItemIndex,
        currentSlideIndex,
        hasSongData: !!currentSongData,
        songTitle: currentSongData?.title
      });
    }
  }, [isPresentationMode, presentationService, currentItemIndex, currentSlideIndex, currentSongData]);
  
  // Load items ONLY when modal opens or service ID changes (not on every service update)
  const [loadedServiceId, setLoadedServiceId] = useState<string | null>(null);
  const [loadedItemCount, setLoadedItemCount] = useState<number>(0);
  
  useEffect(() => {
    // Reload if:
    // 1. Modal is opening (isOpen becomes true)
    // 2. OR we're switching to a different service (service.id changed)
    // 3. OR items were added/removed externally (item count changed)
    const currentItemCount = service?.items?.length || 0;
    const itemCountChanged = currentItemCount !== loadedItemCount && loadedServiceId === service?.id;
    
    const shouldReload = isOpen && service && (
      loadedServiceId !== service.id || itemCountChanged
    );
    
    if (shouldReload) {
      console.log('📖 Loading service into editor:', {
        name: service.name,
        itemCount: currentItemCount,
        items: service.items?.map(i => ({ id: i.id, type: i.type, title: i.title })),
        reason: loadedServiceId === null ? 'initial load' : itemCountChanged ? 'items changed externally' : 'service changed'
      });
      setItems(service.items || []);
      setInitialItems(service.items || []);
      setLoadedServiceId(service.id);
      setLoadedItemCount(currentItemCount);
    }
  }, [service?.id, service?.items?.length, isOpen]); // Depend on item count too

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

  // Auto-start presentation when requested from PlannerPage Present button
  // MUST be before early return to avoid hooks violation
  useEffect(() => {
    if (autoStartPresentation && isOpen && items.length > 0 && !isPresentationMode && service) {
      console.log('🎭 Auto-starting presentation from PlannerPage...');
      const timer = setTimeout(async () => {
        const presentationService: Service = {
          ...service,
          items: items,
          name: service.name,
          date: service.date,
        };
        
        startPresentation(presentationService, 'dual');
        
        if (window.electron?.presentation?.start) {
          try {
            await window.electron.presentation.start();
            console.log('✅ Audience window opened');
          } catch (error) {
            console.error('❌ Failed to open audience window:', error);
          }
        }
        
        setIsPresentationMode(true);
        onPresentationStarted?.();
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [autoStartPresentation, isOpen, items, isPresentationMode, service, startPresentation, onPresentationStarted]);

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
              className="flex items-center gap-2 px-4 py-2 bg-brand-skyBlue text-white rounded-lg hover:bg-brand-skyBlue/90 transition-colors font-medium shadow-sm"
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
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-brand-charcoal last:rounded-b-lg flex items-center gap-3 group"
                  >
                    <Megaphone size={18} className="text-yellow-600 group-hover:scale-110 transition-transform" />
                    <span>Announcement</span>
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
