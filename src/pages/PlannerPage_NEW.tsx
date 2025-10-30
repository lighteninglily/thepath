import { useState } from 'react';
import { Calendar, Clock, Church, Play, Printer, Save, Settings } from 'lucide-react';
import { ServiceItemCard } from '../components/planner/ServiceItemCard';
import { ServiceItemEditor } from '../components/planner/ServiceItemEditor';
import { AddItemMenu } from '../components/planner/AddItemMenu';
import type { Service, ServiceItem, ServiceItemType } from '../types/service';

export function PlannerPage() {
  const [currentService, setCurrentService] = useState<Service>({
    id: 'service-1',
    name: 'Sunday Morning Service',
    date: new Date().toISOString().split('T')[0],
    items: [],
    churchName: 'The Path Church',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null);
  const [editingType, setEditingType] = useState<ServiceItemType | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleAddItem = (type: ServiceItemType) => {
    setEditingItem(null);
    setEditingType(type);
    setShowEditor(true);
  };

  const handleEditItem = (item: ServiceItem) => {
    setEditingItem(item);
    setEditingType(item.type);
    setShowEditor(true);
  };

  const handleSaveItem = (itemData: Partial<ServiceItem>) => {
    if (editingItem) {
      // Update existing item
      setCurrentService({
        ...currentService,
        items: currentService.items.map(item =>
          item.id === editingItem.id
            ? { ...item, ...itemData, updatedAt: new Date().toISOString() }
            : item
        ),
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Add new item
      const newItem: ServiceItem = {
        id: `item-${Date.now()}`,
        type: editingType!,
        order: currentService.items.length,
        ...itemData,
      };
      setCurrentService({
        ...currentService,
        items: [...currentService.items, newItem],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleDeleteItem = (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setCurrentService({
        ...currentService,
        items: currentService.items.filter(item => item.id !== itemId)
          .map((item, index) => ({ ...item, order: index })),
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const getTotalDuration = () => {
    return currentService.items.reduce((total, item) => total + (item.duration || 0), 0);
  };

  return (
    <div className="min-h-screen bg-brand-offWhite">
      {/* Header */}
      <header className="bg-white border-b border-brand-warmGray shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-skyBlue to-brand-powderBlue flex items-center justify-center">
                <Calendar className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-charcoal">Service Planner</h1>
                <p className="text-sm text-brand-umber">Plan your worship service</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg border border-brand-warmGray text-brand-umber hover:bg-brand-warmGray/20 transition-colors flex items-center gap-2">
                <Settings size={18} />
                Settings
              </button>
              <button className="px-4 py-2 rounded-lg border border-brand-warmGray text-brand-umber hover:bg-brand-warmGray/20 transition-colors flex items-center gap-2">
                <Printer size={18} />
                Print
              </button>
              <button className="px-4 py-2 rounded-lg bg-brand-skyBlue text-white hover:bg-brand-skyBlue/90 transition-colors flex items-center gap-2">
                <Save size={18} />
                Save
              </button>
              <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors flex items-center gap-2">
                <Play size={18} />
                Present
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Items List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Info Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-umber mb-2">
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={currentService.name}
                    onChange={(e) => setCurrentService({ ...currentService, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-umber mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={currentService.date}
                    onChange={(e) => setCurrentService({ ...currentService, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-brand-warmGray focus:outline-none focus:ring-2 focus:ring-brand-skyBlue"
                  />
                </div>
              </div>
            </div>

            {/* Add Item Button */}
            <AddItemMenu onAddItem={handleAddItem} />

            {/* Service Items */}
            <div className="space-y-3">
              {currentService.items.length === 0 ? (
                <div className="bg-white rounded-lg border-2 border-dashed border-brand-warmGray p-12 text-center">
                  <Calendar size={48} className="mx-auto text-brand-umber/30 mb-4" />
                  <h3 className="text-lg font-semibold text-brand-charcoal mb-2">
                    No items in service yet
                  </h3>
                  <p className="text-brand-umber mb-4">
                    Click "Add Item to Service" to start building your worship service
                  </p>
                </div>
              ) : (
                currentService.items.map((item, index) => (
                  <ServiceItemCard
                    key={item.id}
                    item={item}
                    index={index}
                    onEdit={() => handleEditItem(item)}
                    onDelete={() => handleDeleteItem(item.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Service Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Service Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-brand-warmGray">
                  <span className="text-brand-umber flex items-center gap-2">
                    <Church size={16} />
                    Church
                  </span>
                  <span className="font-medium text-brand-charcoal">{currentService.churchName}</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-brand-warmGray">
                  <span className="text-brand-umber flex items-center gap-2">
                    <Calendar size={16} />
                    Date
                  </span>
                  <span className="font-medium text-brand-charcoal">
                    {new Date(currentService.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-brand-warmGray">
                  <span className="text-brand-umber">Total Items</span>
                  <span className="font-bold text-brand-skyBlue text-xl">{currentService.items.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-brand-umber flex items-center gap-2">
                    <Clock size={16} />
                    Est. Duration
                  </span>
                  <span className="font-bold text-green-600 text-xl">{getTotalDuration()} min</span>
                </div>
              </div>
            </div>

            {/* Item Types Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-brand-charcoal mb-4">Items Breakdown</h3>
              <div className="space-y-2">
                {[
                  { type: 'song', label: 'Songs', color: 'purple' },
                  { type: 'scripture', label: 'Scriptures', color: 'blue' },
                  { type: 'sermon', label: 'Sermon', color: 'orange' },
                  { type: 'announcement', label: 'Announcements', color: 'yellow' },
                ].map(({ type, label, color }) => {
                  const count = currentService.items.filter(item => item.type === type).length;
                  return (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="text-brand-umber">{label}</span>
                      <span className={`font-medium px-2 py-1 rounded ${
                        color === 'purple' ? 'bg-purple-100 text-purple-700' :
                        color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-brand-skyBlue/10 to-brand-powderBlue/10 rounded-lg p-6 border border-brand-skyBlue/20">
              <h3 className="text-lg font-bold text-brand-charcoal mb-3">💡 Quick Tips</h3>
              <ul className="space-y-2 text-sm text-brand-umber">
                <li>• Drag items to reorder them</li>
                <li>• Add presenter notes for reminders</li>
                <li>• Set durations for timing</li>
                <li>• Preview before presenting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Service Item Editor Modal */}
      {showEditor && editingType && (
        <ServiceItemEditor
          item={editingItem}
          type={editingType}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingItem(null);
            setEditingType(null);
          }}
          onSave={handleSaveItem}
        />
      )}
    </div>
  );
}
