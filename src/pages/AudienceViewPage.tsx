import { useEffect, useState } from 'react';
import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';

/**
 * Audience View - Full screen projection
 * This is what the congregation sees on the projector
 * Clean, full-screen, no controls
 * 
 * Receives state updates via IPC from the presenter window
 */
export function AudienceViewPage() {
  const [presentationState, setPresentationState] = useState<any>(null);

  // Listen for state updates from presenter window via IPC
  useEffect(() => {
    console.log('👀 Audience view initializing', {
      hasElectron: !!window.electron,
      hasPresentation: !!window.electron?.presentation,
      hasOnStateUpdate: !!window.electron?.presentation?.onStateUpdate
    });

    if (window.electron?.presentation?.onStateUpdate) {
      console.log('✅ Audience view listening for state updates');
      
      // Set up listener for state updates
      const unsubscribe = window.electron.presentation.onStateUpdate((state) => {
        console.log('📺 Audience received state update:', {
          hasService: !!state.service,
          currentItemIndex: state.currentItemIndex,
          currentSlideIndex: state.currentSlideIndex,
          hasSongData: !!state.currentSongData,
          isBlank: state.isBlank
        });
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

  if (!service || !currentItem) {
    return (
      <div className="w-screen h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Waiting for presentation...</div>
      </div>
    );
  }

  // Get visual data from song slides or item content
  let visualData = null;
  
  // If it's a song, use the song slide data
  if (currentItem?.type === 'song' && currentSongData?.slidesData) {
    const currentSlide = currentSongData.slidesData[currentSlideIndex];
    if (currentSlide?.visualData) {
      visualData = currentSlide.visualData;
      console.log('📺 Using song slide data:', {
        slideIndex: currentSlideIndex,
        totalSlides: currentSongData.slidesData.length,
        hasBackground: !!visualData.background,
        elementCount: visualData.elements?.length
      });
    }
  }
  // Otherwise try to parse content
  else if (currentItem?.content) {
    try {
      const parsed = typeof currentItem.content === 'string' 
        ? JSON.parse(currentItem.content) 
        : currentItem.content;
      visualData = parsed;
      console.log('📺 Audience parsed visualData from content:', {
        hasBackground: !!visualData?.background,
        elementCount: visualData?.elements?.length,
        backgroundType: visualData?.background?.type
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

  // Helper to get background style
  const getBackgroundStyle = (background: any) => {
    if (!background) {
      return { background: '#000000' };
    }

    // Check for gradient
    if (background.gradient) {
      console.log('📐 Using gradient background');
      return { background: background.gradient };
    }

    // Check for solid color (both 'color' and 'backgroundColor' fields)
    const bgColor = background.color || background.backgroundColor;
    if (bgColor) {
      console.log('🎨 Using solid color background:', bgColor);
      return { background: bgColor };
    }

    // Check for image URL
    if (background.imageUrl) {
      // If it's already a full URL, use it
      if (background.imageUrl.startsWith('http')) {
        console.log('🖼️ Using image URL:', background.imageUrl);
        return {
          backgroundImage: `url(${background.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      
      // Otherwise, it's a background ID - look it up
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === background.imageUrl);
      if (bg) {
        console.log('✅ Resolved background ID:', background.imageUrl, '→', bg.url);
        return {
          backgroundImage: `url(${bg.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        };
      }
      
      console.warn('⚠️ Could not resolve background ID:', background.imageUrl);
    }

    // Fallback to black
    console.warn('⚠️ No background found, using black');
    return { background: '#000000' };
  };

  // Render slide content based on type
  const renderSlide = () => {
    if (visualData) {
      // Visual slide (template-based)
      let { background, elements } = visualData;
      
      // Convert old background format if needed
      if (!background && visualData.backgroundType) {
        console.log('🔧 Converting old background format:', visualData.backgroundType);
        background = {
          type: visualData.backgroundType,
          color: visualData.backgroundColor,
          gradient: visualData.backgroundGradient,
          imageUrl: visualData.backgroundImage,
        };
      }
      
      const backgroundStyle = getBackgroundStyle(background);
      
      // Calculate overlay opacity (ALWAYS 50% minimum for image backgrounds)
      const hasImageBackground = background?.imageUrl || backgroundStyle.backgroundImage;
      const overlayOpacity = hasImageBackground
        ? (background?.overlay?.enabled === false 
            ? 0 
            : background?.overlay?.opacity 
              ? Math.max(background.overlay.opacity / 100, 0.5)
              : 0.5)
        : 0;
      
      console.log('📺 Audience overlay:', {
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

          {/* Elements */}
          {elements?.map((element: any, index: number) => {
            if (!element.visible) return null;

            if (element.type === 'text') {
              return (
                <div
                  key={element.id || index}
                  className="absolute whitespace-pre-wrap"
                  style={{
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: `${element.size.width}px`,
                    height: `${element.size.height}px`,
                    fontSize: `${element.style?.fontSize || element.fontSize}px`,
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
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: `${element.size.width}px`,
                    height: `${element.size.height}px`,
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
                    left: `${element.position.x}px`,
                    top: `${element.position.y}px`,
                    width: `${element.size.width}px`,
                    height: `${element.size.height}px`,
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

  return (
    <div className="w-screen h-screen overflow-hidden bg-black">
      {/* 1920x1080 container scaled to fit screen */}
      <div className="w-full h-full flex items-center justify-center">
        <div
          className="relative bg-black"
          style={{
            width: '1920px',
            height: '1080px',
            transform: 'scale(var(--scale))',
            transformOrigin: 'center center',
          }}
        >
          {renderSlide()}
        </div>
      </div>

      <style>{`
        :root {
          --scale: min(calc(100vw / 1920), calc(100vh / 1080));
        }
      `}</style>
    </div>
  );
}
