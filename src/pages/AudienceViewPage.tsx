import { useEffect, useState } from 'react';
import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';
import { resolveBackground } from '../utils/backgroundResolver';

/**
 * Audience View - Full screen projection
 * This is what the congregation sees on the projector
 * Clean, full-screen, no controls
 * 
 * Receives state updates via IPC from the presenter window
 */
export function AudienceViewPage() {
  const [presentationState, setPresentationState] = useState<any>(null);

  console.log('🎭 AudienceViewPage MOUNTED');
  console.log('📍 Current state:', presentationState);

  // NOTE: Blank screen is now handled via isBlank state in synced presentation state
  // The old onBlank/onUnblank IPC methods have been removed
  // Keeping this as a reference for future blank screen types (black/white/logo)
  useEffect(() => {
    // Legacy code - onBlank/onUnblank don't exist in current IPC interface
    // Blank state is synced via presentation state updates instead
    // Uncomment if blank screen types need special handling
    /*
    if (!window.electron?.presentation) return;

    const unsubscribeBlank = window.electron.presentation.onBlank?.((type: string) => {
      console.log('⬛ Blank screen requested:', type);
      setBlankScreen({ active: true, type: type as any });
    });

    const unsubscribeUnblank = window.electron.presentation.onUnblank?.(() => {
      console.log('⬜ Unblank screen requested');
      setBlankScreen({ active: false, type: null });
    });

    return () => {
      unsubscribeBlank?.();
      unsubscribeUnblank?.();
    };
    */
  }, []);

  // Listen for state updates from presenter window via IPC
  useEffect(() => {
    console.log('👀 Audience view initializing', {
      hasElectron: !!window.electron,
      hasPresentation: !!window.electron?.presentation,
      hasOnStateUpdate: !!window.electron?.presentation?.onStateUpdate,
      windowLocation: window.location.href,
      windowHash: window.location.hash
    });

    if (window.electron?.presentation?.onStateUpdate) {
      console.log('✅ Audience view listening for state updates');
      
      // Set up listener for state updates
      const unsubscribe = window.electron.presentation.onStateUpdate((state) => {
        console.log('📺 AUDIENCE: Received state update:', {
          hasService: !!state.service,
          currentItemIndex: state.currentItemIndex,
          currentSlideIndex: state.currentSlideIndex,
          hasSongData: !!state.currentSongData,
          songDataTitle: state.currentSongData?.title,
          songDataSlidesCount: state.currentSongData?.slidesData?.length,
          isBlank: state.isBlank,
          currentItemType: state.service?.items[state.currentItemIndex]?.type
        });
        
        // Log the full state for debugging
        console.log('📦 AUDIENCE: Full state object:', JSON.stringify(state, null, 2));
        
        setPresentationState(state);
      });

      // IMPORTANT: Request initial state after a short delay
      // This ensures the presenter view has mounted and has state to send
      const requestInitialState = setTimeout(() => {
        console.log('📡 Audience requesting initial state...');
        // Trigger a sync by sending a message back
        // (The presenter's sync effect will run and send current state)
      }, 500);

      return () => {
        unsubscribe();
        clearTimeout(requestInitialState);
      };
    } else {
      console.error('❌ window.electron.presentation.onStateUpdate not available!');
    }
  }, []);

  // Get current item from synced state
  const service = presentationState?.service;
  const currentItemIndex = presentationState?.currentItemIndex ?? 0;
  const currentSlideIndex = presentationState?.currentSlideIndex ?? 0;
  const currentItem = service?.items[currentItemIndex];
  const currentSongData = presentationState?.currentSongData;

  console.log('🔍 Render check:', {
    hasService: !!service,
    hasCurrentItem: !!currentItem,
    hasCurrentSongData: !!currentSongData,
    currentItemIndex,
    currentSlideIndex
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent any keyboard interaction in audience view
      // All control happens from presenter view
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Blank Screen Override (from presenter's isBlank state)
  if (presentationState?.isBlank) {
    return (
      <div 
        className="w-screen h-screen flex items-center justify-center bg-black"
      >
        {/* Blank screen - no content */}
      </div>
    );
  }

  if (!service || !currentItem) {
    console.log('⏳ Showing waiting screen - no service/item yet');
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-4xl font-bold p-8 rounded-lg">
          Waiting for presentation...
          <div className="text-sm mt-4 opacity-50">State: {presentationState ? 'Received' : 'Null'}</div>
        </div>
      </div>
    );
  }

  // Get visual data from song slides or item content
  let visualData = null;
  
  console.log('🎵 AUDIENCE: Checking for visual data:', {
    itemType: currentItem?.type,
    hasSongData: !!currentSongData,
    songDataId: currentSongData?.id,
    songTitle: currentSongData?.title,
    slidesDataLength: currentSongData?.slidesData?.length,
    currentSlideIndex,
    hasContent: !!currentItem?.content
  });
  
  // If it's a song, use the song slide data
  if (currentItem?.type === 'song' && currentSongData?.slidesData) {
    const currentSlide = currentSongData.slidesData[currentSlideIndex];
    console.log('📺 AUDIENCE: Song slide data:', {
      slideIndex: currentSlideIndex,
      totalSlides: currentSongData.slidesData.length,
      currentSlide: currentSlide,
      hasVisualData: !!currentSlide?.visualData
    });
    
    if (currentSlide?.visualData) {
      visualData = currentSlide.visualData;
      console.log('✅ AUDIENCE: Using song slide visual data:', {
        hasBackground: !!visualData.background,
        elementCount: visualData.elements?.length
      });
    } else {
      console.error('❌ AUDIENCE: Song slide missing visualData!', currentSlide);
    }
  } else if (currentItem?.type === 'song') {
    console.error('❌ AUDIENCE: Song item but NO song data!', {
      hasSongData: !!currentSongData,
      songId: currentItem?.songId
    });
  }
  // Otherwise try to parse content
  else if (currentItem?.content) {
    try {
      const parsed = typeof currentItem.content === 'string' 
        ? JSON.parse(currentItem.content) 
        : currentItem.content;
      visualData = parsed;
      
      // 🔍 DIAGNOSTIC: Log the EXACT structure for scripture/non-song items
      console.log('🔍 DIAGNOSTIC - Parsed visual data:', JSON.stringify(visualData, null, 2));
      console.log('📺 Audience parsed visualData from content:', {
        hasBackground: !!visualData?.background,
        backgroundType: visualData?.backgroundType,
        backgroundColor: visualData?.backgroundColor,
        backgroundData: visualData?.background,
        elementCount: visualData?.elements?.length,
        itemType: currentItem.type
      });
    } catch (e) {
      console.error('❌ Failed to parse content:', e, currentItem?.content?.substring(0, 100));
    }
  } else {
    console.log('📺 No visual data available:', {
      itemType: currentItem?.type,
      hasSongData: !!currentSongData,
      hasContent: !!currentItem?.content
    });
  }

  // No longer needed - using resolveBackground utility instead

  // Render slide content based on type
  const renderSlide = () => {
    console.log('🎬 AudienceView renderSlide called:', {
      hasVisualData: !!visualData,
      hasService: !!service,
      hasCurrentItem: !!currentItem,
      currentItemType: currentItem?.type,
      currentItemIndex,
      currentSlideIndex
    });
    
    if (visualData) {
      // Visual slide (template-based)
      let { background, elements } = visualData;
      
      console.log('📊 Visual data details:', {
        hasBackground: !!background,
        elementCount: elements?.length,
        backgroundType: background?.type,
        hasOldFormat: !!(visualData.backgroundGradient || visualData.backgroundColor || visualData.backgroundImage)
      });
      
      // Convert old background format if needed
      // Check for ANY old format fields (backgroundGradient, backgroundColor, backgroundImage)
      if (!background && (visualData.backgroundType || visualData.backgroundGradient || visualData.backgroundColor || visualData.backgroundImage)) {
        console.log('🔧 Converting old background format:', {
          backgroundType: visualData.backgroundType,
          hasGradient: !!visualData.backgroundGradient,
          hasColor: !!visualData.backgroundColor,
          hasImage: !!visualData.backgroundImage
        });
        background = {
          type: visualData.backgroundType || (visualData.backgroundGradient ? 'gradient' : visualData.backgroundImage ? 'image' : 'solid'),
          color: visualData.backgroundColor,
          gradient: visualData.backgroundGradient,
          imageUrl: visualData.backgroundImage,
        };
      }
      
      // Use unified background resolver
      const resolved = resolveBackground(background);
      const backgroundStyle = resolved.style;
      
      console.log('🖼️ Resolved background:', {
        type: resolved.type,
        hasError: resolved.hasError,
        errorMessage: resolved.errorMessage,
        style: backgroundStyle
      });
      
      // Calculate overlay opacity - ONLY apply to SONG slides (title + lyrics)
      // Announcements, scripture, and other items should NOT have overlay
      const isSong = currentItem?.type === 'song';
      const hasImageBackground = background?.imageUrl || backgroundStyle.backgroundImage;
      const overlayOpacity = isSong && hasImageBackground
        ? (background?.overlay?.enabled === false 
            ? 0 
            : background?.overlay?.opacity 
              ? Math.max(background.overlay.opacity / 100, 0.5)
              : 0.5)
        : 0;
      
      console.log('📺 Audience overlay:', {
        isSong,
        hasImageBackground,
        overlayData: background?.overlay,
        calculatedOpacity: overlayOpacity
      });

      return (
        <div className="w-full h-full relative overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0"
            style={backgroundStyle}
          />
          
          {/* Dark overlay for text readability */}
          {overlayOpacity > 0 && (
            <div 
              className="absolute inset-0 bg-black"
              style={{ 
                opacity: overlayOpacity,
                zIndex: 1 
              }}
            />
          )}
          
          {/* Dev Mode: Visual error indicator for missing backgrounds */}
          {process.env.NODE_ENV === 'development' && hasImageBackground && !backgroundStyle.backgroundImage && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 text-sm rounded z-50 font-mono">
              ⚠️ Background missing: {background?.imageUrl || background?.imageId || 'unknown'}
            </div>
          )}

          {/* Elements */}
          {elements?.map((element: any, index: number) => {
            // Only skip if explicitly set to false (undefined or true should render)
            if (element.visible === false) return null;

            // Safety defaults for position and size
            const position = element.position || { x: 0, y: 0 };
            const size = element.size || { width: 100, height: 100 };

            if (element.type === 'text') {
              return (
                <div
                  key={element.id || index}
                  className="absolute whitespace-pre-wrap"
                  style={{
                    left: `${(position.x / 1920) * 100}%`,
                    top: `${(position.y / 1080) * 100}%`,
                    width: `${(size.width / 1920) * 100}%`,
                    height: `${(size.height / 1080) * 100}%`,
                    fontSize: element.fontSize ? `${(element.fontSize / 1080) * 100}vh` : `${((element.style?.fontSize || 48) / 1080) * 100}vh`,
                    fontFamily: element.style?.fontFamily || element.fontFamily,
                    fontWeight: element.style?.fontWeight || element.fontWeight,
                    color: element.style?.color || element.color,
                    textAlign: (element.style?.textAlign || element.textAlign) as any,
                    zIndex: element.zIndex || 10,
                    opacity: element.opacity ?? 1,
                  }}
                >
                  {element.content}
                </div>
              );
            }

            if (element.type === 'shape') {
              return (
                <div
                  key={element.id || index}
                  className="absolute"
                  style={{
                    left: `${(position.x / 1920) * 100}%`,
                    top: `${(position.y / 1080) * 100}%`,
                    width: `${(size.width / 1920) * 100}%`,
                    height: `${(size.height / 1080) * 100}%`,
                    backgroundColor: element.backgroundColor,
                    borderRadius: `${element.borderRadius || 0}px`,
                    zIndex: element.zIndex || 5,
                    opacity: element.opacity ?? 1,
                  }}
                />
              );
            }

            if (element.type === 'image') {
              return (
                <img
                  key={element.id || index}
                  src={element.content || element.imageUrl}
                  alt=""
                  className="absolute"
                  style={{
                    left: `${(position.x / 1920) * 100}%`,
                    top: `${(position.y / 1080) * 100}%`,
                    width: `${(size.width / 1920) * 100}%`,
                    height: `${(size.height / 1080) * 100}%`,
                    objectFit: 'contain',
                    zIndex: element.zIndex || 10,
                    opacity: element.opacity ?? 1,
                  }}
                />
              );
            }

            return null;
          })}
        </div>
      );
    }

    // Handle old-format song slides (plain text + backgroundId)
    if (currentItem?.type === 'song' && currentSongData?.slidesData) {
      const currentSlide = currentSongData.slidesData[currentSlideIndex];
      if (currentSlide && currentSlide.content && currentSlide.backgroundId) {
        console.log('📺 Rendering legacy song slide:', {
          slideType: currentSlide.type,
          backgroundId: currentSlide.backgroundId,
          contentLength: currentSlide.content.length
        });
        
        // Get background from backgroundId
        const bg = WORSHIP_BACKGROUNDS.find(b => b.id === currentSlide.backgroundId);
        const backgroundStyle = bg ? {
          backgroundImage: `url(${bg.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : { background: '#1a1a2e' };
        
        return (
          <div className="w-full h-full relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0" style={backgroundStyle} />
            
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black opacity-50" style={{ zIndex: 1 }} />
            
            {/* Lyrics text */}
            <div 
              className="absolute inset-0 flex items-center justify-center text-white text-center px-32"
              style={{ zIndex: 10 }}
            >
              <div className="text-6xl font-bold leading-tight whitespace-pre-wrap font-sans">
                {currentSlide.content}
              </div>
            </div>
          </div>
        );
      }
    }

    // Fallback for items without visual data
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-900">
        <div className="text-white text-center p-16 max-w-4xl">
          <div className="text-sm uppercase tracking-widest mb-4 opacity-60">
            {currentItem.type}
          </div>
          <h2 className="text-6xl font-bold mb-8">
            {currentItem.songTitle || currentItem.title || 'Loading...'}
          </h2>
          <p className="text-2xl opacity-75">
            Slide content will appear here
          </p>
        </div>
      </div>
    );
  };

  // Enable debug overlay with query param: ?debug=true
  const showDebug = typeof window !== 'undefined' && 
    process.env.NODE_ENV === 'development' && 
    new URLSearchParams(window.location.search).get('debug') === 'true';

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {/* DEBUG OVERLAY - Only shows with ?debug=true in development */}
      {showDebug && (
        <div className="absolute top-4 right-4 bg-black bg-opacity-90 text-white p-4 text-xs font-mono z-50 max-w-md border border-gray-700 rounded shadow-lg">
          <div className="font-bold mb-2 text-yellow-400">🔍 AUDIENCE DEBUG</div>
          <div>Has State: {presentationState ? '✅' : '❌'}</div>
          <div>Has Service: {presentationState?.service ? '✅' : '❌'}</div>
          <div>Item Index: {presentationState?.currentItemIndex ?? 'N/A'}</div>
          <div>Slide Index: {presentationState?.currentSlideIndex ?? 'N/A'}</div>
          <div>Item Type: {currentItem?.type || 'N/A'}</div>
          <div>Song Data: {currentSongData ? `✅ (${currentSongData.slidesData?.length} slides)` : '❌ MISSING'}</div>
          <div>Visual Data: {visualData ? '✅' : '❌'}</div>
          {visualData && (
            <div className="mt-2 border-t border-gray-600 pt-2">
              <div>Background: {visualData.background?.type || 'none'}</div>
              <div>Elements: {visualData.elements?.length || 0}</div>
            </div>
          )}
        </div>
      )}
      
      {/* Responsive container using percentage-based positioning (16:9 aspect ratio) */}
      <div className="w-full h-full flex items-center justify-center bg-black">
        <div className="relative bg-black" style={{ aspectRatio: '16/9', width: '100%', height: '100%', maxWidth: '100vw', maxHeight: '100vh' }}>
          {renderSlide()}
        </div>
      </div>
    </div>
  );
}
