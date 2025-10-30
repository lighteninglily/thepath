/**
 * Brand Asset Library - Type Definitions
 * 
 * Centralized brand asset management for church presentations
 */

export type AssetType = 'logo' | 'background' | 'icon' | 'graphic' | 'photo';

export interface BrandAsset {
  id: string;                    // Unique identifier
  name: string;                  // User-friendly name (e.g., "Church Logo - Main")
  type: AssetType;               // Asset category
  category?: string;             // Optional subcategory (e.g., "Primary Logo", "Social Media")
  dataUrl: string;               // Base64 encoded image data
  size: number;                  // File size in bytes
  dimensions: {                  // Original image dimensions
    width: number;
    height: number;
  };
  uploadedAt: number;            // Upload timestamp
  lastUsedAt?: number;           // Last usage timestamp (for "recently used")
  usageCount: number;            // How many times inserted
  tags: string[];                // Searchable tags
  isPrimary?: boolean;           // Mark as primary asset (e.g., primary logo)
  description?: string;          // Optional description
}

export interface BrandAssetCategory {
  type: AssetType;
  name: string;
  icon: string;
  count: number;
}

export interface BrandAssetStats {
  totalAssets: number;
  totalSize: number;
  byType: {
    logo: number;
    background: number;
    icon: number;
    graphic: number;
    photo: number;
  };
  storageUsed: number;
  storageLimit: number;
  percentUsed: number;
}

export interface AssetUploadOptions {
  name: string;
  type: AssetType;
  category?: string;
  tags?: string[];
  isPrimary?: boolean;
  description?: string;
}

export interface AssetSearchFilters {
  query?: string;               // Text search
  type?: AssetType;             // Filter by type
  category?: string;            // Filter by category
  tags?: string[];              // Filter by tags
  isPrimary?: boolean;          // Show only primary assets
  recentlyUsed?: boolean;       // Show recently used
}

export interface AssetInsertOptions {
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  autoSize?: boolean;           // Auto-calculate size based on asset type
}
