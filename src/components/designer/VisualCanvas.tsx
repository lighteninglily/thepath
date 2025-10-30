/**
 * Visual Canvas - Core designer component
 * 
 * Renders a 1920x1080 canvas with visual elements that can be
 * selected, moved, and edited. Scales to fit viewport.
 */

import { useRef, useEffect, useState } from 'react';
import { VisualSlide, VisualElement, TextElement } from '../../types/designer';
import { WORSHIP_BACKGROUNDS } from '../../assets/backgrounds';

interface VisualCanvasProps {
  slide: VisualSlide;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
  onUpdateElement: (elementId: string, updates: Partial<VisualElement>) => void;
  zoom?: number;
}

export function VisualCanvas({
  slide,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  zoom = 1,
}: VisualCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  
  // Calculate scale to fit canvas in viewport
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 64;  // Padding
      const containerHeight = container.clientHeight - 64;
      
      const scaleX = containerWidth / 1920;
      const scaleY = containerHeight / 1080;
      const baseScale = Math.min(scaleX, scaleY, 1); // Don't scale up beyond 100%
      
      setScale(baseScale * zoom);
    };
    
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [zoom]);
  
  // Handle canvas click (deselect)
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };
  
  // Render background
  const renderBackground = () => {
    const { background } = slide;
    
    if (background.type === 'solid') {
      return (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: background.color }}
        />
      );
    }
    
    if (background.type === 'gradient' && background.gradient) {
      const { gradient } = background;
      let gradientCSS: string;
      
      // Check if gradient is a string (from templates) or an object (from designer)
      if (typeof gradient === 'string') {
        // Template format: direct CSS gradient string
        gradientCSS = gradient;
      } else if (gradient.type === 'linear') {
        // Designer format: gradient object
        const angle = gradient.angle || 135;
        const colorStops = gradient.colors
          .map((color, i) => {
            const stop = gradient.stops?.[i] ?? (i / (gradient.colors.length - 1)) * 100;
            return `${color} ${stop}%`;
          })
          .join(', ');
        gradientCSS = `linear-gradient(${angle}deg, ${colorStops})`;
      } else {
        // Radial gradient
        const colorStops = gradient.colors
          .map((color, i) => {
            const stop = gradient.stops?.[i] ?? (i / (gradient.colors.length - 1)) * 100;
            return `${color} ${stop}%`;
          })
          .join(', ');
        gradientCSS = `radial-gradient(circle, ${colorStops})`;
      }
      
      return (
        <div
          className="absolute inset-0"
          style={{ background: gradientCSS }}
        />
      );
    }
    
    if (background.type === 'image' && (background.imageUrl || background.imageId)) {
      // ✅ Lookup actual URL from background ID (support both imageUrl and imageId)
      const bgId = background.imageUrl || background.imageId;
      const bg = WORSHIP_BACKGROUNDS.find(b => b.id === bgId);
      const actualImageUrl = bg?.url || bgId;
      
      console.log('🎨 CANVAS: Rendering background', {
        id: bgId,
        found: !!bg,
        url: actualImageUrl
      });
      
      const filterString = background.imageFilters
        ? Object.entries(background.imageFilters)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => {
              if (key === 'blur') return `blur(${value}px)`;
              if (key === 'brightness') return `brightness(${value}%)`;
              if (key === 'contrast') return `contrast(${value}%)`;
              if (key === 'saturation') return `saturate(${value}%)`;
              if (key === 'hue') return `hue-rotate(${value}deg)`;
              if (key === 'sepia') return `sepia(${value}%)`;
              if (key === 'grayscale') return `grayscale(${value}%)`;
              return '';
            })
            .join(' ')
        : 'none';
      
      return (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${actualImageUrl})`,
              filter: filterString,
            }}
          />
          {background.overlay?.enabled && (
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: background.overlay.color,
                opacity: background.overlay.opacity / 100,
                mixBlendMode: background.overlay.blendMode,
              }}
            />
          )}
        </>
      );
    }
    
    return null;
  };
  
  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center bg-slate-200 p-8 overflow-auto"
      onClick={handleCanvasClick}
    >
      {/* Canvas container with scaling */}
      <div
        className="relative bg-white shadow-2xl"
        style={{
          width: 1920 * scale,
          height: 1080 * scale,
          transform: 'translateZ(0)', // Force GPU acceleration
        }}
      >
        {/* Scale wrapper */}
        <div
          className="absolute inset-0 origin-top-left"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            width: 1920,
            height: 1080,
          }}
        >
          {/* Background */}
          {renderBackground()}
          
          {/* Elements */}
          <div className="absolute inset-0">
            {slide.elements
              .filter((el) => {
                console.log('🎨 Element visibility check:', el.id, 'visible=', el.visible);
                return el.visible;
              })
              .sort((a, b) => a.zIndex - b.zIndex)
              .map((element) => {
                const elAny = element as any;
                console.log('🎨 Rendering element:', {
                  id: element.id,
                  type: element.type,
                  position: element.position,
                  size: element.size,
                  topLevelFontSize: elAny.fontSize,
                  topLevelFontFamily: elAny.fontFamily,
                  topLevelColor: elAny.color,
                  styleObject: elAny.style,
                  styleFontSize: elAny.style?.fontSize,
                  styleFontFamily: elAny.style?.fontFamily,
                  styleColor: elAny.style?.color
                });
                return (
                  <CanvasElement
                    key={element.id}
                    element={element}
                    isSelected={element.id === selectedElementId}
                    onSelect={() => {
                      console.log('🎯 Element selected:', {
                        id: element.id,
                        type: element.type,
                        topLevel: {
                          fontSize: elAny.fontSize,
                          fontFamily: elAny.fontFamily,
                          fontWeight: elAny.fontWeight,
                          color: elAny.color,
                          textAlign: elAny.textAlign
                        },
                        style: elAny.style,
                        allKeys: Object.keys(element)
                      });
                      onSelectElement(element.id);
                    }}
                    onUpdate={(updates) => onUpdateElement(element.id, updates)}
                  />
                );
              })}
          </div>          
          {/* Grid overlay (optional) */}
          {/* TODO: Add grid overlay */}
        </div>
      </div>
    </div>
  );
}

/**
 * Individual canvas element renderer
 */
interface CanvasElementProps {
  element: VisualElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<VisualElement>) => void;
}

function CanvasElement({ element, isSelected, onSelect, onUpdate }: CanvasElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<'tl' | 'tr' | 'bl' | 'br' | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBounds, setInitialBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (element.locked) return;
    
    e.stopPropagation();
    onSelect();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
    setInitialBounds({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height,
    });
  };
  
  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent, handle: 'tl' | 'tr' | 'bl' | 'br') => {
    if (element.locked) return;
    
    e.stopPropagation();
    e.preventDefault();
    
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialBounds({
      x: element.position.x,
      y: element.position.y,
      width: element.size.width,
      height: element.size.height,
    });
  };
  
  // Handle drag and resize
  useEffect(() => {
    if (!isDragging && !isResizing) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        // Calculate delta in screen space
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        // Convert to canvas space (account for scaling)
        // Get the container to find the scale
        const canvas = document.querySelector('[style*="transform: scale"]');
        const canvasRect = canvas?.getBoundingClientRect();
        const actualScale = canvasRect ? canvasRect.width / 1920 : 1;
        
        // Apply delta to initial position
        const newX = initialBounds.x + (deltaX / actualScale);
        const newY = initialBounds.y + (deltaY / actualScale);
        
        // Constrain to canvas bounds
        const constrainedX = Math.max(0, Math.min(1920 - element.size.width, newX));
        const constrainedY = Math.max(0, Math.min(1080 - element.size.height, newY));
        
        onUpdate({
          position: { x: Math.round(constrainedX), y: Math.round(constrainedY) },
        });
      } else if (isResizing && resizeHandle) {
        // Handle resizing
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        let newX = initialBounds.x;
        let newY = initialBounds.y;
        let newWidth = initialBounds.width;
        let newHeight = initialBounds.height;
        
        // Apply deltas based on which handle is being dragged
        if (resizeHandle === 'tl') {
          // Top-left: move position and adjust size
          newX = initialBounds.x + deltaX;
          newY = initialBounds.y + deltaY;
          newWidth = initialBounds.width - deltaX;
          newHeight = initialBounds.height - deltaY;
        } else if (resizeHandle === 'tr') {
          // Top-right: move Y, adjust width and height
          newY = initialBounds.y + deltaY;
          newWidth = initialBounds.width + deltaX;
          newHeight = initialBounds.height - deltaY;
        } else if (resizeHandle === 'bl') {
          // Bottom-left: move X, adjust width and height
          newX = initialBounds.x + deltaX;
          newWidth = initialBounds.width - deltaX;
          newHeight = initialBounds.height + deltaY;
        } else if (resizeHandle === 'br') {
          // Bottom-right: just adjust size
          newWidth = initialBounds.width + deltaX;
          newHeight = initialBounds.height + deltaY;
        }
        
        // Enforce minimum size
        const minSize = 50;
        if (newWidth < minSize) {
          if (resizeHandle === 'tl' || resizeHandle === 'bl') {
            newX = newX - (minSize - newWidth);
          }
          newWidth = minSize;
        }
        if (newHeight < minSize) {
          if (resizeHandle === 'tl' || resizeHandle === 'tr') {
            newY = newY - (minSize - newHeight);
          }
          newHeight = minSize;
        }
        
        // Constrain to canvas bounds
        newX = Math.max(0, Math.min(1920 - newWidth, newX));
        newY = Math.max(0, Math.min(1080 - newHeight, newY));
        
        onUpdate({
          position: { x: newX, y: newY },
          size: { width: newWidth, height: newHeight },
        });
      }
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeHandle, dragStart, initialBounds, element.size, onUpdate]);
  
  // Render based on type
  const renderElement = () => {
    if (element.type === 'text') {
      const textElement = element as TextElement;
      const style = textElement.style;
      
      return (
        <div
          className="absolute whitespace-pre-wrap"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            textAlign: style.textAlign,
            textTransform: style.textTransform,
            textDecoration: style.textDecoration,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing,
            color: style.color,
            textShadow: style.textShadowBlur
              ? `${style.textShadowOffsetX}px ${style.textShadowOffsetY}px ${style.textShadowBlur}px ${style.textShadowColor}`
              : 'none',
            WebkitTextStroke: style.textStrokeWidth
              ? `${style.textStrokeWidth}px ${style.textStrokeColor}`
              : 'none',
            backgroundColor: style.backgroundColor,
            borderRadius: style.borderRadius,
            padding: '0',
          }}
        >
          {textElement.content || 'Empty text'}
        </div>
      );
    }
    
    if (element.type === 'shape') {
      const shapeElement = element as any;
      const style = shapeElement.style || {};
      
      return (
        <div
          className="absolute w-full h-full"
          style={{
            backgroundColor: shapeElement.backgroundColor || style.backgroundColor || '#FFFFFF',
            borderRadius: shapeElement.borderRadius || style.borderRadius || 0,
            // Support direct border property OR legacy borderWidth
            border: shapeElement.border || 
                    (style.borderWidth ? `${style.borderWidth}px ${style.borderStyle || 'solid'} ${style.borderColor || '#000'}` : 'none'),
            // Support direct boxShadow property OR legacy shadow properties
            boxShadow: shapeElement.boxShadow || 
                      (style.shadowBlur ? `${style.shadowOffsetX || 0}px ${style.shadowOffsetY || 0}px ${style.shadowBlur}px ${style.shadowColor || 'rgba(0,0,0,0.3)'}` : 'none'),
            // Support transform property
            transform: shapeElement.transform || 'none',
          }}
        />
      );
    }
    
    if (element.type === 'image') {
      const imageElement = element as any;
      // Support both content (new way with uploaded images) and imageUrl (legacy)
      const imageSrc = imageElement.content || imageElement.imageUrl;
      
      if (!imageSrc) {
        return <div className="text-xs text-gray-400">No image source</div>;
      }
      
      return (
        <img
          src={imageSrc}
          alt="Slide element"
          className="absolute w-full h-full"
          style={{
            objectFit: imageElement.style?.objectFit || 'cover',
            borderRadius: imageElement.style?.borderRadius || 0,
          }}
        />
      );
    }
    
    // Unsupported type
    return <div className="text-xs text-gray-400">Unsupported: {element.type}</div>;
  };
  
  // Get appropriate cursor
  const getCursor = () => {
    if (element.locked) return 'cursor-default';
    if (isResizing) {
      if (resizeHandle === 'tl' || resizeHandle === 'br') return 'cursor-nwse-resize';
      if (resizeHandle === 'tr' || resizeHandle === 'bl') return 'cursor-nesw-resize';
    }
    if (isDragging) return 'cursor-grabbing';
    return 'cursor-move';
  };
  
  return (
    <div
      className={`absolute ${getCursor()} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        transform: `rotate(${element.rotation}deg)`,  // NO translate in editor - position is top-left
        opacity: element.opacity,
        zIndex: element.zIndex,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderElement()}
      
      {/* Selection handles */}
      {isSelected && !element.locked && (
        <>
          {/* Corner resize handles */}
          <div
            className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, 'tl')}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, 'tr')}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, 'bl')}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize pointer-events-auto"
            onMouseDown={(e) => handleResizeStart(e, 'br')}
          />
        </>
      )}
    </div>
  );
}
