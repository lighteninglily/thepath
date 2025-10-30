/**
 * Image Storage Utility
 * 
 * Stores uploaded images in localStorage with persistence
 * Supports logos, backgrounds, and custom images
 */

export interface StoredImage {
  id: string;
  name: string;
  dataUrl: string;
  type: string; // 'logo' | 'background' | 'custom'
  uploadedAt: number;
  size: number; // bytes
}

const STORAGE_KEY = 'church_slides_images';
const MAX_IMAGES = 50; // Limit to prevent localStorage overflow
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per image

/**
 * Get all stored images
 */
export function getAllImages(): StoredImage[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading images from localStorage:', error);
    return [];
  }
}

/**
 * Get image by ID
 */
export function getImageById(id: string): StoredImage | null {
  const images = getAllImages();
  return images.find(img => img.id === id) || null;
}

/**
 * Save new image
 */
export function saveImage(
  name: string,
  dataUrl: string,
  type: 'logo' | 'background' | 'custom' = 'custom'
): StoredImage {
  const images = getAllImages();
  
  // Check size
  const size = new Blob([dataUrl]).size;
  if (size > MAX_SIZE) {
    throw new Error('Image too large. Maximum size is 5MB.');
  }
  
  // Check count limit
  if (images.length >= MAX_IMAGES) {
    // Remove oldest non-logo image
    const oldestIndex = images.findIndex(img => img.type !== 'logo');
    if (oldestIndex !== -1) {
      images.splice(oldestIndex, 1);
    } else {
      throw new Error('Image storage full. Please delete some images.');
    }
  }
  
  const newImage: StoredImage = {
    id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    dataUrl,
    type,
    uploadedAt: Date.now(),
    size
  };
  
  images.push(newImage);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  
  console.log('✅ Image saved:', newImage.id, name);
  return newImage;
}

/**
 * Delete image
 */
export function deleteImage(id: string): boolean {
  const images = getAllImages();
  const index = images.findIndex(img => img.id === id);
  
  if (index === -1) return false;
  
  images.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(images));
  
  console.log('🗑️ Image deleted:', id);
  return true;
}

/**
 * Get images by type
 */
export function getImagesByType(type: 'logo' | 'background' | 'custom'): StoredImage[] {
  return getAllImages().filter(img => img.type === type);
}

/**
 * Upload file and convert to data URL
 */
export function uploadImageFile(file: File, type: 'logo' | 'background' | 'custom' = 'custom'): Promise<StoredImage> {
  return new Promise((resolve, reject) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('File must be an image (PNG, JPEG, etc.)'));
      return;
    }
    
    // Check file size
    if (file.size > MAX_SIZE) {
      reject(new Error('Image too large. Maximum size is 5MB.'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        const dataUrl = reader.result as string;
        const savedImage = saveImage(file.name, dataUrl, type);
        resolve(savedImage);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Get storage usage info
 */
export function getStorageInfo() {
  const images = getAllImages();
  const totalSize = images.reduce((sum, img) => sum + img.size, 0);
  
  return {
    count: images.length,
    maxCount: MAX_IMAGES,
    totalSize,
    maxSize: MAX_SIZE * MAX_IMAGES,
    percentUsed: (totalSize / (MAX_SIZE * MAX_IMAGES)) * 100
  };
}

/**
 * Clear all images (with confirmation)
 */
export function clearAllImages(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('🗑️ All images cleared');
}
