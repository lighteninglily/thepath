/**
 * Image Preloader Hook - PowerPoint-style instant loading
 * 
 * Aggressively preloads ALL background images when app starts
 * so they're instantly available from browser cache
 */

import { useEffect, useState } from 'react';
import { WORSHIP_BACKGROUNDS } from '../assets/backgrounds';

export function useImagePreloader() {
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const [totalImages] = useState<number>(WORSHIP_BACKGROUNDS.length);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    console.log('🚀 Preloading ALL background images for instant display...');
    
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    WORSHIP_BACKGROUNDS.forEach((bg) => {
      const img = new Image();
      
      img.onload = () => {
        loaded++;
        setLoadedImages(loaded);
        console.log(`✅ Preloaded ${loaded}/${totalImages}: ${bg.id}`);
        
        if (loaded === totalImages) {
          console.log('🎉 ALL IMAGES PRELOADED! Ready for instant display.');
          setIsReady(true);
        }
      };
      
      img.onerror = (err) => {
        console.error(`❌ Failed to preload ${bg.id}:`, err);
        loaded++;
        setLoadedImages(loaded);
        
        if (loaded === totalImages) {
          setIsReady(true);
        }
      };
      
      // Start loading
      img.src = bg.url;
      images.push(img);
    });

    // Cleanup
    return () => {
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [totalImages]);

  return {
    loadedImages,
    totalImages,
    isReady,
    progress: Math.round((loadedImages / totalImages) * 100)
  };
}
