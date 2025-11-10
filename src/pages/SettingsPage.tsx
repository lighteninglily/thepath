import { useState } from 'react';
import { Settings, Image } from 'lucide-react';
import { BrandSettingsPage } from './BrandSettingsPage';

type SettingsTab = 'general' | 'brand';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');

  return (
    <div className="p-8">
      {/* Tab Navigation */}
      <div className="max-w-3xl mx-auto mb-6">
        <div className="flex gap-2 border-b border-brand-warmGray">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-brand-skyBlue text-brand-skyBlue'
                : 'border-transparent text-brand-umber hover:text-brand-charcoal'
            }`}
          >
            <Settings className="inline-block mr-2" size={18} />
            General Settings
          </button>
          <button
            onClick={() => setActiveTab('brand')}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === 'brand'
                ? 'border-brand-skyBlue text-brand-skyBlue'
                : 'border-transparent text-brand-umber hover:text-brand-charcoal'
            }`}
          >
            <Image className="inline-block mr-2" size={18} />
            Brand Settings
          </button>
        </div>
      </div>

      {/* Render active tab content */}
      {activeTab === 'brand' ? (
        <BrandSettingsPage />
      ) : (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-brand-warmGray p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Settings size={24} className="text-brand-skyBlue" />
            <h3 className="text-lg font-semibold text-brand-charcoal">
              Church Information
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Church Name
              </label>
              <input
                type="text"
                defaultValue="The Way"
                className="
                  w-full px-4 py-2 rounded-lg
                  border border-brand-warmGray
                  bg-brand-offWhite
                  text-brand-charcoal
                  focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
                "
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#A8C5DD"
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-brand-umber">#A8C5DD</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-brand-charcoal mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    defaultValue="#C9B8A8"
                    className="w-12 h-10 rounded cursor-pointer"
                  />
                  <span className="text-sm text-brand-umber">#C9B8A8</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-brand-warmGray p-6">
          <h3 className="text-lg font-semibold text-brand-charcoal mb-4">
            Display Settings
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-charcoal mb-2">
                Presentation Display
              </label>
              <select className="
                w-full px-4 py-2 rounded-lg
                border border-brand-warmGray
                bg-brand-offWhite
                text-brand-charcoal
                focus:outline-none focus:ring-2 focus:ring-brand-skyBlue
              ">
                <option>Primary Display</option>
                <option>Secondary Display</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-brand-umber text-center mt-6 italic">
          More settings coming in Stage 7
        </p>
      </div>
      )}
    </div>
  );
}
