import { useEffect } from 'react';
import { useServicePresentationStore, getNextSlideInfo } from '../store/servicePresentationStore';
import { ServiceItemSlidePreview } from '../components/slides/ServiceItemSlidePreview';
import { useSongs } from '../hooks/useSongs';
import { Play, Square, ArrowLeft, ArrowRight, X } from 'lucide-react';

interface PresenterPageProps {
  onClose: () => void;
}

export function PresenterPage({ onClose }: PresenterPageProps) {
  const {
    service,
    isPresenting,
    currentItemIndex,
    currentSlideIndex,
    isBlank,
    elapsedTime,
    nextSlide,
    previousSlide,
    toggleBlank,
    stopPresentation,
    jumpToItem,
    updateElapsedTime,
  } = useServicePresentationStore();
  
  // Load all songs for song items
  const { data: songs = [], isLoading: songsLoading } = useSongs();
  
  console.log('🎵 Songs loading status:', songsLoading ? 'LOADING...' : `LOADED (${songs.length} songs)`);

  // Update timer every second
  useEffect(() => {
    if (!isPresenting) return;
    
    const interval = setInterval(() => {
      updateElapsedTime();
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPresenting, updateElapsedTime]);

  // Force initial sync when presentation starts (handles audience window loading delay)
  useEffect(() => {
    if (!isPresenting || !service) return;

    console.log('🎬 Presentation just started, scheduling delayed initial sync...');
    
    // Send initial sync immediately
    const sendInitialSync = () => {
      if (!window.electron?.presentation?.syncState) return;

      const currentItem = service.items[currentItemIndex];
      const currentSong = currentItem?.type === 'song' && currentItem.songId
        ? songs.find(s => s.id === currentItem.songId)
        : null;

      const state = {
        service: JSON.parse(JSON.stringify(service)),
        currentItemIndex,
        currentSlideIndex,
        isBlank,
        isPresenting,
        currentSongData: currentSong ? {
          id: currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist,
          slidesData: currentSong.slidesData,
        } : null,
      };

      console.log('🚀 INITIAL SYNC - Sending state to audience');
      window.electron.presentation.syncState(state);
    };

    // Send immediately
    sendInitialSync();

    // Also send after 300ms delay (in case audience window wasn't ready)
    const delayedSync = setTimeout(() => {
      console.log('⏰ DELAYED SYNC - Ensuring audience has state');
      sendInitialSync();
    }, 300);

    return () => clearTimeout(delayedSync);
  }, [isPresenting]); // Only run when isPresenting changes (i.e., when presentation starts)

  // Sync presentation state to audience window via IPC
  useEffect(() => {
    console.log('🔄 Sync effect triggered', { 
      hasService: !!service, 
      hasElectron: !!window.electron,
      hasSyncState: !!window.electron?.presentation?.syncState 
    });

    if (!service) {
      console.warn('⚠️ No service to sync');
      return;
    }

    if (!window.electron?.presentation?.syncState) {
      console.warn('⚠️ No electron.presentation.syncState available');
      return;
    }

    const currentItem = service.items[currentItemIndex];
    const currentSong = currentItem?.type === 'song' && currentItem.songId
      ? songs.find(s => s.id === currentItem.songId)
      : null;

    // Build the state payload with song data included
    const state = {
      service: JSON.parse(JSON.stringify(service)),
      currentItemIndex,
      currentSlideIndex,
      isBlank,
      isPresenting,
      // Include current song's slide data if it's a song item
      currentSongData: currentSong ? {
        id: currentSong.id,
        title: currentSong.title,
        artist: currentSong.artist,
        slidesData: currentSong.slidesData,
      } : null,
    };

    console.log('📤 Syncing state to audience window:', { 
      currentItemIndex, 
      currentSlideIndex,
      itemType: currentItem?.type,
      itemTitle: currentItem?.songTitle || currentItem?.title,
      hasSongData: !!currentSong,
      slideCount: currentSong?.slidesData?.length,
      hasContent: !!currentItem?.content,
      contentLength: currentItem?.content?.length,
    });
    
    try {
      window.electron.presentation.syncState(state);
      console.log('✅ State sync sent successfully');
    } catch (error) {
      console.error('❌ Failed to sync state:', error);
    }
  }, [service, currentItemIndex, currentSlideIndex, isBlank, isPresenting, songs]);

  // Keyboard shortcuts with song navigation
  useEffect(() => {
    if (!service) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentItem = service.items[currentItemIndex];
      const currentSong = currentItem?.type === 'song' && currentItem.songId
        ? songs.find(s => s.id === currentItem.songId)
        : null;
      
      switch (e.key) {
        case ' ':
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          // Check if current song has more slides
          if (currentItem?.type === 'song' && currentSong?.slidesData) {
            const slideCount = currentSong.slidesData.length;
            if (currentSlideIndex < slideCount - 1) {
              useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex + 1 });
              console.log('➡️ Next song slide:', currentSlideIndex + 1, '/', slideCount);
              return;
            }
          }
          nextSlide();
          break;
        case 'Backspace':
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          // If not at first slide of current item, go back within item
          if (currentSlideIndex > 0) {
            useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex - 1 });
            console.log('⬅️ Previous song slide:', currentSlideIndex - 1);
            return;
          }
          
          // Move to previous item
          if (currentItemIndex > 0) {
            const prevItem = service.items[currentItemIndex - 1];
            
            // If previous item is a song, go to its LAST slide
            if (prevItem.type === 'song' && prevItem.songId) {
              const prevSong = songs.find(s => s.id === prevItem.songId);
              if (prevSong?.slidesData && prevSong.slidesData.length > 0) {
                const lastSlideIndex = prevSong.slidesData.length - 1;
                useServicePresentationStore.setState({ 
                  currentItemIndex: currentItemIndex - 1,
                  currentSlideIndex: lastSlideIndex
                });
                console.log('⬅️ Previous item (song), going to last slide:', lastSlideIndex);
                return;
              }
            }
            
            // Otherwise, go to previous item at slide 0
            previousSlide();
          }
          break;
        case 'b':
        case 'B':
          e.preventDefault();
          toggleBlank();
          break;
        case 'Escape':
          e.preventDefault();
          stopPresentation();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [service, songs, currentItemIndex, currentSlideIndex, nextSlide, previousSlide, toggleBlank, stopPresentation, onClose]);

  const handleExit = () => {
    stopPresentation();
    onClose();
  };

  if (!isPresenting || !service) {
    return (
      <div className="h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-2xl mb-4">No presentation active</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Return to Planner
          </button>
        </div>
      </div>
    );
  }

  const currentItem = service.items[currentItemIndex];
  const { nextItem } = getNextSlideInfo(service, currentItemIndex, currentSlideIndex);
  
  // Look up song data if current item is a song
  const currentSong = currentItem?.type === 'song' && currentItem.songId
    ? songs.find(s => s.id === currentItem.songId)
    : null;
  
  console.log('🎵 Current item:', currentItem?.type, currentItem?.songId, currentItem?.songTitle);
  console.log('📚 Available songs:', songs.length, songs.map(s => ({ id: s.id, title: s.title })));
  console.log('🎯 Current song found:', currentSong ? `${currentSong.title} (${currentSong.slidesData?.length} slides)` : 'NOT FOUND');
  
  const nextSong = nextItem?.type === 'song' && nextItem.songId
    ? songs.find(s => s.id === nextItem.songId)
    : null;
  
  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Navigation handlers for buttons
  const handleNextClick = () => {
    // Check if current song has more slides
    if (currentItem?.type === 'song' && currentSong?.slidesData) {
      const slideCount = currentSong.slidesData.length;
      if (currentSlideIndex < slideCount - 1) {
        useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex + 1 });
        console.log('➡️ Next song slide:', currentSlideIndex + 1, '/', slideCount);
        return;
      }
    }
    nextSlide();
  };
  
  const handlePreviousClick = () => {
    // If not at first slide of current item, go back within item
    if (currentSlideIndex > 0) {
      useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex - 1 });
      console.log('⬅️ Previous song slide:', currentSlideIndex - 1);
      return;
    }
    
    // Move to previous item
    if (currentItemIndex > 0) {
      const prevItem = service.items[currentItemIndex - 1];
      
      // If previous item is a song, go to its LAST slide
      if (prevItem.type === 'song' && prevItem.songId) {
        const prevSong = songs.find(s => s.id === prevItem.songId);
        if (prevSong?.slidesData && prevSong.slidesData.length > 0) {
          const lastSlideIndex = prevSong.slidesData.length - 1;
          useServicePresentationStore.setState({ 
            currentItemIndex: currentItemIndex - 1,
            currentSlideIndex: lastSlideIndex
          });
          console.log('⬅️ Previous item (song), going to last slide:', lastSlideIndex);
          return;
        }
      }
      
      // Otherwise, go to previous item at slide 0
      previousSlide();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-brand-skyBlue text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">🎭 {service.name}</h1>
          <p className="text-sm opacity-90">
            Item {currentItemIndex + 1} of {service.items.length}
            {currentSong?.slidesData && currentSong.slidesData.length > 1 && (
              <span> • Slide {currentSlideIndex + 1} of {currentSong.slidesData.length}</span>
            )}
            {' • '}{formatTime(elapsedTime)}
          </p>
        </div>
        <button
          onClick={handleExit}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          title="Exit Presentation (ESC)"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Service Items */}
        <div className="w-64 bg-gray-800 p-4 overflow-y-auto">
          <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">
            Service Items
          </h3>
          <div className="space-y-2">
            {service.items.map((item, index) => (
              <button
                key={item.id}
                onClick={() => jumpToItem(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentItemIndex
                    ? 'bg-brand-skyBlue text-white'
                    : index < currentItemIndex
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs opacity-60">{index + 1}</span>
                  {index === currentItemIndex ? (
                    <Play size={14} className="fill-current" />
                  ) : index < currentItemIndex ? (
                    '✓'
                  ) : (
                    '○'
                  )}
                  <span className="flex-1 truncate text-sm">
                    {item.type === 'song' ? (item.songTitle || item.title)
                      : item.type === 'scripture' ? (item.scriptureReference || item.title)
                      : item.type === 'announcement' ? `Announcement${item.title ? ': ' + item.title : ''}`
                      : item.type === 'sermon' ? `Sermon${item.title ? ': ' + item.title : ''}`
                      : (item.title || item.type)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center - Slides */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Current Slide */}
          <div>
            <h3 className="text-white text-sm mb-2 font-semibold">CURRENT SLIDE</h3>
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
              {isBlank ? (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <p className="text-white/50">⬛ BLANK SCREEN</p>
                </div>
              ) : currentItem ? (
                <ServiceItemSlidePreview 
                  item={currentItem} 
                  slideIndex={currentSlideIndex}
                  songData={currentSong}
                />
              ) : (
                <div className="aspect-video bg-black flex items-center justify-center">
                  <p className="text-white">No slide to display</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Slide Preview */}
          <div>
            <h3 className="text-white text-sm mb-2 font-semibold">NEXT SLIDE</h3>
            <div className="bg-black rounded-lg overflow-hidden shadow-lg opacity-70" style={{ height: '180px' }}>
              {nextItem ? (
                <ServiceItemSlidePreview 
                  item={nextItem} 
                  slideIndex={0}
                  songData={nextSong}
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-white/50 text-sm">End of service</p>
                </div>
              )}
            </div>
          </div>

          {/* Presenter Notes */}
          {currentItem?.notes && (
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-white text-sm mb-2 font-semibold">📝 NOTES</h3>
              <p className="text-gray-300 text-base leading-relaxed">{currentItem.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex items-center justify-center gap-4">
        <button
          onClick={handlePreviousClick}
          disabled={currentItemIndex === 0 && currentSlideIndex === 0}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        
        <button
          onClick={toggleBlank}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            isBlank
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          }`}
        >
          <Square size={20} />
          {isBlank ? 'Unblank' : 'Blank'} (B)
        </button>
        
        <button
          onClick={handleNextClick}
          disabled={currentItemIndex >= service.items.length - 1 && (!currentSong?.slidesData || currentSlideIndex >= currentSong.slidesData.length - 1)}
          className="px-6 py-3 bg-brand-skyBlue hover:bg-brand-skyBlue/90 text-white rounded-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
