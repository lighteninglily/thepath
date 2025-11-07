import { useEffect } from 'react';
import { useServicePresentationStore, getNextSlideInfo } from '../store/servicePresentationStore';
import { ServiceItemSlidePreview } from '../components/slides/ServiceItemSlidePreview';
import { useSongs } from '../hooks/useSongs';
import { Square, ArrowLeft, ArrowRight, X } from 'lucide-react';

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
  
  // Parse sermon slides if current item is sermon-slides
  const currentSermonSlides = currentItem?.type === 'sermon-slides' && currentItem.content
    ? (() => {
        try {
          return JSON.parse(currentItem.content);
        } catch {
          return null;
        }
      })()
    : null;
  
  console.log('🎵 Current item:', currentItem?.type, currentItem?.songId, currentItem?.songTitle);
  console.log('📚 Available songs:', songs.length, songs.map(s => ({ id: s.id, title: s.title })));
  console.log('🎯 Current song found:', currentSong ? `${currentSong.title} (${currentSong.slidesData?.length} slides)` : 'NOT FOUND');
  console.log('📖 Sermon slides:', currentSermonSlides ? `${currentSermonSlides.length} slides` : 'N/A');
  
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
    // Check if current item has more slides (song or sermon)
    if (currentItem?.type === 'song' && currentSong?.slidesData) {
      const slideCount = currentSong.slidesData.length;
      if (currentSlideIndex < slideCount - 1) {
        useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex + 1 });
        console.log('➡️ Next song slide:', currentSlideIndex + 1, '/', slideCount);
        return;
      }
    } else if (currentItem?.type === 'sermon-slides' && currentSermonSlides) {
      const slideCount = currentSermonSlides.length;
      if (currentSlideIndex < slideCount - 1) {
        useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex + 1 });
        console.log('➡️ Next sermon slide:', currentSlideIndex + 1, '/', slideCount);
        return;
      }
    }
    nextSlide();
  };
  
  const handlePreviousClick = () => {
    // If not at first slide of current item, go back within item
    if (currentSlideIndex > 0) {
      useServicePresentationStore.setState({ currentSlideIndex: currentSlideIndex - 1 });
      console.log('⬅️ Previous slide:', currentSlideIndex - 1);
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
      
      // If previous item is sermon-slides, go to its LAST slide
      if (prevItem.type === 'sermon-slides' && prevItem.content) {
        try {
          const prevSermonSlides = JSON.parse(prevItem.content);
          if (Array.isArray(prevSermonSlides) && prevSermonSlides.length > 0) {
            const lastSlideIndex = prevSermonSlides.length - 1;
            useServicePresentationStore.setState({ 
              currentItemIndex: currentItemIndex - 1,
              currentSlideIndex: lastSlideIndex
            });
            console.log('⬅️ Previous item (sermon), going to last slide:', lastSlideIndex);
            return;
          }
        } catch {}
      }
      
      // Otherwise, go to previous item at slide 0
      previousSlide();
    }
  };

  // Build a flat list of all slides for the slide navigator
  const allSlides: Array<{
    itemIndex: number;
    slideIndex: number;
    item: typeof currentItem;
    song: typeof currentSong;
    title: string;
    slideNumber: number; // Global slide number
  }> = [];
  
  let globalSlideNumber = 0;
  service.items.forEach((item, itemIndex) => {
    if (item.type === 'song' && item.songId) {
      const song = songs.find(s => s.id === item.songId);
      const slideCount = song?.slidesData?.length || 1;
      for (let slideIndex = 0; slideIndex < slideCount; slideIndex++) {
        allSlides.push({
          itemIndex,
          slideIndex,
          item,
          song: song || null,
          title: `${item.songTitle || item.title} (${slideIndex + 1}/${slideCount})`,
          slideNumber: globalSlideNumber++
        });
      }
    } else if (item.type === 'sermon-slides' && item.content) {
      // Parse sermon slides to get count
      try {
        const sermonSlides = JSON.parse(item.content);
        if (Array.isArray(sermonSlides)) {
          const slideCount = sermonSlides.length;
          for (let slideIndex = 0; slideIndex < slideCount; slideIndex++) {
            allSlides.push({
              itemIndex,
              slideIndex,
              item,
              song: null,
              title: `${item.title || 'Sermon'} (${slideIndex + 1}/${slideCount})`,
              slideNumber: globalSlideNumber++
            });
          }
        } else {
          // Fallback if parse fails
          allSlides.push({
            itemIndex,
            slideIndex: 0,
            item,
            song: null,
            title: item.title || 'Sermon Slides',
            slideNumber: globalSlideNumber++
          });
        }
      } catch {
        // Fallback if parse fails
        allSlides.push({
          itemIndex,
          slideIndex: 0,
          item,
          song: null,
          title: item.title || 'Sermon Slides',
          slideNumber: globalSlideNumber++
        });
      }
    } else {
      allSlides.push({
        itemIndex,
        slideIndex: 0,
        item,
        song: null,
        title: item.type === 'scripture' ? (item.scriptureReference || item.title || 'Scripture')
              : item.type === 'announcement' ? `Announcement${item.title ? ': ' + item.title : ''}`
              : item.type === 'sermon' ? `Sermon${item.title ? ': ' + item.title : ''}`
              : (item.title || item.type || 'Slide'),
        slideNumber: globalSlideNumber++
      });
    }
  });
  
  // Find current slide in the flat list
  const currentGlobalSlideIndex = allSlides.findIndex(
    s => s.itemIndex === currentItemIndex && s.slideIndex === currentSlideIndex
  );

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Header */}
      <div className="bg-brand-skyBlue text-white p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">🎭 {service.name}</h1>
          <p className="text-sm opacity-90">
            Slide {currentGlobalSlideIndex + 1} of {allSlides.length}
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
        {/* Left Sidebar - All Slides Navigator */}
        <div className="w-72 bg-gray-800 p-3 overflow-y-auto">
          <h3 className="text-white text-xs font-semibold mb-3 uppercase tracking-wider px-2">
            All Slides ({allSlides.length})
          </h3>
          <div className="space-y-1">
            {allSlides.map((slide, index) => {
              const isCurrent = index === currentGlobalSlideIndex;
              const isPast = index < currentGlobalSlideIndex;
              const isNext = index === currentGlobalSlideIndex + 1;
              
              return (
                <button
                  key={`${slide.itemIndex}-${slide.slideIndex}`}
                  onClick={() => {
                    useServicePresentationStore.setState({ 
                      currentItemIndex: slide.itemIndex,
                      currentSlideIndex: slide.slideIndex
                    });
                  }}
                  className={`w-full text-left p-2 rounded-lg transition-all ${
                    isCurrent
                      ? 'bg-brand-skyBlue text-white ring-2 ring-white/50'
                      : isNext
                      ? 'bg-green-900/30 text-green-200 border border-green-500/50'
                      : isPast
                      ? 'bg-gray-700/50 text-gray-500'
                      : 'bg-gray-700/30 text-gray-300 hover:bg-gray-700/60'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {/* Slide number & status */}
                    <div className="flex-shrink-0 pt-0.5">
                      <span className="text-xs opacity-70 font-mono">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    
                    {/* Thumbnail */}
                    <div className="flex-shrink-0 w-16 h-9 bg-black rounded overflow-hidden">
                      <div className="transform scale-[0.15] origin-top-left" style={{ width: '640px', height: '360px' }}>
                        <ServiceItemSlidePreview 
                          item={slide.item}
                          slideIndex={slide.slideIndex}
                          songData={slide.song}
                        />
                      </div>
                    </div>
                    
                    {/* Slide info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate font-medium">
                        {slide.title}
                      </div>
                      {isCurrent && (
                        <div className="text-xs opacity-75 mt-0.5">▶ NOW SHOWING</div>
                      )}
                      {isNext && (
                        <div className="text-xs opacity-75 mt-0.5">→ UP NEXT</div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center - Slides */}
        <div className="flex-1 p-6 space-y-4 overflow-y-auto">
          {/* Current Slide */}
          <div>
            <h3 className="text-white text-sm mb-2 font-semibold">CURRENT SLIDE</h3>
            <div className="bg-black rounded-lg overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
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
            <div className="bg-black rounded-lg overflow-hidden shadow-lg opacity-70" style={{ aspectRatio: '16/9' }}>
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
          disabled={
            currentItemIndex >= service.items.length - 1 && 
            (currentItem?.type === 'song' 
              ? (!currentSong?.slidesData || currentSlideIndex >= currentSong.slidesData.length - 1)
              : currentItem?.type === 'sermon-slides'
                ? (!currentSermonSlides || currentSlideIndex >= currentSermonSlides.length - 1)
                : true)
          }
          className="px-6 py-3 bg-brand-skyBlue hover:bg-brand-skyBlue/90 text-white rounded-lg flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
