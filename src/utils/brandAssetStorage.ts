/**
 * Brand Asset Storage Utility
 * 
 * Comprehensive brand asset management with localStorage persistence
 * Supports logos, backgrounds, icons, graphics, and photos
 */

import type { BrandAsset, AssetType, AssetUploadOptions, AssetSearchFilters, BrandAssetStats } from '../types/brandAsset';

const STORAGE_KEY = 'church_slides_brand_assets';
const USAGE_TRACKING_KEY = 'church_slides_asset_usage';
const MAX_ASSETS = 100;           // Increased from 50
const MAX_SIZE = 5 * 1024 * 1024; // 5MB per asset
const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB total

/**
 * Get all brand assets
 */
export function getAllBrandAssets(): BrandAsset[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const assets = JSON.parse(stored);
    return Array.isArray(assets) ? assets : [];
  } catch (error) {
    console.error('Error loading brand assets:', error);
    return [];
  }
}

/**
 * Get brand asset by ID
 */
export function getBrandAssetById(id: string): BrandAsset | null {
  const assets = getAllBrandAssets();
  return assets.find(asset => asset.id === id) || null;
}

/**
 * Get brand assets by type
 */
export function getBrandAssetsByType(type: AssetType): BrandAsset[] {
  const assets = getAllBrandAssets();
  return assets.filter(asset => asset.type === type);
}

/**
 * Get primary logo (or first logo if no primary set)
 */
export function getPrimaryLogo(): BrandAsset | null {
  const logos = getBrandAssetsByType('logo');
  const primary = logos.find(logo => logo.isPrimary);
  return primary || logos[0] || null;
}

/**
 * Extract image dimensions from data URL
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Upload and save a new brand asset
 */
export async function uploadBrandAsset(
  file: File,
  options: AssetUploadOptions
): Promise<BrandAsset> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image (PNG, JPEG, SVG, etc.)');
  }

  // Validate file size
  if (file.size > MAX_SIZE) {
    throw new Error(`Image too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB.`);
  }

  // Check total storage
  const currentAssets = getAllBrandAssets();
  const currentTotalSize = currentAssets.reduce((sum, asset) => sum + asset.size, 0);
  
  if (currentTotalSize + file.size > MAX_TOTAL_SIZE) {
    throw new Error('Storage limit reached. Please delete some assets.');
  }

  // Check asset count limit
  if (currentAssets.length >= MAX_ASSETS) {
    throw new Error(`Maximum ${MAX_ASSETS} assets allowed. Please delete some first.`);
  }

  // Convert file to data URL
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Get image dimensions
  const dimensions = await getImageDimensions(dataUrl);

  // Create brand asset
  const newAsset: BrandAsset = {
    id: `asset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: options.name,
    type: options.type,
    category: options.category,
    dataUrl,
    size: file.size,
    dimensions,
    uploadedAt: Date.now(),
    usageCount: 0,
    tags: options.tags || [],
    isPrimary: options.isPrimary || false,
    description: options.description,
  };

  // If setting as primary, unmark other primary assets of same type
  if (newAsset.isPrimary) {
    const assets = currentAssets.map(asset => {
      if (asset.type === newAsset.type && asset.isPrimary) {
        return { ...asset, isPrimary: false };
      }
      return asset;
    });
    assets.push(newAsset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  } else {
    currentAssets.push(newAsset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentAssets));
  }

  console.log('✅ Brand asset uploaded:', newAsset.id, newAsset.name);
  return newAsset;
}

/**
 * Update an existing brand asset
 */
export function updateBrandAsset(id: string, updates: Partial<BrandAsset>): BrandAsset | null {
  const assets = getAllBrandAssets();
  const index = assets.findIndex(asset => asset.id === id);
  
  if (index === -1) {
    console.error('Asset not found:', id);
    return null;
  }

  // If setting as primary, unmark other primary assets of same type
  if (updates.isPrimary) {
    assets.forEach((asset, i) => {
      if (i !== index && asset.type === assets[index].type && asset.isPrimary) {
        asset.isPrimary = false;
      }
    });
  }

  const updatedAsset = { ...assets[index], ...updates };
  assets[index] = updatedAsset;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
  console.log('🔄 Brand asset updated:', id);
  
  return updatedAsset;
}

/**
 * Delete a brand asset
 */
export function deleteBrandAsset(id: string): boolean {
  const assets = getAllBrandAssets();
  const filtered = assets.filter(asset => asset.id !== id);
  
  if (filtered.length === assets.length) {
    console.error('Asset not found:', id);
    return false;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  console.log('🗑️ Brand asset deleted:', id);
  return true;
}

/**
 * Set an asset as primary for its type
 */
export function setPrimaryAsset(id: string): BrandAsset | null {
  return updateBrandAsset(id, { isPrimary: true });
}

/**
 * Record asset usage (for analytics and "recently used")
 */
export function recordAssetUsage(id: string): void {
  const asset = getBrandAssetById(id);
  if (!asset) return;

  // Update asset's usage count and last used time
  updateBrandAsset(id, {
    usageCount: (asset.usageCount || 0) + 1,
    lastUsedAt: Date.now(),
  });

  // Track in usage history
  try {
    const history = localStorage.getItem(USAGE_TRACKING_KEY);
    const usageData = history ? JSON.parse(history) : [];
    usageData.unshift({ assetId: id, timestamp: Date.now() });
    
    // Keep only last 50 usage records
    const trimmed = usageData.slice(0, 50);
    localStorage.setItem(USAGE_TRACKING_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error('Error tracking asset usage:', error);
  }
}

/**
 * Get recently used assets
 */
export function getRecentlyUsedAssets(limit: number = 10): BrandAsset[] {
  try {
    const history = localStorage.getItem(USAGE_TRACKING_KEY);
    if (!history) return [];
    
    const usageData = JSON.parse(history);
    const assetIds = [...new Set(usageData.map((u: any) => u.assetId))].slice(0, limit);
    
    const assets = getAllBrandAssets();
    return assetIds
      .map(id => assets.find(asset => asset.id === id))
      .filter(Boolean) as BrandAsset[];
  } catch (error) {
    console.error('Error getting recently used assets:', error);
    return [];
  }
}

/**
 * Search and filter brand assets
 */
export function searchBrandAssets(filters: AssetSearchFilters): BrandAsset[] {
  let assets = getAllBrandAssets();

  // Filter by type
  if (filters.type) {
    assets = assets.filter(asset => asset.type === filters.type);
  }

  // Filter by category
  if (filters.category) {
    assets = assets.filter(asset => asset.category === filters.category);
  }

  // Filter by primary
  if (filters.isPrimary !== undefined) {
    assets = assets.filter(asset => asset.isPrimary === filters.isPrimary);
  }

  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    assets = assets.filter(asset =>
      filters.tags!.some(tag => asset.tags.includes(tag))
    );
  }

  // Text search (name, description, tags)
  if (filters.query) {
    const query = filters.query.toLowerCase();
    assets = assets.filter(asset =>
      asset.name.toLowerCase().includes(query) ||
      asset.description?.toLowerCase().includes(query) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Recently used filter
  if (filters.recentlyUsed) {
    assets = assets.filter(asset => asset.lastUsedAt);
    assets.sort((a, b) => (b.lastUsedAt || 0) - (a.lastUsedAt || 0));
  }

  return assets;
}

/**
 * Get storage statistics
 */
export function getBrandAssetStats(): BrandAssetStats {
  const assets = getAllBrandAssets();
  const totalSize = assets.reduce((sum, asset) => sum + asset.size, 0);

  return {
    totalAssets: assets.length,
    totalSize,
    byType: {
      logo: assets.filter(a => a.type === 'logo').length,
      background: assets.filter(a => a.type === 'background').length,
      icon: assets.filter(a => a.type === 'icon').length,
      graphic: assets.filter(a => a.type === 'graphic').length,
      photo: assets.filter(a => a.type === 'photo').length,
    },
    storageUsed: totalSize,
    storageLimit: MAX_TOTAL_SIZE,
    percentUsed: (totalSize / MAX_TOTAL_SIZE) * 100,
  };
}

/**
 * Get all unique tags across all assets
 */
export function getAllTags(): string[] {
  const assets = getAllBrandAssets();
  const allTags = assets.flatMap(asset => asset.tags);
  return [...new Set(allTags)].sort();
}

/**
 * Get all unique categories for a type
 */
export function getCategoriesByType(type: AssetType): string[] {
  const assets = getBrandAssetsByType(type);
  const categories = assets
    .map(asset => asset.category)
    .filter(Boolean) as string[];
  return [...new Set(categories)].sort();
}

/**
 * Clear all brand assets (with confirmation)
 */
export function clearAllBrandAssets(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(USAGE_TRACKING_KEY);
  console.log('🗑️ All brand assets cleared');
}

/**
 * Export brand assets as JSON (for backup)
 */
export function exportBrandAssets(): string {
  const assets = getAllBrandAssets();
  return JSON.stringify(assets, null, 2);
}

/**
 * Import brand assets from JSON (for restore)
 */
export function importBrandAssets(jsonData: string): number {
  try {
    const assets = JSON.parse(jsonData);
    if (!Array.isArray(assets)) {
      throw new Error('Invalid data format');
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assets));
    console.log(`✅ Imported ${assets.length} brand assets`);
    return assets.length;
  } catch (error) {
    console.error('Error importing brand assets:', error);
    throw new Error('Failed to import brand assets');
  }
}

/**
 * Get recommended size for asset type
 */
export function getRecommendedSize(type: AssetType): { width: number; height: number } {
  switch (type) {
    case 'logo':
      return { width: 200, height: 200 };
    case 'icon':
      return { width: 60, height: 60 };
    case 'background':
      return { width: 1920, height: 1080 };
    case 'photo':
      return { width: 400, height: 400 };
    case 'graphic':
      return { width: 300, height: 300 };
    default:
      return { width: 200, height: 200 };
  }
}
