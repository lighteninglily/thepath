import { useState, useEffect } from 'react';

/**
 * Image Preload Hook
 * 
 * Preloads an image and returns loading state
 * Useful for showing loading indicators while backgrounds load
 * 
 * Created: Phase 4 of presentation system overhaul
 */

export interface ImageLoadState {
  loaded: boolean;
  error: boolean;
  loading: boolean;
}

/**
 * Preload a single image
 * 
 * @param src - Image URL to preload
 * @returns Loading state
 */
export function useImagePreload(src: string | null | undefined): ImageLoadState {
  const [state, setState] = useState<ImageLoadState>({
    loaded: false,
    error: false,
    loading: false
  });

  useEffect(() => {
    if (!src) {
      setState({ loaded: false, error: false, loading: false });
      return;
    }

    setState({ loaded: false, error: false, loading: true });

    const img = new Image();
    
    img.onload = () => {
      setState({ loaded: true, error: false, loading: false });
    };
    
    img.onerror = () => {
      setState({ loaded: false, error: true, loading: false });
    };
    
    img.src = src;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return state;
}

/**
 * Preload multiple images
 * 
 * @param sources - Array of image URLs to preload
 * @returns Combined loading state
 */
export function useImagesPreload(sources: (string | null | undefined)[]): ImageLoadState {
  const [state, setState] = useState<ImageLoadState>({
    loaded: false,
    error: false,
    loading: false
  });

  useEffect(() => {
    const validSources = sources.filter((src): src is string => !!src);
    
    if (validSources.length === 0) {
      setState({ loaded: false, error: false, loading: false });
      return;
    }

    setState({ loaded: false, error: false, loading: true });

    let loadedCount = 0;
    let errorCount = 0;
    const total = validSources.length;

    const images = validSources.map(src => {
      const img = new Image();
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === total) {
          setState({ loaded: true, error: false, loading: false });
        }
      };
      
      img.onerror = () => {
        errorCount++;
        if (errorCount === total) {
          setState({ loaded: false, error: true, loading: false });
        } else if (loadedCount + errorCount === total) {
          setState({ loaded: true, error: true, loading: false });
        }
      };
      
      img.src = src;
      return img;
    });

    // Cleanup
    return () => {
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [JSON.stringify(sources)]); // Use JSON.stringify to compare array contents

  return state;
}

/**
 * Preload next slides' backgrounds
 * Useful for smooth navigation
 * 
 * @param backgroundUrls - Array of background URLs to preload
 */
export function preloadBackgrounds(backgroundUrls: string[]): void {
  backgroundUrls.forEach(url => {
    if (!url) return;
    
    const img = new Image();
    img.src = url;
    // Image will be cached by browser
  });
}
