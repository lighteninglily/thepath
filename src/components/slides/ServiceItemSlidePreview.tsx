import type { ServiceItem } from '../../types/service';
import type { Song } from '../../types';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';

interface ServiceItemSlidePreviewProps {
  item: ServiceItem;
  slideIndex?: number;
  songData?: Song | null; // Pass song data if item is a song
  className?: string;
}

/**
 * Renders a service item as a slide for presentation
 * Handles all service item types: songs, scripture, announcements, sermons, etc.
 */
export function ServiceItemSlidePreview({ item, slideIndex = 0, songData, className = '' }: ServiceItemSlidePreviewProps) {
  console.log('🎬 ServiceItemSlidePreview rendering:', item.type, item.title, 'slideIndex:', slideIndex);
  console.log('📊 Song data received:', songData ? `${songData.title} (${songData.slidesData?.length || 0} slides)` : 'NO SONG DATA');
  
  // Handle song items with song data
  if (item.type === 'song') {
    if (!songData) {
      console.error('❌ Song item but NO songData! songId:', item.songId, 'songTitle:', item.songTitle);
      // Fallback for missing song data
      return (
        <div className="relative overflow-hidden aspect-video bg-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-3xl font-bold mb-2">{item.songTitle || 'Song'}</p>
            <p className="text-lg opacity-70">Loading song data...</p>
          </div>
        </div>
      );
    }
    
    if (!songData.slidesData || songData.slidesData.length === 0) {
      console.error('❌ Song has NO slides! songId:', songData.id);
      return (
        <div className="relative overflow-hidden aspect-video bg-gray-800 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-3xl font-bold mb-2">{songData.title}</p>
            <p className="text-lg opacity-70">No slides available</p>
          </div>
        </div>
      );
    }
    
    const slide = songData.slidesData[slideIndex];
    if (slide) {
      console.log('🎵 Rendering song slide:', slide.type, slideIndex, 'of', songData.slidesData.length);
      return renderSongSlide(slide, songData, className);
    }
    console.log('⚠️ Song slide not found at index', slideIndex);
  }
  
  // Has visual data from template editor
  if (item.content) {
    try {
      const visualData = JSON.parse(item.content);
      console.log('📊 Parsed visual data:', visualData);
      
      // If it looks like visual editor data, render it
      if (visualData.elements) {
        // Fix background structure if needed
        if (!visualData.background && visualData.backgroundType) {
          // Old structure: backgroundType, backgroundImage, backgroundColor
          // Convert to new structure
          visualData.background = {
            type: visualData.backgroundType || 'solid',
            imageUrl: visualData.backgroundImage,
            color: visualData.backgroundColor || '#E8E3DC'
          };
          console.log('🔧 Converted background structure:', visualData.background);
        } else if (!visualData.background) {
          // No background at all - add default
          visualData.background = {
            type: 'solid',
            color: visualData.backgroundColor || '#E8E3DC'
          };
        }
        
        console.log('✅ Rendering visual slide with', visualData.elements.length, 'elements');
        return renderVisualSlide(visualData, className);
      }
      console.log('⚠️ Visual data structure incomplete, falling back to simple');
    } catch (e) {
      console.error('❌ Failed to parse visual data:', e);
      // Not JSON or invalid, fall through to simple rendering
    }
  }
  
  console.log('📝 Using simple slide fallback');
  // Simple fallback for items without visual data
  return renderSimpleSlide(item, className);
}

// Render visual editor slide data
function renderVisualSlide(visualData: any, className: string) {
  console.log('🎨 renderVisualSlide received:', {
    hasBackground: !!visualData?.background,
    background: visualData?.background,
    elementCount: visualData?.elements?.length
  });
  
  if (!visualData || !visualData.background || !visualData.elements) {
    console.error('❌ Invalid visualData in renderVisualSlide:', visualData);
    return (
      <div className={`relative ${className} bg-black flex items-center justify-center`} style={{ aspectRatio: '16/9' }}>
        <p className="text-white text-2xl">Invalid slide data</p>
      </div>
    );
  }
  
  const elements = visualData.elements.map((el: any) => ({
    ...el,
    visible: el.visible !== false,
    zIndex: el.zIndex || 10,
    opacity: el.opacity !== undefined ? el.opacity : 1,
  }));
  
  const { background } = visualData;
  console.log('🖼️ Rendering with background:', {
    type: background.type,
    imageUrl: background.imageUrl,
    color: background.color
  });
  
  // Resolve background image URL if it's an ID
  const getBackgroundImageUrl = () => {
    if (!background.imageUrl) return null;
    
    // If it's already a full URL, use it
    if (background.imageUrl.startsWith('http://') || background.imageUrl.startsWith('https://')) {
      return background.imageUrl;
    }
    
    // Otherwise, it's a background ID - look it up
    const bg = WORSHIP_BACKGROUNDS.find(b => b.id === background.imageUrl);
    if (bg) {
      console.log('✅ Resolved background ID:', background.imageUrl, '→', bg.url);
      return bg.url;
    }
    
    console.warn('⚠️ Background ID not found:', background.imageUrl);
    return null;
  };
  
  const backgroundImageUrl = getBackgroundImageUrl();
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        aspectRatio: '16/9',
        width: '100%',
        height: '100%'
      }}
    >
      {/* Background */}
      {background.type === 'image' && backgroundImageUrl ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      ) : background.type === 'gradient' && background.gradient ? (
        <div 
          className="absolute inset-0"
          style={{ background: background.gradient }}
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: background.color || visualData.backgroundColor || '#E8E3DC' }}
        />
      )}
      
      {/* Elements */}
      <div className="absolute inset-0">
        {elements
          .filter((el: any) => el.visible !== false)
          .sort((a: any, b: any) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((element: any) => {
            // Render text elements
            if (element.type === 'text') {
              const style = element.style || {};
              return (
                <div
                  key={element.id}
                  className="absolute whitespace-pre-wrap"
                  style={{
                    left: `${(element.position.x / 1920) * 100}%`,
                    top: `${(element.position.y / 1080) * 100}%`,
                    width: `${(element.size.width / 1920) * 100}%`,
                    height: `${(element.size.height / 1080) * 100}%`,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    opacity: element.opacity !== undefined ? element.opacity : 1,
                    zIndex: element.zIndex || 1,
                    
                    // Text styling
                    fontFamily: element.fontFamily || style.fontFamily || 'Inter',
                    fontSize: element.fontSize ? `${(element.fontSize / 1080) * 100}vh` : style.fontSize ? `${(style.fontSize / 1080) * 100}vh` : '5vh',
                    fontWeight: element.fontWeight || style.fontWeight || 400,
                    fontStyle: style.fontStyle || 'normal',
                    color: element.color || style.color || '#3A3532',
                    textAlign: (element.textAlign || style.textAlign || 'center') as any,
                    textTransform: style.textTransform || 'none',
                    textDecoration: style.textDecoration || 'none',
                    lineHeight: style.lineHeight || 1.3,
                    letterSpacing: style.letterSpacing || 0,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    
                    // Display
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: element.textAlign === 'left' || style.textAlign === 'left' ? 'flex-start' 
                      : element.textAlign === 'right' || style.textAlign === 'right' ? 'flex-end' 
                      : 'center',
                    padding: '0',
                  }}
                >
                  {element.content || ''}
                </div>
              );
            }
            
            // Render shape elements (rectangles, circles, etc.)
            if (element.type === 'shape') {
              const style = element.style || {};
              return (
                <div
                  key={element.id}
                  className="absolute"
                  style={{
                    left: `${(element.position.x / 1920) * 100}%`,
                    top: `${(element.position.y / 1080) * 100}%`,
                    width: `${(element.size.width / 1920) * 100}%`,
                    height: `${(element.size.height / 1080) * 100}%`,
                    transform: `rotate(${element.rotation || 0}deg)`,
                    opacity: element.opacity !== undefined ? element.opacity : 1,
                    zIndex: element.zIndex || 1,
                    
                    // Shape styling
                    backgroundColor: element.fill || style.backgroundColor || 'transparent',
                    border: element.stroke ? `${element.strokeWidth || 2}px solid ${element.stroke}` : style.border || 'none',
                    borderRadius: element.cornerRadius ? `${element.cornerRadius}px` : style.borderRadius || '0px',
                  }}
                />
              );
            }
            
            return null;
          })}
      </div>
    </div>
  );
}

// Render a song slide with lyrics
function renderSongSlide(slide: any, song: Song, className: string) {
  // Check if slide has visual data (was edited in visual editor)
  if (slide.visualData) {
    const visualData = slide.visualData;
    if (visualData.elements && visualData.background) {
      return renderVisualSlide(visualData, className);
    }
  }
  
  // Get background image
  const getBackgroundImage = () => {
    console.log('🖼️ Looking for background:', {
      slideBackgroundId: slide.backgroundId,
      songBackgroundId: song.backgroundId,
      themeBackgroundImage: song.designTheme?.backgroundImage,
      availableBackgrounds: WORSHIP_BACKGROUNDS.length
    });
    
    // Priority 1: Slide-specific background
    if (slide.backgroundId) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === slide.backgroundId);
      if (bg) {
        console.log('✅ Found slide background:', bg.id, bg.url);
        return bg.url;
      }
    }
    
    // Priority 2: Song-level background
    if (song.backgroundId) {
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === song.backgroundId);
      if (bg) {
        console.log('✅ Found song background:', bg.id, bg.url);
        return bg.url;
      }
    }
    
    // Priority 3: Design theme background image
    if (song.designTheme?.backgroundImage) {
      console.log('✅ Using theme background:', song.designTheme.backgroundImage);
      return song.designTheme.backgroundImage;
    }
    
    console.log('⚠️ No background found, using solid color');
    return null;
  };
  
  // Default song slide rendering
  const getBackgroundColor = () => {
    if (song.designTheme?.backgroundColor) {
      return song.designTheme.backgroundColor;
    }
    // Default colors by slide type
    switch (slide.type) {
      case 'title': return '#2A4A6B';
      case 'verse': return '#4A5A7F';
      case 'chorus': return '#5A4A6B';
      case 'bridge': return '#6B4A5A';
      default: return '#3A3532';
    }
  };
  
  const backgroundImage = getBackgroundImage();
  
  const getTypeLabel = () => {
    switch (slide.type) {
      case 'verse': return `Verse ${slide.order}`;
      case 'chorus': return 'Chorus';
      case 'bridge': return 'Bridge';
      case 'title': return song.title;
      default: return slide.type;
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: '16/9',
      }}
    >
      {/* Background Layer */}
      {backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {/* Overlay for text readability */}
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: song.designTheme?.overlayOpacity || 0.4 }}
          />
        </>
      ) : (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: getBackgroundColor() }}
        />
      )}
      
      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center p-16">
        {/* Slide Type Label */}
        {slide.type !== 'title' && (
        <div 
          className="absolute top-8 left-8 text-white/60 uppercase tracking-wider font-semibold"
          style={{ fontSize: '18px' }}
        >
          {getTypeLabel()}
        </div>
      )}
      
      {/* Lyrics */}
      <div 
        className="text-white text-center max-w-5xl"
        style={{
          fontSize: song.designTheme?.fontSize || 'clamp(24px, 4vw, 56px)',
          fontFamily: song.designTheme?.fontFamily || 'Inter',
          lineHeight: '1.5',
          textShadow: song.designTheme?.textShadow || '3px 3px 6px rgba(0,0,0,0.8)',
          textAlign: (song.designTheme?.textAlign || 'center') as any,
          whiteSpace: 'pre-wrap'
        }}
      >
        {slide.content}
      </div>
      
      {/* Song Title (bottom right) */}
      <div 
        className="absolute bottom-8 right-8 text-white/40 text-right"
        style={{ fontSize: '14px' }}
      >
        <div className="font-semibold">{song.title}</div>
        {song.artist && <div className="text-xs mt-1">{song.artist}</div>}
      </div>
      </div>
    </div>
  );
}

// Simple fallback rendering for items without visual data
function renderSimpleSlide(item: ServiceItem, className: string) {
  const getBackgroundColor = () => {
    switch (item.type) {
      case 'scripture': return '#4A5A7F'; // Blue-gray
      case 'sermon': return '#5A4A4F'; // Brown-gray
      case 'announcement': return '#5A7F5A'; // Green-gray
      case 'welcome': return '#7F5A5A'; // Red-gray
      case 'offering': return '#5A5A7F'; // Purple-gray
      case 'closing': return '#4F5A5A'; // Teal-gray
      default: return '#3A3532'; // Default dark
    }
  };
  
  const getTitle = () => {
    if (item.type === 'scripture' && item.scriptureReference) {
      return item.scriptureReference;
    }
    return item.title || item.type.toUpperCase();
  };
  
  const getContent = () => {
    if (item.type === 'scripture' && item.scriptureText) {
      return item.scriptureText;
    }
    // Don't display item.content if it's JSON (visual data)
    if (item.content && item.content.trim().startsWith('{')) {
      return ''; // Skip JSON content
    }
    return item.content || '';
  };
  
  return (
    <div 
      className={`relative overflow-hidden ${className} flex flex-col items-center justify-center p-16`}
      style={{ 
        aspectRatio: '16/9',
        backgroundColor: getBackgroundColor()
      }}
    >
      {/* Title */}
      <h1 
        className="text-white font-bold mb-8"
        style={{
          fontSize: 'clamp(24px, 5vw, 72px)',
          textAlign: 'center',
          textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
          letterSpacing: '0.05em',
        }}
      >
        {getTitle()}
      </h1>
      
      {/* Content */}
      {getContent() && (
        <p 
          className="text-white max-w-4xl"
          style={{
            fontSize: 'clamp(18px, 3vw, 48px)',
            textAlign: 'center',
            lineHeight: '1.6',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          }}
        >
          {getContent()}
        </p>
      )}
      
      {/* Type indicator */}
      <div 
        className="absolute bottom-8 right-8 text-white/40 uppercase tracking-wider"
        style={{ fontSize: '14px' }}
      >
        {item.type}
      </div>
    </div>
  );
}
