import { X, Upload, Search, Star } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { BrandAsset, AssetType } from '../../types/brandAsset';
import {
  getAllBrandAssets,
  getRecentlyUsedAssets,
  uploadBrandAsset,
  recordAssetUsage,
} from '../../utils/brandAssetStorage';

interface AssetPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: BrandAsset) => void;
  filterType?: AssetType; // Optional: filter to specific type
}

export function AssetPickerModal({ isOpen, onClose, onSelectAsset, filterType }: AssetPickerModalProps) {
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<BrandAsset[]>([]);
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>(filterType || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<BrandAsset | null>(null);
  const [showRecentlyUsed, setShowRecentlyUsed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load assets
  useEffect(() => {
    if (isOpen) {
      loadAssets();
    }
  }, [isOpen]);

  // Filter assets when type or search changes
  useEffect(() => {
    filterAssets();
  }, [assets, selectedType, searchQuery, showRecentlyUsed]);

  const loadAssets = () => {
    const allAssets = getAllBrandAssets();
    setAssets(allAssets);
  };

  const filterAssets = () => {
    let filtered = [...assets];

    // Show recently used
    if (showRecentlyUsed) {
      filtered = getRecentlyUsedAssets(20);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(asset => asset.type === selectedType);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(query) ||
        asset.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredAssets(filtered);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const type = selectedType === 'all' ? 'graphic' : selectedType;
      const newAsset = await uploadBrandAsset(file, {
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        type,
        tags: [],
      });

      setAssets([...assets, newAsset]);
      setSelectedAsset(newAsset);
    } catch (error) {
      console.error('Upload failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload asset');
    }

    if (event.target) event.target.value = '';
  };

  const handleSelectAsset = () => {
    if (!selectedAsset) return;

    recordAssetUsage(selectedAsset.id);
    onSelectAsset(selectedAsset);
    onClose();
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-brand-warmGray">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Brand Assets</h2>
            <p className="text-sm text-brand-umber mt-1">
              Select from your library or upload new
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors"
          >
            <X size={24} className="text-brand-charcoal" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-6 border-b border-brand-warmGray space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-umber" size={20} />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
            />
          </div>

          {/* Type Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-brand-skyBlue text-white'
                  : 'bg-brand-warmGray text-brand-charcoal hover:bg-brand-clay hover:text-white'
              }`}
            >
              All ({assets.length})
            </button>
            {['logo', 'background', 'icon', 'graphic', 'photo'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type as AssetType)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                  selectedType === type
                    ? 'bg-brand-skyBlue text-white'
                    : 'bg-brand-warmGray text-brand-charcoal hover:bg-brand-clay hover:text-white'
                }`}
              >
                {getTypeIcon(type as AssetType)} {type.charAt(0).toUpperCase() + type.slice(1)}s
                ({assets.filter(a => a.type === type).length})
              </button>
            ))}
          </div>

          {/* Recently Used Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recently-used"
              checked={showRecentlyUsed}
              onChange={(e) => setShowRecentlyUsed(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="recently-used" className="text-sm text-brand-charcoal cursor-pointer">
              Show recently used only
            </label>
          </div>
        </div>

        {/* Assets Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                No assets found
              </h3>
              <p className="text-brand-umber text-sm">
                {searchQuery ? 'Try a different search term' : 'Upload your first brand asset to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {filteredAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className={`group relative bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                    selectedAsset?.id === asset.id
                      ? 'border-brand-skyBlue shadow-lg'
                      : 'border-brand-warmGray'
                  }`}
                >
                  {/* Asset Preview */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={asset.dataUrl}
                      alt={asset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>

                  {/* Asset Info */}
                  <div className="p-2 bg-white">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-brand-charcoal truncate">
                          {asset.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs px-1.5 py-0.5 bg-brand-skyBlue/20 text-brand-skyBlue rounded font-medium">
                            {getTypeIcon(asset.type)} {asset.type}
                          </span>
                          <p className="text-xs text-brand-umber">
                            {(asset.size / 1024).toFixed(0)} KB
                          </p>
                        </div>
                      </div>
                      {asset.isPrimary && (
                        <Star size={16} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white font-medium">Select</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-brand-warmGray bg-brand-offWhite">
          <div className="flex gap-3">
            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-brand-warmGray text-brand-charcoal rounded-lg hover:bg-brand-clay hover:text-white transition-colors font-medium"
            >
              <Upload size={18} />
              Upload New
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-brand-charcoal hover:bg-brand-warmGray rounded-lg transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSelectAsset}
              disabled={!selectedAsset}
              className="flex items-center gap-2 px-6 py-2 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              Insert Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
