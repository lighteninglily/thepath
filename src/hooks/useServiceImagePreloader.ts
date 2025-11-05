/**
 * Service Image Preloader - Preloads ALL images in a service
 * 
 * Scans all service items and preloads:
 * - Background images from visual data
 * - Custom uploaded images
 * - Any other images used in elements
 * 
 * This ensures instant display for announcements, scripture, etc.
 */

import { useEffect, useState } from 'react';
import type { Service, ServiceItem } from '../types/service';

interface VisualData {
  background?: {
    imageUrl?: string;
    imageId?: string;
  };
  elements?: Array<{
    type: string;
    imageUrl?: string;
  }>;
}

export function useServiceImagePreloader(service: Service | null) {
  const [loadedImages, setLoadedImages] = useState<number>(0);
  const [totalImages, setTotalImages] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (!service) {
      setIsReady(true);
      return;
    }

    console.log('🎬 Preloading ALL images for service:', service.name);
    
    // Extract all image URLs from service items
    const imageUrls = new Set<string>();
    
    service.items.forEach((item: ServiceItem) => {
      let visualData: VisualData | null = null;
      
      // For announcements/scripture/etc, visual data is in item.content (as JSON string)
      // For songs, visual data is in slides (handled separately)
      if (item.content) {
        try {
          const parsed = typeof item.content === 'string' 
            ? JSON.parse(item.content) 
            : item.content;
          visualData = parsed as VisualData;
        } catch (e) {
          console.warn(`⚠️ Could not parse visual data for ${item.title || item.type}`);
        }
      }
      
      if (visualData) {
        // Background image
        const bgUrl = visualData.background?.imageUrl || visualData.background?.imageId;
        if (bgUrl && typeof bgUrl === 'string' && bgUrl.length > 0) {
          // Preload ALL image types:
          // - http:// / https:// (external URLs)
          // - / (absolute paths)
          // - file:// (Electron local files)
          // - blob: (file picker)
          // - data: URLs are embedded, no need to preload
          if (!bgUrl.startsWith('data:')) {
            imageUrls.add(bgUrl);
            console.log(`📷 Found background image in ${item.title || item.type}:`, bgUrl);
          }
        }
        
        // Element images (text boxes with images, etc.)
        visualData.elements?.forEach((element) => {
          if (element.type === 'image' && element.imageUrl) {
            const imgUrl = element.imageUrl;
            // Preload all image types except data URLs (already embedded)
            if (!imgUrl.startsWith('data:')) {
              imageUrls.add(imgUrl);
              console.log(`📷 Found element image in ${item.title || item.type}:`, imgUrl);
            }
          }
        });
      }
    });

    const urls = Array.from(imageUrls);
    setTotalImages(urls.length);

    if (urls.length === 0) {
      console.log('✅ No custom images to preload in this service');
      setIsReady(true);
      return;
    }

    console.log(`🚀 Preloading ${urls.length} custom images...`);
    
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    urls.forEach((url) => {
      const img = new Image();
      
      img.onload = () => {
        loaded++;
        setLoadedImages(loaded);
        console.log(`✅ Preloaded custom image ${loaded}/${urls.length}:`, url);
        
        if (loaded === urls.length) {
          console.log('🎉 ALL CUSTOM IMAGES PRELOADED!');
          setIsReady(true);
        }
      };
      
      img.onerror = (err) => {
        console.error(`❌ Failed to preload image:`, url, err);
        loaded++;
        setLoadedImages(loaded);
        
        if (loaded === urls.length) {
          setIsReady(true);
        }
      };
      
      // Start loading
      img.src = url;
      images.push(img);
    });

    // Cleanup
    return () => {
      images.forEach(img => {
        img.onload = null;
        img.onerror = null;
      });
    };
  }, [service]);

  return {
    loadedImages,
    totalImages,
    isReady,
    progress: totalImages > 0 ? Math.round((loadedImages / totalImages) * 100) : 100
  };
}
