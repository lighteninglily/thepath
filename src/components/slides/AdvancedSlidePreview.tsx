import type { Slide } from '../../types';
import type { BackgroundImage } from '../../assets/backgrounds';
import type { LayoutType } from '../../utils/layouts';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';

interface AdvancedSlidePreviewProps {
  slide: Slide;
  background?: BackgroundImage | null;
  layout?: LayoutType;
  className?: string;
}

export function AdvancedSlidePreview({ 
  slide, 
  background, 
  layout = 'full-bleed',
  className = '' 
}: AdvancedSlidePreviewProps) {
  
  // ✅ CHECK FOR VISUAL DATA FIRST!
  if (slide.visualData) {
    console.log('📺 PRESENTATION: Using visual data for slide', slide.id);
    return renderVisualSlide(slide.visualData, className);
  }
  
  console.log('📺 PRESENTATION: Using advanced layout for slide', slide.id);
  const lines = slide.content.split('\n').filter(l => l.trim());
  const textColor = background?.textColor === 'dark' ? '#3A3532' : '#FFFFFF';
  const fontSize = calculateFontSize(lines.length);

  // Render based on layout type
  switch (layout) {
    case 'split-dark-light':
      return renderSplitLayout(lines, background, textColor, fontSize, className, false);
    
    case 'split-light-dark':
      return renderSplitLayout(lines, background, textColor, fontSize, className, true);
    
    case 'centered-mask':
      return renderMaskedLayout(lines, background, textColor, fontSize, className);
    
    case 'gradient-overlay':
      return renderGradientOverlay(lines, background, textColor, fontSize, className);
    
    case 'full-bleed':
    default:
      return renderFullBleed(lines, background, textColor, fontSize, className);
  }
}

// Full-bleed photo with text overlay
function renderFullBleed(
  lines: string[], 
  background: BackgroundImage | null | undefined, 
  textColor: string,
  fontSize: string,
  className: string
) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* Background Image */}
      {background ? (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background.url})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-brand-deepBrown" />
      )}
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* Text */}
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div style={{ 
          color: textColor,
          fontSize,
          lineHeight: '1.4',
          textAlign: 'left',
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
          fontWeight: '500',
          maxWidth: '80%',
        }}>
          {lines.map((line, i) => (
            <div key={i} className="mb-2">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Split screen layout (like your example 1)
function renderSplitLayout(
  lines: string[], 
  background: BackgroundImage | null | undefined,
  textColor: string,
  fontSize: string,
  className: string,
  reversed: boolean
) {
  // Split lyrics - first part bold/title, rest regular
  const titleLines = lines.slice(0, Math.ceil(lines.length / 2));
  const bodyLines = lines.slice(Math.ceil(lines.length / 2));

  return (
    <div className={`relative overflow-hidden flex ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* Left side */}
      <div className={`w-1/2 flex flex-col justify-center p-12 ${reversed ? 'bg-[#E8DCC8]' : 'bg-[#1a1a1a]'}`}>
        {/* Optional background image on left */}
        {background && !reversed && (
          <div 
            className="absolute inset-0 w-1/2 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${background.url})` }}
          />
        )}
        <div className="relative z-10" style={{
          color: reversed ? '#3A3532' : '#FFFFFF',
          fontSize: 'clamp(20px, 3.5vw, 52px)',
          lineHeight: '1.2',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}>
          {titleLines.map((line, i) => (
            <div key={i} className="mb-3">{line}</div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className={`w-1/2 flex flex-col justify-center p-12 ${reversed ? 'bg-[#1a1a1a]' : 'bg-[#E8DCC8]'}`}>
        {background && reversed && (
          <div 
            className="absolute right-0 inset-y-0 w-1/2 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url(${background.url})` }}
          />
        )}
        <div className="relative z-10" style={{
          color: reversed ? '#FFFFFF' : '#3A3532',
          fontSize: 'clamp(16px, 2.5vw, 40px)',
          lineHeight: '1.5',
          fontWeight: '400',
        }}>
          {bodyLines.map((line, i) => (
            <div key={i} className="mb-2">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Centered with masked image (like your example 3)
function renderMaskedLayout(
  lines: string[], 
  background: BackgroundImage | null | undefined,
  textColor: string,
  fontSize: string,
  className: string
) {
  const titleLine = lines[0];
  const subtitleLine = lines[lines.length - 1];

  return (
    <div className={`relative overflow-hidden ${className} bg-[#E8DCC8]`} style={{ aspectRatio: '16/9' }}>
      {/* Oval masked image in center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-[70%] h-[70%] bg-cover bg-center"
          style={{
            backgroundImage: background ? `url(${background.url})` : 'none',
            borderRadius: '50%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Title at center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div style={{
          color: '#FFFFFF',
          fontSize: 'clamp(24px, 5vw, 72px)',
          fontWeight: '700',
          letterSpacing: '0.15em',
          textShadow: '3px 3px 12px rgba(0,0,0,0.8)',
          textTransform: 'uppercase',
        }}>
          {titleLine}
        </div>
      </div>

      {/* Subtitle at bottom */}
      <div className="absolute bottom-12 left-0 right-0 text-center" style={{
        color: '#FFFFFF',
        fontSize: 'clamp(12px, 1.5vw, 24px)',
        fontWeight: '400',
        letterSpacing: '0.2em',
        textShadow: '2px 2px 8px rgba(0,0,0,0.6)',
        textTransform: 'uppercase',
      }}>
        {subtitleLine}
      </div>
    </div>
  );
}

// Gradient overlay
function renderGradientOverlay(
  lines: string[], 
  background: BackgroundImage | null | undefined,
  textColor: string,
  fontSize: string,
  className: string
) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: '16/9' }}>
      {background && (
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${background.url})` }}
        />
      )}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
      
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div style={{
          color: '#FFFFFF',
          fontSize,
          lineHeight: '1.4',
          textAlign: 'center',
          textShadow: '2px 2px 6px rgba(0,0,0,0.8)',
          fontWeight: '600',
        }}>
          {lines.map((line, i) => (
            <div key={i} className="mb-3">{line}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Render a slide with visual editor data
function renderVisualSlide(visualData: any, className: string) {
  if (!visualData || !visualData.background || !visualData.elements) {
    console.warn('⚠️ Invalid visualData structure:', visualData);
    return (
      <div className={`relative ${className} bg-black flex items-center justify-center`}>
        <p className="text-white text-2xl">Invalid slide data</p>
      </div>
    );
  }
  
  // MIGRATION FIX: Ensure all elements have correct properties
  const elements = visualData.elements.map((el: any) => {
    const fixed = {
      ...el,
      visible: el.visible !== false,  // Default to true if not set
      zIndex: el.zIndex || 10,  // Default z-index above background
      opacity: el.opacity || 1
    };
    
    // FIX OLD CENTER-POINT POSITIONING (x: 960, y: 540)
    // Convert to top-left positioning (x: 160, y: 340)
    if (el.type === 'text' && el.position) {
      // Detect old center-point system (x around 960, y around 540)
      if (el.position.x > 800 && el.position.x < 1100 && 
          el.position.y > 400 && el.position.y < 700) {
        console.log('🔧 Migrating old center-point position to top-left:', el.position);
        fixed.position = { x: 160, y: 340 };
        fixed.size = { width: 1600, height: 400 };
      }
    }
    
    return fixed;
  });
  
  const { background } = visualData;
  
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
      {background.type === 'image' && (background.imageId || background.imageUrl) ? (
        (() => {
          // Lookup actual background URL from ID (support both imageId and imageUrl)
          const bgId = background.imageId || background.imageUrl;
          const bg = WORSHIP_BACKGROUNDS.find(b => b.id === bgId);
          const imageUrl = bg?.url || bgId;
          console.log('🖼️ Rendering background:', bgId, '→', imageUrl);
          return (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
          );
        })()
      ) : background.type === 'gradient' && background.gradient ? (
        <div 
          className="absolute inset-0"
          style={{ background: background.gradient }}
        />
      ) : (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: background.color || '#000000' }}
        />
      )}
      
      {/* Elements */}
      <div className="absolute inset-0">
        {elements
          .filter((el: any) => {
            const isVisible = el.visible !== false;
            if (!isVisible) {
              console.log('⚠️ Element hidden:', el.id, el);
            }
            return isVisible;
          })
          .sort((a: any, b: any) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((element: any) => {
            if (element.type === 'text') {
              const style = element.style || {};
              console.log('📝 Rendering text element:', element.id, 'content:', element.content?.substring(0, 30));
              return (
                <div
                  key={element.id}
                  className="absolute whitespace-pre-wrap"
                  style={{
                    left: `${(element.position.x / 1920) * 100}%`,
                    top: `${(element.position.y / 1080) * 100}%`,
                    width: `${(element.size.width / 1920) * 100}%`,
                    height: `${(element.size.height / 1080) * 100}%`,
                    transform: `rotate(${element.rotation || 0}deg)`,  // Position is top-left corner, no translate
                    opacity: element.opacity || 1,
                    zIndex: element.zIndex || 1,
                    
                    // Text styling
                    fontFamily: style.fontFamily || 'Inter',
                    fontSize: style.fontSize ? `${(style.fontSize / 1080) * 100}vh` : '5vh',
                    fontWeight: style.fontWeight || 600,
                    fontStyle: style.fontStyle || 'normal',
                    color: style.color || '#ffffff',
                    textAlign: style.textAlign || 'center',
                    textTransform: style.textTransform || 'none',
                    textDecoration: style.textDecoration || 'none',
                    lineHeight: style.lineHeight || 1.3,
                    letterSpacing: style.letterSpacing || 0,
                    textShadow: style.textShadow || '2px 2px 4px rgba(0,0,0,0.8)',
                    
                    // Display
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: style.textAlign === 'left' ? 'flex-start' 
                      : style.textAlign === 'right' ? 'flex-end' 
                      : 'center',
                    padding: '0',
                  }}
                >
                  {element.content || ''}
                </div>
              );
            }
            return null;
          })}
      </div>
    </div>
  );
}

function calculateFontSize(lineCount: number): string {
  if (lineCount <= 2) return 'clamp(20px, 4vw, 60px)';
  if (lineCount <= 4) return 'clamp(18px, 3.5vw, 52px)';
  if (lineCount <= 6) return 'clamp(16px, 3vw, 44px)';
  return 'clamp(14px, 2.5vw, 36px)';
}
