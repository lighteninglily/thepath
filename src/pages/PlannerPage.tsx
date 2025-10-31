import { useState } from 'react';
import { Calendar, Loader2, Plus, Copy, Trash2, Play } from 'lucide-react';
import { CreateServiceModal } from '../components/planner/CreateServiceModal';
import { ServiceEditorModal } from '../components/modals/ServiceEditorModal';
import { AddSongToServiceModal } from '../components/modals/AddSongToServiceModal';
import { AddScriptureModal } from '../components/modals/AddScriptureModal';
import { AddSermonModal } from '../components/modals/AddSermonModal';
import { AddOfferingModal } from '../components/modals/AddOfferingModal';
import { AddWelcomeModal } from '../components/modals/AddWelcomeModal';
import { AddClosingModal } from '../components/modals/AddClosingModal';
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
  const [showAddSermonModal, setShowAddSermonModal] = useState(false);
  const [showAddOfferingModal, setShowAddOfferingModal] = useState(false);
  const [showAddWelcomeModal, setShowAddWelcomeModal] = useState(false);
  const [showAddClosingModal, setShowAddClosingModal] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [pendingAIContent, setPendingAIContent] = useState<any>(null);
  const [templateCategory, setTemplateCategory] = useState<'sermon' | 'offering' | 'announcement' | 'scripture' | 'welcome' | 'closing' | 'generic'>('announcement');
  const [pendingScripture, setPendingScripture] = useState<{ 
    reference: string; 
    text: string; 
    version: string;
    parts?: string[];
    shouldSplit?: boolean;
  } | null>(null);
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

  const handlePresentService = async (service: Service) => {
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
    
    // Small delay to ensure store is updated
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Open audience window (projection screen) with correct hash route
    const audienceWindow = window.open('/#/audience', 'audience', 'fullscreen=yes');
    if (!audienceWindow) {
      alert('Please allow popups to open the projection screen');
    } else {
      console.log('✅ Audience window opened successfully');
      // Force audience window to reload after a moment to pick up state
      setTimeout(() => {
        if (audienceWindow && !audienceWindow.closed) {
          audienceWindow.location.reload();
        }
      }, 500);
    }
    
    // Open the service editor modal for presenter controls
    setSelectedService(service);
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

  const handleAddScripture = (scripture: { 
    reference: string; 
    text: string; 
    version: string;
    parts?: string[];
    shouldSplit?: boolean;
  }) => {
    if (!selectedService) return;
    
    console.log('📖 handleAddScripture called with:', {
      reference: scripture.reference,
      textPreview: scripture.text.substring(0, 100) + '...',
      version: scripture.version,
      shouldSplit: scripture.shouldSplit,
      partsCount: scripture.parts?.length || 1
    });
    
    // Store scripture data and show template picker
    setPendingScripture(scripture);
    setTemplateCategory('scripture');
    setShowTemplatePicker(true);
    setShowAddScriptureModal(false);
  };

  const handleAddSermon = (sermon: { title: string; scripture?: string; points?: string[]; aiGenerated: any }) => {
    if (!selectedService) return;
    
    console.log('🎤 handleAddSermon called - opening template picker');
    
    // Store AI content and open template picker
    setPendingAIContent({
      type: 'sermon',
      title: sermon.title,
      aiGenerated: sermon.aiGenerated,
      duration: 20
    });
    setTemplateCategory('sermon');
    setShowTemplatePicker(true);
    setShowAddSermonModal(false);
  };

  const handleAddOffering = (offering: { theme: string; aiGenerated: any }) => {
    if (!selectedService) return;
    
    console.log('💰 handleAddOffering called - opening template picker');
    
    setPendingAIContent({
      type: 'offering',
      title: offering.aiGenerated.title || 'Offering',
      aiGenerated: offering.aiGenerated,
      duration: 5
    });
    setTemplateCategory('offering');
    setShowTemplatePicker(true);
    setShowAddOfferingModal(false);
  };

  const handleAddWelcome = (welcome: { churchName: string; serviceType: string; aiGenerated: any }) => {
    if (!selectedService) return;
    
    console.log('👋 handleAddWelcome called - opening template picker');
    
    setPendingAIContent({
      type: 'welcome',
      title: 'Welcome',
      aiGenerated: welcome.aiGenerated,
      duration: 2
    });
    setTemplateCategory('welcome');
    setShowTemplatePicker(true);
    setShowAddWelcomeModal(false);
  };

  const handleAddClosing = (closing: { includeBenediction: boolean; nextWeekPreview?: string; aiGenerated: any }) => {
    if (!selectedService) return;
    
    console.log('✅ handleAddClosing called - opening template picker');
    
    setPendingAIContent({
      type: 'closing',
      title: 'Closing',
      aiGenerated: closing.aiGenerated,
      duration: 3
    });
    setTemplateCategory('closing');
    setShowTemplatePicker(true);
    setShowAddClosingModal(false);
  };

  const handleAddItem = (type: string) => {
    if (!selectedService) return;

    // Handle AI-enhanced items with dedicated modals
    if (type === 'scripture') {
      setShowAddScriptureModal(true);
      return;
    }
    
    if (type === 'sermon') {
      setShowAddSermonModal(true);
      return;
    }
    
    if (type === 'offering') {
      setShowAddOfferingModal(true);
      return;
    }
    
    if (type === 'welcome') {
      setShowAddWelcomeModal(true);
      return;
    }
    
    if (type === 'closing') {
      setShowAddClosingModal(true);
      return;
    }

    // For items with templates (announcement), show template picker
    if (['announcement'].includes(type)) {
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
        version: pendingScripture.version,
        shouldSplit: pendingScripture.shouldSplit,
        partsCount: pendingScripture.parts?.length || 1
      });
      
      const newItems: ServiceItem[] = [];
      const parts = pendingScripture.shouldSplit && pendingScripture.parts && pendingScripture.parts.length > 1
        ? pendingScripture.parts
        : [pendingScripture.text];

      // Create a slide for each part
      parts.forEach((partText, partIndex) => {
        // Clone template and customize with scripture
        const customizedVisualData = { ...template.visualData };
        
        // Update elements with scripture data
        customizedVisualData.elements = template.visualData.elements.map((el: any) => {
          // Update scripture reference (check multiple possible IDs)
          if (el.id === 'scripture-ref' || el.id === 'header' || el.id === 'reference') {
            const referenceText = parts.length > 1 
              ? `${pendingScripture.reference.toUpperCase()} (Part ${partIndex + 1} of ${parts.length})`
              : pendingScripture.reference.toUpperCase();
            console.log('  ✏️ Updating element', el.id, 'with reference:', referenceText);
            return { ...el, content: referenceText };
          }
          // Update scripture text (check multiple possible IDs)
          if (el.id === 'scripture-text' || el.id === 'scripture-quote' || el.id === 'point-1' || el.id === 'verse-text') {
            console.log('  ✏️ Updating element', el.id, 'with part', partIndex + 1);
            return { ...el, content: partText };
          }
          return el;
        });

        // Create item with customized template
        const itemTitle = parts.length > 1
          ? `${pendingScripture.reference} (${partIndex + 1}/${parts.length})`
          : pendingScripture.reference;

        const newItem: ServiceItem = {
          id: `${Date.now()}_${partIndex}`,
          type: 'scripture',
          title: itemTitle,
          scriptureReference: pendingScripture.reference,
          scriptureText: partText,
          scriptureVersion: pendingScripture.version,
          order: selectedService.items.length + partIndex,
          duration: 3,
          content: JSON.stringify(customizedVisualData),
        };

        newItems.push(newItem);
      });

      const updatedService = {
        ...selectedService,
        items: [...selectedService.items, ...newItems],
      };

      console.log(`✅ Created ${newItems.length} scripture slide(s)`);
      setSelectedService(updatedService);
      setPendingScripture(null); // Clear pending scripture
    } else if (pendingAIContent && ['sermon', 'offering', 'welcome', 'closing'].includes(template.category)) {
      // AI-generated content - populate template with AI data
      console.log('🤖 Populating template with AI content:', pendingAIContent.type);
      
      const customizedVisualData = { ...template.visualData };
      const aiData = pendingAIContent.aiGenerated;
      
      // Populate template elements with AI content
      customizedVisualData.elements = template.visualData.elements.map((el: any) => {
        // For sermon slides
        if (pendingAIContent.type === 'sermon') {
          if (el.id === 'sermon-title' || el.id === 'title' || el.id === 'main-title') {
            return { ...el, content: aiData.titleSlide?.title || pendingAIContent.title };
          }
          if (el.id === 'scripture-ref' || el.id === 'subtitle') {
            return { ...el, content: aiData.titleSlide?.subtitle || '' };
          }
        }
        
        // For offering slides
        if (pendingAIContent.type === 'offering') {
          if (el.id === 'title' || el.id === 'main-title') {
            return { ...el, content: aiData.title };
          }
          if (el.id === 'subtitle' || el.id === 'message') {
            return { ...el, content: aiData.message };
          }
          if (el.id === 'scripture' && aiData.scripture) {
            return { ...el, content: aiData.scripture };
          }
        }
        
        // For welcome slides
        if (pendingAIContent.type === 'welcome') {
          if (el.id === 'main-text' || el.id === 'welcome-text') {
            return { ...el, content: aiData.mainMessage };
          }
          if (el.id === 'subtitle' || el.id === 'tagline' || el.id === 'greeting') {
            return { ...el, content: aiData.subtitle || aiData.greeting };
          }
        }
        
        // For closing slides
        if (pendingAIContent.type === 'closing') {
          if (el.id === 'main-message' || el.id === 'closing-text') {
            return { ...el, content: aiData.title };
          }
          if (el.id === 'subtitle' || el.id === 'message') {
            return { ...el, content: aiData.message };
          }
          if (el.id === 'scripture' || el.id === 'benediction' && aiData.benediction) {
            return { ...el, content: aiData.benediction };
          }
          if (el.id === 'next-service' || el.id === 'next-week' && aiData.nextWeek) {
            return { ...el, content: aiData.nextWeek };
          }
        }
        
        return el;
      });
      
      const newItem: ServiceItem = {
        id: String(Date.now()),
        type: pendingAIContent.type as any,
        title: pendingAIContent.title,
        order: selectedService.items.length,
        duration: pendingAIContent.duration,
        content: JSON.stringify(customizedVisualData),
      };

      const updatedService = {
        ...selectedService,
        items: [...selectedService.items, newItem],
      };

      console.log('✅ Created AI-populated slide!');
      setSelectedService(updatedService);
      setPendingAIContent(null); // Clear pending AI content
      setShowTemplatePicker(false);
    } else {
      // Regular template (announcement, etc.)
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
      setShowTemplatePicker(false);
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

      {/* Add Sermon Modal (AI-Enhanced) */}
      <AddSermonModal
        isOpen={showAddSermonModal}
        onClose={() => setShowAddSermonModal(false)}
        onAddSermon={handleAddSermon}
      />

      {/* Add Offering Modal (AI-Enhanced) */}
      <AddOfferingModal
        isOpen={showAddOfferingModal}
        onClose={() => setShowAddOfferingModal(false)}
        onAddOffering={handleAddOffering}
      />

      {/* Add Welcome Modal (AI-Enhanced) */}
      <AddWelcomeModal
        isOpen={showAddWelcomeModal}
        onClose={() => setShowAddWelcomeModal(false)}
        onAddWelcome={handleAddWelcome}
      />

      {/* Add Closing Modal (AI-Enhanced) */}
      <AddClosingModal
        isOpen={showAddClosingModal}
        onClose={() => setShowAddClosingModal(false)}
        onAddClosing={handleAddClosing}
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
