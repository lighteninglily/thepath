/**
 * Unified slide renderer - single source of truth
 * All slides render through this component for consistency
 */

import type { VisualData } from '../../types/visual';
import { CANVAS } from '../../constants/canvas';

interface UnifiedSlideRendererProps {
  visualData: VisualData;
  className?: string;
}

export function UnifiedSlideRenderer({ 
  visualData, 
  className = '' 
}: UnifiedSlideRendererProps) {
  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ aspectRatio: CANVAS.ASPECT_RATIO }}
    >
      {/* Background */}
      {visualData.backgroundImage ? (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${visualData.backgroundImage})` }}
          />
          {/* Dark overlay for readability only on images */}
          <div className="absolute inset-0 bg-black/50" />
        </>
      ) : (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: visualData.backgroundColor }}
        />
      )}
      
      {/* Elements */}
      <div className="absolute inset-0">
        {visualData.elements.map((element) => {
          // Skip invisible elements (default to visible if not specified)
          if (element.visible === false) return null;
          
          if (element.type === 'text') {
            const style = element.style;
            
            return (
              <div
                key={element.id}
                className="absolute whitespace-pre-wrap"
                style={{
                  // Position as percentage for responsive scaling
                  left: `${(element.position.x / CANVAS.WIDTH) * 100}%`,
                  top: `${(element.position.y / CANVAS.HEIGHT) * 100}%`,
                  width: `${(element.size.width / CANVAS.WIDTH) * 100}%`,
                  height: `${(element.size.height / CANVAS.HEIGHT) * 100}%`,
                  
                  // Text styling
                  fontFamily: style.fontFamily,
                  fontSize: `${(style.fontSize / CANVAS.HEIGHT) * 100}vh`,
                  fontWeight: style.fontWeight,
                  color: style.color,
                  textAlign: style.textAlign,
                  lineHeight: style.lineHeight,
                  textShadow: style.textShadow,
                  
                  // Flex alignment within absolute container
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: style.textAlign === 'left' 
                    ? 'flex-start' 
                    : style.textAlign === 'right' 
                    ? 'flex-end' 
                    : 'center',
                }}
              >
                {element.content}
              </div>
            );
          }
          
          // Handle image elements if needed
          return null;
        })}
      </div>
    </div>
  );
}
