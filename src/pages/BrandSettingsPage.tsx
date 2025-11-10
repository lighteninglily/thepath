import { useState, useEffect } from 'react';
import { Save, Upload, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import type { BrandProfile, LogoPlacement, LogoSize, SlideType } from '../types/brandProfile';
import { getBrandProfile, saveBrandProfile, resetBrandProfile, getBrandProfileStats } from '../utils/brandProfile';
import { getBrandAssetById } from '../utils/brandAssetStorage';
import { AssetPickerModal } from '../components/modals/AssetPickerModal';
import type { BrandAsset } from '../types/brandAsset';

export function BrandSettingsPage() {
  const [profile, setProfile] = useState<BrandProfile>(getBrandProfile());
  const [hasChanges, setHasChanges] = useState(false);
  const [showAssetPicker, setShowAssetPicker] = useState<'primary' | 'white' | 'color' | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load profile on mount
  useEffect(() => {
    setProfile(getBrandProfile());
  }, []);

  // Track changes
  useEffect(() => {
    const current = getBrandProfile();
    setHasChanges(JSON.stringify(current) !== JSON.stringify(profile));
  }, [profile]);

  const handleSave = () => {
    try {
      setSaveStatus('saving');
      saveBrandProfile(profile);
      setSaveStatus('saved');
      setHasChanges(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all brand settings? This cannot be undone.')) {
      resetBrandProfile();
      setProfile(getBrandProfile());
      setHasChanges(false);
    }
  };

  const handleSelectAsset = (asset: BrandAsset, type: 'primary' | 'white' | 'color') => {
    if (type === 'primary') {
      setProfile({
        ...profile,
        logos: {
          ...profile.logos,
          primary: {
            ...profile.logos.primary,
            assetId: asset.id,
            visible: true, // Auto-enable when logo selected
          },
        },
      });
    } else if (type === 'white') {
      setProfile({
        ...profile,
        logos: {
          ...profile.logos,
          whiteVersion: {
            assetId: asset.id,
            useWhen: 'dark-backgrounds',
          },
        },
      });
    } else if (type === 'color') {
      setProfile({
        ...profile,
        logos: {
          ...profile.logos,
          colorVersion: {
            assetId: asset.id,
            useWhen: 'light-backgrounds',
          },
        },
      });
    }
    setShowAssetPicker(null);
  };

  const primaryAsset = profile.logos.primary.assetId 
    ? getBrandAssetById(profile.logos.primary.assetId) 
    : null;
  const whiteAsset = profile.logos.whiteVersion?.assetId 
    ? getBrandAssetById(profile.logos.whiteVersion.assetId) 
    : null;
  const colorAsset = profile.logos.colorVersion?.assetId 
    ? getBrandAssetById(profile.logos.colorVersion.assetId) 
    : null;

  const stats = getBrandProfileStats();

  return (
    <div className="min-h-screen bg-brand-offWhite p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-charcoal mb-2">Brand Settings</h1>
          <p className="text-brand-umber">
            Configure your church's branding to appear on presentations
          </p>
        </div>

        {/* Status Banner */}
        {!stats.isConfigured && (
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg flex items-start gap-3">
            <AlertCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">No branding configured</h3>
              <p className="text-sm text-blue-700">
                Select a primary logo below to get started. Your logo will automatically appear on new presentations.
              </p>
            </div>
          </div>
        )}

        {stats.isConfigured && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-start gap-3">
            <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Branding configured</h3>
              <p className="text-sm text-green-700">
                Your logo will automatically appear on {stats.autoApplyEnabled ? 'new' : ''} presentations.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* Church Name */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-charcoal mb-4">Church Identity</h2>
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Church Name
              </label>
              <input
                type="text"
                value={profile.churchName}
                onChange={(e) => setProfile({ ...profile, churchName: e.target.value })}
                placeholder="e.g., The Way Church"
                className="w-full px-4 py-2 border border-brand-warmGray rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
              />
            </div>
          </div>

          {/* Primary Logo */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-brand-charcoal mb-4">Primary Logo</h2>
            
            {/* Logo Preview */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-brand-charcoal mb-3">
                Logo Image
              </label>
              {primaryAsset ? (
                <div className="flex items-start gap-4">
                  <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-brand-warmGray flex items-center justify-center overflow-hidden">
                    <img
                      src={primaryAsset.dataUrl}
                      alt={primaryAsset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-brand-charcoal">{primaryAsset.name}</p>
                    <p className="text-sm text-brand-umber mt-1">
                      {primaryAsset.dimensions.width} × {primaryAsset.dimensions.height}px
                    </p>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setShowAssetPicker('primary')}
                        className="px-4 py-2 bg-brand-skyBlue text-white rounded-lg hover:bg-brand-powderBlue transition-colors text-sm font-medium"
                      >
                        Change Logo
                      </button>
                      <button
                        onClick={() => setProfile({
                          ...profile,
                          logos: {
                            ...profile.logos,
                            primary: { ...profile.logos.primary, assetId: '', visible: false },
                          },
                        })}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAssetPicker('primary')}
                  className="w-full px-6 py-8 border-2 border-dashed border-brand-warmGray rounded-lg hover:border-brand-skyBlue hover:bg-blue-50 transition-colors flex flex-col items-center justify-center gap-3"
                >
                  <Upload size={32} className="text-brand-umber" />
                  <div>
                    <p className="font-medium text-brand-charcoal">Select from Brand Assets</p>
                    <p className="text-sm text-brand-umber mt-1">
                      Choose your primary logo to appear on slides
                    </p>
                  </div>
                </button>
              )}
            </div>

            {/* Logo Settings */}
            {primaryAsset && (
              <>
                {/* Enabled Toggle */}
                <div className="mb-6 p-4 bg-brand-offWhite rounded-lg">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.logos.primary.visible}
                      onChange={(e) => setProfile({
                        ...profile,
                        logos: {
                          ...profile.logos,
                          primary: { ...profile.logos.primary, visible: e.target.checked },
                        },
                      })}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-medium text-brand-charcoal">Enable Branding</p>
                      <p className="text-sm text-brand-umber">
                        Show logo on presentations
                      </p>
                    </div>
                  </label>
                </div>

                {/* Placement */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    Logo Placement
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['top-left', 'top-right', 'center-bottom', 'bottom-left', 'bottom-right'] as LogoPlacement[]).map((placement) => (
                      <button
                        key={placement}
                        onClick={() => setProfile({
                          ...profile,
                          logos: {
                            ...profile.logos,
                            primary: { ...profile.logos.primary, placement },
                          },
                        })}
                        className={`px-4 py-3 rounded-lg border-2 transition-colors font-medium text-sm ${
                          profile.logos.primary.placement === placement
                            ? 'border-brand-skyBlue bg-blue-50 text-brand-skyBlue'
                            : 'border-brand-warmGray text-brand-charcoal hover:border-brand-clay'
                        }`}
                      >
                        {placement.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    Logo Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['small', 'medium', 'large'] as LogoSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setProfile({
                          ...profile,
                          logos: {
                            ...profile.logos,
                            primary: { ...profile.logos.primary, size },
                          },
                        })}
                        className={`px-4 py-3 rounded-lg border-2 transition-colors font-medium text-sm ${
                          profile.logos.primary.size === size
                            ? 'border-brand-skyBlue bg-blue-50 text-brand-skyBlue'
                            : 'border-brand-warmGray text-brand-charcoal hover:border-brand-clay'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                        <span className="block text-xs mt-1 opacity-70">
                          {size === 'small' ? '100px' : size === 'medium' ? '150px' : '200px'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Opacity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    Logo Opacity: {Math.round(profile.logos.primary.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={profile.logos.primary.opacity * 100}
                    onChange={(e) => setProfile({
                      ...profile,
                      logos: {
                        ...profile.logos,
                        primary: { ...profile.logos.primary, opacity: parseInt(e.target.value) / 100 },
                      },
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-brand-umber mt-1">
                    <span>Subtle</span>
                    <span>Prominent</span>
                  </div>
                </div>

                {/* Apply To */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    Apply Logo To
                  </label>
                  <div className="space-y-2">
                    {(['songs', 'sermons', 'announcements', 'scripture'] as const).map((type) => (
                      <label key={type} className="flex items-center gap-3 p-3 bg-brand-offWhite rounded-lg cursor-pointer hover:bg-brand-warmGray transition-colors">
                        <input
                          type="checkbox"
                          checked={profile.logos.primary.useOn.includes(type) || profile.logos.primary.useOn.includes('all')}
                          onChange={(e) => {
                            let newUseOn = profile.logos.primary.useOn.filter(t => t !== 'all' && t !== type);
                            if (e.target.checked) {
                              newUseOn.push(type);
                            }
                            // If all are selected, use 'all'
                            if (newUseOn.length === 4) {
                              newUseOn = ['all'];
                            }
                            setProfile({
                              ...profile,
                              logos: {
                                ...profile.logos,
                                primary: { ...profile.logos.primary, useOn: newUseOn as SlideType[] },
                              },
                            });
                          }}
                          className="w-4 h-4"
                        />
                        <span className="font-medium text-brand-charcoal capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-brand-offWhite rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.logos.primary.excludeFromTitleSlides || false}
                      onChange={(e) => setProfile({
                        ...profile,
                        logos: {
                          ...profile.logos,
                          primary: { ...profile.logos.primary, excludeFromTitleSlides: e.target.checked },
                        },
                      })}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-brand-charcoal">Hide on Title Slides</p>
                      <p className="text-xs text-brand-umber">Don't show logo on opening/title slides</p>
                    </div>
                  </label>
                </div>
              </>
            )}
          </div>

          {/* Auto-Apply Settings */}
          {primaryAsset && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brand-charcoal mb-2">Auto-Apply Settings</h2>
              <p className="text-sm text-brand-umber mb-4">
                Automatically add logo to new presentations
              </p>
              
              <div className="space-y-2">
                {(['toNewSongs', 'toNewSermons', 'toNewAnnouncements', 'toNewScripture'] as const).map((key) => (
                  <label key={key} className="flex items-center gap-3 p-3 bg-brand-offWhite rounded-lg cursor-pointer hover:bg-brand-warmGray transition-colors">
                    <input
                      type="checkbox"
                      checked={profile.autoApply[key]}
                      onChange={(e) => setProfile({
                        ...profile,
                        autoApply: { ...profile.autoApply, [key]: e.target.checked },
                      })}
                      className="w-4 h-4"
                    />
                    <span className="font-medium text-brand-charcoal">
                      {key.replace('toNew', 'New ').replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Alternative Logos */}
          {primaryAsset && (
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-brand-charcoal mb-2">Alternative Logos (Optional)</h2>
              <p className="text-sm text-brand-umber mb-6">
                Automatically switch logos based on background brightness
              </p>

              <div className="space-y-6">
                {/* White Logo */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    White Logo (for dark backgrounds)
                  </label>
                  {whiteAsset ? (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-800 rounded-lg border-2 border-brand-warmGray flex items-center justify-center overflow-hidden">
                        <img
                          src={whiteAsset.dataUrl}
                          alt={whiteAsset.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-charcoal">{whiteAsset.name}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setShowAssetPicker('white')}
                            className="px-3 py-1 bg-brand-skyBlue text-white rounded text-sm hover:bg-brand-powderBlue"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => setProfile({
                              ...profile,
                              logos: { ...profile.logos, whiteVersion: undefined },
                            })}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAssetPicker('white')}
                      className="w-full px-4 py-6 border-2 border-dashed border-brand-warmGray rounded-lg hover:border-brand-skyBlue hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={20} className="text-brand-umber" />
                      <span className="text-sm font-medium text-brand-charcoal">Select White Logo</span>
                    </button>
                  )}
                </div>

                {/* Color Logo */}
                <div>
                  <label className="block text-sm font-medium text-brand-charcoal mb-3">
                    Color Logo (for light backgrounds)
                  </label>
                  {colorAsset ? (
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-white rounded-lg border-2 border-brand-warmGray flex items-center justify-center overflow-hidden">
                        <img
                          src={colorAsset.dataUrl}
                          alt={colorAsset.name}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-brand-charcoal">{colorAsset.name}</p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => setShowAssetPicker('color')}
                            className="px-3 py-1 bg-brand-skyBlue text-white rounded text-sm hover:bg-brand-powderBlue"
                          >
                            Change
                          </button>
                          <button
                            onClick={() => setProfile({
                              ...profile,
                              logos: { ...profile.logos, colorVersion: undefined },
                            })}
                            className="px-3 py-1 bg-red-50 text-red-600 rounded text-sm hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAssetPicker('color')}
                      className="w-full px-4 py-6 border-2 border-dashed border-brand-warmGray rounded-lg hover:border-brand-skyBlue hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Upload size={20} className="text-brand-umber" />
                      <span className="text-sm font-medium text-brand-charcoal">Select Color Logo</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 sticky bottom-0 bg-brand-offWhite py-4 border-t border-brand-warmGray">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
          >
            <Trash2 size={18} />
            Reset to Defaults
          </button>

          <div className="flex items-center gap-4">
            {saveStatus === 'saved' && (
              <span className="text-green-600 flex items-center gap-2">
                <CheckCircle size={18} />
                Saved successfully
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="text-red-600 flex items-center gap-2">
                <AlertCircle size={18} />
                Failed to save
              </span>
            )}
            
            <button
              onClick={handleSave}
              disabled={!hasChanges || saveStatus === 'saving'}
              className="flex items-center gap-2 px-8 py-3 bg-brand-taupe text-white rounded-lg hover:bg-brand-clay disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-md"
            >
              <Save size={18} />
              {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>

      {/* Asset Picker Modal */}
      {showAssetPicker && (
        <AssetPickerModal
          isOpen={true}
          onClose={() => setShowAssetPicker(null)}
          onSelectAsset={(asset) => handleSelectAsset(asset, showAssetPicker)}
          filterType="logo"
        />
      )}
    </div>
  );
}
