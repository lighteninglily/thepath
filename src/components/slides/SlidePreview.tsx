import type { Slide, DesignTheme } from '../../types';

interface SlidePreviewProps {
  slide: Slide;
  design?: DesignTheme | null;
  className?: string;
}

const DEFAULT_DESIGN: DesignTheme = {
  backgroundColor: '#F5F3F0',
  textColor: '#3A3532',
  textShadow: 'none',
  fontFamily: 'Inter',
  fontSize: '48px',
  textAlign: 'center',
  overlayOpacity: 0,
};

/**
 * Calculate responsive font size based on content length
 * More text = smaller font to fit on slide
 */
function calculateFontSize(content: string): string {
  const lines = content.split('\n').length;
  
  // Fewer lines = bigger text
  if (lines <= 2) return 'clamp(20px, 4vw, 60px)';
  if (lines <= 4) return 'clamp(18px, 3.5vw, 52px)';
  if (lines <= 6) return 'clamp(16px, 3vw, 44px)';
  
  // Many lines = smaller text
  return 'clamp(14px, 2.5vw, 36px)';
}

export function SlidePreview({ slide, design, className = '' }: SlidePreviewProps) {
  const finalDesign = design || DEFAULT_DESIGN;
  
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: finalDesign.backgroundGradient || finalDesign.backgroundColor,
        aspectRatio: '16/9',
      }}
    >
      {/* Background Image (if exists) */}
      {finalDesign.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${finalDesign.backgroundImage})`,
            opacity: 1 - (finalDesign.overlayOpacity || 0),
          }}
        />
      )}

      {/* Overlay */}
      {finalDesign.overlayOpacity > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: finalDesign.backgroundColor,
            opacity: finalDesign.overlayOpacity,
          }}
        />
      )}

      {/* Text Content */}
      <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12 lg:p-16">
        <div
          style={{
            color: finalDesign.textColor,
            textShadow: finalDesign.textShadow,
            fontFamily: finalDesign.fontFamily,
            fontSize: calculateFontSize(slide.content),
            textAlign: finalDesign.textAlign,
            lineHeight: '1.4',
            maxWidth: '90%',
          }}
        >
          {slide.content.split('\n').map((line, i) => (
            <div key={i} className="mb-2">
              {line || '\u00A0'} {/* Non-breaking space for empty lines */}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Type Badge */}
      <div className="absolute top-2 left-2 px-2 py-1 rounded text-xs bg-black/20 text-white">
        {slide.type}
      </div>
    </div>
  );
}
