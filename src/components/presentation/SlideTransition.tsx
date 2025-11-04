import { useEffect, useState } from 'react';
import type { TransitionType } from '../../types/settings';

interface SlideTransitionProps {
  children: React.ReactNode;
  transitionKey: string | number; // Change this to trigger transition
  transitionType: TransitionType;
  duration: number; // in milliseconds
}

/**
 * Wraps slide content and applies transition effects when slide changes
 * Supports: none, fade, slide
 */
export function SlideTransition({
  children,
  transitionKey,
  transitionType,
  duration,
}: SlideTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayKey, setDisplayKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionType === 'none') {
      // No transition - instant update
      setDisplayKey(transitionKey);
      return;
    }

    // Start transition
    setIsTransitioning(true);

    // After fade out, update content
    const updateTimer = setTimeout(() => {
      setDisplayKey(transitionKey);
    }, duration / 2);

    // After fade in, end transition
    const endTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, duration);

    return () => {
      clearTimeout(updateTimer);
      clearTimeout(endTimer);
    };
  }, [transitionKey, transitionType, duration]);

  const getTransitionStyle = (): React.CSSProperties => {
    if (transitionType === 'none') {
      return {};
    }

    const baseStyle: React.CSSProperties = {
      transition: `all ${duration}ms ease-in-out`,
    };

    switch (transitionType) {
      case 'fade':
        return {
          ...baseStyle,
          opacity: isTransitioning ? 0 : 1,
        };

      case 'slide':
        return {
          ...baseStyle,
          transform: isTransitioning ? 'translateX(100%)' : 'translateX(0)',
        };

      default:
        return baseStyle;
    }
  };

  return (
    <div
      key={displayKey}
      className="w-full h-full"
      style={getTransitionStyle()}
    >
      {children}
    </div>
  );
}
