import { useState, useEffect, useRef } from 'react';
import { Upload, Star, Trash2, Download, FolderOpen, Home } from 'lucide-react';
import type { BrandAsset, AssetType } from '../types/brandAsset';
import {
  getAllBrandAssets,
  getBrandAssetsByType,
  uploadBrandAsset,
  deleteBrandAsset,
  setPrimaryAsset,
  getBrandAssetStats,
  exportBrandAssets,
} from '../utils/brandAssetStorage';

interface BrandAssetManagerPageProps {
  onClose?: () => void;
}

export function BrandAssetManagerPage({ onClose }: BrandAssetManagerPageProps = {}) {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  const [selectedAsset, setSelectedAsset] = useState<BrandAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets on mount
  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = () => {
    const allAssets = getAllBrandAssets();
    setAssets(allAssets);
  };

  const getFilteredAssets = () => {
    if (selectedType === 'all') return assets;
    return getBrandAssetsByType(selectedType);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type?: AssetType) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const assetType = type || selectedType === 'all' ? 'graphic' : selectedType;
      const newAsset = await uploadBrandAsset(file, {
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: assetType,
        tags: [],
      });

      setAssets([...assets, newAsset]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload asset');
    }

    if (event.target) event.target.value = '';
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this asset?')) {
      deleteBrandAsset(id);
      setAssets(assets.filter(a => a.id !== id));
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    }
  };

  const handleSetPrimary = (id: string) => {
    const updated = setPrimaryAsset(id);
    if (updated) {
      loadAssets();
    }
  };

  const handleExport = () => {
    const jsonData = exportBrandAssets();
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-assets-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getTypeIcon = (type: AssetType): string => {
    switch (type) {
      case 'logo': return '🏷️';
      case 'background': return '🖼️';
      case 'icon': return '⭐';
      case 'graphic': return '🎨';
      case 'photo': return '📸';
      default: return '📁';
    }
  };

  const stats = getBrandAssetStats();
  const filteredAssets = getFilteredAssets();

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Header */}
      <header className="bg-white border-b border-brand-warmGray">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
                  title="Close"
                >
                  <Home size={24} className="text-brand-charcoal" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold text-brand-charcoal">Brand Asset Library</h1>
                <p className="text-sm text-brand-umber mt-1">
                  Manage your logos, backgrounds, and graphics
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Stats */}
              <div className="px-4 py-2 bg-brand-warmGray/30 rounded-lg">
                <div className="text-xs text-brand-umber">Total Assets</div>
                <div className="text-lg font-bold text-brand-charcoal">{stats.totalAssets}</div>
              </div>
              <div className="px-4 py-2 bg-brand-warmGray/30 rounded-lg">
                <div className="text-xs text-brand-umber">Storage Used</div>
                <div className="text-lg font-bold text-brand-charcoal">
                  {(stats.totalSize / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>

              {/* Actions */}
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 bg-brand-warmGray text-brand-charcoal rounded-lg hover:bg-brand-clay hover:text-white transition-colors font-medium"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay transition-colors font-medium shadow-md"
              >
                <Upload size={18} />
                Upload Asset
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e)}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Type Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              selectedType === 'all'
                ? 'bg-brand-skyBlue text-white shadow-md'
                : 'bg-white text-brand-charcoal hover:bg-brand-warmGray'
            }`}
          >
            All Assets ({stats.totalAssets})
          </button>
          {['logo', 'background', 'icon', 'graphic', 'photo'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type as AssetType)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                selectedType === type
                  ? 'bg-brand-skyBlue text-white shadow-md'
                  : 'bg-white text-brand-charcoal hover:bg-brand-warmGray'
              }`}
            >
              {getTypeIcon(type as AssetType)} {type.charAt(0).toUpperCase() + type.slice(1)}s
              ({stats.byType[type as AssetType]})
            </button>
          ))}
        </div>

        {/* Assets Grid */}
        {filteredAssets.length === 0 ? (
          <div className="bg-white rounded-xl p-16 text-center">
            <FolderOpen size={64} className="mx-auto text-brand-umber/30 mb-4" />
            <h3 className="text-xl font-semibold text-brand-charcoal mb-2">
              No assets in this category
            </h3>
            <p className="text-brand-umber mb-6">
              Upload your first {selectedType === 'all' ? '' : selectedType} to get started
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay transition-colors font-medium shadow-md inline-flex items-center gap-2"
            >
              <Upload size={18} />
              Upload {selectedType === 'all' ? 'Asset' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className="group relative bg-white rounded-lg border-2 border-brand-warmGray overflow-hidden hover:border-brand-skyBlue hover:shadow-lg transition-all"
              >
                {/* Asset Preview */}
                <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden relative">
                  <img
                    src={asset.dataUrl}
                    alt={asset.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  
                  {/* Primary Star */}
                  {asset.isPrimary && (
                    <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                      <Star size={16} className="text-white fill-white" />
                    </div>
                  )}

                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {!asset.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(asset.id)}
                        className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                        title="Set as primary"
                      >
                        <Star size={18} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Asset Info */}
                <div className="p-3 bg-white">
                  <p className="font-medium text-brand-charcoal truncate" title={asset.name}>
                    {asset.name}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-brand-umber">
                      {(asset.size / 1024).toFixed(0)} KB
                    </span>
                    <span className="text-xs text-brand-umber">
                      {asset.dimensions.width} × {asset.dimensions.height}
                    </span>
                  </div>
                  {asset.isPrimary && (
                    <div className="mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                      Primary {asset.type}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
