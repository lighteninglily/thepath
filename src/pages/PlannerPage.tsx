import { useState } from 'react';
import { Calendar, Loader2, Plus, Copy, Trash2, Play } from 'lucide-react';
import { CreateServiceModal } from '../components/planner/CreateServiceModal';
import { ServiceEditorModal } from '../components/modals/ServiceEditorModal';
import { AddSongToServiceModal } from '../components/modals/AddSongToServiceModal';
import { AddScriptureModal } from '../components/modals/AddScriptureModal';
import { TemplatePickerModal } from '../components/modals/TemplatePickerModal';
import type { SlideTemplate } from '../config/slideTemplatesFixed';
import { useServices, useCreateService, useUpdateService, useDeleteService, useDuplicateService } from '../hooks/useServices';
import { useSongs } from '../hooks/useSongs';
import { useServicePresentationStore } from '../store/servicePresentationStore';
import type { Service, ServiceItem } from '../types/service';

export function PlannerPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [showAddScriptureModal, setShowAddScriptureModal] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<'sermon' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'generic'>('announcement');
  const [pendingScripture, setPendingScripture] = useState<{ reference: string; text: string; version: string } | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const { data: services, isLoading: servicesLoading } = useServices();
  const { data: songs } = useSongs();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();
  const duplicateService = useDuplicateService();
  const { startPresentation } = useServicePresentationStore();

  const handleCreateService = async (data: { name: string; date: string }) => {
    console.log('🔵 handleCreateService called with:', data);
    try {
      console.log('📤 Calling createService mutation...');
      const result = await createService.mutateAsync({
        name: data.name,
        date: data.date,
        items: [],
      });
      console.log('✅ Service created successfully:', result);
      
      // Open the editor immediately after creation
      setSelectedService(result as Service);
    } catch (error) {
      console.error('❌ Error creating service:', error);
      alert(`Failed to create service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveService = async (service: Service) => {
    try {
      await updateService.mutateAsync(service);
      // DON'T close modal - let autosave work in background
      console.log('✅ Service autosaved');
    } catch (error) {
      console.error('❌ Error saving service:', error);
      alert(`Failed to save service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteService = async (serviceId: string, serviceName: string) => {
    if (confirm(`Are you sure you want to delete "${serviceName}"? This cannot be undone.`)) {
      try {
        await deleteService.mutateAsync(serviceId);
        console.log('✅ Service deleted:', serviceId);
      } catch (error) {
        console.error('❌ Error deleting service:', error);
        alert(`Failed to delete service: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleDuplicateService = async (service: Service) => {
    try {
      const result = await duplicateService.mutateAsync(service.id);
      console.log('✅ Service duplicated:', result);
      // Optionally open the duplicated service for editing
      if (result) {
        setSelectedService(result as Service);
      }
    } catch (error) {
      console.error('❌ Error duplicating service:', error);
      alert(`Failed to duplicate service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handlePresentService = (service: Service) => {
    console.log('🎭 Starting presentation for:', service.name);
    console.log('📊 Service data:', {
      id: service.id,
      name: service.name,
      itemCount: service.items?.length || 0,
      items: service.items
    });
    
    // Validate service has items
    if (!service.items || service.items.length === 0) {
      alert('This service has no items to present. Please add songs or slides first.');
      return;
    }
    
    // Start presentation in dual-screen mode
    startPresentation(service, 'dual');
    
    // Open audience window (projection screen) with correct hash route
    const audienceWindow = window.open('/#/audience', 'audience', 'fullscreen=yes');
    if (!audienceWindow) {
      alert('Please allow popups to open the projection screen');
    } else {
      console.log('✅ Audience window opened successfully');
    }
  };

  const handleAddSong = (song: any) => {
    if (!selectedService) return;
    
    const newItem: ServiceItem = {
      id: String(Date.now()),
      type: 'song',
      songId: song.id,
      songTitle: song.title,
      order: selectedService.items.length,
      duration: 4, // Default 4 minutes for songs
    };
    
    const updatedService = {
      ...selectedService,
      items: [...selectedService.items, newItem],
    };
    
    setSelectedService(updatedService);
  };

  const handleAddScripture = (scripture: { reference: string; text: string; version: string }) => {
    if (!selectedService) return;
    
    console.log('📖 handleAddScripture called with:', {
      reference: scripture.reference,
      textPreview: scripture.text.substring(0, 100) + '...',
      version: scripture.version
    });
    
    // Store scripture data and show template picker
    setPendingScripture(scripture);
    setTemplateCategory('scripture');
    setShowTemplatePicker(true);
    setShowAddScriptureModal(false);
  };

  const handleAddItem = (type: string) => {
    if (!selectedService) return;

    // Handle scripture specially (has AI lookup)
    if (type === 'scripture') {
      setShowAddScriptureModal(true);
      return;
    }

    // For items with templates, show template picker
    if (['announcement', 'sermon', 'welcome', 'closing'].includes(type)) {
      setTemplateCategory(type as any);
      setShowTemplatePicker(true);
      return;
    }
    
    // Fallback for other types (offering, etc.)
    const newItem: ServiceItem = {
      id: String(Date.now()),
      type: type as any,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      order: selectedService.items.length,
      duration: 2,
    };
    
    const updatedService = {
      ...selectedService,
      items: [...selectedService.items, newItem],
    };
    
    setSelectedService(updatedService);
  };

  const handleSelectTemplate = (template: SlideTemplate) => {
    if (!selectedService) return;

    // If there's pending scripture data, pre-fill it into the template
    if (pendingScripture && template.category === 'scripture') {
      console.log('📖 Using pending scripture:', {
        reference: pendingScripture.reference,
        textPreview: pendingScripture.text.substring(0, 100) + '...',
        version: pendingScripture.version
      });
      
      // Clone template and customize with scripture
      const customizedVisualData = { ...template.visualData };
      
      // Update elements with scripture data
      customizedVisualData.elements = template.visualData.elements.map((el: any) => {
        // Update scripture reference (check multiple possible IDs)
        if (el.id === 'scripture-ref' || el.id === 'header' || el.id === 'reference') {
          console.log('  ✏️ Updating element', el.id, 'with reference:', pendingScripture.reference);
          return { ...el, content: pendingScripture.reference.toUpperCase() };
        }
        // Update scripture text (check multiple possible IDs)
        if (el.id === 'scripture-text' || el.id === 'scripture-quote' || el.id === 'point-1' || el.id === 'verse-text') {
          console.log('  ✏️ Updating element', el.id, 'with text preview:', pendingScripture.text.substring(0, 50) + '...');
          return { ...el, content: pendingScripture.text };
        }
        return el;
      });

      // Create item with customized template
      const newItem: ServiceItem = {
        id: String(Date.now()),
        type: 'scripture',
        title: pendingScripture.reference,
        scriptureReference: pendingScripture.reference,
        scriptureText: pendingScripture.text,
        scriptureVersion: pendingScripture.version,
        order: selectedService.items.length,
        duration: 3,
        content: JSON.stringify(customizedVisualData),
      };

      const updatedService = {
        ...selectedService,
        items: [...selectedService.items, newItem],
      };

      setSelectedService(updatedService);
      setPendingScripture(null); // Clear pending scripture
    } else {
      // Regular template (announcement, sermon, etc.)
      const newItem: ServiceItem = {
        id: String(Date.now()),
        type: template.category as any,
        title: template.name,
        order: selectedService.items.length,
        duration: 3,
        content: JSON.stringify(template.visualData),
      };

      const updatedService = {
        ...selectedService,
        items: [...selectedService.items, newItem],
      };

      setSelectedService(updatedService);
    }
  };

  if (servicesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-brand-skyBlue" />
      </div>
    );
  }

  const songCount = songs?.length || 0;
  const serviceCount = services?.length || 0;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-brand-charcoal">Service Planner</h2>
            <p className="text-brand-umber mt-1">
              {serviceCount} {serviceCount === 1 ? 'service' : 'services'} planned
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            disabled={songCount === 0}
            className="
              inline-flex items-center gap-2 px-4 py-2 rounded-lg
              bg-brand-taupe text-white
              hover:bg-brand-clay
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-md hover:shadow-lg
              font-medium
            "
          >
            <Plus size={20} />
            New Service
          </button>
        </div>

        {songCount === 0 ? (
          /* No songs yet */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-taupe/10 mb-6">
              <Calendar size={40} className="text-brand-taupe" />
            </div>
            
            <h3 className="text-xl font-bold text-brand-charcoal mb-2">
              Add Some Songs First
            </h3>
            
            <p className="text-brand-umber mb-6">
              Before you can plan a service, you need to add some songs to your library.
            </p>

            <a
              href="#"
              onClick={() => window.location.reload()}
              className="text-brand-skyBlue hover:underline font-medium"
            >
              Go to Library →
            </a>
          </div>
        ) : serviceCount === 0 ? (
          /* Empty state */
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-brand-taupe/10 mb-6">
              <Calendar size={40} className="text-brand-taupe" />
            </div>
            
            <h3 className="text-xl font-bold text-brand-charcoal mb-2">
              Create Your First Service
            </h3>
            
            <p className="text-brand-umber mb-8 max-w-md mx-auto">
              Plan your worship services by adding songs, announcements, and organizing the order.
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="
                inline-flex items-center gap-2 px-6 py-3 rounded-lg
                bg-brand-taupe text-white
                hover:bg-brand-clay
                transition-all duration-200
                shadow-md hover:shadow-lg
                font-medium
              "
            >
              <Plus size={20} />
              Create First Service
            </button>

            <div className="grid grid-cols-2 gap-4 mt-12 max-w-md mx-auto">
              <div className="bg-white rounded-lg p-4 border border-brand-warmGray">
                <div className="text-3xl font-bold text-brand-skyBlue">{songCount}</div>
                <div className="text-sm text-brand-umber mt-1">Songs Available</div>
              </div>
              <div className="bg-white rounded-lg p-4 border border-brand-warmGray">
                <div className="text-3xl font-bold text-brand-taupe">0</div>
                <div className="text-sm text-brand-umber mt-1">Services</div>
              </div>
            </div>
          </div>
        ) : (
          /* Services list */
          <div className="space-y-4">
            {services?.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg border border-brand-warmGray p-6 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={24} className="text-brand-taupe" />
                    <div>
                      <h3 className="font-semibold text-brand-charcoal">{service.name}</h3>
                      <p className="text-sm text-brand-umber">
                        {service.date ? new Date(service.date).toLocaleDateString() : 'No date set'}
                        {' • '}
                        {service.items?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePresentService(service)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-skyBlue hover:bg-brand-powderBlue text-white transition-colors text-sm font-medium"
                      title="Start presentation"
                    >
                      <Play size={16} />
                      Present
                    </button>
                    <button
                      onClick={() => handleDuplicateService(service)}
                      className="p-2 hover:bg-brand-warmGray rounded-lg transition-colors group"
                      title="Duplicate service"
                    >
                      <Copy size={18} className="text-brand-umber group-hover:text-brand-skyBlue" />
                    </button>
                    <button
                      onClick={() => handleDeleteService(service.id, service.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Delete service"
                    >
                      <Trash2 size={18} className="text-brand-umber group-hover:text-red-600" />
                    </button>
                    <button 
                      onClick={() => setSelectedService(service)}
                      className="text-brand-skyBlue hover:underline text-sm font-medium ml-2"
                    >
                      Edit →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <p className="text-xs text-brand-umber italic">
            Full drag-and-drop service builder coming next! 🚧
          </p>
        </div>
      </div>

      {/* Create Service Modal */}
      <CreateServiceModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateService}
      />

      {/* Service Editor Modal */}
      <ServiceEditorModal
        service={selectedService}
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        onSave={handleSaveService}
        onAddSong={() => setShowAddSongModal(true)}
        onAddItem={handleAddItem}
      />

      {/* Add Song Modal */}
      <AddSongToServiceModal
        isOpen={showAddSongModal}
        onClose={() => setShowAddSongModal(false)}
        songs={songs || []}
        onAddSong={handleAddSong}
      />

      {/* Add Scripture Modal */}
      <AddScriptureModal
        isOpen={showAddScriptureModal}
        onClose={() => setShowAddScriptureModal(false)}
        onAddScripture={handleAddScripture}
      />

      {/* Template Picker Modal */}
      <TemplatePickerModal
        isOpen={showTemplatePicker}
        category={templateCategory}
        onClose={() => setShowTemplatePicker(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
}
